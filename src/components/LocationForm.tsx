import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { WiFiLocation } from '../types';

interface LocationFormProps {
  location?: WiFiLocation;
  onSave: (data: Omit<WiFiLocation, 'id' | 'status' | 'last_checked' | 'created_at' | 'updated_at' | 'is_active'>) => void;
  onCancel: () => void;
  existingIPs: string[];
}

export const LocationForm: React.FC<LocationFormProps> = ({
  location,
  onSave,
  onCancel,
  existingIPs
}) => {
  const [formData, setFormData] = useState({
    nama: location?.nama || '',
    alamat: location?.alamat || '',
    latitude: location?.latitude || 0,
    longitude: location?.longitude || 0,
    ip_publik: location?.ip_publik || ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama location is required';
    }

    if (!formData.alamat.trim()) {
      newErrors.alamat = 'Address is required';
    }

    if (!formData.latitude || formData.latitude < -90 || formData.latitude > 90) {
      newErrors.latitude = 'Valid latitude is required (-90 to 90)';
    }

    if (!formData.longitude || formData.longitude < -180 || formData.longitude > 180) {
      newErrors.longitude = 'Valid longitude is required (-180 to 180)';
    }

    if (!formData.ip_publik.trim()) {
      newErrors.ip_publik = 'IP address is required';
    } else {
      // Simple IP validation
      const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (!ipRegex.test(formData.ip_publik)) {
        newErrors.ip_publik = 'Invalid IP address format';
      } else if (existingIPs.includes(formData.ip_publik) && formData.ip_publik !== location?.ip_publik) {
        newErrors.ip_publik = 'IP address already exists';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSave(formData);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {location ? 'Edit Location' : 'Add New Location'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.nama ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Location name"
              disabled={isSubmitting}
            />
            {errors.nama && <p className="text-red-500 text-sm mt-1">{errors.nama}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <textarea
              value={formData.alamat}
              onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.alamat ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Full address"
              rows={2}
              disabled={isSubmitting}
            />
            {errors.alamat && <p className="text-red-500 text-sm mt-1">{errors.alamat}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude *
              </label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.latitude ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="-6.2088"
                disabled={isSubmitting}
              />
              {errors.latitude && <p className="text-red-500 text-sm mt-1">{errors.latitude}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude *
              </label>
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.longitude ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="106.8456"
                disabled={isSubmitting}
              />
              {errors.longitude && <p className="text-red-500 text-sm mt-1">{errors.longitude}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Public IP Address *
            </label>
            <input
              type="text"
              value={formData.ip_publik}
              onChange={(e) => setFormData({ ...formData, ip_publik: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.ip_publik ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="8.8.8.8"
              disabled={isSubmitting}
            />
            {errors.ip_publik && <p className="text-red-500 text-sm mt-1">{errors.ip_publik}</p>}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save'}</span>
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};