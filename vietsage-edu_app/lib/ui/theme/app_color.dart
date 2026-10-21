import 'package:flutter/material.dart';

/// Quản lý toàn bộ bảng màu chuẩn của dự án Vietsage Edu.
/// Định nghĩa đầy đủ mã Hex, tên màu và mục đích sử dụng.
class AppColors {
  // ==========================================
  // 1. BRAND COLORS (MÀU CHỦ ĐẠO & THƯƠNG HIỆU)
  // ==========================================
  /// Xanh dương đậm chủ đạo (Royal Blue) - Thanh AppBar, nút chính, điểm nhấn chính
  static const Color primary = Color(0xFF1E40AF);

  /// Xanh Navy đậm (Navy Dark) - Nền gradient banner, thẻ tài khoản chính
  static const Color primaryDark = Color(0xFF1E3A8A);

  /// Xanh dương sáng (Blue Bright) - Gradient, trạng thái hover / focus, điểm số
  static const Color primaryLight = Color(0xFF2563EB);

  /// Xanh da trời nhạt (Sky Blue) - Điểm sáng gradient
  static const Color primaryAccent = Color(0xFF60A5FA);

  /// Xanh nhạt nền container (Blue Container Light) - Nền icon CircleAvatar, badge nhẹ
  static const Color primaryContainer = Color(0xFFDBEAFE);

  /// Màu chữ / icon tương phản trên nền primary (Trắng)
  static const Color onPrimary = Color(0xFFFFFFFF);

  // ==========================================
  // 2. SECONDARY & CATEGORY COLORS (MÀU DANH MỤC & DỊCH VỤ)
  // ==========================================
  /// Xanh ngọc / Mòng két (Teal) - Thực đơn canteen, thẻ dịch vụ dinh dưỡng
  static const Color secondary = Color(0xFF0D9488);
  static const Color secondaryLight = Color(0xFFCCFBF1);

  /// Tím hoàng gia (Purple / Violet) - Đồng phục học sinh, tài khoản phụ
  static const Color purple = Color(0xFF7C3AED);
  static const Color purpleLight = Color(0xFFF3E8FF);

  /// Chàm đậm (Indigo) - Bài tập về nhà, thông báo hệ thống
  static const Color indigo = Color(0xFF4F46E5);
  static const Color indigoLight = Color(0xFFE0E7FF);

  /// Hồng hoa sen (Pink / Rose) - Sự kiện ngoại khóa, lễ hội nhà trường
  static const Color pink = Color(0xFFDB2777);
  static const Color pinkLight = Color(0xFFFCE7F3);

  // ==========================================
  // 3. STATUS & FUNCTIONAL COLORS (MÀU TRẠNG THÁI & CHỨC NĂNG)
  // ==========================================
  /// Xanh lá thành công (Success Green) - Chuyên cần đúng giờ, đã hoàn thành, nộp bài
  static const Color success = Color(0xFF16A34A);
  static const Color successLight = Color(0xFFDCFCE7);

  /// Cam cảnh báo (Warning Orange) - Nhắc nhở hạn nộp, cần chú ý
  static const Color warning = Color(0xFFEA580C);
  static const Color warningLight = Color(0xFFFEF3C7);

  /// Đỏ báo động / lỗi (Danger Red) - Quá hạn, nghỉ học, nút xóa, đăng xuất
  static const Color danger = Color(0xFFDC2626);
  static const Color dangerLight = Color(0xFFFEE2E2);
  static const Color dangerBorder = Color(0xFFFECACA);

  /// Xanh dương thông tin (Info Blue) - Tin tức mới, thông báo chung
  static const Color info = Color(0xFF2563EB);
  static const Color infoLight = Color(0xFFE0F2FE);

  // ==========================================
  // 4. LIGHT NEUTRAL COLORS (BẢNG MÀU CHẾ ĐỘ SÁNG)
  // ==========================================
  /// Nền toàn màn hình giao diện sáng (Slate 50)
  static const Color background = Color(0xFFF8FAFC);

  /// Nền thẻ Card / BottomSheet / Input (Trắng tinh khiết)
  static const Color surface = Color(0xFFFFFFFF);

  /// Chữ chính / Tiêu đề độ tương phản cao (Slate 900)
  static const Color textPrimary = Color(0xFF0F172A);

  /// Chữ phụ / Ghi chú / Thời gian (Slate 500)
  static const Color textSecondary = Color(0xFF64748B);

  /// Chữ mờ / Placeholder text (Slate 400)
  static const Color textMuted = Color(0xFF94A3B8);

  /// Đường viền viền hộp / Card border (Slate 200)
  static const Color border = Color(0xFFE2E8F0);

  /// Đường kẻ phân cách (Slate 100)
  static const Color divider = Color(0xFFF1F5F9);

  // ==========================================
  // 5. DARK NEUTRAL COLORS (BẢNG MÀU CHẾ ĐỘ TỐI)
  // ==========================================
  /// Nền toàn màn hình giao diện tối (Slate 900)
  static const Color darkBackground = Color(0xFF0F172A);

  /// Nền thẻ Card / BottomSheet chế độ tối (Slate 800)
  static const Color darkSurface = Color(0xFF1E293B);

  /// Đường viền chế độ tối (Slate 700)
  static const Color darkBorder = Color(0xFF334155);

  /// Chữ chính chế độ tối (Slate 50)
  static const Color darkTextPrimary = Color(0xFFF8FAFC);

  /// Chữ phụ chế độ tối (Slate 400)
  static const Color darkTextSecondary = Color(0xFF94A3B8);

  /// Chữ mờ chế độ tối (Slate 500)
  static const Color darkTextMuted = Color(0xFF64748B);

  // ==========================================
  // 6. GRADIENTS (DẢI MÀU HIỆU ỨNG)
  // ==========================================
  /// Gradient chủ đạo cho Banner Trang Chủ
  static const LinearGradient homeBannerGradient = LinearGradient(
    colors: [primaryDark, primaryLight, primaryAccent],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}
