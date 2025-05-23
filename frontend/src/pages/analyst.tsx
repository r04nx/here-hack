import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Layout/Header';
import { MapView } from '@/components/Analyst/MapView';
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
  Loader2
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
  
  // Function to simulate AI agent process
  const runAgentAnalysis = () => {
    setAgentAnalysisActive(true);
    setProcessingDemo(true);
    
    // Reset progress
    setCurrentAgentState({
      dataExtraction: { ...agentStates.dataExtraction, status: 'in_progress', progress: 0 },
      externalValidation: { ...agentStates.externalValidation, status: 'pending', progress: 0 },
      newsAnalysis: { ...agentStates.newsAnalysis, status: 'pending', progress: 0 },
      finalDecision: { ...agentStates.finalDecision, status: 'pending', progress: 0 }
    });
    
    // Simulate data extraction agent
    const extractionInterval = setInterval(() => {
      setCurrentAgentState(prev => {
        const newProgress = Math.min(prev.dataExtraction.progress + 10, 100);
        return {
          ...prev,
          dataExtraction: {
            ...prev.dataExtraction,
            progress: newProgress,
            status: newProgress === 100 ? 'completed' : 'in_progress'
          }
        };
      });
    }, 500);
    
    // Simulate external validation agent
    setTimeout(() => {
      clearInterval(extractionInterval);
      const validationInterval = setInterval(() => {
        setCurrentAgentState(prev => {
          const newProgress = Math.min(prev.externalValidation.progress + 8, 100);
          return {
            ...prev,
            externalValidation: {
              ...prev.externalValidation,
              progress: newProgress,
              status: newProgress === 100 ? 'completed' : 'in_progress'
            }
          };
        });
      }, 600);
      
      // Simulate news analysis agent
      setTimeout(() => {
        clearInterval(validationInterval);
        const newsInterval = setInterval(() => {
          setCurrentAgentState(prev => {
            const newProgress = Math.min(prev.newsAnalysis.progress + 12, 100);
            return {
              ...prev,
              newsAnalysis: {
                ...prev.newsAnalysis,
                progress: newProgress,
                status: newProgress === 100 ? 'completed' : 'in_progress'
              }
            };
          });
        }, 400);
        
        // Simulate final decision agent
        setTimeout(() => {
          clearInterval(newsInterval);
          const decisionInterval = setInterval(() => {
            setCurrentAgentState(prev => {
              const newProgress = Math.min(prev.finalDecision.progress + 15, 100);
              return {
                ...prev,
                finalDecision: {
                  ...prev.finalDecision,
                  progress: newProgress,
                  status: newProgress === 100 ? 'completed' : 'in_progress'
                }
              };
            });
          }, 300);
          
          // Complete the process
          setTimeout(() => {
            clearInterval(decisionInterval);
            setCurrentAgentState(agentStates);
            setProcessingDemo(false);
          }, 2000);
        }, 5000);
      }, 6000);
    }, 5000);
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

        <Tabs defaultValue="trust-scores">
          <TabsList className="mb-4">
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
      </div>
    </div>
  );
};

export default AnalystDashboard;
