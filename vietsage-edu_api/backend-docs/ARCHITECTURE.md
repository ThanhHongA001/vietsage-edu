# Kiến Trúc Hệ Thống Vietsage Education API

Tài liệu này mô tả tổng quan kiến trúc hệ thống, các lớp xử lý, nguyên tắc thiết kế và luồng xác thực / phân quyền trong dự án **Vietsage Education API**.

---

## 1. Mục Tiêu Thiết Kế
- **Tính module hóa (Modular Architecture):** Tách biệt các miền nghiệp vụ (`auth`, `users`, `hn212`, `attendance`, `health`) theo chuẩn NestJS.
- **Bảo mật nhiều lớp (Defense in Depth):**
  - Không lưu mật khẩu thuần (sử dụng `bcrypt` với 12 salt rounds).
  - Không lưu `refreshToken` dạng raw trong cơ sở dữ liệu (sử dụng băm SHA-256 để chống lộ phiên ngay cả khi database bị dump).
  - Xoay vòng token (Refresh Token Rotation): Mỗi lần cấp lại Access Token sẽ thu hồi Refresh Token cũ và sinh Refresh Token mới.
  - Phân quyền theo vai trò (Role-Based Access Control - RBAC) với `RolesGuard`.
- **Tích hợp phần cứng / Plugin (HN212 Device Adapter):**
  - Chống trùng lặp sự kiện (Idempotency) dựa trên khóa duy nhất `eventId`.
  - Hỗ trợ lưu payload gốc (`rawPayload` kiểu JSONB) phục vụ đối soát và kiểm toán.
  - Ghi nhận trạng thái kết nối (`lastSeenAt`) của thiết bị tự động.
- **Tập trung hóa xử lý lỗi (Centralized Error Handling):**
  - Exception Filter toàn cục chuẩn hóa cấu trúc lỗi trả về dạng JSON nhất quán.
  - Ẩn toàn bộ stack trace và chi tiết nhạy cảm ở môi trường production.

---

## 2. Bố Cục Thư Mục Dự Án (Project Layout)

```text
vietsage-edu_api/
├── backend-api/                         # Ứng dụng Backend NestJS chính
│   ├── prisma/
│   │   ├── migrations/                  # Lịch sử migration cơ sở dữ liệu
│   │   ├── schema.prisma                # Schema định nghĩa database models & enums
│   │   └── seed.ts                      # Script khởi tạo tài khoản mẫu & thiết bị mẫu
│   ├── src/
│   │   ├── common/                      # Thành phần dùng chung toàn hệ thống
│   │   │   ├── decorators/              # Custom Decorators (@Roles, @CurrentUser,...)
│   │   │   ├── filters/                 # Exception Filters (HttpExceptionFilter)
│   │   │   ├── guards/                  # Guards (JwtAuthGuard, RolesGuard)
│   │   │   ├── interceptors/            # LoggingInterceptor, TransformInterceptor
│   │   │   └── pipes/                   # Validation Pipes
│   │   ├── config/                      # Cấu hình biến môi trường
│   │   ├── modules/                     # Các module nghiệp vụ
│   │   │   ├── auth/                    # Đăng ký, đăng nhập, xoay vòng token, đăng xuất
│   │   │   ├── users/                   # Quản lý tài khoản, thông tin cá nhân, cập nhật trạng thái
│   │   │   ├── hn212/                   # Adapter tiếp nhận sự kiện chấm công từ HN212
│   │   │   ├── attendance/              # Truy vấn, thống kê lịch sử chấm công
│   │   │   └── health/                  # Health check & kiểm tra kết nối DB
│   │   ├── prisma/                      # PrismaService & PrismaModule
│   │   ├── app.module.ts                # Root module của ứng dụng
│   │   └── main.ts                      # Điểm khởi chạy (Bootstrap application)
│   ├── .env                             # File cấu hình biến môi trường thực tế
│   ├── .env.example                     # File mẫu biến môi trường
│   ├── Dockerfile                       # Multi-stage Dockerfile cho production
│   ├── docker-compose.yml               # Cấu hình khởi chạy API & PostgreSQL container
│   ├── package.json                     # Danh sách phụ thuộc và scripts
│   └── vietsage-edu_api.postman_collection.json # Bộ test Postman
├── backend-docs/                        # Toàn bộ tài liệu kỹ thuật & đặc tả hệ thống
│   ├── ARCHITECTURE.md                  # Kiến trúc hệ thống và luồng dữ liệu
│   ├── DATABASE_ERD.md                  # Sơ đồ quan hệ thực thể (ERD) & giải thích
│   ├── API_SPECIFICATION.md             # Đặc tả chi tiết các endpoint API
│   └── HN212_INTEGRATION_GUIDE.md       # Hướng dẫn tích hợp thiết bị/plugin HN212
└── backend-logs/                        # Thư mục chứa các file log của hệ thống
    ├── application-%DATE%.log           # Log hoạt động chung
    ├── error-%DATE%.log                 # Log ngoại lệ và lỗi hệ thống
    └── hn212-%DATE%.log                 # Log sự kiện chấm công nhận từ thiết bị
```

---

## 3. Luồng Xử Lý Request (Request Lifecycle)

```mermaid
flowchart TD
    Client["Client / Postman / Thiết bị HN212"] -->|"HTTP Request"| Helmet["Helmet (Bảo vệ HTTP Headers)"]
    Helmet --> Cors["CORS Middleware"]
    Cors --> GlobalPrefix["Global Prefix (/api/v1)"]
    GlobalPrefix --> Interceptor["Logging Interceptor (Ghi vết thời gian & URL)"]
    Interceptor --> Pipe["Validation Pipe (class-validator DTO)"]
    Pipe --> AuthGuard{"JwtAuthGuard (Kiểm tra Bearer Token)"}
    
    AuthGuard -->|"Token không hợp lệ / Hết hạn"| Filter["HttpExceptionFilter (Chuẩn hóa JSON Error)"]
    AuthGuard -->|"Token hợp lệ"| RolesGuard{"RolesGuard (Kiểm tra quyền RBAC)"}
    
    RolesGuard -->|"Không đủ quyền"| Filter
    RolesGuard -->|"Đủ quyền"| Controller["Controller (Điều phối request)"]
    
    Controller --> Service["Service (Logic nghiệp vụ)"]
    Service --> Prisma["Prisma Client (Truy vấn PostgreSQL)"]
    Prisma --> DB[(PostgreSQL Database)]
    
    DB --> Service
    Service --> Controller
    Controller --> Interceptor
    Interceptor -->|"HTTP Response 200/201"| Client
    Filter -->|"HTTP Response 4xx/5xx"| Client
```

---

## 4. Cơ Chế Xác Thực & Xoay Vòng Token (Authentication & Token Rotation)

```mermaid
sequenceDiagram
    autonumber
    actor User as Người dùng / Client
    participant Auth as AuthService
    participant JWT as JwtService
    participant DB as PostgreSQL (User & RefreshToken)

    Note over User, DB: Luồng Đăng Nhập (Login)
    User->>Auth: POST /api/v1/auth/login (email, password)
    Auth->>DB: Tìm User theo email
    DB-->>Auth: Trả về thông tin User + passwordHash
    Auth->>Auth: bcrypt.compare(password, passwordHash)
    Auth->>JWT: Ký Access Token (hạn 15m, sub, email, role)
    Auth->>JWT: Ký Refresh Token (hạn 7d, sub, jti)
    Auth->>Auth: Băm SHA-256(RefreshToken)
    Auth->>DB: Lưu tokenHash, userId, expiresAt vào bảng RefreshToken
    Auth-->>User: Trả về { accessToken, refreshToken, user }

    Note over User, DB: Luồng Gọi API Bảo Vệ
    User->>Auth: GET /api/v1/attendance (Headers: Bearer <accessToken>)
    Auth->>JWT: Xác minh chữ ký & thời hạn Access Token
    Auth-->>User: Trả về dữ liệu chấm công

    Note over User, DB: Luồng Xoay Vòng Token (Refresh Token Rotation)
    User->>Auth: POST /api/v1/auth/refresh (refreshToken cũ)
    Auth->>JWT: Kiểm tra tính hợp lệ của refreshToken
    Auth->>Auth: Băm SHA-256(refreshToken cũ)
    Auth->>DB: Tìm bản ghi có tokenHash
    alt Token không tìm thấy hoặc đã bị thu hồi (revokedAt != null)
        Auth-->>User: 401 Unauthorized (Phát hiện nghi vấn rò rỉ token)
    else Token hợp lệ
        Auth->>DB: Cập nhật revokedAt = now() (Thu hồi token cũ)
        Auth->>JWT: Ký Access Token mới + Refresh Token mới
        Auth->>Auth: Băm SHA-256(RefreshToken mới)
        Auth->>DB: Lưu RefreshToken mới vào DB
        Auth-->>User: Trả về { accessToken mới, refreshToken mới }
    end
```
