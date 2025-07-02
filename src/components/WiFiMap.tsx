import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { WiFiLocation } from '../types';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface WiFiMapProps {
  locations: WiFiLocation[];
  onLocationClick?: (location: WiFiLocation) => void;
}

export const WiFiMap: React.FC<WiFiMapProps> = ({ locations, onLocationClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map centered on Bandung
    mapInstanceRef.current = L.map(mapRef.current).setView([-6.9175, 107.6191], 12);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstanceRef.current);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers
    locations.forEach(location => {
      const icon = L.divIcon({
        html: `
          <div class="relative">
            <div class="w-6 h-6 rounded-full border-2 border-white shadow-lg ${
              location.status === 'online' ? 'bg-green-500' : 
              location.status === 'offline' ? 'bg-red-500' : 'bg-gray-500'
            }"></div>
            <div class="absolute -top-1 -right-1 w-3 h-3 rounded-full ${
              location.status === 'online' ? 'bg-green-400' : 
              location.status === 'offline' ? 'bg-red-400' : 'bg-gray-400'
            } animate-ping"></div>
          </div>
        `,
        className: 'custom-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([location.latitude, location.longitude], { icon })
        .addTo(mapInstanceRef.current!)
        .bindPopup(`
          <div class="p-3 min-w-48">
            <h3 class="font-semibold text-gray-900 mb-2">${location.nama}</h3>
            <p class="text-sm text-gray-600 mb-2">${location.alamat}</p>
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium ${
                location.status === 'online' ? 'text-green-600' : 
                location.status === 'offline' ? 'text-red-600' : 'text-gray-600'
              }">
                ${location.status.toUpperCase()}
              </span>
              <span class="text-xs text-gray-500">${location.ip_publik}</span>
            </div>
            <p class="text-xs text-gray-500">
              Last checked: ${new Date(location.last_checked).toLocaleString()}
            </p>
          </div>
        `);

      if (onLocationClick) {
        marker.on('click', () => onLocationClick(location));
      }

      markersRef.current.push(marker);
    });

    // Fit map to show all markers if locations exist
    if (locations.length > 0) {
      const group = new L.FeatureGroup(markersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [locations, onLocationClick]);

  return (
    <div className="relative">
      <div ref={mapRef} className="w-full h-96 rounded-xl border shadow-sm" />
      
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg border">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">WiFi Locations - Bandung</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Online</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Offline</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Unknown</span>
          </div>
        </div>
      </div>
    </div>
  );
};