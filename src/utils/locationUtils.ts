import { GPSLocation, WiFiInfo } from '../types/auth';

// Function để lấy GPS location
export const getGPSLocation = (): Promise<GPSLocation> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation không được hỗ trợ bởi trình duyệt này'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: GPSLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        console.log('📍 GPS Location:', location);
        resolve(location);
      },
      (error) => {
        console.error('❌ GPS Error:', error);
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
};

// Function để lấy thông tin WiFi (sử dụng Web API có sẵn)
export const getWiFiInfo = async (): Promise<WiFiInfo | null> => {
  try {
    // Thử sử dụng Network Information API nếu có
    if ('connection' in navigator && (navigator as any).connection) {
      const connection = (navigator as any).connection;
      const wifiInfo: WiFiInfo = {
        ssid: connection.effectiveType || 'unknown',
        signal_strength: connection.downlink || 0
      };
      console.log('📶 WiFi Info (Network API):', wifiInfo);
      return wifiInfo;
    }

    // Fallback: Sử dụng thông tin mạng cơ bản
    const wifiInfo: WiFiInfo = {
      ssid: 'web-app',
      bssid: 'unknown'
    };
    console.log('📶 WiFi Info (Fallback):', wifiInfo);
    return wifiInfo;
  } catch (error) {
    console.error('❌ WiFi Error:', error);
    return null;
  }
};

// Function để lấy tất cả thông tin location
export const getAllLocationInfo = async (): Promise<{
  gps_location: GPSLocation | null;
  wifi_ssid: string | null;
}> => {
  try {
    const [gpsLocation, wifiInfo] = await Promise.allSettled([
      getGPSLocation(),
      getWiFiInfo()
    ]);

    const result = {
      gps_location: gpsLocation.status === 'fulfilled' ? gpsLocation.value : null,
      wifi_ssid: wifiInfo.status === 'fulfilled' && wifiInfo.value ? wifiInfo.value.ssid : null
    };

    console.log('🌍 All Location Info:', result);
    return result;
  } catch (error) {
    console.error('❌ Location Error:', error);
    return {
      gps_location: null,
      wifi_ssid: null
    };
  }
};

// Function để format GPS coordinates
export const formatGPS = (location: GPSLocation): string => {
  return `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
};

// Function để tạo Google Maps URL
export const getGoogleMapsUrl = (location: GPSLocation): string => {
  return `https://www.google.com/maps?q=${location.lat},${location.lng}`;
}; 