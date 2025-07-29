import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { logout, getCurrentUser } from '../store/slices/authSlice';
import DebugPanel from '../components/DebugPanel';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

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
            <span>Xin chào, {user?.full_name || user?.username}!</span>
            <button onClick={handleLogout} className="logout-button">
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-section">
          <h2>Chào mừng bạn đến với hệ thống!</h2>
          <p>Bạn đã đăng nhập thành công với tài khoản: {user?.email}</p>
        </div>

        <div className="dashboard-cards">
          <div className="card">
            <h3>Thông tin tài khoản</h3>
            <div className="user-details">
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Tên đăng nhập:</strong> {user?.username || 'Chưa cập nhật'}</p>
              <p><strong>Họ tên:</strong> {user?.full_name || 'Chưa cập nhật'}</p>
              <p><strong>Số điện thoại:</strong> {user?.phone || 'Chưa cập nhật'}</p>
              <p><strong>Vai trò:</strong> {user?.role || 'Chưa cập nhật'}</p>
              <p><strong>Ngày tạo:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : 'N/A'}</p>
            </div>
          </div>

          <div className="card">
            <h3>Thống kê</h3>
            <div className="stats">
              <div className="stat-item">
                <span className="stat-number">0</span>
                <span className="stat-label">Dự án</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">0</span>
                <span className="stat-label">Nhiệm vụ</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">0</span>
                <span className="stat-label">Thông báo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Panel - Chỉ hiển thị trong development */}
        {process.env.NODE_ENV === 'development' && <DebugPanel />}
      </main>
    </div>
  );
};

export default Dashboard; 