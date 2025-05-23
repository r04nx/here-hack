import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  geojsonData: any;
  title: string;
}

export function MapModal({ isOpen, onClose, geojsonData, title }: MapModalProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Only initialize the map when the modal is open and we have data
    if (isOpen && mapRef.current && geojsonData) {
      // Initialize the map if it doesn't exist
      if (!mapInstanceRef.current) {
        // Create map with a bright white background
        mapInstanceRef.current = L.map(mapRef.current).setView([0, 0], 2);
        
        // Add a clean, minimal tile layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19
        }).addTo(mapInstanceRef.current);
      }

      // Clear any existing GeoJSON layers
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.GeoJSON) {
          mapInstanceRef.current?.removeLayer(layer);
        }
      });

      // Add the GeoJSON data with dark grey styling
      const geoJsonLayer = L.geoJSON(geojsonData, {
        style: {
          color: '#444444',
          weight: 3,
          opacity: 0.8,
          fillColor: '#666666',
          fillOpacity: 0.1
        },
        pointToLayer: (feature, latlng) => {
          return L.circleMarker(latlng, {
            radius: 8,
            fillColor: '#444444',
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          });
        }
      }).addTo(mapInstanceRef.current);

      // Fit the map to the GeoJSON bounds
      const bounds = geoJsonLayer.getBounds();
      if (bounds.isValid()) {
        mapInstanceRef.current.fitBounds(bounds, {
          padding: [50, 50]
        });
      }
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current && !isOpen) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen, geojsonData]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div ref={mapRef} className="w-full h-[500px] rounded-md border"></div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
