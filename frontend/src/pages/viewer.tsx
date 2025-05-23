
import React from 'react';
import { Header } from '@/components/Layout/Header';
import { Dashboard } from '@/components/Viewer/Dashboard';

const ViewerDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="viewer" />
      
      <div className="container mx-auto px-6 py-8">
        <Dashboard />
      </div>
    </div>
  );
};

export default ViewerDashboard;
