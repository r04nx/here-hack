import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Filter, Check, X, Info, Maximize2 } from 'lucide-react';

interface Change {
  id: string;
  type: 'speed_limit' | 'merge' | 'new_road' | 'closure';
  description: string;
  coordinates: [number, number];
  severity: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected';
}

const mockChanges: Change[] = [
  {
    id: '1',
    type: 'speed_limit',
    description: 'Speed limit changed from 50 km/h to 60 km/h on Main St.',
    coordinates: [8.682557, 50.111224],
    severity: 'low',
    status: 'pending'
  },
  {
    id: '2',
    type: 'merge',
    description: 'Road merger detected between Main St. segments',
    coordinates: [8.683007, 50.111525],
    severity: 'medium',
    status: 'pending'
  }
];

export const MapView: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [changes, setChanges] = useState<Change[]>(mockChanges);
  const [selectedChange, setSelectedChange] = useState<Change | null>(null);
  const [filters, setFilters] = useState({
    street: '',
    location: '',
    area: ''
  });

  useEffect(() => {
    // Initialize map (mock implementation)
    if (mapRef.current) {
      // This would integrate with Leaflet.js and HERE Maps API
      console.log('Initializing map...');
    }
  }, []);

  const handleApproveChange = (changeId: string) => {
    setChanges(prev => prev.map(change => 
      change.id === changeId ? { ...change, status: 'approved' } : change
    ));
  };

  const handleRejectChange = (changeId: string) => {
    setChanges(prev => prev.map(change => 
      change.id === changeId ? { ...change, status: 'rejected' } : change
    ));
  };

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'speed_limit': return 'bg-blue-100 text-blue-700';
      case 'merge': return 'bg-orange-100 text-orange-700';
      case 'new_road': return 'bg-green-100 text-green-700';
      case 'closure': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const toggleFullScreen = () => {
    if (iframeRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        iframeRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <iframe
        ref={iframeRef}
        src="http://127.0.0.1:5000/analyst"
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Analyst Map View"
      />
      <button
        onClick={toggleFullScreen}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          padding: '5px 10px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}
      >
        <Maximize2 size={16} />
      </button>
    </div>
  );
};
