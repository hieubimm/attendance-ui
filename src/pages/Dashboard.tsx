import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { logout, getCurrentUser } from '../store/slices/authSlice';
import AttendanceCard from '../components/AttendanceCard';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  // Fallback: lấy user từ localStorage nếu Redux state chưa có
  const userFromStorage = localStorage.getItem('user');
  const currentUser = user || (userFromStorage ? JSON.parse(userFromStorage) : null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!user) {
      dispatch(getCurrentUser());
    }
  }, [isAuthenticated, user, navigate, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Dashboard</h1>
          <div className="user-info">
            <span>Xin chào, {currentUser?.full_name || 'User'}!</span>
            <button onClick={handleLogout} className="logout-button">
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-section">
          <h2>Chào mừng bạn đến với hệ thống chấm công!</h2>
          <p>Bạn đã đăng nhập thành công với tài khoản: {currentUser?.email || 'N/A'}</p>
        </div>

        <div className="dashboard-cards">
          <AttendanceCard />

          <div className="card">
            <h3>Thông tin tài khoản</h3>
            <div className="user-details">
              <p><strong>ID:</strong> {currentUser?.id || 'N/A'}</p>
              <p><strong>Email:</strong> {currentUser?.email || 'N/A'}</p>
              <p><strong>Họ tên:</strong> {currentUser?.full_name || 'N/A'}</p>
              <p><strong>Số điện thoại:</strong> {currentUser?.phone || 'N/A'}</p>
              <p><strong>Trạng thái:</strong> 
                <span className={`status-badge ${currentUser?.is_active ? 'active' : 'inactive'}`}>
                  {currentUser?.is_active ? 'Hoạt động' : 'Không hoạt động'}
                </span>
              </p>
            </div>
          </div>

          <div className="card">
            <h3>Thống kê</h3>
            <div className="stats">
              <div className="stat-item">
                <span className="stat-number">0</span>
                <span className="stat-label">Ngày làm việc</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">0</span>
                <span className="stat-label">Giờ làm việc</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">0</span>
                <span className="stat-label">Ngày nghỉ</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 