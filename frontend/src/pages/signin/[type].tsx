import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { SignInCard } from '@/components/Login/SignInCard';
import { Users, BarChart3, Eye, Edit3 } from 'lucide-react';

const userTypes = {
  vendor: {
    title: 'Vendor',
    description: 'Upload and manage geospatial data files',
    icon: <Users className="w-8 h-8 text-white" />,
    color: 'from-orange-500 to-orange-600',
    route: '/vendor'
  },
  analyst: {
    title: 'Analyst',
    description: 'Review and approve map changes',
    icon: <BarChart3 className="w-8 h-8 text-white" />,
    color: 'from-blue-500 to-blue-600',
    route: '/analyst'
  },
  viewer: {
    title: 'Viewer',
    description: 'View overview dashboard and reports',
    icon: <Eye className="w-8 h-8 text-white" />,
    color: 'from-purple-500 to-purple-600',
    route: '/viewer'
  },
  editor: {
    title: 'Editor',
    description: 'Edit and adjust road segments manually',
    icon: <Edit3 className="w-8 h-8 text-white" />,
    color: 'from-green-500 to-green-600',
    route: '/editor'
  }
};

export default function SignInPage() {
  const { type } = useParams();
  
  if (!type || !(type in userTypes)) {
    return <Navigate to="/login" replace />;
  }

  const userType = userTypes[type as keyof typeof userTypes];

  return (
    <SignInCard
      userType={type}
      title={userType.title}
      description={userType.description}
      icon={userType.icon}
      color={userType.color}
      route={userType.route}
    />
  );
} 