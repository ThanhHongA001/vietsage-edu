/// Quản lý toàn bộ khóa lưu trữ cục bộ (SharedPreferences / Storage keys).
/// Tất cả hằng số khóa lưu trữ tuân thủ tiền tố "sp...".
class SPKeys {
  // ==========================================
  // 1. ACCOUNT & SESSION STORAGE KEYS
  // ==========================================
  /// ID của tài khoản đang được kích hoạt sử dụng
  static const String spActiveAccountId = 'sp_active_account_id';

  /// Danh sách toàn bộ các tài khoản đã từng đăng nhập trên thiết bị (dạng JSON list)
  static const String spSavedAccounts = 'sp_saved_accounts_json';

  /// Mã xác thực phiên đăng nhập (JWT token hoặc session token)
  static const String spAuthToken = 'sp_auth_token';

  /// Ghi nhớ đăng nhập
  static const String spRememberMe = 'sp_remember_me';

  /// Số điện thoại đăng nhập gần nhất
  static const String spLastPhoneNumber = 'sp_last_phone_number';

  // ==========================================
  // 2. SETTINGS & PREFERENCES KEYS
  // ==========================================
  /// Chế độ giao diện (system / light / dark)
  static const String spThemeMode = 'sp_theme_mode';

  /// Mã ngôn ngữ đang chọn (vi / en)
  static const String spLanguageCode = 'sp_language_code';

  // ==========================================
  // 3. NOTIFICATION PREFERENCES KEYS
  // ==========================================
  /// Bật/tắt thông báo điểm danh & chuyên cần
  static const String spAttendanceNotification = 'sp_attendance_notification';

  /// Bật/tắt thông báo điểm số & kết quả học tập
  static const String spGradeNotification = 'sp_grade_notification';

  /// Bật/tắt thông báo bài tập về nhà & nhắc hạn nộp
  static const String spHomeworkNotification = 'sp_homework_notification';

  /// Bật/tắt thông báo dịch vụ nhà trường (thực đơn, đồng phục)
  static const String spServiceNotification = 'sp_service_notification';

  /// Bật/tắt thông báo sự kiện & tin tức toàn trường
  static const String spSchoolEventsNotification = 'sp_school_events_notification';

  // ==========================================
  // 4. CACHE & SYNC TIMESTAMP KEYS
  // ==========================================
  /// Thời điểm đồng bộ dữ liệu gần nhất
  static const String spLastSyncTimestamp = 'sp_last_sync_timestamp';
}
