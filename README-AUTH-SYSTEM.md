# 🔐 Hệ Thống Authentication ReactJS

## 📋 Tổng Quan

Hệ thống authentication hoàn chỉnh được xây dựng với ReactJS, TypeScript, Redux Toolkit và tích hợp với API backend.

## 🏗️ Cấu Trúc Project

```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx      # Form đăng nhập
│   │   ├── RegisterForm.tsx   # Form đăng ký
│   │   └── AuthForms.css      # CSS cho forms
│   ├── ProtectedRoute.tsx     # Route bảo vệ
│   └── PublicRoute.tsx        # Route công khai
├── pages/
│   ├── Dashboard.tsx          # Trang dashboard
│   └── Dashboard.css          # CSS cho dashboard
├── store/
│   ├── index.ts              # Redux store
│   └── slices/
│       └── authSlice.ts      # Auth slice
├── services/
│   └── api.ts                # API service
├── hooks/
│   ├── useAppDispatch.ts     # Custom dispatch hook
│   └── useAppSelector.ts     # Custom selector hook
├── types/
│   └── auth.ts               # TypeScript types
└── App.tsx                   # Component chính
```

## 🚀 Tính Năng

### ✅ Authentication
- **Đăng ký**: Tạo tài khoản mới với validation
- **Đăng nhập**: Xác thực người dùng
- **Đăng xuất**: Thoát khỏi hệ thống
- **Token Management**: Tự động lưu và sử dụng JWT token
- **Auto Redirect**: Chuyển hướng tự động dựa trên trạng thái đăng nhập

### ✅ Form Validation
- **React Hook Form**: Quản lý form state
- **Yup Schema**: Validation rules
- **Real-time Validation**: Hiển thị lỗi ngay lập tức
- **Error Handling**: Xử lý lỗi từ API

### ✅ State Management
- **Redux Toolkit**: Quản lý global state
- **Async Thunks**: Xử lý API calls
- **Persistent State**: Lưu trạng thái vào localStorage

### ✅ UI/UX
- **Responsive Design**: Tương thích mobile
- **Loading States**: Hiển thị trạng thái loading
- **Error Messages**: Thông báo lỗi rõ ràng
- **Modern Design**: Giao diện đẹp với gradient

## 🔧 Cài Đặt & Chạy

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Khởi chạy development server
```bash
npm start
```

### 3. Truy cập ứng dụng
- **Local**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Register**: http://localhost:3000/register
- **Dashboard**: http://localhost:3000/dashboard

## 📡 API Integration

### Base URL
```typescript
const API_BASE_URL = 'http://34.126.96.127:8000';
```

### Endpoints
- **POST /register** - Đăng ký tài khoản
- **POST /login** - Đăng nhập
- **GET /users/me** - Lấy thông tin user hiện tại
- **POST /logout** - Đăng xuất

### Request/Response Examples

#### Đăng ký
```typescript
// Request
{
  "email": "user@example.com",
  "username": "username",
  "full_name": "Full Name",
  "password": "password123",
  "phone": "0123456789",
  "role": "admin"
}

// Response
{
  "access_token": "jwt_token_here",
  "token_type": "bearer",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "username": "username",
    "full_name": "Full Name",
    "phone": "0123456789",
    "role": "admin",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### Đăng nhập
```typescript
// Request
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "access_token": "jwt_token_here",
  "token_type": "bearer",
  "user": { ... }
}
```

## 🛠️ Công Nghệ Sử Dụng

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Redux Toolkit** - State Management
- **React Router DOM** - Routing
- **React Hook Form** - Form Management
- **Yup** - Validation
- **Axios** - HTTP Client
- **CSS3** - Styling

## 🔒 Bảo Mật

### Token Management
- JWT token được lưu trong localStorage
- Tự động thêm token vào Authorization header
- Tự động logout khi token hết hạn (401 error)

### Route Protection
- **ProtectedRoute**: Chỉ cho phép user đã đăng nhập
- **PublicRoute**: Chỉ cho phép user chưa đăng nhập
- **Auto Redirect**: Chuyển hướng tự động

### Form Security
- Validation client-side và server-side
- Sanitize input data
- CSRF protection (nếu backend hỗ trợ)

## 📱 Responsive Design

- **Desktop**: Layout tối ưu cho màn hình lớn
- **Tablet**: Responsive grid layout
- **Mobile**: Single column layout, touch-friendly

## 🎨 Customization

### Thay đổi theme
```css
/* Trong AuthForms.css */
.auth-container {
  background: linear-gradient(135deg, #your-color1 0%, #your-color2 100%);
}
```

### Thay đổi API URL
```typescript
// Trong services/api.ts
const API_BASE_URL = 'your-api-url';
```

## 🚀 Deployment

### Build cho production
```bash
npm run build
```

### Deploy lên hosting
- Upload thư mục `build/` lên web server
- Cấu hình CORS trên backend nếu cần
- Đảm bảo HTTPS cho production

## 🐛 Troubleshooting

### Lỗi CORS
- Kiểm tra cấu hình CORS trên backend
- Đảm bảo API URL đúng

### Token không hợp lệ
- Xóa localStorage và đăng nhập lại
- Kiểm tra token expiration

### Form validation errors
- Kiểm tra schema validation trong components
- Đảm bảo field names khớp với API

## 📚 Tài Liệu Tham Khảo

- [React Documentation](https://react.dev)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [React Router](https://reactrouter.com)
- [React Hook Form](https://react-hook-form.com)
- [Yup Validation](https://github.com/jquense/yup)

---

**Happy Coding! 🚀** 