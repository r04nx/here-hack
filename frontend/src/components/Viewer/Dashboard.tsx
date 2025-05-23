
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  MapPin, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  BarChart3,
  Activity,
  Users
} from 'lucide-react';

const stats = [
  {
    title: 'Total Changes',
    value: '1,234',
    change: '+12.5%',
    trend: 'up',
    icon: Activity,
    color: 'text-blue-600'
  },
  {
    title: 'Approved Changes',
    value: '987',
    change: '+8.2%',
    trend: 'up',
    icon: CheckCircle,
    color: 'text-green-600'
  },
  {
    title: 'Pending Review',
    value: '156',
    change: '-3.1%',
    trend: 'down',
    icon: Clock,
    color: 'text-orange-600'
  },
  {
    title: 'Active Users',
    value: '42',
    change: '+5.7%',
    trend: 'up',
    icon: Users,
    color: 'text-purple-600'
  }
];

const recentChanges = [
  {
    id: '1',
    type: 'Speed Limit Update',
    location: 'Main Street, Downtown',
    status: 'approved',
    time: '2 hours ago',
    user: 'John Doe'
  },
  {
    id: '2',
    type: 'Road Merge',
    location: 'Highway 101, Section A',
    status: 'pending',
    time: '4 hours ago',
    user: 'Jane Smith'
  },
  {
    id: '3',
    type: 'New Road Addition',
    location: 'Residential Area, Block C',
    status: 'approved',
    time: '6 hours ago',
    user: 'Mike Johnson'
  }
];

const regions = [
  { name: 'Downtown', changes: 45, completion: 78 },
  { name: 'Suburbs', changes: 32, completion: 92 },
  { name: 'Industrial', changes: 18, completion: 65 },
  { name: 'Highway', changes: 67, completion: 84 }
];

export const Dashboard: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-orange-100 text-orange-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Overview Dashboard</h1>
          <p className="text-gray-600">Monitor all changes and system activity</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="border-green-500 text-green-700">
            System Healthy
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className={`text-xs ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100`}>
                    <IconComponent className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Changes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-500" />
              <span>Recent Changes</span>
            </CardTitle>
            <CardDescription>Latest updates from all users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentChanges.map((change) => (
                <div key={change.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{change.type}</h4>
                      <Badge className={getStatusColor(change.status)}>
                        {change.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{change.location}</p>
                    <p className="text-xs text-gray-500">by {change.user} • {change.time}</p>
                  </div>
                  <MapPin className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Regional Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-orange-500" />
              <span>Regional Progress</span>
            </CardTitle>
            <CardDescription>Change implementation by region</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {regions.map((region) => (
                <div key={region.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{region.name}</span>
                    <span className="text-gray-600">{region.changes} changes</span>
                  </div>
                  <Progress value={region.completion} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{region.completion}% complete</span>
                    <span>{Math.round(region.changes * (region.completion / 100))} approved</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-green-500" />
            <span>Global Map Overview</span>
          </CardTitle>
          <CardDescription>Visual representation of all changes across regions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center relative">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Interactive Overview Map</p>
              <p className="text-sm text-gray-500">
                Aggregated view of all regional changes and their status
              </p>
            </div>

            {/* Mock data points */}
            <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-green-500 rounded-full"></div>
            <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-orange-500 rounded-full"></div>
            <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-blue-500 rounded-full"></div>
            <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-purple-500 rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
