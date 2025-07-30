import { GPSLocation, WiFiInfo } from '../types/auth';
import { officeConfig } from '../config/officeConfig';

// Function để tính khoảng cách giữa 2 điểm GPS (Haversine formula)
export const calculateDistance = (
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number => {
  const R = 6371e3; // Bán kính trái đất (mét)
  const phi1 = lat1 * Math.PI / 180;
  const phi2 = lat2 * Math.PI / 180;
  const deltaPhi = (lat2 - lat1) * Math.PI / 180;
  const deltaLambda = (lng2 - lng1) * Math.PI / 180;

  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Kết quả tính bằng mét
};

// Function để kiểm tra vị trí có trong phạm vi của bất kỳ cơ sở nào không
export const isWithinAnyOfficeRadius = (
  userLat: number, 
  userLng: number
): { isInRange: boolean; nearestOffice: any; distance: number } => {
  let minDistance = Infinity;
  let nearestOffice = null;

  for (const office of officeConfig.officeLocations) {
    const distance = calculateDistance(
      userLat,
      userLng,
      office.lat,
      office.lng
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      nearestOffice = office;
    }
  }

  const isInRange = minDistance <= officeConfig.allowedRadius;
  
  return {
    isInRange,
    nearestOffice,
    distance: minDistance
  };
};

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
      
      // Kiểm tra loại kết nối
      const connectionType = connection.effectiveType || connection.type || 'unknown';
      const isWiFi = connectionType === 'wifi' || connectionType === '4g' || connectionType === '3g';
      
      const wifiInfo: WiFiInfo = {
        ssid: isWiFi ? 'WiFi_Connection' : connectionType,
        signal_strength: connection.downlink || 0
      };
      
      console.log('📶 Network Info (Network API):', {
        connectionType,
        isWiFi,
        wifiInfo
      });
      
      return wifiInfo;
    }

    // Fallback: Sử dụng thông tin mạng cơ bản
    const wifiInfo: WiFiInfo = {
      ssid: 'web-app',
      bssid: 'unknown'
    };
    console.log('📶 Network Info (Fallback):', wifiInfo);
    return wifiInfo;
  } catch (error) {
    console.error('❌ Network Error:', error);
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