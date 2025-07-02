export interface WiFiLocation {
  id: string;
  nama: string;
  alamat: string;
  latitude: number;
  longitude: number;
  ip_publik: string;
  status: 'online' | 'offline' | 'unknown';
  last_checked: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MonitoringLog {
  id: string;
  location_id: string;
  ip_address: string;
  status: 'online' | 'offline';
  response_time: number | null;
  error_message: string | null;
  checked_at: string;
  location?: {
    id: string;
    nama: string;
    alamat: string;
  };
}

export interface Alert {
  id: string;
  location_id: string;
  message: string;
  type: 'status_change' | 'connection_lost' | 'connection_restored';
  previous_status: 'online' | 'offline' | 'unknown' | null;
  current_status: 'online' | 'offline' | 'unknown';
  is_read: boolean;
  email_sent: boolean;
  email_sent_at: string | null;
  created_at: string;
  location?: {
    id: string;
    nama: string;
    alamat: string;
    ip_publik: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface DashboardData {
  statistics: {
    total_locations: number;
    online_locations: number;
    offline_locations: number;
    unread_alerts: number;
    monitoring_activity_24h: number;
    average_response_time: number;
  };
  recent_logs: MonitoringLog[];
  recent_alerts: Alert[];
}

export interface ApiPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface LocationsResponse {
  locations: WiFiLocation[];
  pagination: ApiPagination;
}

export interface LogsResponse {
  logs: MonitoringLog[];
  pagination: ApiPagination;
}

export interface AlertsResponse {
  alerts: Alert[];
  pagination: ApiPagination;
}