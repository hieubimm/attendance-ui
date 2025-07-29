# 🚀 Quick Start Guide

## Bắt Đầu Ngay Lập Tức

### 1. Khởi chạy development server
```bash
npm start
```

### 2. Mở trình duyệt
Truy cập: http://localhost:3000

### 3. Bạn sẽ thấy:
- ✅ Giao diện đẹp với gradient background
- ✅ Component Welcome với counter
- ✅ Responsive design
- ✅ TypeScript support

## 📝 Cách Chỉnh Sửa

### Thay đổi nội dung
1. Mở file `src/components/Welcome.tsx`
2. Thay đổi text trong component
3. Lưu file - trang web sẽ tự động reload

### Thay đổi style
1. Mở file `src/components/Welcome.css`
2. Chỉnh sửa CSS
3. Lưu file - style sẽ cập nhật ngay

### Tạo component mới
1. Tạo file mới trong `src/components/`
2. Import và sử dụng trong `App.tsx`

## 🎯 Ví Dụ Code

### Tạo component đơn giản
```tsx
// src/components/MyComponent.tsx
import React from 'react';

const MyComponent: React.FC = () => {
  return <div>Hello World!</div>;
};

export default MyComponent;
```

### Sử dụng trong App.tsx
```tsx
import MyComponent from './components/MyComponent';

function App() {
  return (
    <div className="App">
      <MyComponent />
    </div>
  );
}
```

## 🔧 Các Lệnh Hữu Ích

```bash
# Development
npm start          # Khởi chạy server
npm run build      # Build production
npm test           # Chạy test

# Package management
npm install        # Cài đặt dependencies
npm update         # Cập nhật packages
```

## 📚 Tài Liệu Tham Khảo

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [CSS Tutorial](https://developer.mozilla.org/en-US/docs/Web/CSS)

---

**Chúc bạn coding vui vẻ! 🎉** 