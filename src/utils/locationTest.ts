// File test để kiểm tra tính năng location
import { getAllLocationInfo, getGPSLocation, getWiFiInfo } from './locationUtils';

// Test function để chạy tất cả các test
export const runLocationTests = async () => {
  console.log('🧪 Bắt đầu test tính năng Location...');
  
  try {
    // Test 1: Lấy GPS location
    console.log('\n📍 Test 1: GPS Location');
    try {
      const gpsLocation = await getGPSLocation();
      console.log('✅ GPS Location thành công:', gpsLocation);
    } catch (error) {
      console.log('❌ GPS Location thất bại:', error);
    }

    // Test 2: Lấy WiFi info
    console.log('\n📶 Test 2: WiFi Info');
    try {
      const wifiInfo = await getWiFiInfo();
      console.log('✅ WiFi Info thành công:', wifiInfo);
    } catch (error) {
      console.log('❌ WiFi Info thất bại:', error);
    }

    // Test 3: Lấy tất cả thông tin
    console.log('\n🌍 Test 3: All Location Info');
    try {
      const allInfo = await getAllLocationInfo();
      console.log('✅ All Location Info thành công:', allInfo);
    } catch (error) {
      console.log('❌ All Location Info thất bại:', error);
    }

    console.log('\n🎉 Hoàn thành test Location!');
  } catch (error) {
    console.error('💥 Lỗi trong quá trình test:', error);
  }
};

// Function để test với mock data
export const testWithMockData = () => {
  console.log('🧪 Test với Mock Data...');
  
  const mockLocationInfo = {
    gps_location: {
      lat: 10.762622,
      lng: 106.660172
    },
    wifi_ssid: 'Office_WiFi_Test'
  };
  
  console.log('📍 Mock GPS:', mockLocationInfo.gps_location);
  console.log('📶 Mock WiFi SSID:', mockLocationInfo.wifi_ssid);
  
  return mockLocationInfo;
};

// Function để kiểm tra browser support
export const checkBrowserSupport = () => {
  console.log('🔍 Kiểm tra Browser Support...');
  
  const support = {
    geolocation: !!navigator.geolocation,
    networkInfo: 'connection' in navigator,
    userAgent: navigator.userAgent
  };
  
  console.log('✅ Geolocation Support:', support.geolocation);
  console.log('✅ Network Info Support:', support.networkInfo);
  console.log('🌐 User Agent:', support.userAgent);
  
  return support;
};

// Export để sử dụng trong console
if (typeof window !== 'undefined') {
  (window as any).runLocationTests = runLocationTests;
  (window as any).testWithMockData = testWithMockData;
  (window as any).checkBrowserSupport = checkBrowserSupport;
} 