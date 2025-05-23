
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Filter, Check, X, Info } from 'lucide-react';

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Controls Panel */}
      <div className="lg:col-span-1 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-blue-500" />
              <span>Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Street</label>
              <Input
                placeholder="Enter street name"
                value={filters.street}
                onChange={(e) => setFilters(prev => ({ ...prev, street: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Location</label>
              <Input
                placeholder="Enter location"
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Area</label>
              <Select value={filters.area} onValueChange={(value) => setFilters(prev => ({ ...prev, area: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="downtown">Downtown</SelectItem>
                  <SelectItem value="suburbs">Suburbs</SelectItem>
                  <SelectItem value="highway">Highway</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Changes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {changes.filter(change => change.status === 'pending').map((change) => (
                <div
                  key={change.id}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedChange(change)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Badge className={getChangeColor(change.type)}>
                        {change.type.replace('_', ' ')}
                      </Badge>
                      <p className="text-sm mt-2">{change.description}</p>
                    </div>
                    <MapPin className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApproveChange(change.id);
                      }}
                    >
                      <Check className="w-3 h-3 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRejectChange(change.id);
                      }}
                    >
                      <X className="w-3 h-3 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map Panel */}
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-orange-500" />
              <span>Map View</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-96 lg:h-full">
            <div
              ref={mapRef}
              className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center relative"
            >
              <div className="text-center">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Interactive Map View</p>
                <p className="text-sm text-gray-500">
                  HERE Maps & Leaflet.js integration will be implemented here
                </p>
              </div>

              {/* Mock change markers */}
              <div className="absolute top-1/3 left-1/3 w-4 h-4 bg-orange-500 rounded-full border-2 border-white cursor-pointer hover:scale-110 transition-transform"></div>
              <div className="absolute top-1/2 right-1/3 w-4 h-4 bg-blue-500 rounded-full border-2 border-white cursor-pointer hover:scale-110 transition-transform"></div>
            </div>

            {selectedChange && (
              <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg border max-w-sm">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <Badge className={getChangeColor(selectedChange.type)}>
                      {selectedChange.type.replace('_', ' ')}
                    </Badge>
                    <p className="text-sm mt-2">{selectedChange.description}</p>
                    <div className="flex space-x-2 mt-3">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Check className="w-3 h-3 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive">
                        <X className="w-3 h-3 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
