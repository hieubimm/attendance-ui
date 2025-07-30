import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { checkin, checkout, getTodayAttendance, clearError } from '../store/slices/attendanceSlice';
import { getAllLocationInfo } from '../utils/locationUtils';
import './AttendanceCard.css';

const AttendanceCard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { todayRecord, isLoading, error } = useAppSelector((state) => state.attendance);
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [locationInfo, setLocationInfo] = useState<{
    gps_location: { lat: number; lng: number } | null;
    wifi_ssid: string | null;
  } | null>(null);

  // Cập nhật thời gian hiện tại mỗi giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Lấy thông tin attendance hôm nay khi component mount
  useEffect(() => {
    if (user) {
      dispatch(getTodayAttendance());
    }
  }, [dispatch, user]);

  // Clear error khi component unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Tự động ẩn thông báo thành công sau 3 giây
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleCheckin = async () => {
    if (user) {
      setSuccessMessage(null); // Clear previous messages
      
      try {
        // Lấy thông tin GPS và WiFi
        const locationInfo = await getAllLocationInfo();
        console.log('📍 Checkin Location Info:', locationInfo);
        
        dispatch(checkin({
          user_id: user.id,
          location: 'Office',
          note: 'Checkin via web app',
          gps_location: locationInfo.gps_location || undefined,
          wifi_ssid: locationInfo.wifi_ssid || undefined
        })).then((result) => {
          if (checkin.fulfilled.match(result)) {
            setSuccessMessage('Checkin thành công! 🎉');
          }
        });
      } catch (error) {
        console.error('❌ Error getting location for checkin:', error);
        // Fallback: checkin không có location info
        dispatch(checkin({
          user_id: user.id,
          location: 'Office',
          note: 'Checkin via web app (no location data)'
        })).then((result) => {
          if (checkin.fulfilled.match(result)) {
            setSuccessMessage('Checkin thành công! 🎉');
          }
        });
      }
    }
  };

  const handleCheckout = async () => {
    if (user) {
      setSuccessMessage(null); // Clear previous messages
      
      try {
        // Lấy thông tin GPS và WiFi
        const locationInfo = await getAllLocationInfo();
        console.log('📍 Checkout Location Info:', locationInfo);
        
        dispatch(checkout({
          user_id: user.id,
          location: 'Office',
          note: 'Checkout via web app',
          gps_location: locationInfo.gps_location || undefined,
          wifi_ssid: locationInfo.wifi_ssid || undefined
        })).then((result) => {
          if (checkout.fulfilled.match(result)) {
            setSuccessMessage('Checkout thành công! 👋');
          }
        });
      } catch (error) {
        console.error('❌ Error getting location for checkout:', error);
        // Fallback: checkout không có location info
        dispatch(checkout({
          user_id: user.id,
          location: 'Office',
          note: 'Checkout via web app (no location data)'
        })).then((result) => {
          if (checkout.fulfilled.match(result)) {
            setSuccessMessage('Checkout thành công! 👋');
          }
        });
      }
    }
  };

  const handleRefresh = () => {
    if (user) {
      dispatch(getTodayAttendance());
    }
  };

  const handleTestLocation = async () => {
    try {
      const info = await getAllLocationInfo();
      setLocationInfo(info);
      console.log('🧪 Test Location Result:', info);
    } catch (error) {
      console.error('❌ Test Location Error:', error);
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const canCheckin = !todayRecord || !todayRecord.checkin_time;
  const canCheckout = todayRecord && todayRecord.checkin_time && !todayRecord.checkout_time;

  return (
    <div className="attendance-card">
      <div className="attendance-header">
        <h3>Chấm Công</h3>
        <div className="current-time">
          <div className="time">{currentTime.toLocaleTimeString('vi-VN')}</div>
          <div className="date">{currentTime.toLocaleDateString('vi-VN')}</div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      <div className="attendance-status">
        <div className="status-item">
          <span className="label">Trạng thái hôm nay:</span>
          <span className={`status ${todayRecord && todayRecord.checkin_time ? 'present' : 'absent'}`}>
            {todayRecord && todayRecord.checkin_time ? 'Đã chấm công' : 'Chưa chấm công'}
          </span>
        </div>
        
        {todayRecord?.checkin_time && (
          <div className="status-item">
            <span className="label">Giờ vào:</span>
            <span className="time-value">{formatTime(todayRecord.checkin_time)}</span>
          </div>
        )}
        
        {todayRecord?.checkout_time && (
          <div className="status-item">
            <span className="label">Giờ ra:</span>
            <span className="time-value">{formatTime(todayRecord.checkout_time)}</span>
          </div>
        )}
      </div>

      <div className="attendance-buttons">
        <button
          className={`checkin-btn ${!canCheckin ? 'disabled' : ''}`}
          onClick={handleCheckin}
          disabled={!canCheckin || isLoading}
        >
          {isLoading ? 'Đang xử lý...' : 'Check In'}
        </button>
        
        <button
          className={`checkout-btn ${!canCheckout ? 'disabled' : ''}`}
          onClick={handleCheckout}
          disabled={!canCheckout || isLoading}
        >
          {isLoading ? 'Đang xử lý...' : 'Check Out'}
        </button>
      </div>

      <div className="refresh-section">
        <button
          className="refresh-btn"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          {isLoading ? 'Đang tải...' : '🔄 Làm mới'}
        </button>
        
        <button
          className="location-test-btn"
          onClick={handleTestLocation}
          disabled={isLoading}
        >
          📍 Test Location
        </button>
      </div>

      {locationInfo && (
        <div className="location-info">
          <h4>📍 Thông tin Vị trí</h4>
          {locationInfo.gps_location ? (
            <div className="location-item">
              <span className="label">GPS:</span>
              <span className="value">
                {locationInfo.gps_location.lat.toFixed(6)}, {locationInfo.gps_location.lng.toFixed(6)}
              </span>
              <a 
                href={`https://www.google.com/maps?q=${locationInfo.gps_location.lat},${locationInfo.gps_location.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="map-link"
              >
                🗺️ Xem trên bản đồ
              </a>
            </div>
          ) : (
            <div className="location-item">
              <span className="label">GPS:</span>
              <span className="value error">Không thể lấy vị trí</span>
            </div>
          )}
          
          {locationInfo.wifi_ssid ? (
            <div className="location-item">
              <span className="label">WiFi SSID:</span>
              <span className="value">{locationInfo.wifi_ssid}</span>
            </div>
          ) : (
            <div className="location-item">
              <span className="label">WiFi SSID:</span>
              <span className="value error">Không thể lấy thông tin WiFi</span>
            </div>
          )}
        </div>
      )}

      {todayRecord && (
        <div className="attendance-summary">
          <h4>Thông tin hôm nay</h4>
          <p><strong>Ngày:</strong> {formatDate(todayRecord.date)}</p>
          {todayRecord.total_hours && (
            <p><strong>Tổng giờ làm:</strong> {todayRecord.total_hours} giờ</p>
          )}
          <p><strong>Trạng thái:</strong> 
            <span className={`status-badge ${todayRecord.status}`}>
              {todayRecord.status === 'present' ? 'Có mặt' : 
               todayRecord.status === 'late' ? 'Đi muộn' : 'Vắng mặt'}
            </span>
          </p>
        </div>
      )}

      {/* Debug info - chỉ hiển thị trong development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-info">
          <h4>Debug Info</h4>
          <p><strong>Today Record:</strong> {todayRecord ? 'Có' : 'Không'}</p>
          <p><strong>Can Checkin:</strong> {canCheckin ? 'Có' : 'Không'}</p>
          <p><strong>Can Checkout:</strong> {canCheckout ? 'Có' : 'Không'}</p>
          <p><strong>Is Loading:</strong> {isLoading ? 'Có' : 'Không'}</p>
          {todayRecord && (
            <div>
              <p><strong>Raw Data:</strong></p>
              <pre style={{ fontSize: '0.8rem', background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
                {JSON.stringify(todayRecord, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AttendanceCard; 