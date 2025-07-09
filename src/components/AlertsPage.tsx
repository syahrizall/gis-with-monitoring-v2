// [1] IMPORTS
import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, XCircle, Clock, Search, Check, CheckCheck, Filter } from 'lucide-react';
import { useWiFiData } from '../hooks/useWiFiData';
import { apiService } from '../services/api';
import { Alert } from '../types';

// [2] ALERTS PAGE COMPONENT
export const AlertsPage: React.FC = () => {
  // State & hooks
  const { locations } = useWiFiData();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Fetch alerts
  const fetchAlerts = async () => {
    try {
      setIsLoading(true);
      const params: any = { limit: 100 };
      if (showUnreadOnly) params.unread_only = true;
      if (typeFilter !== 'all') params.type = typeFilter;
      const response = await apiService.getAlerts(params);
      if (response && typeof response === 'object' && 'alerts' in response && Array.isArray((response as any).alerts)) {
        setAlerts((response as any).alerts);
      } else {
        setAlerts([]);
      }
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAlerts(); }, [showUnreadOnly, typeFilter]);
  useEffect(() => { const interval = setInterval(fetchAlerts, 30000); return () => clearInterval(interval); }, [showUnreadOnly, typeFilter]);

  // Filter alerts by search
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.location?.nama?.toLowerCase().includes(searchTerm.toLowerCase()) || alert.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const unreadCount = alerts.filter(alert => !alert.is_read).length;

  // Handler: mark as read
  const handleMarkAsRead = async (alertId: string) => {
    try {
      await apiService.markAlertAsRead(alertId);
      await fetchAlerts();
    } catch (error) {
      console.error('Failed to mark alert as read:', error);
    }
  };

  // Handler: mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await apiService.markAllAlertsAsRead();
      await fetchAlerts();
    } catch (error) {
      console.error('Failed to mark all alerts as read:', error);
    }
  };

  // Icon & color util
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'connection_restored': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'connection_lost': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <Bell className="w-5 h-5 text-orange-600" />;
    }
  };
  const getAlertColor = (type: string) => {
    switch (type) {
      case 'connection_restored': return 'border-l-green-500 bg-green-50';
      case 'connection_lost': return 'border-l-red-500 bg-red-50';
      default: return 'border-l-orange-500 bg-orange-50';
    }
  };

  // [3] LOADING STATE
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

  // [4] MAIN RENDER
  return (
    <div className="p-6 space-y-6">
      {/* Header & Action */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alerts</h1>
          <p className="text-gray-600">System notifications and status changes</p>
        </div>
        <div className="flex items-center space-x-3">
          {unreadCount > 0 && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-red-100 text-red-800 rounded-full">
              <Bell className="w-4 h-4" />
              <span className="text-sm font-medium">{unreadCount} unread</span>
            </div>
          )}
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center space-x-2 px-4 py-2 bg-teal-800 text-white rounded-lg hover:bg-teal-900 transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark All Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="connection_lost">Connection Lost</option>
              <option value="connection_restored">Connection Restored</option>
              <option value="status_change">Status Change</option>
            </select>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showUnreadOnly}
                onChange={(e) => setShowUnreadOnly(e.target.checked)}
                className="rounded border-gray-300 text-teal-700 focus:ring-teal-700"
              />
              <span className="text-sm text-gray-700">Show unread only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-900">All Alerts</h2>
            <span className="text-sm text-gray-500">({filteredAlerts.length} alerts)</span>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-6 border-l-4 ${getAlertColor(alert.type)} ${alert.is_read ? 'opacity-75' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-sm font-medium text-gray-900">{alert.location?.nama || 'Unknown Location'}</h3>
                        {!alert.is_read && (<span className="w-2 h-2 bg-teal-700 rounded-full"></span>)}
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(alert.created_at).toLocaleString()}</span>
                        </div>
                        {alert.email_sent && (<span className="text-xs text-green-600">Email sent</span>)}
                      </div>
                    </div>
                  </div>
                  {!alert.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(alert.id)}
                      className="flex items-center space-x-1 px-2 py-1 text-xs text-teal-700 hover:text-teal-800 hover:bg-teal-50 rounded transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-3 h-3" />
                      <span>Mark read</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts</h3>
              <p className="text-gray-500">{searchTerm || showUnreadOnly || typeFilter !== 'all' ? 'No alerts match your filters' : 'System alerts will appear here when status changes occur'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};