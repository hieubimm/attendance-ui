# 📋 API Schema - Attendance System

## 🔗 Base URL
```
http://34.126.96.127:8000/api
```

---

k ph## 1️⃣ **GET /user/attendance-today**

**Mô tả:** Lấy thông tin chấm công hôm nay của user

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "code": "string",
  "message": "string",
  "data": {
    "id": "number",
    "user_id": "number",
    "date": "string",
    "checkin_time": "string",
    "checkout_time": "string | null",
    "total_hours": "number | null",
    "status": "string",
    "location": "string | null",
    "note": "string | null",
    "gps_location": {
      "lat": "number",
      "lng": "number"
    } | null,
    "wifi_ssid": "string | null"
  } | null
}
```

**Trường hợp:**
- `data = null` → Chưa chấm công hôm nay
- `checkout_time = null` → Đã check-in, chưa check-out
- `checkout_time có giá trị` → Đã hoàn thành chấm công

---

## 2️⃣ **POST /attendance/checkin**

**Mô tả:** Chấm công vào

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "user_id": "number",
  "location": "string | null",
  "note": "string | null",
  "gps_location": {
    "lat": "number",
    "lng": "number"
  } | null,
  "wifi_ssid": "string | null"
}
```

**Response:** Giống schema attendance-today, nhưng `checkout_time` và `total_hours` sẽ là `null`

---

## 3️⃣ **POST /attendance/checkout**

**Mô tả:** Chấm công ra

**Headers:** `Authorization: Bearer {token}`

**Request:** Giống checkin

**Response:** Giống schema attendance-today, nhưng `checkout_time` và `total_hours` sẽ có giá trị

---

## 📊 **Trường dữ liệu**

| Trường | Type | Required | Mô tả |
|--------|------|----------|-------|
| `id` | number | ✅ | ID record attendance |
| `user_id` | number | ✅ | ID user |
| `date` | string | ✅ | Ngày (YYYY-MM-DD) |
| `checkin_time` | string | ✅ | Thời gian check-in (ISO) |
| `checkout_time` | string/null | ❌ | Thời gian check-out (ISO) |
| `total_hours` | number/null | ❌ | Tổng giờ làm |
| `status` | string | ✅ | "present", "absent", "late" |
| `location` | string | ❌ | Địa điểm |
| `note` | string | ❌ | Ghi chú |
| `gps_location.lat` | number | ❌ | Vĩ độ |
| `gps_location.lng` | number | ❌ | Kinh độ |
| `wifi_ssid` | string | ❌ | SSID WiFi |

---

## 🚨 **Error Responses**

```json
{
  "code": "401|404|500",
  "message": "Error message",
  "data": null
}
```

---

## 🎯 **Logic quan trọng**

- **Checkin:** Tạo record mới với `checkin_time`, `checkout_time = null`
- **Checkout:** Cập nhật record với `checkout_time` và tính `total_hours`
- **Status:** Tự động tính dựa trên giờ check-in (8:30 = present, >8:30 = late)
- **GPS:** Validate trong phạm vi 50m của 2 cơ sở 