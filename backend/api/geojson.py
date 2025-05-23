from flask import Blueprint, current_app, jsonify, request
import json
import traceback
from utils import get_db_connection
import sqlite3
import os
import hashlib
import datetime
import uuid

# Define the blueprints for geojson
geojson_management = Blueprint('geojson_management', __name__)
geojson_bp = Blueprint('geojson', __name__, url_prefix='/api/geojson')

def validate_geojson_structure(geojson_data):
    """Validate the structure of GeoJSON data"""
    try:
        if not isinstance(geojson_data, dict):
            return False, "GeoJSON must be an object"
        
        if 'type' not in geojson_data:
            return False, "GeoJSON must have a 'type' field"
            
        if geojson_data['type'] == 'FeatureCollection':
            if 'features' not in geojson_data:
                return False, "FeatureCollection must have a 'features' array"
            if not isinstance(geojson_data['features'], list):
                return False, "'features' must be an array"
        elif geojson_data['type'] == 'Feature':
            if 'geometry' not in geojson_data:
                return False, "Feature must have a 'geometry' field"
            if 'properties' not in geojson_data:
                return False, "Feature must have a 'properties' field"
        else:
            return False, f"Unsupported GeoJSON type: {geojson_data['type']}"
            
        return True, "Valid GeoJSON structure"
    except Exception as e:
        return False, f"Invalid GeoJSON structure: {str(e)}"

def check_required_fields(data, required_fields):
    """Check if all required fields are present and not empty"""
    missing_fields = [field for field in required_fields if not data.get(field)]
    if missing_fields:
        return False, f"Missing required fields: {', '.join(missing_fields)}"
    return True, "All required fields present"

# Upload GeoJSON file
@geojson_management.route('/upload', methods=['POST'])
def upload_geojson():
    try:
        # Check if request has JSON data
        if not request.is_json:
            return jsonify({
                "success": False,
                "message": "Request must be JSON"
            }), 400

        # Get data from request
        data = request.json
        name = data.get('name')
        vendor_name = data.get('vendor_name')
        geojson_data = data.get('geojson_data')
        
        # Check required fields
        is_valid, message = check_required_fields(data, ['name', 'vendor_name', 'geojson_data'])
        if not is_valid:
            return jsonify({
                "success": False,
                "message": message
            }), 400

        # Validate GeoJSON structure
        is_valid, message = validate_geojson_structure(geojson_data)
        if not is_valid:
            return jsonify({
                "success": False,
                "message": message
            }), 400

        # Calculate size of GeoJSON data
        try:
            geojson_str = json.dumps(geojson_data)
            size = len(geojson_str)
        except Exception as e:
            return jsonify({
                "success": False,
                "message": f"Error calculating size: {str(e)}"
            }), 400
            
        # Generate a unique hash for the file
        timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
        random_id = str(uuid.uuid4())[:8]
        file_hash = hashlib.md5(f"{name}_{vendor_name}_{timestamp}_{random_id}".encode()).hexdigest()
        
        # Create the data directory if it doesn't exist
        data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data')
        os.makedirs(data_dir, exist_ok=True)
        
        # Save the GeoJSON file to disk
        file_path = os.path.join(data_dir, f"{file_hash}.json")
        try:
            with open(file_path, 'w') as f:
                f.write(geojson_str)
        except Exception as e:
            return jsonify({
                "success": False,
                "message": f"Error saving file to disk: {str(e)}"
            }), 500

        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            # Check if name already exists
            cursor.execute('SELECT COUNT(*) FROM geojson_data WHERE name = ?', (name,))
            if cursor.fetchone()[0] > 0:
                return jsonify({
                    "success": False,
                    "message": "A GeoJSON with this name already exists"
                }), 409

            cursor.execute('''
                INSERT INTO geojson_data (name, size, vendor_name, geojson_data, file_hash, file_path)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (name, size, vendor_name, json.dumps(geojson_data), file_hash, file_path))
            
            conn.commit()
            return jsonify({
                "success": True,
                "message": "GeoJSON uploaded successfully",
                "id": cursor.lastrowid
            }), 201

        except Exception as e:
            conn.rollback()
            return jsonify({
                "success": False,
                "message": f"Upload failed: {str(e)}"
            }), 500
        finally:
            conn.close()

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Server error: {str(e)}"
        }), 500

# Fetch GeoJSON file by ID
@geojson_bp.route('/fetch/<int:geojson_id>', methods=['GET', 'OPTIONS'])
def fetch_geojson(geojson_id):
    if geojson_id <= 0:
        return jsonify({
            "success": False,
            "message": "Invalid GeoJSON ID"
        }), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute('''
            SELECT id, name, size, vendor_name, date_added, geojson_data, file_hash, file_path
            FROM geojson_data
            WHERE id = ?
        ''', (geojson_id,))
        
        result = cursor.fetchone()
        
        if not result:
            return jsonify({
                "success": False,
                "message": "GeoJSON not found"
            }), 404

        try:
            geojson_data = json.loads(result['geojson_data'])
        except json.JSONDecodeError:
            return jsonify({
                "success": False,
                "message": "Invalid GeoJSON data in database"
            }), 500

        return jsonify({
            "success": True,
            "data": {
                "id": result['id'],
                "name": result['name'],
                "size": result['size'],
                "vendor_name": result['vendor_name'],
                "date_added": result['date_added'],
                "geojson_data": geojson_data,
                "file_hash": result['file_hash'] if 'file_hash' in result.keys() else None,
                "file_path": result['file_path'] if 'file_path' in result.keys() else None
            }
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Fetch failed: {str(e)}"
        }), 500
    finally:
        conn.close()

# List all GeoJSON files
@geojson_management.route('/list', methods=['GET'])
def list_geojson():
    print("Starting list_geojson function")
    conn = None
    try:
        # Get database connection
        conn = get_db_connection()
        cursor = conn.cursor()

        # Query matching exact schema columns
        cursor.execute('''
            SELECT 
                id,
                name,
                size,
                vendor_name,
                date_added,
                geojson_data,
                file_hash,
                file_path
            FROM geojson_data
            ORDER BY date_added DESC
        ''')
        
        rows = cursor.fetchall()
        
        # Convert to list of dictionaries
        data = []
        for row in rows:
            data.append({
                'id': row['id'],
                'name': row['name'],
                'size': row['size'],
                'vendor_name': row['vendor_name'],
                'date_added': row['date_added'],
                'geojson_data': json.loads(row['geojson_data']),
                'file_hash': row['file_hash'] if 'file_hash' in row.keys() else None,
                'file_path': row['file_path'] if 'file_path' in row.keys() else None
            })

        return jsonify({
            'success': True,
            'data': data
        }), 200

    except Exception as e:
        print(f"Error in list_geojson: {str(e)}")
        print(traceback.format_exc())
        return jsonify({
            'success': False,
            'message': f'List failed: {str(e)}'
        }), 500
    finally:
        if conn:
            try:
                conn.close()
            except Exception as e:
                print(f"Error closing connection: {str(e)}")

# Create new GeoJSON file
@geojson_management.route('/create', methods=['POST'])
def create_geojson():
    try:
        if not request.is_json:
            return jsonify({
                "success": False,
                "message": "Request must be JSON"
            }), 400

        # Get data from request
        data = request.json
        name = data.get('name')
        vendor_name = data.get('vendor_name')
        features = data.get('features', [])
        
        # Check required fields
        is_valid, message = check_required_fields(data, ['name', 'vendor_name'])
        if not is_valid:
            return jsonify({
                "success": False,
                "message": message
            }), 400

        # Validate features array
        if not isinstance(features, list):
            return jsonify({
                "success": False,
                "message": "Features must be an array"
            }), 400

        # Create GeoJSON structure
        geojson_data = {
            "type": "FeatureCollection",
            "features": features
        }

        # Validate the created GeoJSON
        is_valid, message = validate_geojson_structure(geojson_data)
        if not is_valid:
            return jsonify({
                "success": False,
                "message": message
            }), 400

        # Calculate size
        try:
            size = len(json.dumps(geojson_data))
        except Exception as e:
            return jsonify({
                "success": False,
                "message": f"Error calculating size: {str(e)}"
            }), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            # Check if name already exists
            cursor.execute('SELECT COUNT(*) FROM geojson_data WHERE name = ?', (name,))
            if cursor.fetchone()[0] > 0:
                return jsonify({
                    "success": False,
                    "message": "A GeoJSON with this name already exists"
                }), 409

            cursor.execute('''
                INSERT INTO geojson_data (name, size, vendor_name, geojson_data, file_hash, file_path)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (name, size, vendor_name, json.dumps(geojson_data), file_hash, file_path))
            
            conn.commit()
            return jsonify({
                "success": True,
                "message": "GeoJSON created successfully",
                "id": cursor.lastrowid
            }), 201

        except Exception as e:
            conn.rollback()
            return jsonify({
                "success": False,
                "message": f"Creation failed: {str(e)}"
            }), 500
        finally:
            conn.close()

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Server error: {str(e)}"
        }), 500

# Update GeoJSON file
@geojson_management.route('/update/<int:geojson_id>', methods=['PUT'])
def update_geojson(geojson_id):
    if geojson_id <= 0:
        return jsonify({
            "success": False,
            "message": "Invalid GeoJSON ID"
        }), 400

    try:
        if not request.is_json:
            return jsonify({
                "success": False,
                "message": "Request must be JSON"
            }), 400

        # Get data from request
        data = request.json
        name = data.get('name')
        vendor_name = data.get('vendor_name')
        geojson_data = data.get('geojson_data')
        
        if not any([name, vendor_name, geojson_data]):
            return jsonify({
                "success": False,
                "message": "No fields to update"
            }), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            # Check if record exists
            cursor.execute('SELECT COUNT(*) FROM geojson_data WHERE id = ?', (geojson_id,))
            if cursor.fetchone()[0] == 0:
                return jsonify({
                    "success": False,
                    "message": "GeoJSON not found"
                }), 404

            # If name is being updated, check for duplicates
            if name:
                cursor.execute('SELECT COUNT(*) FROM geojson_data WHERE name = ? AND id != ?', (name, geojson_id))
                if cursor.fetchone()[0] > 0:
                    return jsonify({
                        "success": False,
                        "message": "A GeoJSON with this name already exists"
                    }), 409

            # Validate GeoJSON if provided
            if geojson_data:
                is_valid, message = validate_geojson_structure(geojson_data)
                if not is_valid:
                    return jsonify({
                        "success": False,
                        "message": message
                    }), 400

            # Build update query dynamically based on provided fields
            update_fields = []
            params = []
            
            if name:
                update_fields.append('name = ?')
                params.append(name)
            if vendor_name:
                update_fields.append('vendor_name = ?')
                params.append(vendor_name)
            if geojson_data:
                update_fields.append('geojson_data = ?')
                update_fields.append('size = ?')
                params.append(json.dumps(geojson_data))
                params.append(len(json.dumps(geojson_data)))

            if not update_fields:
                return jsonify({
                    "success": False,
                    "message": "No valid fields to update"
                }), 400

            query = f'''
                UPDATE geojson_data 
                SET {', '.join(update_fields)}
                WHERE id = ?
            '''
            params.append(geojson_id)

            cursor.execute(query, params)
            conn.commit()
            
            return jsonify({
                "success": True,
                "message": "GeoJSON updated successfully"
            }), 200

        except Exception as e:
            conn.rollback()
            return jsonify({
                "success": False,
                "message": f"Update failed: {str(e)}"
            }), 500
        finally:
            conn.close()

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Server error: {str(e)}"
        }), 500

# Delete GeoJSON file
@geojson_bp.route('/delete/<int:geojson_id>', methods=['DELETE', 'OPTIONS'])
def delete_geojson(geojson_id):
    if geojson_id <= 0:
        return jsonify({
            "success": False,
            "message": "Invalid GeoJSON ID"
        }), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Check if record exists and get file path before deletion
        cursor.execute('SELECT file_path FROM geojson_data WHERE id = ?', (geojson_id,))
        result = cursor.fetchone()
        
        if not result:
            return jsonify({
                "success": False,
                "message": "GeoJSON not found"
            }), 404
            
        # Delete the file from disk if it exists
        file_path = result['file_path'] if result and 'file_path' in result.keys() else None
        if file_path and os.path.exists(file_path):
            try:
                os.remove(file_path)
                logger.info(f"Deleted file from disk: {file_path}")
            except Exception as e:
                logger.error(f"Error deleting file from disk: {str(e)}")
                
        # Delete any analysis results for this GeoJSON
        cursor.execute('DELETE FROM analysis_results WHERE geojson_id = ?', (geojson_id,))
        
        # Delete the GeoJSON record from the database
        cursor.execute('DELETE FROM geojson_data WHERE id = ?', (geojson_id,))
        conn.commit()
        
        return jsonify({
            "success": True,
            "message": "GeoJSON deleted successfully"
        }), 200

    except Exception as e:
        conn.rollback()
        return jsonify({
            "success": False,
            "message": f"Deletion failed: {str(e)}"
        }), 500
    finally:
        conn.close()

# Register routes with the geojson_bp Blueprint
geojson_bp.route('/upload', methods=['POST'])(upload_geojson)
geojson_bp.route('/<int:geojson_id>', methods=['GET'])(fetch_geojson)
geojson_bp.route('/list', methods=['GET'])(list_geojson)
geojson_bp.route('/create', methods=['POST'])(create_geojson)
geojson_bp.route('/<int:geojson_id>', methods=['PUT'])(update_geojson)
geojson_bp.route('/<int:geojson_id>', methods=['DELETE'])(delete_geojson)