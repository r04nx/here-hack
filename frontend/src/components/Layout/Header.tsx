
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  userType?: 'vendor' | 'analyst' | 'viewer' | 'editor';
  userName?: string;
}

export const Header: React.FC<HeaderProps> = ({ userType, userName = 'John Doe' }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data and redirect to login
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AL</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">AutoLink</h1>
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
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
