
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  MousePointer, 
  Move, 
  Pencil, 
  Square, 
  Circle, 
  Minus, 
  Trash2, 
  Undo, 
  Redo, 
  Save,
  Settings,
  Layers,
  Ruler
} from 'lucide-react';
import { MapContainer, TileLayer, useMap, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Header } from '@/components/Layout/Header';

interface Tool {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  category: 'selection' | 'drawing' | 'editing' | 'measurement';
}

const tools: Tool[] = [
  { id: 'select', name: 'Select', icon: MousePointer, category: 'selection' },
  { id: 'pan', name: 'Pan', icon: Move, category: 'selection' },
  { id: 'draw', name: 'Draw', icon: Pencil, category: 'drawing' },
  { id: 'rectangle', name: 'Rectangle', icon: Square, category: 'drawing' },
  { id: 'circle', name: 'Circle', icon: Circle, category: 'drawing' },
  { id: 'line', name: 'Line', icon: Minus, category: 'drawing' },
  { id: 'measure', name: 'Measure', icon: Ruler, category: 'measurement' },
  { id: 'delete', name: 'Delete', icon: Trash2, category: 'editing' },
];

// Component to display coordinates
const CoordinatesDisplay = () => {
  const [coords, setCoords] = useState<[number, number]>([0, 0]);
  const map = useMap();
  
  map.addEventListener('mousemove', (e) => {
    setCoords([e.latlng.lat, e.latlng.lng]);
  });
  
  return (
    <div className="coordinates-display">
      Coordinates: {coords[0].toFixed(6)}, {coords[1].toFixed(6)}
    </div>
  );
};

export const MapEditor: React.FC = () => {
  const [activeTool, setActiveTool] = useState('select');
  const [isLayersPanelOpen, setIsLayersPanelOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(13);
  const defaultPosition: [number, number] = [50.111, 8.683]; // Frankfurt coordinates from the example

  const toolCategories = {
    selection: tools.filter(t => t.category === 'selection'),
    drawing: tools.filter(t => t.category === 'drawing'),
    editing: tools.filter(t => t.category === 'editing'),
    measurement: tools.filter(t => t.category === 'measurement'),
  };

  const ToolButton: React.FC<{ tool: Tool }> = ({ tool }) => {
    const IconComponent = tool.icon;
    return (
      <Button
        variant={activeTool === tool.id ? 'default' : 'ghost'}
        size="sm"
        className={`w-10 h-10 p-0 ${activeTool === tool.id ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
        onClick={() => setActiveTool(tool.id)}
        title={tool.name}
      >
        <IconComponent className="w-4 h-4" />
      </Button>
    );
  };

  const handleZoomChange = (map: any) => {
    setZoomLevel(map.getZoom());
  };

  return (
    <div className="h-screen w-full relative bg-gray-100">
      <Header userType="editor" />
      
      {/* Top Toolbar */}
      <div className="absolute top-16 left-0 right-0 z-10 bg-white shadow-sm border-b p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="font-semibold">AutoLink Editor</span>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Selection Tools */}
            <div className="flex space-x-1">
              {toolCategories.selection.map(tool => (
                <ToolButton key={tool.id} tool={tool} />
              ))}
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Drawing Tools */}
            <div className="flex space-x-1">
              {toolCategories.drawing.map(tool => (
                <ToolButton key={tool.id} tool={tool} />
              ))}
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Editing Tools */}
            <div className="flex space-x-1">
              {toolCategories.editing.map(tool => (
                <ToolButton key={tool.id} tool={tool} />
              ))}
              {toolCategories.measurement.map(tool => (
                <ToolButton key={tool.id} tool={tool} />
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Redo className="w-4 h-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsLayersPanelOpen(!isLayersPanelOpen)}
            >
              <Layers className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Map Canvas with OpenStreetMap */}
      <div className="absolute inset-0 pt-32">
        <MapContainer 
          center={defaultPosition} 
          zoom={zoomLevel} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          whenReady={(map) => {
            console.log('Map initialized with OpenStreetMap');
            map.target.on('zoom', () => handleZoomChange(map.target));
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="bottomright" />
          <CoordinatesDisplay />
        </MapContainer>
      </div>

      {/* Layers Panel */}
      {isLayersPanelOpen && (
        <div className="absolute right-4 top-36 z-20">
          <Card className="w-64">
            <CardHeader>
              <CardTitle className="text-sm">Layers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <span className="text-sm">Base Map</span>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <span className="text-sm">Roads</span>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <span className="text-sm">Changes</span>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <span className="text-sm">Annotations</span>
                <input type="checkbox" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-2 text-sm text-gray-600">
        <div className="flex justify-between items-center">
          <span>Tool: {tools.find(t => t.id === activeTool)?.name}</span>
          <span>Zoom: {zoomLevel}x | OSM-based map</span>
        </div>
      </div>
    </div>
  );
};
