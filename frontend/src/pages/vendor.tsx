import React, { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/Layout/Header';
import { FileUpload } from '@/components/Vendor/FileUpload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, CheckCircle, Map, Eye, ThumbsUp, ThumbsDown, Calendar, User, HardDrive, BarChart2, Trash2, X, FileJson } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const API_BASE = "http://127.0.0.1:5000/api/geojson";
const AI_MERGER_API = "http://127.0.0.1:5000/api/ai_merger";
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
});

async function uploadGeoJSON({ name, vendor_name, geojson_data }: any) {
  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ name, vendor_name, geojson_data }),
  });
  return res.json();
}

async function analyzeGeoJSON(geojson_id: number) {
  const res = await fetch(`${AI_MERGER_API}/analyze`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ geojson_id }),
  });
  return res.json();
}

async function listGeoJSON() {
  const res = await fetch(`${API_BASE}/list`, {
    headers: getAuthHeaders(),
  });
  return res.json();
}

async function fetchGeoJSON(id: number) {
  const res = await fetch(`${API_BASE}/fetch/${id}`, {
    headers: getAuthHeaders(),
  });
  return res.json();
}

async function createGeoJSON({ name, vendor_name, features }: any) {
  const res = await fetch(`${API_BASE}/create`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ name, vendor_name, features }),
  });
  return res.json();
}

async function updateGeoJSON(id: number, { name, vendor_name, geojson_data }: any) {
  const res = await fetch(`${API_BASE}/update/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ name, vendor_name, geojson_data }),
  });
  return res.json();
}

async function deleteGeoJSON(id: number) {
  const res = await fetch(`${API_BASE}/delete/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return res.json();
}

// Simple Map Modal Component with Leaflet CDN
const SimpleMapModal = ({ isOpen, onClose, geojsonData, title }: { isOpen: boolean, onClose: () => void, geojsonData: any, title: string }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  
  // Add Leaflet CSS on component mount
  useEffect(() => {
    // Add Leaflet CSS once
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(linkElement);
    
    // Add Leaflet JS once
    const scriptElement = document.createElement('script');
    scriptElement.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    document.head.appendChild(scriptElement);
    
    return () => {
      // Clean up on component unmount
      document.head.removeChild(linkElement);
      document.head.removeChild(scriptElement);
    };
  }, []);
  
  // Initialize map when modal is opened and data is available
  useEffect(() => {
    if (!isOpen || !mapRef.current || !geojsonData || mapInitialized) return;
    
    console.log('Modal is open, waiting for Leaflet to load...');
    
    // Check if Leaflet is loaded every 100ms
    const checkLeaflet = setInterval(() => {
      // @ts-ignore
      if (window.L) {
        clearInterval(checkLeaflet);
        initMap();
      }
    }, 100);
    
    return () => {
      clearInterval(checkLeaflet);
    };
  }, [isOpen, geojsonData, mapInitialized]);
  
  // Clean up map when modal closes
  useEffect(() => {
    if (!isOpen && mapInitialized) {
      setMapInitialized(false);
      console.log('Modal closed, map state reset');
    }
  }, [isOpen]);
  
  const initMap = () => {
    if (!mapRef.current || !geojsonData) return;
    
    console.log('Initializing map with Leaflet');
    // @ts-ignore
    const L = window.L;
    
    try {
      // Clear any existing content
      mapRef.current.innerHTML = '';
      
      // Create the map
      const map = L.map(mapRef.current).setView([0, 0], 2);
      
      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      // Add GeoJSON layer
      const geoJsonLayer = L.geoJSON(geojsonData, {
        style: {
          color: '#3388ff',
          weight: 3,
          opacity: 0.7
        }
      }).addTo(map);
      
      // Fit to bounds
      try {
        const bounds = geoJsonLayer.getBounds();
        map.fitBounds(bounds);
      } catch (e) {
        console.error('Error fitting bounds:', e);
      }
      
      // Force a resize after a short delay
      setTimeout(() => {
        map.invalidateSize();
      }, 200);
      
      setMapInitialized(true);
      console.log('Map initialized successfully');
    } catch (error) {
      console.error('Error initializing map:', error);
      if (mapRef.current) {
        mapRef.current.innerHTML = '<div class="p-4 text-red-500">Error loading map</div>';
      }
    }
  };

  
  if (!isOpen) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh]">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>{title}</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="mt-4">
          <div ref={mapRef} className="w-full h-[500px] rounded-md border"></div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function VendorDashboard() {
  const [geojsonList, setGeojsonList] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedGeojson, setSelectedGeojson] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [mapData, setMapData] = useState<any>(null);

  const refreshList = () => {
    setLoading(true);
    listGeoJSON()
      .then((res) => {
        if (res.success) setGeojsonList(res.data);
        else setError(res.message || "Failed to fetch GeoJSON list");
      })
      .catch(() => setError("Failed to fetch GeoJSON list"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refreshList();
  }, []);

  const handleFileUpload = async (file: File, geojsonData: any) => {
    setLoading(true);
    const name = file.name;
    const vendor_name = localStorage.getItem("userName") || "Unknown Vendor";
    const res = await uploadGeoJSON({ name, vendor_name, geojson_data: geojsonData });
    if (res.success) {
      refreshList();
    } else {
      setError(res.message || "Upload failed");
    }
    setLoading(false);
  };
  
  const handleAnalyze = async (id: number) => {
    setAnalyzing(true);
    setAnalysisResult(null);
    try {
      const res = await analyzeGeoJSON(id);
      if (res.success) {
        setAnalysisResult(res.data);
      } else {
        setError(res.message || "Analysis failed");
      }
    } catch (err) {
      setError("Failed to analyze GeoJSON data");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFetch = async (id: number) => {
    console.log('Fetching GeoJSON with ID:', id);
    setSelectedId(id);
    setSelectedGeojson(null);
    setMapData(null);
    
    try {
      const res = await fetchGeoJSON(id);
      console.log('Fetch response:', res);
      
      if (res.success) {
        setSelectedGeojson(res.data);
        
        // Make sure we have valid GeoJSON data
        if (res.data && res.data.geojson_data) {
          console.log('GeoJSON data received:', res.data.geojson_data);
          
          // If the data is a string, try to parse it
          let parsedData = res.data.geojson_data;
          if (typeof parsedData === 'string') {
            try {
              parsedData = JSON.parse(parsedData);
              console.log('Parsed GeoJSON data from string');
            } catch (parseError) {
              console.error('Error parsing GeoJSON string:', parseError);
            }
          }
          
          // Set map data for the modal
          setMapData(parsedData);
          
          // Open the map modal
          setMapModalOpen(true);
        } else {
          console.error('No GeoJSON data in response');
          setError('No GeoJSON data found in the response');
        }
      } else {
        console.error('Fetch failed:', res.message);
        setError(res.message || 'Fetch failed');
      }
    } catch (error) {
      console.error('Error fetching GeoJSON:', error);
      setError('Error fetching GeoJSON data');
    }
  };

  const handleDelete = async (id: number) => {
    const res = await deleteGeoJSON(id);
    if (res.success) {
      refreshList();
      if (selectedId === id) setSelectedGeojson(null);
    } else {
      setError(res.message || "Delete failed");
    }
  };

  const handleUpdate = async (id: number, updates: any) => {
    setUpdating(true);
    const res = await updateGeoJSON(id, updates);
    setUpdating(false);
    if (res.success) {
      refreshList();
      if (selectedId === id) handleFetch(id);
    } else {
      setError(res.message || "Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="vendor" />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Dashboard</h1>
          <p className="text-gray-600">Upload and manage your geospatial data files</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FileUpload onFileUpload={handleFileUpload} />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <span>Upload Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Files</span>
                    <Badge variant="secondary">{geojsonList.length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Processing Status</span>
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Ready
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Uploaded GeoJSON Files</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div>Loading...</div>
                ) : error ? (
                  <div className="text-red-500">{error}</div>
                ) : (
                  <div className="grid gap-3">
                    {geojsonList.map((item) => (
                      <div key={item.id} className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-all p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1">
                            <FileJson className="h-5 w-5 text-blue-600" />
                            <h3 className="font-medium text-gray-900 truncate max-w-[200px]" title={item.name}>
                              {item.name}
                            </h3>
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50" 
                              onClick={() => handleFetch(item.id)}
                              title="View on Map"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 text-amber-600 hover:text-amber-800 hover:bg-amber-50" 
                              onClick={() => handleAnalyze(item.id)}
                              title="Analyze Data"
                            >
                              <BarChart2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50" 
                              onClick={() => handleDelete(item.id)}
                              title="Delete File"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <HardDrive className="h-3 w-3 text-gray-400" />
                            <span>{(item.size / 1024).toFixed(2)} KB</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3 text-gray-400" />
                            <span>{item.vendor_name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span>{new Date(item.date_added).toLocaleDateString()}</span>
                          </div>
                          {item.file_hash && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-mono bg-gray-100 px-1 rounded">{item.file_hash.substring(0, 8)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {selectedGeojson && (
              <Card>
                <CardHeader>
                  <CardTitle>GeoJSON Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div><b>ID:</b> {selectedGeojson.id}</div>
                    <div><b>Name:</b> {selectedGeojson.name}</div>
                    <div><b>Vendor:</b> {selectedGeojson.vendor_name}</div>
                    <div><b>Date Added:</b> {new Date(selectedGeojson.date_added).toLocaleString()}</div>
                    <div><b>Size:</b> {(selectedGeojson.size / 1024).toFixed(2)} KB</div>
                    {selectedGeojson.file_hash && (
                      <div><b>File Hash:</b> {selectedGeojson.file_hash}</div>
                    )}
                    {selectedGeojson.file_path && (
                      <div><b>File Path:</b> {selectedGeojson.file_path}</div>
                    )}
                    <div><b>GeoJSON:</b>
                      <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-48">{JSON.stringify(selectedGeojson.geojson_data, null, 2)}</pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {analyzing && (
              <Card>
                <CardHeader>
                  <CardTitle>Analyzing Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                    <span className="ml-2">Processing with AI agents...</span>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {analysisResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span>Analysis Results</span>
                    <Badge className="ml-2" variant={analysisResult.decision.recommendation === "MERGE" ? "success" : "destructive"}>
                      {analysisResult.decision.recommendation}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-1">Confidence Score</h3>
                      <div className="flex items-center">
                        <Progress value={analysisResult.decision.confidence_score} className="h-2 flex-1" />
                        <span className="ml-2 text-sm">{analysisResult.decision.confidence_score.toFixed(1)}%</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-1">Reasoning</h3>
                      <p className="text-sm">{analysisResult.decision.reasoning}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-1">Score Breakdown</h3>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <div>Vendor Trust</div>
                          <Badge variant="outline">{analysisResult.decision.scores.vendor_trust}%</Badge>
                        </div>
                        <div>
                          <div>Validation</div>
                          <Badge variant="outline">{analysisResult.decision.scores.validation.toFixed(1)}%</Badge>
                        </div>
                        <div>
                          <div>News Impact</div>
                          <Badge variant="outline">{analysisResult.decision.scores.news_impact}%</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Processing Pipeline</CardTitle>
                <CardDescription>Universal parser workflow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>File Validation</span>
                      <span>100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Data Parsing</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Quality Check</span>
                      <span>72%</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Map Modal */}
      <SimpleMapModal
        isOpen={mapModalOpen}
        onClose={() => setMapModalOpen(false)}
        geojsonData={mapData}
        title={selectedGeojson?.name || "GeoJSON Map View"}
      />
    </div>
  );
}
