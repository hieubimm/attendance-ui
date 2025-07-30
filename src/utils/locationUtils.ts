import { GPSLocation } from '../types/auth';



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



// Function để lấy thông tin GPS location
export const getAllLocationInfo = async (): Promise<{
  gps_location: GPSLocation | null;
}> => {
  try {
    const gpsLocation = await getGPSLocation();
    
    const result = {
      gps_location: gpsLocation
    };

    console.log('🌍 GPS Location Info:', result);
    return result;
  } catch (error) {
    console.error('❌ Location Error:', error);
    return {
      gps_location: null
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