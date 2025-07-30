import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { register as registerUser, clearError } from '../../store/slices/authSlice';
import './AuthForms.css';

const schema = yup.object({
  email: yup
    .string()
    .email('Email không hợp lệ')
    .required('Email là bắt buộc'),
  username: yup
    .string()
    .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
    .max(20, 'Tên đăng nhập không được quá 20 ký tự')
    .required('Tên đăng nhập là bắt buộc'),
  full_name: yup
    .string()
    .min(2, 'Họ tên phải có ít nhất 2 ký tự')
    .required('Họ tên là bắt buộc'),
  phone: yup
    .string()
    .min(10, 'Số điện thoại phải có ít nhất 10 số')
    .required('Số điện thoại là bắt buộc'),
  password: yup
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Mật khẩu là bắt buộc'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp')
    .required('Xác nhận mật khẩu là bắt buộc'),
}).required();

type RegisterFormData = yup.InferType<typeof schema>;

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit = async (data: RegisterFormData) => {
    const { confirmPassword, ...registerData } = data;
    dispatch(registerUser(registerData));
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Đăng Ký</h2>
          <p>Tạo tài khoản mới</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              {...register('email')}
              placeholder="Nhập email của bạn"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              type="text"
              id="username"
              {...register('username')}
              placeholder="Nhập tên đăng nhập"
              className={errors.username ? 'error' : ''}
            />
            {errors.username && <span className="error-text">{errors.username.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="full_name">Họ tên</label>
            <input
              type="text"
              id="full_name"
              {...register('full_name')}
              placeholder="Nhập họ tên đầy đủ"
              className={errors.full_name ? 'error' : ''}
            />
            {errors.full_name && <span className="error-text">{errors.full_name.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Số điện thoại</label>
            <input
              type="tel"
              id="phone"
              {...register('phone')}
              placeholder="Nhập số điện thoại"
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && <span className="error-text">{errors.phone.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              {...register('password')}
              placeholder="Nhập mật khẩu"
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-text">{errors.password.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
            <input
              type="password"
              id="confirmPassword"
              {...register('confirmPassword')}
              placeholder="Nhập lại mật khẩu"
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && (
              <span className="error-text">{errors.confirmPassword.message}</span>
            )}
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? 'Đang đăng ký...' : 'Đăng Ký'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Đã có tài khoản?{' '}
            <Link to="/login" className="auth-link">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm; 