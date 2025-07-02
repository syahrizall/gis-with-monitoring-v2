import { useState, useEffect, useCallback } from 'react';
import { WiFiLocation, MonitoringLog, Alert, DashboardData } from '../types';
import { apiService } from '../services/api';

export const useWiFiData = () => {
  const [locations, setLocations] = useState<WiFiLocation[]>([]);
  const [logs, setLogs] = useState<MonitoringLog[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch locations
  const fetchLocations = useCallback(async () => {
    try {
      const response = await apiService.getLocations({ limit: 100 });
      setLocations(response.locations || []);
    } catch (err) {
      console.error('Failed to fetch locations:', err);
      setError('Failed to load locations');
    }
  }, []);

  // Fetch monitoring logs
  const fetchLogs = useCallback(async () => {
    try {
      const response = await apiService.getMonitoringLogs({ limit: 50 });
      setLogs(response.logs || []);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    }
  }, []);

  // Fetch alerts
  const fetchAlerts = useCallback(async () => {
    try {
      const response = await apiService.getAlerts({ limit: 50 });
      setAlerts(response.alerts || []);
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
    }
  }, []);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      const data = await apiService.getDashboardData();
      setDashboardData(data);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchLocations(),
          fetchLogs(),
          fetchAlerts(),
          fetchDashboardData()
        ]);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [fetchLocations, fetchLogs, fetchAlerts, fetchDashboardData]);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLocations();
      fetchLogs();
      fetchAlerts();
      fetchDashboardData();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchLocations, fetchLogs, fetchAlerts, fetchDashboardData]);

  // Location operations
  const addLocation = async (locationData: Omit<WiFiLocation, 'id' | 'status' | 'last_checked' | 'created_at' | 'updated_at' | 'is_active'>) => {
    try {
      const newLocation = await apiService.createLocation({
        nama: locationData.nama,
        alamat: locationData.alamat,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        ip_publik: locationData.ip_publik
      });
      await fetchLocations(); // Refresh locations
      return newLocation;
    } catch (err) {
      console.error('Failed to add location:', err);
      throw err;
    }
  };

  const updateLocation = async (id: string, locationData: Partial<WiFiLocation>) => {
    try {
      await apiService.updateLocation(id, {
        nama: locationData.nama,
        alamat: locationData.alamat,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        ip_publik: locationData.ip_publik
      });
      await fetchLocations(); // Refresh locations
    } catch (err) {
      console.error('Failed to update location:', err);
      throw err;
    }
  };

  const deleteLocation = async (id: string) => {
    try {
      await apiService.deleteLocation(id);
      await fetchLocations(); // Refresh locations
      await fetchLogs(); // Refresh logs
      await fetchAlerts(); // Refresh alerts
    } catch (err) {
      console.error('Failed to delete location:', err);
      throw err;
    }
  };

  const pingLocation = async (id: string) => {
    try {
      const result = await apiService.pingLocation(id);
      await fetchLocations(); // Refresh to get updated status
      await fetchLogs(); // Refresh to get new log
      return result;
    } catch (err) {
      console.error('Failed to ping location:', err);
      throw err;
    }
  };

  // Alert operations
  const markAlertAsRead = async (alertId: string) => {
    try {
      await apiService.markAlertAsRead(alertId);
      await fetchAlerts(); // Refresh alerts
    } catch (err) {
      console.error('Failed to mark alert as read:', err);
      throw err;
    }
  };

  const markAllAlertsAsRead = async () => {
    try {
      await apiService.markAllAlertsAsRead();
      await fetchAlerts(); // Refresh alerts
    } catch (err) {
      console.error('Failed to mark all alerts as read:', err);
      throw err;
    }
  };

  // Manual monitoring trigger
  const triggerMonitoring = async () => {
    try {
      const result = await apiService.triggerMonitoring();
      await fetchLocations(); // Refresh locations
      await fetchLogs(); // Refresh logs
      await fetchAlerts(); // Refresh alerts
      return result;
    } catch (err) {
      console.error('Failed to trigger monitoring:', err);
      throw err;
    }
  };

  // Get statistics
  const getStats = () => {
    if (dashboardData) {
      return {
        total: dashboardData.statistics.total_locations,
        online: dashboardData.statistics.online_locations,
        offline: dashboardData.statistics.offline_locations,
        unreadAlerts: dashboardData.statistics.unread_alerts
      };
    }
    
    // Fallback calculation from locations
    const total = locations.length;
    const online = locations.filter(loc => loc.status === 'online').length;
    const offline = locations.filter(loc => loc.status === 'offline').length;
    const unreadAlerts = alerts.filter(alert => !alert.is_read).length;
    
    return { total, online, offline, unreadAlerts };
  };

  return {
    locations,
    logs,
    alerts,
    dashboardData,
    isLoading,
    error,
    addLocation,
    updateLocation,
    deleteLocation,
    pingLocation,
    markAlertAsRead,
    markAllAlertsAsRead,
    triggerMonitoring,
    getStats,
    refreshData: () => {
      fetchLocations();
      fetchLogs();
      fetchAlerts();
      fetchDashboardData();
    }
  };
};