// Utility để test API và debug
import axios from 'axios';

const API_BASE_URL = 'http://34.126.96.127:8000/api';

export const testRegisterAPI = async () => {
  try {
    const testData = {
      email: "test@example.com",
      username: "testuser",
      full_name: "Test User",
      password: "123456",
      phone: "0123456789",
      role: "user"
    };

    console.log('Testing Register API...');
    console.log('Request URL:', `${API_BASE_URL}/register`);
    console.log('Request Data:', testData);

    const response = await axios.post(`${API_BASE_URL}/register`, testData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      withCredentials: false,
    });

    console.log('Response Status:', response.status);
    console.log('Response Headers:', response.headers);
    console.log('Response Data:', response.data);

    return response.data;
  } catch (error: any) {
    console.error('API Test Error:');
    console.error('Error Status:', error.response?.status);
    console.error('Error Headers:', error.response?.headers);
    console.error('Error Data:', error.response?.data);
    console.error('Error Message:', error.message);
    throw error;
  }
};

export const testLoginAPI = async () => {
  try {
    const testData = {
      email: "test@example.com",
      password: "123456"
    };

    console.log('Testing Login API...');
    console.log('Request URL:', `${API_BASE_URL}/login`);
    console.log('Request Data:', testData);

    const response = await axios.post(`${API_BASE_URL}/login`, testData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      withCredentials: false,
    });

    console.log('Response Status:', response.status);
    console.log('Response Headers:', response.headers);
    console.log('Response Data:', response.data);

    return response.data;
  } catch (error: any) {
    console.error('API Test Error:');
    console.error('Error Status:', error.response?.status);
    console.error('Error Headers:', error.response?.headers);
    console.error('Error Data:', error.response?.data);
    console.error('Error Message:', error.message);
    throw error;
  }
}; 