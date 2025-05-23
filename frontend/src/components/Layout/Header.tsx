import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface HeaderProps {
  userType?: 'vendor' | 'analyst' | 'viewer' | 'editor';
  userName?: string;
}

export const Header: React.FC<HeaderProps> = ({ userType, userName = 'John Doe' }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    
    // Show logout confirmation
    toast({
      title: "Logged Out Successfully",
      description: "You have been logged out of your account.",
    });
    
    // Redirect to landing page
    navigate('/', { replace: true });
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <img 
              src="/assets/logo-no-bg.png" 
              alt="RoadFusion Logo" 
              className="h-8 w-auto"
            />
            <h1 className="text-xl font-bold text-gray-900">RoadFusion</h1>
          </div>
          {userType && (
            <div className="bg-orange-100 px-3 py-1 rounded-full">
              <span className="text-orange-700 text-sm font-medium capitalize">{userType}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700">{userName}</span>
          </div>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
