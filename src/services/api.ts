import axios from 'axios';
import { LoginRequest, RegisterRequest, AuthResponse, CheckinRequest, CheckoutRequest, AttendanceResponse } from '../types/auth';

// Tạo instance axios với base URL
const API_BASE_URL = 'http://34.126.96.127:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // Disable credentials for CORS
});

// Interceptor để thêm token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  // Đăng ký
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/register', data);
    return response.data;
  },

  // Đăng nhập
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/login', data);
    return response.data;
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: async () => {
    const response = await api.get('/user/me');
    return response.data;
  },

  // Đăng xuất
  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },
};

// Attendance API functions
export const attendanceAPI = {
  // Checkin
  checkin: async (data: CheckinRequest): Promise<AttendanceResponse> => {
    const response = await api.post('/attendance/checkin', data);
    return response.data;
  },

  // Checkout
  checkout: async (data: CheckoutRequest): Promise<AttendanceResponse> => {
    const response = await api.post('/attendance/checkout', data);
    return response.data;
  },

  // Lấy thông tin attendance hôm nay
  getTodayAttendance: async () => {
    const response = await api.get('/user/attendance-today');
    return response.data;
  },

  // Lấy lịch sử attendance
  getAttendanceHistory: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const response = await api.get(`/attendance/history?${params.toString()}`);
    return response.data;
  },
};

export default api; 