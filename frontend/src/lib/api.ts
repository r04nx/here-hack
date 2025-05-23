// API service for connecting to the backend
import axios from 'axios';

// Base URL for the backend API
const API_BASE_URL = 'http://localhost:5000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface VendorTrustScore {
  vendor_name: string;
  trust_score: number;
  trend: 'up' | 'down' | 'stable';
  last_updated: string;
}

export interface MergeHistory {
  id: string;
  vendor_name: string;
  timestamp: string;
  status: 'approved' | 'rejected' | 'reviewed';
  confidence_score: number;
  region: string;
}

export interface GeoJSONData {
  id: number;
  name: string;
  size: number;
  vendor_name: string;
  date_added: string;
  geojson_data: any;
  is_merged?: boolean;
}

export interface RoadDataAnalysis {
  status: string;
  process_results?: {
    extraction: {
      status: string;
      data?: {
        road_segments: {
          count: number;
          data: any[];
        };
        intersections: {
          count: number;
          data: any[];
        };
        traffic_signals: {
          count: number;
          data: any[];
        };
        location_info: {
          region: string;
          coordinates: number[];
        };
        complex_analysis: {
          complexity: string;
          connectivity_issues: string[];
          patterns: string[];
          summary: string;
        };
      };
    };
    validation: {
      status: string;
      validation_results?: {
        google_maps_match_rate: number;
        waze_match_rate: number;
        osm_match_rate: number;
        overall_match_rate: number;
      };
    };
    news_analysis: {
      status: string;
      news_analysis?: {
        articles_analyzed: number;
        findings: Array<{
          article: string;
          relevance: string;
          impact: string;
          summary: string;
        }>;
      };
    };
    decision: {
      vendor_name: string;
      vendor_trust_score: number;
      validation_score: number;
      news_impact_score: number;
      confidence_score: number;
      recommendation: 'approve' | 'review' | 'reject';
      reasoning: string;
    };
  };
  error_message?: string;
}

// API functions
export const roadMergerAPI = {
  // Analyze a GeoJSON file
  analyzeGeoJSON: async (geoJsonData: any, vendorName: string): Promise<RoadDataAnalysis> => {
    try {
      const response = await api.post('/api/ai_merger/analyze', {
        geojson_data: geoJsonData,
        vendor_name: vendorName
      });
      return response.data;
    } catch (error) {
      console.error('Error analyzing GeoJSON:', error);
      throw error;
    }
  },

  // Analyze a GeoJSON file by ID
  analyzeGeoJSONById: async (geojsonId: number): Promise<RoadDataAnalysis> => {
    try {
      const response = await api.post('/api/ai_merger/analyze', {
        geojson_id: geojsonId
      });
      return response.data;
    } catch (error) {
      console.error('Error analyzing GeoJSON by ID:', error);
      throw error;
    }
  },
  
  // Get list of uploaded GeoJSON files
  getUploadedGeoJSONFiles: async () => {
    try {
      const response = await api.get('/api/geojson/list');
      return response.data;
    } catch (error) {
      console.error('Error fetching GeoJSON files:', error);
      throw error;
    }
  },
  
  // Get a specific GeoJSON file by ID
  getGeoJSONById: async (id: number) => {
    try {
      const response = await api.get(`/api/geojson/fetch/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching GeoJSON with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Approve a GeoJSON file for merging
  approveGeoJSON: async (id: number, notes: string = '') => {
    try {
      const response = await api.post('/api/ai_merger/approve', {
        geojson_id: id,
        notes: notes
      });
      return response.data;
    } catch (error) {
      console.error(`Error approving GeoJSON with ID ${id}:`, error);
      throw error;
    }
  },

  // Get vendor trust scores
  getVendorTrustScores: async (): Promise<VendorTrustScore[]> => {
    try {
      const response = await api.get('/api/ai_merger/trust_scores');
      return response.data;
    } catch (error) {
      console.error('Error getting vendor trust scores:', error);
      throw error;
    }
  },

  // Get merge history
  getMergeHistory: async (): Promise<MergeHistory[]> => {
    try {
      const response = await api.get('/api/ai_merger/merge_history');
      return response.data;
    } catch (error) {
      console.error('Error getting merge history:', error);
      throw error;
    }
  },

  // Merge GeoJSON files
  mergeGeoJSON: async (file1Path: string, file2Path: string, outputPath: string): Promise<any> => {
    try {
      const response = await api.post('/api/ai_merger/merge', {
        file1_path: file1Path,
        file2_path: file2Path,
        output_path: outputPath
      });
      return response.data;
    } catch (error) {
      console.error('Error merging GeoJSON files:', error);
      throw error;
    }
  }
};

// GeoJSON API functions
export const geoJsonAPI = {
  // List all GeoJSON files
  listGeoJSON: async (): Promise<GeoJSONData[]> => {
    try {
      const response = await api.get('/api/geojson/list');
      return response.data.data;
    } catch (error) {
      console.error('Error listing GeoJSON files:', error);
      throw error;
    }
  },

  // Fetch a specific GeoJSON file by ID
  fetchGeoJSON: async (id: number): Promise<GeoJSONData> => {
    try {
      const response = await api.get(`/api/geojson/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching GeoJSON with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new GeoJSON file
  createGeoJSON: async (name: string, vendorName: string, features: any[]): Promise<any> => {
    try {
      const response = await api.post('/api/geojson/create', {
        name,
        vendor_name: vendorName,
        features
      });
      return response.data;
    } catch (error) {
      console.error('Error creating GeoJSON:', error);
      throw error;
    }
  },

  // Update an existing GeoJSON file
  updateGeoJSON: async (id: number, data: { name?: string; vendor_name?: string; geojson_data?: any }): Promise<any> => {
    try {
      const response = await api.put(`/api/geojson/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating GeoJSON with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a GeoJSON file
  deleteGeoJSON: async (id: number): Promise<any> => {
    try {
      const response = await api.delete(`/api/geojson/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting GeoJSON with ID ${id}:`, error);
      throw error;
    }
  }
};

export default { roadMergerAPI, geoJsonAPI };
