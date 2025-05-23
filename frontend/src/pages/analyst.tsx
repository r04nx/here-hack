
import React from 'react';
import { Header } from '@/components/Layout/Header';
import { MapView } from '@/components/Analyst/MapView';

const AnalystDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="analyst" />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analyst Dashboard</h1>
          <p className="text-gray-600">Review and approve map changes</p>
        </div>

        <div className="h-[calc(100vh-200px)]">
          <MapView />
        </div>
      </div>
    </div>
  );
};

export default AnalystDashboard;
