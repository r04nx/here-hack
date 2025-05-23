"""
Test script for the smart road data merger system.
This script demonstrates how to use the road merger agent.
"""

import json
import logging
import os
import sys

# Add the parent directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from road_merger_agent.agent import process_road_data

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def load_sample_geojson(file_path):
    """
    Load a sample GeoJSON file.
    
    Args:
        file_path (str): Path to the GeoJSON file.
        
    Returns:
        dict: The GeoJSON data.
    """
    try:
        with open(file_path, 'r') as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error loading GeoJSON file: {str(e)}")
        return None

def main():
    """
    Main function to test the road merger agent.
    """
    # Check if a GeoJSON file path was provided
    if len(sys.argv) < 2:
        logger.error("Please provide a path to a GeoJSON file.")
        logger.info("Usage: python test.py <path_to_geojson_file> [vendor_name]")
        return
    
    # Get the GeoJSON file path
    geojson_path = sys.argv[1]
    
    # Get the vendor name (default to "RoadTech Solutions")
    vendor_name = sys.argv[2] if len(sys.argv) > 2 else "RoadTech Solutions"
    
    # Load the GeoJSON file
    geojson_data = load_sample_geojson(geojson_path)
    if not geojson_data:
        return
    
    # Process the GeoJSON data using the direct function call approach
    logger.info(f"Processing GeoJSON data from vendor: {vendor_name}")
    result = process_road_data(geojson_data, vendor_name)
    
    # Print the result
    logger.info("Processing complete!")
    logger.info(f"Status: {result.get('status')}")
    
    if result.get("status") == "success":
        process_results = result.get("process_results", {})
        
        # Print extraction results
        extraction = process_results.get("extraction", {})
        logger.info("\nExtraction Results:")
        logger.info(f"Status: {extraction.get('status')}")
        if extraction.get("status") == "success":
            data = extraction.get("data", {})
            road_segments = data.get("road_segments", {})
            logger.info(f"Road Segments: {road_segments.get('count')}")
            intersections = data.get("intersections", {})
            logger.info(f"Intersections: {intersections.get('count')}")
            traffic_signals = data.get("traffic_signals", {})
            logger.info(f"Traffic Signals: {traffic_signals.get('count')}")
        
        # Print validation results
        validation = process_results.get("validation", {})
        logger.info("\nValidation Results:")
        logger.info(f"Status: {validation.get('status')}")
        if validation.get("status") == "success":
            validation_results = validation.get("validation_results", {})
            logger.info(f"Google Maps Match Rate: {validation_results.get('google_maps_match_rate', 0) * 100:.1f}%")
            logger.info(f"Waze Match Rate: {validation_results.get('waze_match_rate', 0) * 100:.1f}%")
            logger.info(f"OSM Match Rate: {validation_results.get('osm_match_rate', 0) * 100:.1f}%")
            logger.info(f"Overall Match Rate: {validation_results.get('overall_match_rate', 0) * 100:.1f}%")
        
        # Print news analysis results
        news_analysis = process_results.get("news_analysis", {})
        logger.info("\nNews Analysis Results:")
        logger.info(f"Status: {news_analysis.get('status')}")
        if news_analysis.get("status") == "success":
            news_analysis_results = news_analysis.get("news_analysis", {})
            logger.info(f"Articles Analyzed: {news_analysis_results.get('articles_analyzed', 0)}")
            logger.info(f"Findings: {len(news_analysis_results.get('findings', []))}")
        
        # Print decision results
        decision = process_results.get("decision", {})
        logger.info("\nDecision Results:")
        logger.info(f"Vendor: {decision.get('vendor_name')}")
        
        vendor_trust_score = decision.get('vendor_trust_score')
        if vendor_trust_score is not None:
            logger.info(f"Vendor Trust Score: {vendor_trust_score}%")
        else:
            logger.info("Vendor Trust Score: Not available")
        
        confidence_score = decision.get('confidence_score')
        if confidence_score is not None:
            logger.info(f"Confidence Score: {confidence_score:.1f}%")
        else:
            logger.info("Confidence Score: Not available")
        
        recommendation = decision.get('recommendation')
        if recommendation:
            logger.info(f"Recommendation: {recommendation.upper()}")
        else:
            logger.info("Recommendation: Not available")
        
        reasoning = decision.get('reasoning')
        if reasoning:
            logger.info(f"Reasoning: {reasoning}")
        else:
            logger.info("Reasoning: Not available")
    else:
        logger.error(f"Error: {result.get('error_message')}")
    
    logger.info("\nTest completed successfully!")
    logger.info("You can now use the API endpoints to interact with the road merger agent.")
    logger.info("- /ai_merger/analyze: Analyze a GeoJSON file")
    logger.info("- /ai_merger/trust_scores: Get vendor trust scores")
    logger.info("- /ai_merger/merge_history: Get merge history")
    logger.info("- /ai_merger/merge: Merge GeoJSON files")

if __name__ == "__main__":
    main()
