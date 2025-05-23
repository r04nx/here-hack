
import React, { useState, useEffect, useRef } from 'react';
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
  Ruler,
  Download,
  Upload
} from 'lucide-react';
import { MapContainer, TileLayer, useMap, ZoomControl, FeatureGroup, GeoJSON, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import { Header } from '@/components/Layout/Header';
import { geoJsonAPI } from '@/lib/api';
import { toast } from 'sonner';

interface Tool {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  category: 'selection' | 'drawing' | 'editing' | 'measurement' | 'file';
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
  { id: 'save', name: 'Save', icon: Save, category: 'file' },
  { id: 'load', name: 'Load', icon: Download, category: 'file' },
];

// Custom Legend Control for the map
class LegendControl extends L.Control {
  private container: HTMLElement | null = null;
  
  constructor() {
    super({ position: 'bottomright' });
  }
  
  onAdd(map: L.Map): HTMLElement {
    this.container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-legend');
    this.container.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    this.container.style.padding = '10px';
    this.container.style.borderRadius = '4px';
    this.container.style.color = 'white';
    this.container.style.width = '180px';
    this.container.style.boxShadow = '0 1px 5px rgba(0,0,0,0.4)';
    this.container.style.border = '1px solid #555';
    
    const title = document.createElement('div');
    title.innerHTML = '<strong>Road Types</strong>';
    title.style.marginBottom = '8px';
    title.style.textAlign = 'center';
    this.container.appendChild(title);
    
    // Ensure these match exactly with the colors in the styleFunction
    const roadTypes = [
      { color: '#ff0000', name: 'Motorway' },
      { color: '#ff8800', name: 'Trunk' },
      { color: '#00aaff', name: 'Primary' },
      { color: '#00ff00', name: 'Secondary' },
      { color: '#ff0000', name: 'Tertiary' },
      { color: '#ffffff', name: 'Residential' },
      { color: '#ff00ff', name: 'Pedestrian' },
      { color: '#00ffff', name: 'Service' },
      { color: '#ffff00', name: 'Intersection' }
    ];
    
    roadTypes.forEach(type => {
      const item = document.createElement('div');
      item.style.display = 'flex';
      item.style.alignItems = 'center';
      item.style.marginBottom = '5px';
      
      const colorBox = document.createElement('div');
      colorBox.style.width = '15px';
      colorBox.style.height = '15px';
      colorBox.style.backgroundColor = type.color;
      colorBox.style.marginRight = '8px';
      // Add a border to make white colors visible against dark background
      colorBox.style.border = type.color === '#ffffff' ? '1px solid #aaa' : 'none';
      
      const label = document.createElement('span');
      label.textContent = type.name;
      label.style.fontSize = '12px';
      
      item.appendChild(colorBox);
      item.appendChild(label);
      this.container.appendChild(item);
    });
    
    // Prevent map clicks from propagating through the control
    L.DomEvent.disableClickPropagation(this.container);
    L.DomEvent.disableScrollPropagation(this.container);
    
    return this.container;
  }
  
  onRemove(map: L.Map): void {
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
  }
}

// Component to display coordinates and handle drawing controls
const MapControls = ({ activeTool, onDrawingComplete }: { activeTool: string, onDrawingComplete: (data: any) => void }) => {
  const [coords, setCoords] = useState<[number, number]>([0, 0]);
  const map = useMap();
  const drawControlRef = useRef<any>(null);
  const legendControlRef = useRef<LegendControl | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup>(new L.FeatureGroup());
  
  useEffect(() => {
    // Add the feature group to the map
    drawnItemsRef.current.addTo(map);
    
    // Add legend control to the map
    legendControlRef.current = new LegendControl();
    map.addControl(legendControlRef.current);
    
    // Initialize draw control
    const drawControl = new L.Control.Draw({
      draw: {
        polyline: activeTool === 'line',
        polygon: activeTool === 'draw',
        rectangle: activeTool === 'rectangle',
        circle: activeTool === 'circle',
        marker: false,
        circlemarker: false
      },
      edit: {
        featureGroup: drawnItemsRef.current,
        remove: activeTool === 'delete'
      }
    });
    
    drawControlRef.current = drawControl;
    map.addControl(drawControl);
    
    // Event handlers for drawing
    map.on(L.Draw.Event.CREATED, (e: any) => {
      const layer = e.layer;
      drawnItemsRef.current.addLayer(layer);
      onDrawingComplete(drawnItemsRef.current.toGeoJSON());
    });
    
    map.on(L.Draw.Event.EDITED, (e: any) => {
      onDrawingComplete(drawnItemsRef.current.toGeoJSON());
    });
    
    map.on(L.Draw.Event.DELETED, (e: any) => {
      onDrawingComplete(drawnItemsRef.current.toGeoJSON());
    });
    
    const handleMouseMove = (e: L.LeafletMouseEvent) => {
      setCoords([e.latlng.lat, e.latlng.lng]);
    };
    
    map.on('mousemove', handleMouseMove);
    
    return () => {
      map.off('mousemove', handleMouseMove);
      map.off(L.Draw.Event.CREATED);
      map.off(L.Draw.Event.EDITED);
      map.off(L.Draw.Event.DELETED);
      if (drawControlRef.current) {
        map.removeControl(drawControlRef.current);
      }
      if (legendControlRef.current) {
        map.removeControl(legendControlRef.current);
      }
      if (map.hasLayer(drawnItemsRef.current)) {
        map.removeLayer(drawnItemsRef.current);
      }
    };
  }, [map, activeTool, onDrawingComplete]);
  
  // Update drawing tools when active tool changes
  useEffect(() => {
    if (drawControlRef.current) {
      map.removeControl(drawControlRef.current);
    }
    
    const drawControl = new L.Control.Draw({
      draw: {
        polyline: activeTool === 'line',
        polygon: activeTool === 'draw',
        rectangle: activeTool === 'rectangle',
        circle: activeTool === 'circle',
        marker: false,
        circlemarker: false
      },
      edit: {
        featureGroup: drawnItemsRef.current,
        remove: activeTool === 'delete'
      }
    });
    
    drawControlRef.current = drawControl;
    map.addControl(drawControl);
  }, [activeTool, map]);
  
  // Method to add GeoJSON to the map
  useEffect(() => {
    // This will be called from the parent component
    const handleAddGeoJSON = (data: any) => {
      if (!data) return;
      
      try {
        // Clear existing layers
        drawnItemsRef.current.clearLayers();
        
        // Style function based on road type
        const styleFunction = (feature: any) => {
          // First check for road_type, if not available, check type property (from sample data)
          // If not available, map from highway property
          let roadType = feature.properties?.road_type;
          
          // Check for type property from sample data
          if (!roadType && feature.properties?.type) {
            roadType = feature.properties.type;
            // Store the mapped road_type back in the properties for future reference
            feature.properties.road_type = roadType;
          }
          // If road_type is not available, map from highway property
          else if (!roadType && feature.properties?.highway) {
            const highwayType = feature.properties.highway;
            switch(highwayType) {
              case 'motorway':
              case 'motorway_link':
                roadType = 'motorway';
                break;
              case 'trunk':
              case 'trunk_link':
                roadType = 'trunk';
                break;
              case 'primary':
              case 'primary_link':
                roadType = 'primary';
                break;
              case 'secondary':
              case 'secondary_link':
                roadType = 'secondary';
                break;
              case 'tertiary':
              case 'tertiary_link':
                roadType = 'tertiary';
                break;
              case 'residential':
                roadType = 'residential';
                break;
              case 'pedestrian':
              case 'footway':
              case 'path':
                roadType = 'pedestrian';
                break;
              case 'service':
                roadType = 'service';
                break;
              default:
                roadType = 'unclassified';
            }
            // Store the mapped road_type back in the properties for future reference
            feature.properties.road_type = roadType;
          } else if (!roadType) {
            roadType = 'unclassified';
          }
          
          // Colors matching the legend exactly
          const colors: Record<string, string> = {
            'motorway': '#ff0000',     // Red
            'trunk': '#ff8800',        // Orange
            'primary': '#00aaff',      // Cyan
            'secondary': '#00ff00',    // Green
            'tertiary': '#ff0000',     // Red
            'residential': '#ffffff',  // White
            'pedestrian': '#ff00ff',   // Pink
            'service': '#00ffff',      // Light Cyan
            'unclassified': '#ffffff',  // White
            'intersection': '#ffff00'   // Yellow for intersections
          };
          
          // Make these colors available globally
          (window as any).roadColors = colors;
          
          return {
            color: colors[roadType] || '#ffffff',
            weight: roadType === 'motorway' || roadType === 'trunk' ? 8 : 
                   roadType === 'primary' ? 6 :
                   roadType === 'secondary' ? 5 : 
                   roadType === 'tertiary' ? 4 : 3,
            opacity: 1.0,
            lineCap: 'round',
            lineJoin: 'round'
          };
        };
        
        // Add new GeoJSON data with styling
        const geoJsonLayer = L.geoJSON(data, { 
          style: styleFunction,
          pointToLayer: (feature, latlng) => {
            // Handle point features like intersections
            if (feature.properties && (feature.properties.type === 'intersection' || feature.properties.highway === 'traffic_signals')) {
              return L.circleMarker(latlng, {
                radius: 8,
                fillColor: '#ffff00', // Yellow for intersections
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
              });
            }
            return L.marker(latlng);
          },
          onEachFeature: (feature, layer) => {
            // Add tooltips to show road type and name
            if (feature.properties) {
              const roadType = feature.properties.road_type || feature.properties.type || 'unknown';
              const roadName = feature.properties.name || feature.properties.id || 'Unnamed';
              const speedLimit = feature.properties.speed_limit ? ` (${feature.properties.speed_limit} km/h)` : '';
              const lanes = feature.properties.lanes ? ` - ${feature.properties.lanes} lane(s)` : '';
              const oneway = feature.properties.hasOwnProperty('oneway') ? ` - ${feature.properties.oneway ? 'One-way' : 'Two-way'}` : '';
              const trafficSignals = feature.properties.traffic_signals ? ' - Has traffic signals' : '';
              
              layer.bindTooltip(`${roadName} (${roadType})${speedLimit}${lanes}${oneway}${trafficSignals}`, { sticky: true });
            }
          }
        });
        geoJsonLayer.eachLayer((layer) => {
          drawnItemsRef.current.addLayer(layer);
        });
        
        // Fit bounds to the new data
        const bounds = geoJsonLayer.getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds);
        }
        
        onDrawingComplete(drawnItemsRef.current.toGeoJSON());
      } catch (error) {
        console.error('Error adding GeoJSON to map:', error);
      }
    };
    
    // Add the event listener to the map instance
    map.on('addGeoJSON', handleAddGeoJSON);
    
    return () => {
      map.off('addGeoJSON', handleAddGeoJSON);
    };
  }, [map, onDrawingComplete]);
  
  return (
    <div className="coordinates-display absolute bottom-10 left-2 z-[1000] bg-white p-2 rounded shadow">
      Coordinates: {coords[0].toFixed(6)}, {coords[1].toFixed(6)}
    </div>
  );
};

// Component to load GeoJSON data
const GeoJSONLoader = ({ onDataLoaded }: { onDataLoaded: (data: any) => void }) => {
  const [geoJsonFiles, setGeoJsonFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchGeoJsonFiles = async () => {
      try {
        setLoading(true);
        const files = await geoJsonAPI.listGeoJSON();
        setGeoJsonFiles(files || []);
      } catch (error) {
        console.error('Error fetching GeoJSON files:', error);
        toast.error('Failed to load GeoJSON files');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGeoJsonFiles();
  }, []);
  
  const handleLoadFile = async (id: number) => {
    try {
      setLoading(true);
      const data = await geoJsonAPI.fetchGeoJSON(id);
      if (data && data.geojson_data) {
        onDataLoaded(data.geojson_data);
        toast.success(`Loaded ${data.name} successfully`);
      }
    } catch (error) {
      console.error('Error loading GeoJSON file:', error);
      toast.error('Failed to load GeoJSON file');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle className="text-sm">Load GeoJSON</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : geoJsonFiles.length > 0 ? (
          geoJsonFiles.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <span className="text-sm truncate" title={file.name}>{file.name}</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleLoadFile(file.id)}
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          ))
        ) : (
          <div className="text-center text-sm text-gray-500">No GeoJSON files found</div>
        )}
      </CardContent>
    </Card>
  );
};

export const MapEditor: React.FC = () => {
  const [activeTool, setActiveTool] = useState('select');
  const [isLayersPanelOpen, setIsLayersPanelOpen] = useState(false);
  const [isGeoJsonPanelOpen, setIsGeoJsonPanelOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(13);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [drawnItems, setDrawnItems] = useState<any>(null);
  const mapRef = useRef<L.Map | null>(null);
  
  // Default position - Munshiu Nagar, India coordinates
  const defaultPosition = [19.075983, 72.877656];

  const loadMunshiuNagarMap = async () => {
    // Try to load our custom sample data first
    try {
      console.log('Attempting to load custom sample data');
      const response = await fetch('/sample_data/custom_roads.geojson');
      if (response.ok) {
        const data = await response.json();
        console.log('Loaded custom sample data:', data);
        setGeoJsonData(data);
        toast.success('Loaded custom road sample data');
        return;
      }
    } catch (error) {
      console.error('Error loading custom sample data:', error);
    }
    
    // Try to load from backend sample data
    try {
      console.log('Attempting to load backend sample data');
      const response = await fetch('/sample_data/sample_roads_v2.geojson');
      if (response.ok) {
        const data = await response.json();
        console.log('Loaded backend sample data:', data);
        setGeoJsonData(data);
        toast.success('Loaded backend road sample data');
        return;
      }
    } catch (error) {
      console.error('Error loading backend sample data:', error);
    }
    
    // Try to load from munshiu_nagar.geojson as fallback
    try {
      console.log('Attempting to load munshiu_nagar.geojson');
      const localResponse = await fetch('/munshiu_nagar.geojson');
      if (localResponse.ok) {
        const localData = await localResponse.json();
        console.log('Loaded munshiu_nagar data:', localData);
        setGeoJsonData(localData);
        toast.info('Loaded Munshiu Nagar map');
      }
    } catch (error) {
      console.error('Error loading munshiu_nagar.geojson:', error);
      toast.error('Failed to load any map data');
    }
  };

  useEffect(() => {
    loadMunshiuNagarMap();
  }, []);

  const toolCategories = {
    selection: tools.filter(t => t.category === 'selection'),
    drawing: tools.filter(t => t.category === 'drawing'),
    editing: tools.filter(t => t.category === 'editing'),
    measurement: tools.filter(t => t.category === 'measurement'),
    file: tools.filter(t => t.category === 'file'),
  };

  const ToolButton: React.FC<{ tool: Tool }> = ({ tool }) => {
    const IconComponent = tool.icon;
    return (
      <Button
        variant={activeTool === tool.id ? 'default' : 'ghost'}
        size="sm"
        className={`w-10 h-10 p-0 ${activeTool === tool.id ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
        onClick={() => handleToolClick(tool.id)}
        title={tool.name}
      >
        <IconComponent className="w-4 h-4" />
      </Button>
    );
  };

  const handleToolClick = (toolId: string) => {
    setActiveTool(toolId);
    
    // Handle special tool actions
    if (toolId === 'load') {
      setIsGeoJsonPanelOpen(!isGeoJsonPanelOpen);
    } else if (toolId === 'save') {
      handleSaveDrawing();
    }
  };
  
  const handleSaveDrawing = async () => {
    if (!drawnItems || !drawnItems.features || drawnItems.features.length === 0) {
      toast.error('No drawing to save');
      return;
    }
    
    try {
      // Prompt for name
      const name = prompt('Enter a name for this GeoJSON:');
      if (!name) return;
      
      const vendorName = 'editor-user';
      
      // Save to backend
      const result = await geoJsonAPI.createGeoJSON(name, vendorName, drawnItems.features);
      
      if (result.success) {
        toast.success('GeoJSON saved successfully');
      } else {
        toast.error(`Failed to save: ${result.message}`);
      }
    } catch (error) {
      console.error('Error saving GeoJSON:', error);
      toast.error('Failed to save GeoJSON');
    }
  };

  const handleZoomChange = (map: any) => {
    setZoomLevel(map.getZoom());
  };
  
  const handleGeoJsonLoaded = (data: any) => {
    setGeoJsonData(data);
    setIsGeoJsonPanelOpen(false);
    
    // If there are features with coordinates, add them to the map
    if (data && data.features && data.features.length > 0 && mapRef.current) {
      // Trigger the custom event to add GeoJSON to the map
      mapRef.current.fireEvent('addGeoJSON', { detail: data });
    }
  };
  
  // Handle drawing updates
  const handleDrawingComplete = (data: any) => {
    setDrawnItems(data);
  };

  return (
    <div className="h-screen w-full relative bg-gray-100">
      <Header userType="editor" />
      
      {/* Top Toolbar */}
      <div className="absolute top-16 left-0 right-0 z-10 bg-white shadow-sm border-b p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="font-semibold">RoadFusion Editor</span>
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
            
            <Separator orientation="vertical" className="h-6" />
            
            {/* File Operations */}
            <div className="flex space-x-1">
              {toolCategories.file.map(tool => (
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
            mapRef.current = map.target;
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          
          {/* Map Controls with Drawing Tools */}
          <MapControls 
            activeTool={activeTool} 
            onDrawingComplete={handleDrawingComplete} 
          />
          
          <ZoomControl position="bottomright" />
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
              {geoJsonData && (
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <span className="text-sm">Loaded GeoJSON</span>
                  <input type="checkbox" defaultChecked onChange={(e) => setGeoJsonData(e.target.checked ? geoJsonData : null)} />
                </div>
              )}
              {drawnItems && drawnItems.features.length > 0 && (
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <span className="text-sm">Your Drawings</span>
                  <input type="checkbox" defaultChecked />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* GeoJSON Loader Panel */}
      {isGeoJsonPanelOpen && (
        <div className="absolute right-4 top-36 z-20">
          <GeoJSONLoader onDataLoaded={handleGeoJsonLoaded} />
        </div>
      )}

      {/* We don't need the React-based legend anymore since we're using the Leaflet control */}
      
      {/* Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 border-t border-gray-700 p-2 text-sm text-gray-300">
        <div className="flex justify-between items-center">
          <span>Tool: {tools.find(t => t.id === activeTool)?.name}</span>
          <div className="flex items-center space-x-4">
            <span>Zoom: {zoomLevel}x</span>
            {geoJsonData && <span>GeoJSON Loaded</span>}
            {drawnItems && drawnItems.features.length > 0 && (
              <span>Features: {drawnItems.features.length}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
