# Đặc Tả API (API Specification) - Vietsage Education

- **Base URL:** `http://localhost:1000/api/v1`
- **Định dạng dữ liệu:** `application/json`
- **Bộ mã hóa:** UTF-8
- **Xác thực:** Bearer Token (JWT trong header `Authorization: Bearer <accessToken>`)
- **API Key Thiết Bị HN212:** Header `x-device-api-key: dev-hn212-key`

---

## 1. Định Dạng Phản Hồi Chung (Response Standard)

### Phản hồi thành công (200 OK / 201 Created)
```json
{
  "success": true,
  "data": { ... },
  "message": "Thông báo (tùy chọn)"
}
```

### Phản hồi thất bại (4xx / 5xx)
Cung cấp thống nhất qua `HttpExceptionFilter`:
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Chi tiết lỗi",
  "error": "Tên loại lỗi (ví dụ: Bad Request)",
  "path": "/api/v1/users",
  "timestamp": "2026-10-19T10:00:00.000Z"
}
```

---

## 2. Danh Sách Endpoint Chi Tiết

### 2.1. Kiểm Tra Hệ Thống (Health Check)
#### `GET /health`
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "status": "ok",
    "database": "fallback_ready",
    "version": "1.0.0",
    "service": "Vietsage Education Backend API",
    "timestamp": "2026-10-19T12:38:30.300Z"
  }
  ```

---

### 2.2. Tổng Quan Báo Cáo (Dashboard Summary)
#### `GET /dashboard/summary`
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "totalStudents": 14,
      "totalTeachers": 9,
      "totalClasses": 6,
      "totalDevices": 6,
      "onlineDevices": 6,
      "attendanceToday": {
        "totalScans": 6,
        "present": 4,
        "late": 1,
        "excused": 1,
        "attendanceRate": 96.5
      },
      "pendingLeaveRequests": 1,
      "activeHomeworks": 3,
      "uniformRevenue": 525000,
      "serverTime": "2026-10-19T12:38:31.879Z"
    }
  }
  ```

---

### 2.3. Nhóm Xác Thực (Authentication)
#### `POST /auth/login`
Hỗ trợ đăng nhập linh hoạt bằng **Email** (Admin / Giáo viên) HOẶC **Số điện thoại** (Phụ huynh / Học sinh).
- **Request Body (Email):**
  ```json
  { "email": "admin@vietsage.edu.vn", "password": "AdminPassword_123!" }
  ```
- **Request Body (Số điện thoại từ Mobile App):**
  ```json
  { "phone": "0988123456", "password": "12345678" }
  ```
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "message": "Đăng nhập thành công",
    "data": {
      "user": {
        "id": "usr_parent_01",
        "email": "0988123456@vietsage.edu.vn",
        "fullName": "Phụ huynh học sinh (Nguyễn Văn An)",
        "role": "PARENT",
        "phone": "0988123456",
        "studentId": "hs_001",
        "studentName": "Nguyễn Minh Quân",
        "studentClass": "10A1"
      },
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "tokenType": "Bearer",
      "expiresIn": 900
    }
  }
  ```

#### `POST /auth/forgot-password`
Yêu cầu mã OTP khôi phục mật khẩu.
- **Request Body:** `{ "contact": "0988123456" }`
- **Response `200 OK`:** `{ "success": true, "message": "Mã xác thực OTP đã được gửi...", "data": { "otp": "123456", "expiresInSeconds": 60 } }`

#### `POST /auth/verify-otp`
- **Request Body:** `{ "otp": "123456", "contact": "0988123456" }`
- **Response `200 OK`:** `{ "success": true, "message": "Xác thực OTP thành công", "data": { "resetToken": "..." } }`

#### `POST /auth/reset-password`
- **Request Body:** `{ "newPassword": "Password_888!", "confirmPassword": "Password_888!" }`
- **Response `200 OK`:** `{ "success": true, "message": "Đổi mật khẩu thành công!" }`

#### `POST /auth/refresh` & `POST /auth/logout`
- Xoay vòng Refresh Token và thu hồi phiên đăng nhập an toàn.

---

### 2.4. Quản Lý Giáo Viên (`/teachers`)
- `GET /teachers?department=Toán+-+Tin+học&status=ACTIVE`
- `GET /teachers/:id`
- `POST /teachers`: `{ code, fullName, email, phone, department, homeroomClass, subjects }`
- `PATCH /teachers/:id`: Cập nhật thông tin
- `DELETE /teachers/:id`: Xóa giáo viên

---

### 2.5. Quản Lý Học Sinh (`/students`)
- `GET /students/classes`: Danh sách các lớp học (10A1, 10A2...)
- `GET /students?className=10A1`: Lọc học sinh theo lớp
- `GET /students/:id`
- `POST /students`: Thêm mới học sinh
- `PATCH /students/:id`
- `DELETE /students/:id`

---

### 2.6. Thiết Bị & Điểm Danh HN212 (`/devices`, `/hn212`, `/attendance`)
- `GET /devices`: Danh sách máy chấm công nhận diện khuôn mặt
- `POST /devices/:deviceCode/ping`: Cập nhật heartbeat
- `POST /hn212/events`: Tiếp nhận sự kiện quét thẻ/khuôn mặt từ máy HN212 (kèm `x-device-api-key: dev-hn212-key`)
- `GET /attendance?className=10A1&limit=100`: Lịch sử chấm công
- `GET /attendance/stats?className=10A1`: Thống kê tỷ lệ chuyên cần
- `POST /attendance/check-in`: Điểm danh cá nhân
- `POST /attendance/class`: Điểm danh cả lớp theo ngày

---

### 2.7. Đơn Xin Nghỉ Phép (`/leave-requests`)
- `GET /leave-requests?className=10A1&status=PENDING`
- `POST /leave-requests`: Học sinh/phụ huynh gửi đơn (lý do, ngày bắt đầu, ngày kết thúc)
- `PATCH /leave-requests/:id/status`: Giáo viên phê duyệt (`APPROVED` / `REJECTED`)

---

### 2.8. Thời Khóa Biểu (`/schedules`)
- `GET /schedules?className=10A1`: Lấy lịch học theo lớp
- `GET /schedules?teacherName=Hùng`: Lấy lịch dạy theo giáo viên
- `POST /schedules`, `PATCH /schedules/:id`, `DELETE /schedules/:id`

---

### 2.9. Sổ Điểm & Học Bạ (`/grades`)
- `GET /grades?className=10A1&subject=Toán+Học`
- `GET /grades/student/:studentId`: Bảng điểm học bạ, GPA và xếp loại học lực của học sinh
- `POST /grades`: Lưu sổ điểm (tự động tính điểm trung bình môn theo trọng số)

---

### 2.10. Bài Tập Về Nhà (`/homework`)
- `GET /homework?className=10A1`: Danh sách bài tập
- `POST /homework`: Giáo viên giao bài tập mới
- `GET /homework/:id`: Chi tiết bài tập và danh sách nộp bài
- `POST /homework/:id/submit`: Học sinh nộp bài tập
- `PATCH /homework/:id/submissions/:subId/grade`: Giáo viên chấm điểm và nhận xét

---

### 2.11. Căn Tin & Suất Ăn Bán Trú (`/canteen`)
- `GET /canteen/menu`: Thực đơn tuần (Thứ 2 đến Thứ 7)
- `GET /canteen/today`: Thực đơn hôm nay
- `PATCH /canteen/menu/:id`: Cập nhật món ăn
- `POST /canteen/register`: Đăng ký suất ăn và chọn món

---

### 2.12. Đồng Phục Trường (`/uniforms`)
- `GET /uniforms`: Danh mục đồng phục học sinh
- `POST /uniforms/orders`: Đặt mua đồng phục (tự động cập nhật tồn kho)
- `GET /uniforms/orders`: Danh sách đơn đặt hàng
- `PATCH /uniforms/orders/:code/status`: Cập nhật trạng thái nhận tại trường

---

### 2.13. Sự Kiện & Hoạt Động (`/events`)
- `GET /events`: Danh sách hoạt động ngoại khóa, hội thao, văn nghệ
- `POST, PATCH, DELETE /events`

---

### 2.14. Thông Báo Toàn Trường (`/announcements`)
- `GET /announcements`: Danh sách thông báo
- `PATCH /announcements/:id/read`: Đánh dấu đã đọc
- `POST, PATCH, DELETE /announcements`

---

### 2.15. Cài Đặt Hệ Thống (`/settings`)
- `GET /settings`: Thông tin trường, giờ chốt suất ăn
- `PATCH /settings`: Cập nhật cấu hình
