from flask import Blueprint, jsonify, request
from utils import get_db_connection
import traceback

# Create Blueprint
merge_operations_bp = Blueprint('merge_operations', __name__)

@merge_operations_bp.route('/list', methods=['GET'])
def list_merge_operations():
    """Get a list of all merge operations with optional filtering and pagination."""
    try:
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status')
        sort_by = request.args.get('sort_by', 'created_at')
        sort_order = request.args.get('sort_order', 'desc')
        
        # Validate sort parameters
        valid_sort_columns = ['created_at', 'merge_date', 'total_roads_merged', 'merge_duration_ms']
        if sort_by not in valid_sort_columns:
            sort_by = 'created_at'
        
        if sort_order not in ['asc', 'desc']:
            sort_order = 'desc'
        
        # Calculate offset
        offset = (page - 1) * per_page
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            # Build query with filters
            query = '''
                SELECT 
                    id,
                    file1_name,
                    file2_name,
                    similarity_threshold,
                    merge_date,
                    output_file_id,
                    total_roads_file1,
                    total_roads_file2,
                    total_roads_merged,
                    roads_merged,
                    roads_skipped,
                    roads_added,
                    merge_duration_ms,
                    status,
                    error_message,
                    created_at,
                    updated_at
                FROM merge_operations
            '''
            
            params = []
            where_clauses = []
            
            if status:
                where_clauses.append('status = ?')
                params.append(status)
            
            if where_clauses:
                query += ' WHERE ' + ' AND '.join(where_clauses)
            
            # Add sorting
            query += f' ORDER BY {sort_by} {sort_order}'
            
            # Add pagination
            query += ' LIMIT ? OFFSET ?'
            params.extend([per_page, offset])
            
            # Execute query
            cursor.execute(query, params)
            rows = cursor.fetchall()
            
            # Get total count for pagination
            count_query = '''
                SELECT COUNT(*) 
                FROM merge_operations
            '''
            if where_clauses:
                count_query += ' WHERE ' + ' AND '.join(where_clauses)
            
            cursor.execute(count_query, params[:-2] if params else [])
            total_count = cursor.fetchone()[0]
            
            # Convert rows to list of dictionaries
            operations = []
            for row in rows:
                operations.append({
                    'id': row['id'],
                    'file1_name': row['file1_name'],
                    'file2_name': row['file2_name'],
                    'similarity_threshold': row['similarity_threshold'],
                    'merge_date': row['merge_date'],
                    'output_file_id': row['output_file_id'],
                    'total_roads_file1': row['total_roads_file1'],
                    'total_roads_file2': row['total_roads_file2'],
                    'total_roads_merged': row['total_roads_merged'],
                    'roads_merged': row['roads_merged'],
                    'roads_skipped': row['roads_skipped'],
                    'roads_added': row['roads_added'],
                    'merge_duration_ms': row['merge_duration_ms'],
                    'status': row['status'],
                    'error_message': row['error_message'],
                    'created_at': row['created_at'],
                    'updated_at': row['updated_at']
                })
            
            return jsonify({
                'success': True,
                'data': {
                    'operations': operations,
                    'pagination': {
                        'total': total_count,
                        'page': page,
                        'per_page': per_page,
                        'total_pages': (total_count + per_page - 1) // per_page
                    }
                }
            }), 200
            
        except Exception as e:
            print(f"Error in list_merge_operations: {str(e)}")
            print(traceback.format_exc())
            return jsonify({
                'success': False,
                'message': f'Failed to fetch merge operations: {str(e)}'
            }), 500
        finally:
            conn.close()
            
    except Exception as e:
        print(f"Error in list_merge_operations: {str(e)}")
        print(traceback.format_exc())
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500

@merge_operations_bp.route('/stats', methods=['GET'])
def get_merge_stats():
    """Get aggregate statistics about merge operations."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            # Get total number of operations
            cursor.execute('SELECT COUNT(*) FROM merge_operations')
            total_operations = cursor.fetchone()[0]
            
            # Get success/failure counts
            cursor.execute('''
                SELECT 
                    status,
                    COUNT(*) as count,
                    AVG(merge_duration_ms) as avg_duration,
                    AVG(total_roads_merged) as avg_roads_merged
                FROM merge_operations
                GROUP BY status
            ''')
            status_stats = cursor.fetchall()
            
            # Get average merge duration
            cursor.execute('''
                SELECT 
                    AVG(merge_duration_ms) as avg_duration,
                    MIN(merge_duration_ms) as min_duration,
                    MAX(merge_duration_ms) as max_duration
                FROM merge_operations
                WHERE status = 'completed'
            ''')
            duration_stats = cursor.fetchone()
            
            # Get most common file pairs
            cursor.execute('''
                SELECT 
                    file1_name,
                    file2_name,
                    COUNT(*) as merge_count
                FROM merge_operations
                GROUP BY file1_name, file2_name
                ORDER BY merge_count DESC
                LIMIT 5
            ''')
            common_pairs = cursor.fetchall()
            
            return jsonify({
                'success': True,
                'data': {
                    'total_operations': total_operations,
                    'status_stats': [
                        {
                            'status': row['status'],
                            'count': row['count'],
                            'avg_duration': row['avg_duration'],
                            'avg_roads_merged': row['avg_roads_merged']
                        }
                        for row in status_stats
                    ],
                    'duration_stats': {
                        'avg_duration': duration_stats['avg_duration'],
                        'min_duration': duration_stats['min_duration'],
                        'max_duration': duration_stats['max_duration']
                    },
                    'common_pairs': [
                        {
                            'file1_name': row['file1_name'],
                            'file2_name': row['file2_name'],
                            'merge_count': row['merge_count']
                        }
                        for row in common_pairs
                    ]
                }
            }), 200
            
        except Exception as e:
            print(f"Error in get_merge_stats: {str(e)}")
            print(traceback.format_exc())
            return jsonify({
                'success': False,
                'message': f'Failed to fetch merge statistics: {str(e)}'
            }), 500
        finally:
            conn.close()
            
    except Exception as e:
        print(f"Error in get_merge_stats: {str(e)}")
        print(traceback.format_exc())
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500 