// [1] IMPORTS
import React from 'react';
import { Wifi, CheckCircle, XCircle, Activity, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { useWiFiData } from '../hooks/useWiFiData';

// [2] DASHBOARD COMPONENT
export const Dashboard: React.FC = () => {
  const { dashboardData, triggerMonitoring, getStats, isLoading } = useWiFiData();
  const stats = getStats();

  // Manual refresh handler
  const handleManualRefresh = async () => {
    try {
      await triggerMonitoring();
    } catch (error) {
      console.error('Manual refresh failed:', error);
    }
  };

  // Stat Card
  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
      </div>
    </div>
  );

  // [3] LOADING STATE
  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // [4] MAIN RENDER
  return (
    <div className="p-6 space-y-6">
      {/* Header & Manual Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">WiFi Location Monitoring Overview</p>
        </div>
        <button
          onClick={handleManualRefresh}
          className="flex items-center space-x-2 px-4 py-2 bg-teal-800 text-white rounded-lg hover:bg-teal-900 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Manual Check</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total WiFi Locations"
          value={stats.total}
          icon={<Wifi className="w-6 h-6 text-teal-700" />}
          color="bg-teal-100"
        />
        <StatCard
          title="Online Locations"
          value={stats.online}
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
          color="bg-green-100"
        />
        <StatCard
          title="Offline Locations"
          value={stats.offline}
          icon={<XCircle className="w-6 h-6 text-red-600" />}
          color="bg-red-100"
        />
        <StatCard
          title="Unread Alerts"
          value={stats.unreadAlerts}
          icon={<AlertTriangle className="w-6 h-6 text-orange-600" />}
          color="bg-orange-100"
        />
      </div>

      {/* Recent Monitoring Logs & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Monitoring Logs */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-teal-700" />
              <h2 className="text-lg font-semibold text-gray-900">Recent Monitoring</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {dashboardData?.recent_logs && dashboardData.recent_logs.length > 0 ? (
                dashboardData.recent_logs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div className="flex items-center space-x-3">
                      {log.status === 'online' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{log.location?.nama}</p>
                        <p className="text-sm text-gray-500">{log.ip_address}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${log.status === 'online' ? 'text-green-600' : 'text-red-600'}`}>{log.status.toUpperCase()}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{new Date(log.checked_at).toLocaleTimeString()}</span>
                      </div>
                      {log.response_time && (
                        <p className="text-xs text-gray-500">{log.response_time}ms</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No monitoring logs available</p>
              )}
            </div>
          </div>
        </div>
        {/* Recent Alerts */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-900">Recent Alerts</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {dashboardData?.recent_alerts && dashboardData.recent_alerts.length > 0 ? (
                dashboardData.recent_alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-3 py-3 border-b last:border-b-0">
                    <div className={`p-1 rounded-full ${alert.type === 'connection_restored' ? 'bg-green-100' : 'bg-red-100'}`}>{alert.type === 'connection_restored' ? (<CheckCircle className="w-4 h-4 text-green-600" />) : (<XCircle className="w-4 h-4 text-red-600" />)}</div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{alert.message}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(alert.created_at).toLocaleString()}
                        </p>
                        {!alert.is_read && (<span className="w-2 h-2 bg-teal-700 rounded-full"></span>)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No alerts available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      {dashboardData && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">24 Hour Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-teal-700">{dashboardData.statistics.monitoring_activity_24h}</p>
              <p className="text-sm text-gray-600">Monitoring Checks</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{dashboardData.statistics.average_response_time}ms</p>
              <p className="text-sm text-gray-600">Avg Response Time</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{dashboardData.statistics.unread_alerts}</p>
              <p className="text-sm text-gray-600">Unread Alerts</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};