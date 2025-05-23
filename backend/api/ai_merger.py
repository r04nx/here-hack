"""
AI-powered road merger API endpoints.
This module provides API endpoints for the smart road data merger system.
"""

import json
import logging
import os
import time
import sqlite3
from typing import Dict, List, Any, Optional

from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename

from road_merger_agent.agent import process_road_data
from utils import get_db_connection

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create blueprint
ai_merger_bp = Blueprint('ai_merger', __name__, url_prefix='/api/ai_merger')

@ai_merger_bp.route('/analyze', methods=['POST'])
def analyze_geojson():
    """
    Analyze a GeoJSON file using the AI-powered road merger agent.
    
    Request body:
    {
        "geojson_id": 123  # ID of the GeoJSON file to analyze
    }
    
    OR
    
    {
        "geojson_data": {...},  # GeoJSON data
        "vendor_name": "..."    # Name of the vendor
    }
    
    Returns:
        JSON response with analysis results.
    """
    try:
        start_time = time.time()
        logger.info("Starting GeoJSON analysis")
        
        # Get request data
        data = request.get_json()
        
        if not data:
            return jsonify({
                "success": False,
                "message": "No data provided"
            }), 400
        
        geojson_id = data.get('geojson_id')
        geojson_data = data.get('geojson_data')
        vendor_name = data.get('vendor_name')
        
        # If geojson_id is provided, fetch the data from the database
        if geojson_id:
            logger.info(f"Fetching GeoJSON data for ID: {geojson_id}")
            conn = get_db_connection()
            cursor = conn.cursor()
            
            try:
                cursor.execute('SELECT * FROM geojson_data WHERE id = ?', (geojson_id,))
                row = cursor.fetchone()
                
                if not row:
                    return jsonify({
                        "success": False,
                        "message": f"GeoJSON with ID {geojson_id} not found"
                    }), 404
                
                # Check if we have a file path to load from
                if row['file_path'] and os.path.exists(row['file_path']):
                    logger.info(f"Loading GeoJSON from file: {row['file_path']}")
                    with open(row['file_path'], 'r') as f:
                        geojson_data = json.load(f)
                else:
                    # Fall back to the data stored in the database
                    logger.info("Loading GeoJSON from database")
                    geojson_data = json.loads(row['geojson_data'])
                
                vendor_name = row['vendor_name']
                
            except Exception as e:
                logger.error(f"Error fetching GeoJSON data: {str(e)}")
                return jsonify({
                    "success": False,
                    "message": f"Error fetching GeoJSON data: {str(e)}"
                }), 500
            finally:
                conn.close()
        # Validate that we have the required data
        if not geojson_data:
            return jsonify({
                "success": False,
                "message": "No GeoJSON data provided"
            }), 400
            
        if not vendor_name:
            vendor_name = "Unknown Vendor"
            logger.warning("No vendor name provided, using 'Unknown Vendor'")
        
        # Process the GeoJSON data
        logger.info(f"Processing GeoJSON data from vendor: {vendor_name}")
        result = process_road_data(geojson_data, vendor_name)
        
        # If we have a geojson_id, store the analysis results in the database
        if geojson_id:
            try:
                logger.info(f"Storing analysis results for GeoJSON ID: {geojson_id}")
                conn = get_db_connection()
                cursor = conn.cursor()
                
                # Check if we already have analysis results for this GeoJSON
                cursor.execute('SELECT id FROM analysis_results WHERE geojson_id = ?', (geojson_id,))
                existing_result = cursor.fetchone()
                
                analysis_data = json.dumps(result)
                confidence_score = result.get('decision', {}).get('confidence_score', 0)
                recommendation = result.get('decision', {}).get('recommendation', '')
                reasoning = result.get('decision', {}).get('reasoning', '')
                
                if existing_result:
                    # Update existing analysis results
                    cursor.execute('''
                        UPDATE analysis_results 
                        SET confidence_score = ?, recommendation = ?, reasoning = ?, analysis_data = ?, date_analyzed = CURRENT_TIMESTAMP 
                        WHERE geojson_id = ?
                    ''', (confidence_score, recommendation, reasoning, analysis_data, geojson_id))
                else:
                    # Insert new analysis results
                    cursor.execute('''
                        INSERT INTO analysis_results (geojson_id, confidence_score, recommendation, reasoning, analysis_data)
                        VALUES (?, ?, ?, ?, ?)
                    ''', (geojson_id, confidence_score, recommendation, reasoning, analysis_data))
                
                conn.commit()
                logger.info(f"Analysis results stored successfully for GeoJSON ID: {geojson_id}")
            except Exception as e:
                logger.error(f"Error storing analysis results: {str(e)}")
            finally:
                conn.close()
        
        # Return the result
        processing_time = time.time() - start_time
        logger.info(f"GeoJSON analysis completed in {processing_time:.2f} seconds")
        return jsonify({
            "success": True,
            "data": result,
            "processing_time": processing_time
        })
            
    except Exception as e:
        logger.error(f"Error analyzing GeoJSON: {str(e)}")
        return jsonify({
            "success": False,
            "message": f"Error analyzing GeoJSON: {str(e)}"
        }), 500

@ai_merger_bp.route('/trust_scores', methods=['GET'])
def get_trust_scores():
    """
    Get vendor trust scores.
    
    Returns:
        JSON response with vendor trust scores.
    """
    try:
        # Mock vendor trust scores
        trust_scores = [
            {
                "name": "RoadTech Solutions",
                "score": 92,
                "trend": "+2.4%",
                "history": [85, 87, 90, 88, 92]
            },
            {
                "name": "GeoSpatial Partners",
                "score": 86,
                "trend": "+1.2%",
                "history": [80, 82, 84, 85, 86]
            },
            {
                "name": "MapData Inc.",
                "score": 78,
                "trend": "+3.5%",
                "history": [65, 70, 75, 76, 78]
            },
            {
                "name": "UrbanMapper",
                "score": 65,
                "trend": "-1.8%",
                "history": [60, 58, 62, 64, 65]
            },
            {
                "name": "GlobalRoads",
                "score": 81,
                "trend": "+0.5%",
                "history": [78, 79, 80, 80, 81]
            }
        ]
        
        return jsonify({
            "success": True,
            "data": trust_scores
        }), 200
            
    except Exception as e:
        logger.error(f"Error getting trust scores: {str(e)}")
        return jsonify({
            "success": False,
            "message": f"Error getting trust scores: {str(e)}"
        }), 500

@ai_merger_bp.route('/merge_history', methods=['GET'])
def get_merge_history():
    """
    Get merge history.
    
    Returns:
        JSON response with merge history.
    """
    try:
        # Mock merge history
        merge_history = [
            { 
                "id": 1, 
                "date": "2025-05-23", 
                "vendor": "RoadTech Solutions",
                "region": "Downtown",
                "segments": 127,
                "confidence": 94,
                "status": "completed",
                "aiVerified": True,
                "trustScore": 92
            },
            { 
                "id": 2, 
                "date": "2025-05-22", 
                "vendor": "MapData Inc.",
                "region": "Highway 101",
                "segments": 84,
                "confidence": 87,
                "status": "completed",
                "aiVerified": True,
                "trustScore": 78
            },
            { 
                "id": 3, 
                "date": "2025-05-20", 
                "vendor": "GeoSpatial Partners",
                "region": "Suburban Area",
                "segments": 56,
                "confidence": 91,
                "status": "completed",
                "aiVerified": True,
                "trustScore": 86
            },
            { 
                "id": 4, 
                "date": "2025-05-18", 
                "vendor": "UrbanMapper",
                "region": "City Center",
                "segments": 42,
                "confidence": 76,
                "status": "completed",
                "aiVerified": False,
                "trustScore": 65
            }
        ]
        
        return jsonify({
            "success": True,
            "data": merge_history
        }), 200
            
    except Exception as e:
        logger.error(f"Error getting merge history: {str(e)}")
        return jsonify({
            "success": False,
            "message": f"Error getting merge history: {str(e)}"
        }), 500

@ai_merger_bp.route('/merge', methods=['POST'])
def merge_geojson():
    """
    Merge GeoJSON files using the AI-powered road merger agent.
    
    Request body:
    {
        "geojson_data1": {...},  # First GeoJSON data
        "geojson_data2": {...},  # Second GeoJSON data
        "vendor_name": "...",    # Name of the vendor
        "auto_merge": true       # Whether to auto-merge based on trust score
    }
    
    Returns:
        JSON response with merged GeoJSON data.
    """
    try:
        # Get request data
        data = request.get_json()
        
        if not data:
            return jsonify({
                "success": False,
                "message": "No data provided"
            }), 400
        
        geojson_data1 = data.get('geojson_data1')
        geojson_data2 = data.get('geojson_data2')
        vendor_name = data.get('vendor_name')
        auto_merge = data.get('auto_merge', False)
        
        if not geojson_data1 or not geojson_data2:
            return jsonify({
                "success": False,
                "message": "Both GeoJSON datasets are required"
            }), 400
            
        if not vendor_name:
            return jsonify({
                "success": False,
                "message": "No vendor name provided"
            }), 400
        
        # Process the first GeoJSON data using the road merger agent
        logger.info(f"Processing first GeoJSON data from vendor: {vendor_name}")
        
        # Add a small delay to simulate processing time
        time.sleep(3)
        
        # For demonstration purposes, we'll use the existing RoadMerger class
        # In a real implementation, we would integrate with our AI agent
        from api.merger import RoadMerger
        
        # Create a temporary file for the first GeoJSON
        temp_file1 = "/tmp/temp_geojson1.json"
        with open(temp_file1, 'w') as f:
            json.dump(geojson_data1, f)
        
        # Create a temporary file for the second GeoJSON
        temp_file2 = "/tmp/temp_geojson2.json"
        with open(temp_file2, 'w') as f:
            json.dump(geojson_data2, f)
        
        # Create a temporary file for the merged GeoJSON
        temp_merged = "/tmp/temp_merged.json"
        
        # Create a RoadMerger instance
        merger = RoadMerger(similarity_threshold=0.8)
        
        # Merge the GeoJSON files
        merger.merge_roads(temp_file1, temp_file2, temp_merged)
        
        # Read the merged GeoJSON
        with open(temp_merged, 'r') as f:
            merged_geojson = json.load(f)
        
        # Clean up temporary files
        os.remove(temp_file1)
        os.remove(temp_file2)
        os.remove(temp_merged)
        
        return jsonify({
            "success": True,
            "data": {
                "merged_geojson": merged_geojson,
                "stats": merger.stats
            }
        }), 200
            
    except Exception as e:
        logger.error(f"Error merging GeoJSON: {str(e)}")
        return jsonify({
            "success": False,
            "message": f"Error merging GeoJSON: {str(e)}"
        }), 500
