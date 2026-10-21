# Vietsage Education API

Bộ khung API dùng NestJS + TypeScript + Prisma ORM + PostgreSQL + Docker Compose. HN212 hiện được triển khai dưới dạng adapter tạm thời vì chưa có tài liệu giao thức chính thức.

## Yêu cầu
- Docker Desktop đang chạy (khuyến nghị).
- Hoặc Node.js 22 LTS và npm nếu chạy API ngoài Docker.

## Chạy bằng Docker trên Windows
1. Giải nén thư mục dự án vào `D:\Code\Backend_Api\vietsage-edu_api`.
2. Mở PowerShell tại thư mục dự án.
3. Tạo file môi trường: `Copy-Item .env.example .env`.
4. Mở `.env`, thay `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `HN212_API_KEY` bằng giá trị ngẫu nhiên đủ mạnh. Đồng thời đặt `POSTGRES_PASSWORD` trong `.env` trùng với mật khẩu bạn muốn dùng; nếu không đặt, Compose dùng mật khẩu phát triển mặc định.
5. Chạy `docker compose up --build -d`.
6. Xem log: `docker compose logs -f api`.
7. Kiểm tra `http://localhost:3000/api/v1/health`.

Lần khởi động đầu, container API chạy `prisma migrate deploy` và áp dụng migration khởi tạo đã có sẵn trong `prisma/migrations`.

## Tạo migration mới khi thay đổi schema
Migration khởi tạo đã được đóng gói sẵn. Khi chỉnh sửa `prisma/schema.prisma`, tạo migration mới trong môi trường phát triển bằng:
```powershell
npm install
Copy-Item .env.example .env
# Khi chạy lệnh Prisma từ Windows host, đổi hostname postgres thành localhost trong DATABASE_URL
# DATABASE_URL=postgresql://vietsage:vietsage_dev_password@localhost:5432/vietsage_edu?schema=public
# Khởi động riêng database trước
 docker compose up -d postgres
npx prisma migrate dev --name ten_migration_moi
npx prisma generate
npx prisma db seed
```
Sau đó có thể chạy `docker compose up --build -d` để chạy cả hệ thống. Nếu `DATABASE_URL` trong `.env` đang dùng hostname `postgres`, lệnh Prisma từ Windows host sẽ không phân giải được; hãy tạm dùng `localhost` khi chạy Prisma từ máy host, rồi khôi phục hostname `postgres` cho API trong Docker.

## Chạy API ngoài Docker
- Đảm bảo PostgreSQL đang chạy và `DATABASE_URL` dùng `localhost`.
- `npm install`
- `npx prisma generate`
- `npm run start:dev`

## API hiện có
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/v1/health` | Kiểm tra API và database |
| POST | `/api/v1/auth/register` | Đăng ký tài khoản |
| POST | `/api/v1/auth/login` | Đăng nhập, cấp access/refresh token |
| POST | `/api/v1/auth/refresh` | Xoay vòng refresh token |
| POST | `/api/v1/auth/logout` | Thu hồi refresh token |
| POST | `/api/v1/hn212/events` | Adapter tiếp nhận sự kiện tạm thời |
| GET | `/api/v1/attendance` | Danh sách chấm công, tối đa 100 bản ghi |

## Postman
Import `vietsage-edu_api.postman_collection.json` vào Postman. Sửa biến `deviceApiKey` trùng `HN212_API_KEY` trong `.env`. Đăng ký user trước khi login. Collection tự lưu token sau khi gọi Login.

## Lưu ý bảo mật và phần chưa hoàn thiện
- Đây là bộ khung khởi đầu, chưa phải bản production-ready.
- Endpoint register hiện cho phép tự đăng ký; cần giới hạn hoặc chuyển sang quy trình do admin cấp tài khoản trước khi triển khai thực tế.
- Endpoint danh sách attendance đã yêu cầu Access Token; module phân quyền chi tiết theo role và phạm vi dữ liệu cần được hoàn thiện trước khi public API.
- Refresh token được lưu dưới dạng SHA-256 hash và xoay vòng khi refresh; cân nhắc thêm phát hiện tái sử dụng token, giới hạn phiên và kiểm thử đồng thời.
- HN212 payload và trường ánh xạ chỉ là phỏng đoán tương thích phổ biến, không phải schema được xác nhận. Không kết nối thiết bị thật trước khi đối chiếu tài liệu/plugin thực tế.
- Không lưu ảnh khuôn mặt/vân tay thô nếu không có yêu cầu nghiệp vụ, căn cứ pháp lý và biện pháp bảo vệ phù hợp.
- Đổi mọi secret và mật khẩu mẫu trước khi sử dụng thật.
