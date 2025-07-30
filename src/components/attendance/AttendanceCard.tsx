import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { checkin, checkout, getTodayAttendance, clearError } from '../../store/slices/attendanceSlice';
import { getAllLocationInfo, isWithinAnyOfficeRadius } from '../../utils/locationUtils';
import '../../styles/components/AttendanceCard.css';

const AttendanceCard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { todayRecord, isLoading, error } = useAppSelector((state) => state.attendance);
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
      setSuccessMessage(null);
      
      try {
        const locationInfo = await getAllLocationInfo();
        console.log('📍 Checkin Location Info:', locationInfo);
        
        // Kiểm tra vị trí có trong phạm vi văn phòng không
        if (locationInfo.gps_location) {
          const locationCheck = isWithinAnyOfficeRadius(
            locationInfo.gps_location.lat,
            locationInfo.gps_location.lng
          );
          
          if (!locationCheck.isInRange) {
            setSuccessMessage(`❌ Vị trí quá xa văn phòng (${locationCheck.distance.toFixed(0)}m). Vui lòng đến gần văn phòng hơn.`);
            return;
          }
          
          console.log('🏢 Nearest Office:', locationCheck.nearestOffice);
        }
        
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
        setSuccessMessage('❌ Lỗi khi lấy vị trí. Vui lòng thử lại.');
      }
    }
  };

  const handleCheckout = async () => {
    if (user) {
      setSuccessMessage(null);
      
      try {
        const locationInfo = await getAllLocationInfo();
        console.log('📍 Checkout Location Info:', locationInfo);
        
        // Kiểm tra vị trí có trong phạm vi văn phòng không
        if (locationInfo.gps_location) {
          const locationCheck = isWithinAnyOfficeRadius(
            locationInfo.gps_location.lat,
            locationInfo.gps_location.lng
          );
          
          if (!locationCheck.isInRange) {
            setSuccessMessage(`❌ Vị trí quá xa văn phòng (${locationCheck.distance.toFixed(0)}m). Vui lòng đến gần văn phòng hơn.`);
            return;
          }
          
          console.log('🏢 Nearest Office:', locationCheck.nearestOffice);
        }
        
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
        setSuccessMessage('❌ Lỗi khi lấy vị trí. Vui lòng thử lại.');
      }
    }
  };

  const handleRefresh = () => {
    if (user) {
      dispatch(getTodayAttendance());
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
      </div>

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
    </div>
  );
};

export default AttendanceCard; 