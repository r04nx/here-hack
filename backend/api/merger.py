import geopandas as gpd
import numpy as np
from shapely.geometry import LineString
from shapely.ops import nearest_points
from scipy.spatial.distance import directed_hausdorff
import json
from typing import Tuple, Dict, List
import logging
from datetime import datetime
import pandas as pd
from tqdm import tqdm

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class GeoJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if pd.isna(obj) or pd.isna(obj) is pd.NaT:
            return None
        if isinstance(obj, (np.integer, np.int64)):
            return int(obj)
        if isinstance(obj, (float, np.float64)):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

class RoadMerger:
    def __init__(self, similarity_threshold: float = 0.8):
        self.similarity_threshold = similarity_threshold
        self.stats = {
            'total_roads_file1': 0,
            'total_roads_file2': 0,
            'matched_roads': 0,
            'unmatched_roads_file1': 0,
            'unmatched_roads_file2': 0
        }
        
    def load_geojson(self, file_path: str) -> gpd.GeoDataFrame:
        """Load GeoJSON file into a GeoDataFrame."""
        logger.info(f"Loading GeoJSON file: {file_path}")
        gdf = gpd.read_file(file_path)
        logger.info(f"Successfully loaded {len(gdf)} features from {file_path}")
        return gdf
    
    def calculate_geometric_similarity(self, line1: LineString, line2: LineString) -> float:
        """Calculate geometric similarity between two LineStrings using Hausdorff distance."""
        coords1 = np.array(line1.coords)
        coords2 = np.array(line2.coords)
        
        # Calculate directed Hausdorff distances
        d1 = directed_hausdorff(coords1, coords2)[0]
        d2 = directed_hausdorff(coords2, coords1)[0]
        
        # Take the maximum of the two directed distances
        max_distance = max(d1, d2)
        
        # Convert to similarity score (1 - normalized distance)
        # Using a reasonable threshold for normalization
        similarity = 1 - min(max_distance / 0.001, 1.0)
        return similarity
    
    def calculate_attribute_similarity(self, props1: Dict, props2: Dict) -> float:
        """Calculate similarity between road attributes."""
        # Simple attribute comparison - can be enhanced
        matching_attrs = 0
        total_attrs = 0
        
        for key in set(props1.keys()) | set(props2.keys()):
            if key in props1 and key in props2:
                if props1[key] == props2[key]:
                    matching_attrs += 1
                total_attrs += 1
        
        return matching_attrs / total_attrs if total_attrs > 0 else 0
    
    def clean_properties(self, props: Dict) -> Dict:
        """Clean properties dictionary by handling NaT and other non-serializable values."""
        cleaned = {}
        for key, value in props.items():
            if pd.isna(value) or pd.isna(value) is pd.NaT:
                cleaned[key] = None
            elif isinstance(value, (np.integer, np.int64)):
                cleaned[key] = int(value)
            elif isinstance(value, (float, np.float64)):
                cleaned[key] = float(value)
            elif isinstance(value, np.ndarray):
                cleaned[key] = value.tolist()
            elif isinstance(value, datetime):
                cleaned[key] = value.isoformat()
            else:
                cleaned[key] = value
        return cleaned
    
    def print_stats(self):
        """Print current statistics of the merging process."""
        logger.info("\nMerging Statistics:")
        logger.info(f"Total roads in file 1: {self.stats['total_roads_file1']}")
        logger.info(f"Total roads in file 2: {self.stats['total_roads_file2']}")
        logger.info(f"Successfully matched roads: {self.stats['matched_roads']}")
        logger.info(f"Unmatched roads from file 1: {self.stats['unmatched_roads_file1']}")
        logger.info(f"Unmatched roads from file 2: {self.stats['unmatched_roads_file2']}")
        logger.info(f"Match rate: {(self.stats['matched_roads'] / max(self.stats['total_roads_file1'], self.stats['total_roads_file2'])) * 100:.2f}%")
    
    def merge_roads(self, file1_path: str, file2_path: str, output_path: str):
        """Merge two GeoJSON files containing road data."""
        logger.info("Starting road merging process...")
        
        # Load the GeoJSON files
        gdf1 = self.load_geojson(file1_path)
        gdf2 = self.load_geojson(file2_path)
        
        self.stats['total_roads_file1'] = len(gdf1)
        self.stats['total_roads_file2'] = len(gdf2)
        
        merged_features = []
        processed_indices = set()
        
        logger.info("Finding and merging similar roads...")
        # Iterate through roads in first file with progress bar
        for idx1, row1 in tqdm(gdf1.iterrows(), total=len(gdf1), desc="Processing roads"):
            best_match = None
            best_similarity = 0
            
            # Find best matching road in second file
            for idx2, row2 in gdf2.iterrows():
                if idx2 in processed_indices:
                    continue
                    
                # Calculate similarities
                geom_similarity = self.calculate_geometric_similarity(row1.geometry, row2.geometry)
                attr_similarity = self.calculate_attribute_similarity(row1, row2)
                
                # Weighted combination
                total_similarity = 0.7 * geom_similarity + 0.3 * attr_similarity
                
                if total_similarity > best_similarity:
                    best_similarity = total_similarity
                    best_match = (idx2, row2)
            
            # If good match found, merge the roads
            if best_match and best_similarity >= self.similarity_threshold:
                idx2, row2 = best_match
                processed_indices.add(idx2)
                self.stats['matched_roads'] += 1
                
                # Merge geometries (simple average for now)
                merged_coords = []
                coords1 = list(row1.geometry.coords)
                coords2 = list(row2.geometry.coords)
                
                # Take average of coordinates
                for c1, c2 in zip(coords1, coords2):
                    merged_coords.append([
                        (c1[0] + c2[0]) / 2,
                        (c1[1] + c2[1]) / 2
                    ])
                
                # Merge properties (take non-null values)
                merged_props = {}
                for key in set(row1.keys()) | set(row2.keys()):
                    if key != 'geometry':
                        val1 = row1.get(key)
                        val2 = row2.get(key)
                        merged_props[key] = val1 if val1 is not None else val2
                
                # Clean the properties
                merged_props = self.clean_properties(merged_props)
                
                merged_feature = {
                    "type": "Feature",
                    "properties": merged_props,
                    "geometry": {
                        "type": "LineString",
                        "coordinates": merged_coords
                    }
                }
                merged_features.append(merged_feature)
            else:
                # Keep original road if no good match found
                self.stats['unmatched_roads_file1'] += 1
                props = self.clean_properties(row1.drop('geometry').to_dict())
                merged_features.append({
                    "type": "Feature",
                    "properties": props,
                    "geometry": {
                        "type": "LineString",
                        "coordinates": list(row1.geometry.coords)
                    }
                })
        
        logger.info("Adding remaining unmatched roads from second file...")
        # Add remaining unmatched roads from second file
        for idx2, row2 in gdf2.iterrows():
            if idx2 not in processed_indices:
                self.stats['unmatched_roads_file2'] += 1
                props = self.clean_properties(row2.drop('geometry').to_dict())
                merged_features.append({
                    "type": "Feature",
                    "properties": props,
                    "geometry": {
                        "type": "LineString",
                        "coordinates": list(row2.geometry.coords)
                    }
                })
        
        # Print statistics
        self.print_stats()
        
        # Create final GeoJSON
        logger.info("Creating final GeoJSON...")
        final_geojson = {
            "type": "FeatureCollection",
            "features": merged_features
        }
        
        # Save to file using custom encoder
        logger.info(f"Saving merged roads to {output_path}...")
        with open(output_path, 'w') as f:
            json.dump(final_geojson, f, indent=2, cls=GeoJSONEncoder)
        
        logger.info("Road merging process completed successfully!")

if __name__ == "__main__":
    # Example usage
    merger = RoadMerger(similarity_threshold=0.8)
    merger.merge_roads(
        "munshi_nagar-gilbert_hill.geojson",
        "munshi_nagar-gilbert_hill_v2.geojson",
        "merged_roads.geojson"
    ) 