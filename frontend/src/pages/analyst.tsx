import React, { useState, useEffect } from 'react';
import { roadMergerAPI, RoadDataAnalysis } from '@/lib/api';
import { Header } from '@/components/Layout/Header';
import { MapView } from '@/components/Analyst/MapView';
import { MapModal } from '@/components/Analyst/MapModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  TrendingUp, 
  MapPin, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  BarChart3,
  Activity,
  Users,
  Bot,
  Brain,
  Sparkles,
  Zap,
  Star,
  Shield,
  Loader2,
  FileJson,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  User,
  HardDrive,
  BarChart2,
  Trash2,
  Inbox
} from 'lucide-react';

// Mock vendor data with trust scores
const vendors = [
  { 
    id: 1, 
    name: 'RoadTech Solutions', 
    trustScore: 92, 
    scoreHistory: [85, 87, 90, 88, 92],
    approvalRate: 98,
    totalSubmissions: 234,
    lastSubmission: '2 hours ago',
    specialization: 'Highway data',
    region: 'North America'
  },
  { 
    id: 2, 
    name: 'MapData Inc.', 
    trustScore: 78, 
    scoreHistory: [65, 70, 75, 76, 78],
    approvalRate: 82,
    totalSubmissions: 156,
    lastSubmission: '5 hours ago',
    specialization: 'Urban roads',
    region: 'Europe'
  },
  { 
    id: 3, 
    name: 'GeoSpatial Partners', 
    trustScore: 86, 
    scoreHistory: [80, 82, 84, 85, 86],
    approvalRate: 90,
    totalSubmissions: 198,
    lastSubmission: '1 day ago',
    specialization: 'Rural roads',
    region: 'Global'
  },
  { 
    id: 4, 
    name: 'UrbanMapper', 
    trustScore: 65, 
    scoreHistory: [60, 58, 62, 64, 65],
    approvalRate: 72,
    totalSubmissions: 87,
    lastSubmission: '3 days ago',
    specialization: 'City centers',
    region: 'Asia'
  }
];

// Mock AI agent analysis states
const agentStates = {
  dataExtraction: {
    status: 'completed',
    message: 'Successfully extracted 127 road segments, 42 intersections, and 18 traffic signals from vendor data',
    progress: 100
  },
  externalValidation: {
    status: 'completed',
    message: 'Validated data against Google Maps, OpenStreetMap, and Waze. Found 94% match rate.',
    progress: 100
  },
  newsAnalysis: {
    status: 'completed',
    message: 'Analyzed 37 recent news articles about the region. Found 2 relevant road construction reports.',
    progress: 100
  },
  finalDecision: {
    status: 'completed',
    message: 'Recommended to APPROVE with 87% confidence score based on combined analysis.',
    progress: 100
  }
};

const AnalystDashboard = () => {
  const [trustThreshold, setTrustThreshold] = useState<number>(75);
  const [selectedVendor, setSelectedVendor] = useState<number | null>(null);
  const [agentAnalysisActive, setAgentAnalysisActive] = useState<boolean>(false);
  const [currentAgentState, setCurrentAgentState] = useState(agentStates);
  const [autoMergeEnabled, setAutoMergeEnabled] = useState<boolean>(false);
  const [processingDemo, setProcessingDemo] = useState<boolean>(false);
  
  // State for uploaded files
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [loadingFiles, setLoadingFiles] = useState<boolean>(true);
  const [fileError, setFileError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [mapModalOpen, setMapModalOpen] = useState<boolean>(false);
  const [mapData, setMapData] = useState<any>(null);
  const [merging, setMerging] = useState<boolean>(false);
  const [mergeStatus, setMergeStatus] = useState<{success: boolean; message: string} | null>(null);
  
  // Sample GeoJSON data for testing
  const sampleGeoJSON = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
          "id": "road1",
          "name": "Main Street",
          "type": "primary",
          "speed_limit": 50,
          "lanes": 2,
          "oneway": false
        },
        "geometry": {
          "type": "LineString",
          "coordinates": [
            [72.8776, 19.0760],
            [72.8780, 19.0765],
            [72.8785, 19.0770],
            [72.8790, 19.0775]
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {
          "id": "intersection1",
          "type": "intersection",
          "traffic_signals": true
        },
        "geometry": {
          "type": "Point",
          "coordinates": [72.8785, 19.0770]
        }
      },
      {
        "type": "Feature",
        "properties": {
          "id": "traffic_signal1",
          "highway": "traffic_signals"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [72.8790, 19.0775]
        }
      }
    ]
  };

  // Function to fetch uploaded GeoJSON files
  const fetchUploadedFiles = async () => {
    setLoadingFiles(true);
    setFileError(null);
    try {
      const response = await roadMergerAPI.getUploadedGeoJSONFiles();
      if (response.success) {
        setUploadedFiles(response.data);
      } else {
        setFileError(response.message || 'Failed to fetch uploaded files');
      }
    } catch (error) {
      console.error('Error fetching uploaded files:', error);
      setFileError('Failed to fetch uploaded files');
    } finally {
      setLoadingFiles(false);
    }
  };

  // Function to fetch a specific GeoJSON file
  const fetchGeoJSONFile = async (id: number) => {
    setSelectedFileId(id);
    setSelectedFile(null);
    try {
      const response = await roadMergerAPI.getGeoJSONById(id);
      if (response.success) {
        setSelectedFile(response.data);
        // Set map data for the modal
        setMapData(response.data.geojson_data);
      } else {
        setFileError(response.message || 'Failed to fetch file details');
      }
    } catch (error) {
      console.error(`Error fetching GeoJSON with ID ${id}:`, error);
      setFileError('Failed to fetch file details');
    }
  };

  // Function to analyze a GeoJSON file by ID
  const handleAnalyze = async (id: number) => {
    if (!id) return;
    
    setAnalyzing(true);
    setAnalysisResult(null);
    setMergeStatus(null);
    
    try {
      const result = await roadMergerAPI.analyzeGeoJSONById(id);
      console.log('Analysis result:', result);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error analyzing file:', error);
      setFileError('Failed to analyze the file. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  // Function to approve a GeoJSON file for merging
  const approveGeoJSONFile = async (id: number, notes: string = '') => {
    try {
      const response = await roadMergerAPI.approveGeoJSON(id, notes);
      if (response.success) {
        // Refresh the list after approval
        fetchUploadedFiles();
      } else {
        setFileError(response.message || 'Approval failed');
      }
    } catch (error) {
      console.error(`Error approving GeoJSON with ID ${id}:`, error);
      setFileError('Approval failed');
    }
  };
  
  // Load uploaded files when component mounts
  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  // Function to run AI agent analysis using the backend API
  const runAgentAnalysis = async () => {
    setAgentAnalysisActive(true);
    setProcessingDemo(true);
    
    // Reset progress
    setCurrentAgentState({
      dataExtraction: { ...agentStates.dataExtraction, status: 'in_progress', progress: 0 },
      externalValidation: { ...agentStates.externalValidation, status: 'pending', progress: 0 },
      newsAnalysis: { ...agentStates.newsAnalysis, status: 'pending', progress: 0 },
      finalDecision: { ...agentStates.finalDecision, status: 'pending', progress: 0 }
    });
    
    try {
      // Get the selected vendor name
      const vendorName = selectedVendor ? vendors.find(v => v.id === selectedVendor)?.name || 'RoadTech Solutions' : 'RoadTech Solutions';
      
      // Start data extraction phase
      setCurrentAgentState(prev => ({
        ...prev,
        dataExtraction: { ...prev.dataExtraction, status: 'in_progress', progress: 25 }
      }));
      
      // Call the backend API to analyze the GeoJSON data
      const analysisResult = await roadMergerAPI.analyzeGeoJSON(sampleGeoJSON, vendorName);
      
      // Update UI based on the API response
      if (analysisResult.status === 'success' && analysisResult.process_results) {
        const { extraction, validation, news_analysis, decision } = analysisResult.process_results;
        
        // Update data extraction state
        setCurrentAgentState(prev => ({
          ...prev,
          dataExtraction: { 
            ...prev.dataExtraction, 
            status: extraction.status === 'success' ? 'completed' : 'error',
            progress: 100,
            result: extraction.data ? {
              roadSegments: extraction.data.road_segments.count,
              intersections: extraction.data.intersections.count,
              trafficSignals: extraction.data.traffic_signals.count,
              region: extraction.data.location_info.region
            } : undefined
          }
        }));
        
        // Update all agent states immediately in sequence
        // Update external validation state
        setCurrentAgentState(prev => ({
          ...prev,
          dataExtraction: { 
            ...prev.dataExtraction, 
            status: extraction.status === 'success' ? 'completed' : 'error',
            progress: 100,
            result: extraction.data ? {
              roadSegments: extraction.data.road_segments.count,
              intersections: extraction.data.intersections.count,
              trafficSignals: extraction.data.traffic_signals.count,
              region: extraction.data.location_info.region
            } : undefined
          },
          externalValidation: { 
            ...prev.externalValidation, 
            status: validation.status === 'success' ? 'completed' : 'error',
            progress: 100,
            result: validation.validation_results ? {
              googleMapsMatchRate: validation.validation_results.google_maps_match_rate * 100,
              wazeMatchRate: validation.validation_results.waze_match_rate * 100,
              osmMatchRate: validation.validation_results.osm_match_rate * 100,
              overallMatchRate: validation.validation_results.overall_match_rate * 100
            } : undefined
          },
          newsAnalysis: { 
            ...prev.newsAnalysis, 
            status: news_analysis.status === 'success' ? 'completed' : 'error',
            progress: 100,
            result: news_analysis.news_analysis ? {
              articlesAnalyzed: news_analysis.news_analysis.articles_analyzed,
              findings: news_analysis.news_analysis.findings
            } : undefined
          },
          finalDecision: { 
            ...prev.finalDecision, 
            status: 'completed',
            progress: 100,
            result: {
              vendorName: decision.vendor_name,
              trustScore: decision.vendor_trust_score,
              confidenceScore: decision.confidence_score,
              recommendation: decision.recommendation,
              reasoning: decision.reasoning
            }
          }
        }));
        
        setProcessingDemo(false);
      } else {
        // Handle error
        setCurrentAgentState(prev => ({
          ...prev,
          dataExtraction: { ...prev.dataExtraction, status: 'error', progress: 100 },
          externalValidation: { ...prev.externalValidation, status: 'error', progress: 0 },
          newsAnalysis: { ...prev.newsAnalysis, status: 'error', progress: 0 },
          finalDecision: { ...prev.finalDecision, status: 'error', progress: 0 }
        }));
        setProcessingDemo(false);
      }
    } catch (error) {
      console.error('Error running agent analysis:', error);
      // Handle error
      setCurrentAgentState(prev => ({
        ...prev,
        dataExtraction: { ...prev.dataExtraction, status: 'error', progress: 100 },
        externalValidation: { ...prev.externalValidation, status: 'error', progress: 0 },
        newsAnalysis: { ...prev.newsAnalysis, status: 'error', progress: 0 },
        finalDecision: { ...prev.finalDecision, status: 'error', progress: 0 }
      }));
      setProcessingDemo(false);
    }
  };
  
  // Function to handle auto-merge toggle
  const toggleAutoMerge = () => {
    setAutoMergeEnabled(!autoMergeEnabled);
  };
  
  // Get color based on trust score
  const getTrustScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };
  
  // Get background color based on trust score
  const getTrustScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 75) return 'bg-blue-100';
    if (score >= 60) return 'bg-orange-100';
    return 'bg-red-100';
  };
  
  // Get badge color for agent status
  const getAgentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="analyst" />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart Road Data Merger</h1>
          <p className="text-gray-600">AI-powered analysis and trust-based approval system</p>
        </div>

        <Tabs defaultValue="uploaded-files">
          <TabsList className="mb-4">
            <TabsTrigger value="uploaded-files">
              <Inbox className="w-4 h-4 mr-2" />
              Uploaded Files
            </TabsTrigger>
            <TabsTrigger value="trust-scores">
              <Shield className="w-4 h-4 mr-2" />
              Vendor Trust Scores
            </TabsTrigger>
            <TabsTrigger value="ai-analysis">
              <Brain className="w-4 h-4 mr-2" />
              Multi-Agent Analysis
            </TabsTrigger>
            <TabsTrigger value="map-view">
              <MapPin className="w-4 h-4 mr-2" />
              Map View
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="uploaded-files" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileJson className="w-5 h-5 text-blue-500" />
                      <span>Vendor Uploads</span>
                    </CardTitle>
                    <CardDescription>
                      GeoJSON files uploaded by vendors for review
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loadingFiles ? (
                      <div className="flex justify-center items-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        <span className="ml-2">Loading files...</span>
                      </div>
                    ) : fileError ? (
                      <div className="text-red-500 py-4">{fileError}</div>
                    ) : uploadedFiles.length === 0 ? (
                      <div className="text-gray-500 py-4 text-center">
                        <p>No GeoJSON files have been uploaded yet.</p>
                      </div>
                    ) : (
                      <div className="grid gap-3 max-h-[500px] overflow-y-auto pr-2">
                        {uploadedFiles.map((file) => (
                          <div 
                            key={file.id} 
                            className={`bg-white rounded-lg border shadow-sm hover:shadow-md transition-all p-3 cursor-pointer ${selectedFileId === file.id ? 'border-blue-500 bg-blue-50' : ''}`}
                            onClick={() => fetchGeoJSONFile(file.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 flex-1">
                                <FileJson className="h-5 w-5 text-blue-600" />
                                <h3 className="font-medium text-gray-900 truncate max-w-[150px]" title={file.name}>
                                  {file.name}
                                </h3>
                              </div>
                            </div>
                            <div className="mt-2 grid grid-cols-1 gap-y-1 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3 text-gray-400" />
                                <span>{file.vendor_name}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-gray-400" />
                                <span>{new Date(file.date_added).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <HardDrive className="h-3 w-3 text-gray-400" />
                                <span>{(file.size / 1024).toFixed(2)} KB</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-2">
                {selectedFile ? (
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                          <div>{selectedFile.name}</div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setMapModalOpen(true);
                              }}
                              className="flex items-center gap-1"
                            >
                              <Eye className="h-4 w-4" />
                              <span>View Map</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="default"
                              onClick={() => analyzeGeoJSONFile(selectedFile.id)}
                              disabled={analyzing}
                              className="flex items-center gap-1"
                            >
                              {analyzing ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span>Analyzing...</span>
                                </>
                              ) : (
                                <>
                                  <BarChart2 className="h-4 w-4" />
                                  <span>Analyze</span>
                                </>
                              )}
                            </Button>
                          </div>
                        </CardTitle>
                        <CardDescription>
                          Uploaded by {selectedFile.vendor_name} on {new Date(selectedFile.date_added).toLocaleString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="p-3 bg-gray-50 rounded-md">
                            <div className="text-sm font-medium text-gray-500">Size</div>
                            <div className="text-lg font-semibold">{(selectedFile.size / 1024).toFixed(2)} KB</div>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-md">
                            <div className="text-sm font-medium text-gray-500">File Hash</div>
                            <div className="text-sm font-mono truncate" title={selectedFile.file_hash}>
                              {selectedFile.file_hash ? selectedFile.file_hash.substring(0, 12) + '...' : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {analysisResult && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Brain className="h-5 w-5 text-purple-600" />
                            <span>Analysis Results</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {analysisResult.decision && (
                              <div className="p-4 border rounded-md bg-gray-50">
                                <div className="flex justify-between items-center mb-3">
                                  <h3 className="font-semibold text-lg">AI Recommendation</h3>
                                  <Badge 
                                    className={`${analysisResult.decision.recommendation === 'MERGE' ? 'bg-green-100 text-green-800' : 
                                      analysisResult.decision.recommendation === 'REVIEW' ? 'bg-orange-100 text-orange-800' : 
                                      'bg-red-100 text-red-800'}`}
                                  >
                                    {analysisResult.decision.recommendation}
                                  </Badge>
                                </div>
                                <div className="mb-3">
                                  <div className="text-sm text-gray-600 mb-1">Confidence Score</div>
                                  <div className="flex items-center">
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                      <div 
                                        className={`h-full ${analysisResult.decision.confidence_score >= 80 ? 'bg-green-600' : 
                                          analysisResult.decision.confidence_score >= 60 ? 'bg-blue-600' : 
                                          analysisResult.decision.confidence_score >= 40 ? 'bg-orange-600' : 'bg-red-600'}`}
                                        style={{ width: `${analysisResult.decision.confidence_score}%` }}
                                      />
                                    </div>
                                    <span className="ml-2 font-medium">{analysisResult.decision.confidence_score.toFixed(1)}%</span>
                                  </div>
                                </div>
                                <div className="text-sm">
                                  <div className="font-medium mb-1">Reasoning:</div>
                                  <p className="text-gray-700">{analysisResult.decision.reasoning}</p>
                                </div>
                              </div>
                            )}
                            
                            <div className="flex justify-end gap-3 mt-4">
                              <Button 
                                variant="outline" 
                                className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => setAnalysisResult(null)}
                              >
                                <ThumbsDown className="h-4 w-4" />
                                <span>Reject</span>
                              </Button>
                              <Button 
                                variant="default" 
                                className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                                onClick={() => approveGeoJSONFile(selectedFile.id)}
                              >
                                <ThumbsUp className="h-4 w-4" />
                                <span>Approve & Merge</span>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <FileJson className="h-16 w-16 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">No File Selected</h3>
                      <p className="text-gray-500 text-center max-w-md">
                        Select a GeoJSON file from the list to view details, analyze with AI agents, and approve for merging.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="trust-scores" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-orange-500" />
                      <span>Vendor Trust Scores</span>
                    </CardTitle>
                    <CardDescription>
                      Reinforcement learning based trust scores for data providers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {vendors.map(vendor => (
                        <div 
                          key={vendor.id} 
                          className={`p-4 border rounded-lg ${selectedVendor === vendor.id ? 'border-blue-500 bg-blue-50' : ''} cursor-pointer`}
                          onClick={() => setSelectedVendor(vendor.id)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h3 className="font-medium">{vendor.name}</h3>
                              <p className="text-sm text-gray-600">{vendor.specialization} • {vendor.region}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full font-medium ${getTrustScoreBgColor(vendor.trustScore)} ${getTrustScoreColor(vendor.trustScore)}`}>
                              {vendor.trustScore}%
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-sm">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              {vendor.scoreHistory.map((score, i) => (
                                <div 
                                  key={i}
                                  className={`h-full ${getTrustScoreColor(score).replace('text-', 'bg-')}`}
                                  style={{ 
                                    width: `${100 / vendor.scoreHistory.length}%`, 
                                    display: 'inline-block',
                                    opacity: 0.5 + (i * 0.1)
                                  }}
                                />
                              ))}
                            </div>
                            <span className="text-gray-600">
                              {vendor.approvalRate}% approval
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="w-5 h-5 text-purple-500" />
                      <span>Auto-Merge Controls</span>
                    </CardTitle>
                    <CardDescription>
                      Set trust threshold for automatic merging
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Trust Threshold</span>
                        <span className="text-sm font-medium">{trustThreshold}%</span>
                      </div>
                      <Slider
                        value={[trustThreshold]}
                        min={50}
                        max={95}
                        step={5}
                        onValueChange={(value) => setTrustThreshold(value[0])}
                        className="mb-6"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Permissive</span>
                        <span>Strict</span>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <Button 
                        className={autoMergeEnabled ? 'bg-green-600 hover:bg-green-700 w-full' : 'w-full'}
                        onClick={toggleAutoMerge}
                      >
                        {autoMergeEnabled ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Auto-Merge Enabled
                          </>
                        ) : (
                          <>Enable Auto-Merge</>
                        )}
                      </Button>
                      
                      <p className="text-xs text-gray-600 mt-2">
                        {autoMergeEnabled 
                          ? `Vendors with trust scores above ${trustThreshold}% will have their data automatically merged` 
                          : 'Enable to automatically merge data from trusted vendors'}
                      </p>
                    </div>
                    
                    {selectedVendor && (
                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-2">Selected Vendor Status</h4>
                        {vendors.find(v => v.id === selectedVendor)?.trustScore ?? 0 >= trustThreshold ? (
                          <Alert className="bg-green-50 border-green-200">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <AlertTitle className="text-green-700">Eligible for Auto-Merge</AlertTitle>
                            <AlertDescription className="text-green-600 text-xs">
                              Trust score exceeds threshold
                            </AlertDescription>
                          </Alert>
                        ) : (
                          <Alert className="bg-orange-50 border-orange-200">
                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                            <AlertTitle className="text-orange-700">Manual Review Required</AlertTitle>
                            <AlertDescription className="text-orange-600 text-xs">
                              Trust score below threshold
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="ai-analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Brain className="w-5 h-5 text-purple-500" />
                      <span>Multi-Agent Analysis Pipeline</span>
                    </CardTitle>
                    <CardDescription>
                      AI-powered data validation and verification system
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Data Extraction Agent */}
                      <div className="border rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-blue-100 rounded-full">
                            <Bot className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">Data Extraction Agent</h3>
                              <Badge className={getAgentStatusColor(currentAgentState.dataExtraction.status)}>
                                {currentAgentState.dataExtraction.status === 'in_progress' ? 'Processing' : 
                                 currentAgentState.dataExtraction.status === 'completed' ? 'Completed' : 'Pending'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {currentAgentState.dataExtraction.status === 'in_progress' 
                                ? 'Extracting road segments, intersections, and traffic signals...' 
                                : currentAgentState.dataExtraction.message}
                            </p>
                            <div className="mt-2">
                              <div className="flex justify-between text-xs mb-1">
                                <span>Progress</span>
                                <span>{currentAgentState.dataExtraction.progress}%</span>
                              </div>
                              <Progress value={currentAgentState.dataExtraction.progress} className="h-1" />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* External Validation Agent */}
                      <div className="border rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-green-100 rounded-full">
                            <Bot className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">External Validation Agent</h3>
                              <Badge className={getAgentStatusColor(currentAgentState.externalValidation.status)}>
                                {currentAgentState.externalValidation.status === 'in_progress' ? 'Processing' : 
                                 currentAgentState.externalValidation.status === 'completed' ? 'Completed' : 'Pending'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {currentAgentState.externalValidation.status === 'in_progress' 
                                ? 'Validating against Google Maps, OpenStreetMap, and Waze...' 
                                : currentAgentState.externalValidation.message}
                            </p>
                            <div className="mt-2">
                              <div className="flex justify-between text-xs mb-1">
                                <span>Progress</span>
                                <span>{currentAgentState.externalValidation.progress}%</span>
                              </div>
                              <Progress value={currentAgentState.externalValidation.progress} className="h-1" />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* News Analysis Agent */}
                      <div className="border rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-orange-100 rounded-full">
                            <Bot className="w-5 h-5 text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">News Analysis Agent</h3>
                              <Badge className={getAgentStatusColor(currentAgentState.newsAnalysis.status)}>
                                {currentAgentState.newsAnalysis.status === 'in_progress' ? 'Processing' : 
                                 currentAgentState.newsAnalysis.status === 'completed' ? 'Completed' : 'Pending'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {currentAgentState.newsAnalysis.status === 'in_progress' 
                                ? 'Analyzing recent news articles about the region...' 
                                : currentAgentState.newsAnalysis.message}
                            </p>
                            <div className="mt-2">
                              <div className="flex justify-between text-xs mb-1">
                                <span>Progress</span>
                                <span>{currentAgentState.newsAnalysis.progress}%</span>
                              </div>
                              <Progress value={currentAgentState.newsAnalysis.progress} className="h-1" />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Decision Agent */}
                      <div className="border rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-purple-100 rounded-full">
                            <Bot className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">Decision Agent</h3>
                              <Badge className={getAgentStatusColor(currentAgentState.finalDecision.status)}>
                                {currentAgentState.finalDecision.status === 'in_progress' ? 'Processing' : 
                                 currentAgentState.finalDecision.status === 'completed' ? 'Completed' : 'Pending'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {currentAgentState.finalDecision.status === 'in_progress' 
                                ? 'Making final decision based on all collected data...' 
                                : currentAgentState.finalDecision.message}
                            </p>
                            <div className="mt-2">
                              <div className="flex justify-between text-xs mb-1">
                                <span>Progress</span>
                                <span>{currentAgentState.finalDecision.progress}%</span>
                              </div>
                              <Progress value={currentAgentState.finalDecision.progress} className="h-1" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-blue-500" />
                      <span>Analysis Controls</span>
                    </CardTitle>
                    <CardDescription>
                      Run AI analysis on selected vendor data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <Button 
                        className="w-full" 
                        onClick={runAgentAnalysis}
                        disabled={processingDemo || !selectedVendor}
                      >
                        {processingDemo ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>Run AI Analysis</>
                        )}
                      </Button>
                      
                      <p className="text-xs text-gray-600">
                        {selectedVendor 
                          ? `Analyze data from ${vendors.find(v => v.id === selectedVendor)?.name}` 
                          : 'Select a vendor to analyze their data'}
                      </p>
                    </div>
                    
                    {agentAnalysisActive && currentAgentState.finalDecision.status === 'completed' && (
                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-2">Analysis Results</h4>
                        <Alert className="bg-green-50 border-green-200">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <AlertTitle className="text-green-700">Recommended to Approve</AlertTitle>
                          <AlertDescription className="text-green-600 text-xs">
                            87% confidence score based on combined analysis
                          </AlertDescription>
                        </Alert>
                        
                        <div className="mt-4">
                          <Button className="w-full bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Merge to Production
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2">System Status</h4>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">AI Agents</span>
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Online
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-gray-600">External APIs</span>
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Connected
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-gray-600">LLM Services</span>
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Ready
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="map-view">
            <div className="h-[calc(100vh-250px)]">
              <MapView />
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Map Modal */}
        <MapModal
          isOpen={mapModalOpen}
          onClose={() => setMapModalOpen(false)}
          geojsonData={mapData}
          title={selectedFile?.name || "GeoJSON Map View"}
        />
      </div>
    </div>
  );
};

export default AnalystDashboard;
