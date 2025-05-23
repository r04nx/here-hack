
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, BarChart3, Eye, Edit3 } from 'lucide-react';

const userTypes = [
  {
    type: 'vendor',
    title: 'Vendor',
    description: 'Upload and manage geospatial data files',
    icon: Users,
    color: 'from-orange-500 to-orange-600',
    route: '/vendor'
  },
  {
    type: 'analyst',
    title: 'Analyst',
    description: 'Review and approve map changes',
    icon: BarChart3,
    color: 'from-blue-500 to-blue-600',
    route: '/analyst'
  },
  {
    type: 'viewer',
    title: 'Viewer',
    description: 'View overview dashboard and reports',
    icon: Eye,
    color: 'from-purple-500 to-purple-600',
    route: '/viewer'
  },
  {
    type: 'editor',
    title: 'Editor',
    description: 'Edit and adjust road segments manually',
    icon: Edit3,
    color: 'from-green-500 to-green-600',
    route: '/editor'
  }
];

export const LoginCard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (userType: string, route: string) => {
    // Store user type in localStorage
    localStorage.setItem('userType', userType);
    localStorage.setItem('userName', 'John Doe'); // Mock user
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">AL</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900">AutoLink</h1>
          </div>
          <p className="text-xl text-gray-600">Smart Road Merge Platform</p>
          <p className="text-gray-500 mt-2">Choose your role to access the dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {userTypes.map((user) => {
            const IconComponent = user.icon;
            return (
              <Card 
                key={user.type} 
                className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-orange-300"
                onClick={() => handleLogin(user.type, user.route)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${user.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">{user.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 mb-4">
                    {user.description}
                  </CardDescription>
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700">
                    Login as {user.title}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
