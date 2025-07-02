import React, { useState } from 'react';
import { Plus, Edit, Trash2, MapPin, Globe, Zap, RefreshCw } from 'lucide-react';
import { useWiFiData } from '../hooks/useWiFiData';
import { LocationForm } from './LocationForm';
import { WiFiMap } from './WiFiMap';
import { WiFiLocation } from '../types';

export const LocationsPage: React.FC = () => {
  const { locations, addLocation, updateLocation, deleteLocation, pingLocation, isLoading } = useWiFiData();
  const [showForm, setShowForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState<WiFiLocation | undefined>();
  const [showMap, setShowMap] = useState(true);
  const [pingLoading, setPingLoading] = useState<string | null>(null);

  const handleSaveLocation = async (locationData: Omit<WiFiLocation, 'id' | 'status' | 'last_checked' | 'created_at' | 'updated_at' | 'is_active'>) => {
    try {
      if (editingLocation) {
        await updateLocation(editingLocation.id, locationData);
      } else {
        await addLocation(locationData);
      }
      setShowForm(false);
      setEditingLocation(undefined);
    } catch (error) {
      console.error('Failed to save location:', error);
      alert('Failed to save location. Please try again.');
    }
  };

  const handleEditLocation = (location: WiFiLocation) => {
    setEditingLocation(location);
    setShowForm(true);
  };

  const handleDeleteLocation = async (location: WiFiLocation) => {
    if (confirm(`Are you sure you want to delete "${location.nama}"?`)) {
      try {
        await deleteLocation(location.id);
      } catch (error) {
        console.error('Failed to delete location:', error);
        alert('Failed to delete location. Please try again.');
      }
    }
  };

  const handlePingLocation = async (location: WiFiLocation) => {
    setPingLoading(location.id);
    try {
      await pingLocation(location.id);
    } catch (error) {
      console.error('Failed to ping location:', error);
      alert('Failed to ping location. Please try again.');
    } finally {
      setPingLoading(null);
    }
  };

  const existingIPs = locations
    .filter(loc => loc.id !== editingLocation?.id)
    .map(loc => loc.ip_publik);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6 animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">WiFi Locations</h1>
          <p className="text-gray-600">Manage your WiFi monitoring locations</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowMap(!showMap)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <MapPin className="w-4 h-4" />
            <span>{showMap ? 'Hide Map' : 'Show Map'}</span>
          </button>
          <button
            onClick={() => { setShowForm(true); setShowMap(false); }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Location</span>
          </button>
        </div>
      </div>

      {showMap && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Interactive Map</h2>
          <WiFiMap locations={locations} />
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">All Locations ({locations.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coordinates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Checked
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {locations.map((location) => (
                <tr key={location.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{location.nama}</div>
                      <div className="text-sm text-gray-500">{location.alamat}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      location.status === 'online' 
                        ? 'bg-green-100 text-green-800' 
                        : location.status === 'offline'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {location.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <span>{location.ip_publik}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                    {Number(location.latitude).toFixed(4)}, {Number(location.longitude).toFixed(4)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(location.last_checked).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handlePingLocation(location)}
                        disabled={pingLoading === location.id}
                        className="text-green-600 hover:text-green-900 transition-colors disabled:opacity-50"
                        title="Test ping"
                      >
                        {pingLoading === location.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Zap className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleEditLocation(location)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Edit location"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteLocation(location)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Delete location"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {locations.length === 0 && (
          <div className="p-12 text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No locations yet</h3>
            <p className="text-gray-500 mb-4">Start by adding your first WiFi location to monitor.</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Location</span>
            </button>
          </div>
        )}
      </div>

      {showForm && (
        <LocationForm
          location={editingLocation}
          onSave={handleSaveLocation}
          onCancel={() => {
            setShowForm(false);
            setShowMap(true);
            setEditingLocation(undefined);
          }}
          existingIPs={existingIPs}
        />
      )}
    </div>
  );
};