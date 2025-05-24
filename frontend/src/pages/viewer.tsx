import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  FileText,
  Eye,
  Layers
} from 'lucide-react';

// Mock data for road merges
const mergeHistory = [
  { 
    id: 1, 
    date: '2025-05-23', 
    vendor: 'RoadTech Solutions',
    region: 'Downtown',
    segments: 127,
    confidence: 94,
    status: 'completed',
    aiVerified: true,
    trustScore: 92
  },
  { 
    id: 2, 
    date: '2025-05-22', 
    vendor: 'MapData Inc.',
    region: 'Highway 101',
    segments: 84,
    confidence: 87,
    status: 'completed',
    aiVerified: true,
    trustScore: 78
  },
  { 
    id: 3, 
    date: '2025-05-20', 
    vendor: 'GeoSpatial Partners',
    region: 'Suburban Area',
    segments: 56,
    confidence: 91,
    status: 'completed',
    aiVerified: true,
    trustScore: 86
  },
  { 
    id: 4, 
    date: '2025-05-18', 
    vendor: 'UrbanMapper',
    region: 'City Center',
    segments: 42,
    confidence: 76,
    status: 'completed',
    aiVerified: false,
    trustScore: 65
  }
];

// Mock data for vendor trust scores
const vendorScores = [
  { name: 'RoadTech Solutions', score: 92, trend: '+2.4%' },
  { name: 'GeoSpatial Partners', score: 86, trend: '+1.2%' },
  { name: 'MapData Inc.', score: 78, trend: '+3.5%' },
  { name: 'UrbanMapper', score: 65, trend: '-1.8%' },
  { name: 'GlobalRoads', score: 81, trend: '+0.5%' }
];

const ViewerDashboard = () => {
  const [selectedMerge, setSelectedMerge] = useState<number | null>(null);
  const [aiProcessLog, setAiProcessLog] = useState<string[]>([]);
  const [showingProcessDetails, setShowingProcessDetails] = useState(false);
  
  // Function to show AI process details with animated typing effect
  const showProcessDetails = (mergeId: number) => {
    setSelectedMerge(mergeId);
    setShowingProcessDetails(true);
    setAiProcessLog([]);
    
    // Simulate typing effect with process logs
    const logs = [
      "🤖 Initializing multi-agent analysis system...",
      "🔍 Agent 1: Extracting road segments and intersections from GeoJSON data...",
      "🌐 Agent 1: Making requests to OpenStreetMap Nominatim API for location validation...",
      "🚦 Agent 1: Identified 127 road segments, 42 intersections, and 18 traffic signals.",
      "🔄 Agent 2: Validating data against external map sources...",
      "🔄 Agent 2: Cross-referencing with Google Maps API...",
      "🔄 Agent 2: Cross-referencing with Waze data...",
      "✅ Agent 2: Found 94% match rate with external sources.",
      "📰 Agent 3: Searching for recent news about the region...",
      "📰 Agent 3: Analyzing 37 news articles using RAG-enhanced LLM...",
      "📰 Agent 3: Found 2 relevant road construction reports affecting the area.",
      "🧠 Decision Agent: Analyzing combined data from all agents...",
      "🧠 Decision Agent: Calculating confidence scores based on historical accuracy...",
      "🧠 Decision Agent: Considering vendor trust score of 92%...",
      "✅ Decision Agent: Recommending APPROVAL with 87% confidence.",
      "🚀 System: Data merge completed successfully!"
    ];
    
    logs.forEach((log, index) => {
      setTimeout(() => {
        setAiProcessLog(prev => [...prev, log]);
      }, 500 * (index + 1));
    });
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="viewer" />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Road Data Merger Dashboard</h1>
          <p className="text-gray-600">View AI-powered road data merges and vendor trust scores</p>
        </div>
        
        <Tabs defaultValue="merge-history">
          <TabsList className="mb-4">
            <TabsTrigger value="merge-history">
              <Layers className="w-4 h-4 mr-2" />
              Merge History
            </TabsTrigger>
            <TabsTrigger value="vendor-scores">
              <Star className="w-4 h-4 mr-2" />
              Vendor Trust Scores
            </TabsTrigger>
            <TabsTrigger value="ai-insights">
              <Brain className="w-4 h-4 mr-2" />
              AI Insights
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="merge-history" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Layers className="w-5 h-5 text-blue-500" />
                      <span>Recent Road Data Merges</span>
                    </CardTitle>
                    <CardDescription>
                      History of AI-verified road data merges from vendors
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mergeHistory.map(merge => (
                        <div 
                          key={merge.id} 
                          className={`p-4 border rounded-lg ${selectedMerge === merge.id ? 'border-blue-500 bg-blue-50' : ''} cursor-pointer hover:bg-gray-50`}
                          onClick={() => showProcessDetails(merge.id)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h3 className="font-medium">{merge.region}</h3>
                              <p className="text-sm text-gray-600">{merge.vendor} • {merge.date}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={getTrustScoreBgColor(merge.trustScore)}>
                                <Star className="w-3 h-3 mr-1" />
                                {merge.trustScore}%
                              </Badge>
                              {merge.aiVerified && (
                                <Badge className="bg-purple-100 text-purple-700">
                                  <Brain className="w-3 h-3 mr-1" />
                                  AI Verified
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div>
                              <span className="text-gray-500">Segments:</span>
                              <span className="ml-1 font-medium">{merge.segments}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Confidence:</span>
                              <span className="ml-1 font-medium">{merge.confidence}%</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Status:</span>
                              <span className="ml-1 font-medium capitalize">{merge.status}</span>
                            </div>
                          </div>
                          
                          <div className="mt-3 flex justify-end">
                            <Button variant="outline" size="sm" className="text-blue-600">
                              <Eye className="w-3 h-3 mr-1" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                {selectedMerge ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Brain className="w-5 h-5 text-purple-500" />
                        <span>AI Process Details</span>
                      </CardTitle>
                      <CardDescription>
                        Multi-agent analysis process for merge #{selectedMerge}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px] overflow-y-auto space-y-2 p-3 bg-black text-green-400 font-mono text-sm rounded-lg">
                        {aiProcessLog.map((log, index) => (
                          <div key={index} className="animate-fadeIn">
                            {log}
                          </div>
                        ))}
                        {showingProcessDetails && aiProcessLog.length < 16 && (
                          <div className="animate-pulse">_</div>
                        )}
                      </div>
                      
                      {aiProcessLog.length === 16 && (
                        <div className="mt-4">
                          <Alert className="bg-green-50 border-green-200">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <AlertTitle className="text-green-700">Merge Successfully Completed</AlertTitle>
                            <AlertDescription className="text-green-600 text-xs">
                              Data has been verified by all AI agents and merged into the production map
                            </AlertDescription>
                          </Alert>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Brain className="w-5 h-5 text-purple-500" />
                        <span>AI Process Details</span>
                      </CardTitle>
                      <CardDescription>
                        Select a merge to view AI analysis details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px] flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <Brain className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p>Select a merge from the list to view</p>
                        <p className="text-sm">the multi-agent AI analysis process</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="vendor-scores" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span>Vendor Trust Scores</span>
                    </CardTitle>
                    <CardDescription>
                      Reinforcement learning based trust scores for data providers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {vendorScores.map((vendor, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{vendor.name}</h3>
                            <div className="flex items-center space-x-2">
                              <div className={`px-3 py-1 rounded-full font-medium ${getTrustScoreBgColor(vendor.score)} ${getTrustScoreColor(vendor.score)}`}>
                                {vendor.score}%
                              </div>
                              <Badge className={vendor.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                                {vendor.trend.startsWith('+') ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingUp className="w-3 h-3 mr-1 rotate-180" />}
                                {vendor.trend}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                              <div 
                                className={`h-2.5 rounded-full ${getTrustScoreColor(vendor.score).replace('text-', 'bg-')}`}
                                style={{ width: `${vendor.score}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>0%</span>
                              <span>50%</span>
                              <span>100%</span>
                            </div>
                          </div>
                          
                          <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                            <div className="p-2 bg-gray-50 rounded">
                              <p className="text-gray-500">Data Quality</p>
                              <p className="font-medium">{Math.round(vendor.score * 0.9)}%</p>
                            </div>
                            <div className="p-2 bg-gray-50 rounded">
                              <p className="text-gray-500">Consistency</p>
                              <p className="font-medium">{Math.round(vendor.score * 1.1 > 100 ? 100 : vendor.score * 1.1)}%</p>
                            </div>
                            <div className="p-2 bg-gray-50 rounded">
                              <p className="text-gray-500">Timeliness</p>
                              <p className="font-medium">{Math.round(vendor.score * 0.95)}%</p>
                            </div>
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
                      <Brain className="w-5 h-5 text-purple-500" />
                      <span>Trust Score System</span>
                    </CardTitle>
                    <CardDescription>
                      How vendor trust scores are calculated
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium mb-1">Reinforcement Learning Model</h4>
                      <p className="text-sm text-gray-600">
                        Trust scores are calculated using a reinforcement learning model that learns from historical data accuracy and analyst approvals.
                      </p>
                    </div>
                    
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium mb-1">Key Factors</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li className="flex items-center">
                          <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                          Historical data accuracy
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                          Analyst approval rate
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                          Data consistency over time
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                          External validation results
                        </li>
                      </ul>
                    </div>
                    
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium mb-1">Score Interpretation</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          <span className="text-sm">90-100%: Excellent - Auto-merge eligible</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                          <span className="text-sm">75-89%: Good - Low review priority</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                          <span className="text-sm">60-74%: Fair - Review recommended</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                          <span className="text-sm">Below 60%: Poor - Full review required</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="ai-insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Brain className="w-5 h-5 text-purple-500" />
                      <span>Multi-Agent System Architecture</span>
                    </CardTitle>
                    <CardDescription>
                      How our AI agents work together to validate and merge road data
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
                              <h3 className="font-medium">Agent 1: Data Extraction</h3>
                              <Badge className="bg-blue-100 text-blue-700">
                                Primary Agent
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              Extracts road segments, intersections, and traffic signals from GeoJSON data. Makes requests to OpenStreetMap Nominatim API for location validation and enrichment.
                            </p>
                            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                              <div className="p-2 bg-gray-50 rounded">
                                <p className="text-gray-500">Input</p>
                                <p className="font-medium">GeoJSON Files</p>
                              </div>
                              <div className="p-2 bg-gray-50 rounded">
                                <p className="text-gray-500">Output</p>
                                <p className="font-medium">Structured Road Data</p>
                              </div>
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
                              <h3 className="font-medium">Agent 2: External Validation</h3>
                              <Badge className="bg-green-100 text-green-700">
                                Verification Agent
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              Validates extracted data against external map sources including Google Maps, Waze, and other proprietary datasets. Calculates match rates and identifies discrepancies.
                            </p>
                            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                              <div className="p-2 bg-gray-50 rounded">
                                <p className="text-gray-500">Input</p>
                                <p className="font-medium">Structured Road Data</p>
                              </div>
                              <div className="p-2 bg-gray-50 rounded">
                                <p className="text-gray-500">Output</p>
                                <p className="font-medium">Validation Report</p>
                              </div>
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
                              <h3 className="font-medium">Agent 3: News Analysis</h3>
                              <Badge className="bg-orange-100 text-orange-700">
                                RAG-Enhanced LLM
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              Searches for and analyzes recent news articles about the region using a RAG-enhanced LLM. Identifies relevant road construction reports, closures, or changes that might affect data accuracy.
                            </p>
                            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                              <div className="p-2 bg-gray-50 rounded">
                                <p className="text-gray-500">Input</p>
                                <p className="font-medium">Location Data</p>
                              </div>
                              <div className="p-2 bg-gray-50 rounded">
                                <p className="text-gray-500">Output</p>
                                <p className="font-medium">News Context Report</p>
                              </div>
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
                              <h3 className="font-medium">Agent 4: Decision Agent</h3>
                              <Badge className="bg-purple-100 text-purple-700">
                                Orchestrator
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              Analyzes combined data from all agents, calculates confidence scores, and makes the final decision on whether to approve the data merge. Considers vendor trust scores in the decision-making process.
                            </p>
                            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                              <div className="p-2 bg-gray-50 rounded">
                                <p className="text-gray-500">Input</p>
                                <p className="font-medium">All Agent Reports</p>
                              </div>
                              <div className="p-2 bg-gray-50 rounded">
                                <p className="text-gray-500">Output</p>
                                <p className="font-medium">Merge Decision</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-blue-500" />
                      <span>System Performance</span>
                    </CardTitle>
                    <CardDescription>
                      AI system performance metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Decision Accuracy</span>
                        <span className="font-medium">97.8%</span>
                      </div>
                      <Progress value={97.8} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>False Positive Rate</span>
                        <span className="font-medium">1.2%</span>
                      </div>
                      <Progress value={1.2} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>False Negative Rate</span>
                        <span className="font-medium">0.9%</span>
                      </div>
                      <Progress value={0.9} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Average Processing Time</span>
                        <span className="font-medium">4.3 minutes</span>
                      </div>
                      <Progress value={43} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-green-500" />
                      <span>Latest System Updates</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <p className="text-sm font-medium">May 23, 2025</p>
                        <p className="text-sm text-gray-600">Improved RAG model with 15% better context retrieval for news analysis</p>
                      </div>
                      
                      <div className="p-3 border rounded-lg">
                        <p className="text-sm font-medium">May 20, 2025</p>
                        <p className="text-sm text-gray-600">Added support for 3 new external map data sources</p>
                      </div>
                      
                      <div className="p-3 border rounded-lg">
                        <p className="text-sm font-medium">May 15, 2025</p>
                        <p className="text-sm text-gray-600">Enhanced trust score calculation with new reinforcement learning model</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ViewerDashboard;
