// Types cho Authentication
export interface User {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  is_active: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  full_name: string;
  password: string;
  phone: string;
}

export interface AuthResponse {
  code: string;
  message: string;
  data: {
    access_token: string;
    token_type: string;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Types cho Attendance
export interface AttendanceRecord {
  id: number;
  user_id: number;
  checkin_time: string;
  checkout_time?: string;
  date: string;
  total_hours?: number;
  status: 'present' | 'absent' | 'late';
}

export interface GPSLocation {
  lat: number;
  lng: number;
}

export interface WiFiInfo {
  ssid: string;
  bssid?: string;
  signal_strength?: number;
}

export interface CheckinRequest {
  user_id: number;
  location?: string;
  note?: string;
  gps_location?: GPSLocation;
  wifi_ssid?: string;
}

export interface CheckoutRequest {
  user_id: number;
  location?: string;
  note?: string;
  gps_location?: GPSLocation;
  wifi_ssid?: string;
}

export interface AttendanceResponse {
  code: string;
  message: string;
  data: AttendanceRecord;
}

export interface AttendanceState {
  currentRecord: AttendanceRecord | null;
  todayRecord: AttendanceRecord | null;
  isLoading: boolean;
  error: string | null;
  lastCheckinTime: string | null;
  lastCheckoutTime: string | null;
} 