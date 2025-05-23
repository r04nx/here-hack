from flask import Blueprint, jsonify, request, send_from_directory
import json
import os
import uuid
import tempfile
from dotenv import load_dotenv
from .merger import RoadMerger

# Load environment variables from .env file
load_dotenv()

# Create Blueprint
road_merger_bp = Blueprint('road_merger', __name__)

# Directory for temporary file storage
UPLOAD_FOLDER = os.path.join(tempfile.gettempdir(), 'road_merger_uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Get GeoJSON path from environment variable or use default
GEOJSON_PATH = os.environ.get('PROD_GEOJSON', 'prod/munshi_nagar-gilbert_hill.geojson')

# Initialize RoadMerger
road_merger = RoadMerger(similarity_threshold=0.8)

# Load GeoJSON data
def load_geojson():
    geojson_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', GEOJSON_PATH)
    try:
        with open(geojson_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except UnicodeDecodeError:
        # Fallback to latin-1 if UTF-8 fails
        with open(geojson_path, 'r', encoding='latin-1') as f:
            return json.load(f)

@road_merger_bp.route('/geojson')
def get_geojson():
    upload_id = request.args.get('upload_id')
    
    if upload_id:
        # Return the uploaded GeoJSON file if upload_id is provided
        uploaded_file_path = os.path.join(UPLOAD_FOLDER, upload_id, 'uploaded.geojson')
        
        if os.path.exists(uploaded_file_path):
            try:
                # Try UTF-8 first
                with open(uploaded_file_path, 'r', encoding='utf-8') as f:
                    return jsonify(json.load(f))
            except UnicodeDecodeError:
                # Fallback to latin-1 if UTF-8 fails
                with open(uploaded_file_path, 'r', encoding='latin-1') as f:
                    return jsonify(json.load(f))
        else:
            return jsonify({'error': 'Uploaded file not found'}), 404
    else:
        # Return the original GeoJSON data if no upload_id is provided
        data = load_geojson()
        return jsonify(data)

@road_merger_bp.route('/upload-geojson', methods=['POST'])
def upload_geojson():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if not file.filename.endswith(('.geojson', '.json')):
        return jsonify({'error': 'File must be a GeoJSON file'}), 400
    
    # Generate a unique ID for this upload
    upload_id = str(uuid.uuid4())
    
    # Create a directory for this upload
    upload_dir = os.path.join(UPLOAD_FOLDER, upload_id)
    os.makedirs(upload_dir, exist_ok=True)
    
    # Save the uploaded file
    file_path = os.path.join(upload_dir, 'uploaded.geojson')
    try:
        file.save(file_path)
        
        # Validate the GeoJSON
        with open(file_path, 'r', encoding='utf-8') as f:
            uploaded_data = json.load(f)
        
        # Check if it's a valid GeoJSON
        if 'type' not in uploaded_data or uploaded_data['type'] != 'FeatureCollection' or 'features' not in uploaded_data:
            os.remove(file_path)
            return jsonify({'error': 'Invalid GeoJSON format'}), 400
        
        return jsonify({
            'success': True,
            'upload_id': upload_id,
            'filename': file.filename,
            'feature_count': len(uploaded_data['features'])
        })
    
    except UnicodeDecodeError:
        # Try reading with latin-1 encoding
        try:
            with open(file_path, 'r', encoding='latin-1') as f:
                uploaded_data = json.load(f)
            
            # Check if it's a valid GeoJSON
            if 'type' not in uploaded_data or uploaded_data['type'] != 'FeatureCollection' or 'features' not in uploaded_data:
                os.remove(file_path)
                return jsonify({'error': 'Invalid GeoJSON format'}), 400
            
            return jsonify({
                'success': True,
                'upload_id': upload_id,
                'filename': file.filename,
                'feature_count': len(uploaded_data['features'])
            })
        except Exception as e:
            os.remove(file_path)
            return jsonify({'error': f'Error processing file: {str(e)}'}), 500
    except json.JSONDecodeError:
        os.remove(file_path)
        return jsonify({'error': 'Invalid JSON format'}), 400
    except Exception as e:
        os.remove(file_path)
        return jsonify({'error': str(e)}), 500

@road_merger_bp.route('/compare-geojson', methods=['POST'])
def compare_geojson():
    data = request.json
    
    if not data or 'upload_id' not in data:
        return jsonify({'error': 'Upload ID is required'}), 400
    
    upload_id = data['upload_id']
    uploaded_file_path = os.path.join(UPLOAD_FOLDER, upload_id, 'uploaded.geojson')
    
    if not os.path.exists(uploaded_file_path):
        return jsonify({'error': 'Uploaded file not found'}), 404
    
    try:
        # Load the original and uploaded GeoJSON files with proper encoding
        try:
            with open(uploaded_file_path, 'r', encoding='utf-8') as f:
                uploaded_data = json.load(f)
        except UnicodeDecodeError:
            with open(uploaded_file_path, 'r', encoding='latin-1') as f:
                uploaded_data = json.load(f)

        # Load original data with proper encoding
        original_data = load_geojson()
        
        # Find mismatches between the two datasets
        mismatches = find_mismatches(original_data, uploaded_data)
        
        # Save the analysis results with proper encoding
        results_path = os.path.join(UPLOAD_FOLDER, upload_id, 'analysis_results.json')
        with open(results_path, 'w', encoding='utf-8') as f:
            json.dump(mismatches, f, indent=2, ensure_ascii=False)
        
        return jsonify({
            'success': True,
            'mismatches': mismatches
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@road_merger_bp.route('/approve-changes', methods=['POST'])
def approve_changes():
    data = request.json
    
    if not data or 'upload_id' not in data or 'changes' not in data:
        return jsonify({'error': 'Upload ID and changes are required'}), 400
    
    upload_id = data['upload_id']
    changes = data['changes']
    
    try:
        approved_path = os.path.join(UPLOAD_FOLDER, upload_id, 'approved_changes.json')
        with open(approved_path, 'w') as f:
            json.dump(changes, f)
        
        return jsonify({
            'success': True,
            'message': 'Changes approved successfully'
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@road_merger_bp.route('/save-geojson', methods=['POST'])
def save_geojson():
    try:
        # Get the edited GeoJSON data from the request
        edited_data = request.json
        
        if not edited_data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
        
        # Validate the GeoJSON structure
        if 'type' not in edited_data or edited_data['type'] != 'FeatureCollection' or 'features' not in edited_data:
            return jsonify({'success': False, 'error': 'Invalid GeoJSON format'}), 400
        
        # Create a backup of the current file
        geojson_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', GEOJSON_PATH)
        backup_path = geojson_path + '.backup.' + str(uuid.uuid4())
        
        try:
            with open(geojson_path, 'r', encoding='utf-8') as f:
                original_data = f.read()
        except UnicodeDecodeError:
            with open(geojson_path, 'r', encoding='latin-1') as f:
                original_data = f.read()
            
        with open(backup_path, 'w', encoding='utf-8') as f:
            f.write(original_data)
        
        # Save the edited data
        with open(geojson_path, 'w', encoding='utf-8') as f:
            json.dump(edited_data, f, indent=2, ensure_ascii=False)
        
        return jsonify({'success': True, 'message': 'GeoJSON data saved successfully'})
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@road_merger_bp.route('/merge-geojson', methods=['POST'])
def merge_geojson():
    try:
        data = request.json
        
        if not data or 'upload_id' not in data:
            return jsonify({'error': 'Upload ID is required'}), 400
        
        upload_id = data['upload_id']
        uploaded_file_path = os.path.join(UPLOAD_FOLDER, upload_id, 'uploaded.geojson')
        
        if not os.path.exists(uploaded_file_path):
            return jsonify({'error': 'Uploaded file not found'}), 404
        
        # Get the original GeoJSON path
        original_geojson_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', GEOJSON_PATH)
        
        # Create output path for merged file
        output_path = os.path.join(UPLOAD_FOLDER, upload_id, 'merged.geojson')
        
        # Merge the roads
        road_merger.merge_roads(original_geojson_path, uploaded_file_path, output_path)
        
        # Read the merged file
        try:
            with open(output_path, 'r', encoding='utf-8') as f:
                merged_data = json.load(f)
        except UnicodeDecodeError:
            with open(output_path, 'r', encoding='latin-1') as f:
                merged_data = json.load(f)
        
        return jsonify({
            'success': True,
            'message': 'Roads merged successfully',
            'merged_data': merged_data
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@road_merger_bp.route('/preview-merge', methods=['POST'])
def preview_merge():
    try:
        data = request.json
        
        if not data or 'upload_id' not in data:
            return jsonify({'error': 'Upload ID is required'}), 400
        
        upload_id = data['upload_id']
        uploaded_file_path = os.path.join(UPLOAD_FOLDER, upload_id, 'uploaded.geojson')
        
        if not os.path.exists(uploaded_file_path):
            return jsonify({'error': 'Uploaded file not found'}), 404
        
        # Get the original GeoJSON path
        original_geojson_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', GEOJSON_PATH)
        
        # Create output path for merged file
        output_path = os.path.join(UPLOAD_FOLDER, upload_id, 'merged.geojson')
        
        # Merge the roads
        road_merger.merge_roads(original_geojson_path, uploaded_file_path, output_path)
        
        # Read the merged file
        try:
            with open(output_path, 'r', encoding='utf-8') as f:
                merged_data = json.load(f)
        except UnicodeDecodeError:
            with open(output_path, 'r', encoding='latin-1') as f:
                merged_data = json.load(f)
        
        # Get statistics about the merge
        stats = road_merger.stats
        
        return jsonify({
            'success': True,
            'message': 'Preview generated successfully',
            'merged_data': merged_data,
            'stats': stats
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@road_merger_bp.route('/download-merged', methods=['GET'])
def download_merged():
    try:
        upload_id = request.args.get('upload_id')
        
        if not upload_id:
            return jsonify({'error': 'Upload ID is required'}), 400
        
        merged_file_path = os.path.join(UPLOAD_FOLDER, upload_id, 'merged.geojson')
        
        if not os.path.exists(merged_file_path):
            return jsonify({'error': 'Merged file not found'}), 404
        
        return send_from_directory(
            os.path.dirname(merged_file_path),
            os.path.basename(merged_file_path),
            as_attachment=True,
            download_name='merged_roads.geojson'
        )
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Helper function to find mismatches between two GeoJSON datasets
def find_mismatches(original, uploaded):
    result = {
        'missingRoads': [],
        'newRoads': [],
        'modifiedRoads': []
    }
    
    # Create lookup maps for faster comparison
    original_feature_map = create_feature_map(original['features'])
    uploaded_feature_map = create_feature_map(uploaded['features'])
    
    # Find new and modified roads in uploaded dataset
    for uploaded_feature in uploaded['features']:
        # Only process road features (with highway property)
        if not uploaded_feature.get('properties') or not uploaded_feature['properties'].get('highway'):
            continue
        
        feature_id = get_feature_id(uploaded_feature)
        
        if not feature_id:
            # If no ID, treat as new road
            result['newRoads'].append(uploaded_feature)
            continue
        
        original_feature = original_feature_map.get(feature_id)
        
        if not original_feature:
            # Road exists in uploaded but not in original
            result['newRoads'].append(uploaded_feature)
        elif not are_geometries_equal(original_feature['geometry'], uploaded_feature['geometry']):
            # Road exists but geometry is different
            result['modifiedRoads'].append({
                'original': original_feature,
                'modified': uploaded_feature,
                'id': feature_id,
                'changeType': 'geometry'
            })
        elif not are_properties_equal(original_feature['properties'], uploaded_feature['properties']):
            # Road exists but properties are different
            result['modifiedRoads'].append({
                'original': original_feature,
                'modified': uploaded_feature,
                'id': feature_id,
                'changeType': 'properties'
            })
    
    # Find missing roads (in original but not in uploaded)
    for original_feature in original['features']:
        # Only process road features (with highway property)
        if not original_feature.get('properties') or not original_feature['properties'].get('highway'):
            continue
        
        feature_id = get_feature_id(original_feature)
        
        if feature_id and feature_id not in uploaded_feature_map:
            # Road exists in original but not in uploaded
            result['missingRoads'].append(original_feature)
    
    return result

# Helper function to create a map of features by ID
def create_feature_map(features):
    feature_map = {}
    for feature in features:
        # Only include road features
        if feature.get('properties') and feature['properties'].get('highway'):
            feature_id = get_feature_id(feature)
            if feature_id:
                feature_map[feature_id] = feature
    return feature_map

# Helper function to get a feature ID
def get_feature_id(feature):
    if feature.get('id'):
        return feature['id']
    elif feature.get('properties') and feature['properties'].get('@id'):
        return feature['properties']['@id']
    return None

# Helper function to compare geometries
def are_geometries_equal(geom1, geom2):
    if not geom1 or not geom2:
        return False
    if geom1.get('type') != geom2.get('type'):
        return False
    
    # Simple string comparison of coordinates
    return json.dumps(geom1.get('coordinates')) == json.dumps(geom2.get('coordinates'))

# Helper function to compare properties
def are_properties_equal(props1, props2):
    if not props1 or not props2:
        return False
    
    # Compare only road-related properties
    road_props1 = {}
    road_props2 = {}
    
    relevant_props = ['highway', 'name', 'lanes', 'oneway', 'surface', 'maxspeed']
    
    for prop in relevant_props:
        if props1.get(prop) is not None:
            road_props1[prop] = props1[prop]
        if props2.get(prop) is not None:
            road_props2[prop] = props2[prop]
    
    return json.dumps(road_props1, sort_keys=True) == json.dumps(road_props2, sort_keys=True) 