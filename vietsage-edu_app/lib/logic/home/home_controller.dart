import 'package:flutter/material.dart';
import '../../core/network/services/api_services.dart';
import '../auth/account_manager.dart';
import '../navigation/navigation_service.dart';

class HomeController extends ChangeNotifier {
  final AccountManager _accountManager = AccountManager();
  bool _isLoading = false;

  bool get isLoading => _isLoading;

  HomeController() {
    _accountManager.addListener(_onAccountChanged);
    loadData();
  }

  void _onAccountChanged() {
    notifyListeners();
  }

  @override
  void dispose() {
    _accountManager.removeListener(_onAccountChanged);
    super.dispose();
  }

  // Getters phản hồi động theo tài khoản đang kích hoạt
  String get studentName => _accountManager.currentAccount.name;
  String get studentClass => '${_accountManager.currentAccount.studentClass} • ${_accountManager.currentAccount.school}';
  String get gpa => _accountManager.currentAccount.gpa;
  String get gpaClassification => _accountManager.currentAccount.gpaClassification;
  String get attendanceRatio => _accountManager.currentAccount.attendanceRatio;
  String get attendanceStatus => _accountManager.currentAccount.attendanceStatus;
  String get scheduleToday => _accountManager.currentAccount.scheduleToday;
  Map<String, String> get urgentHomework => _accountManager.currentAccount.urgentHomework;

  List<Map<String, String?>> _notifications = [
    {
      'title': 'Thông Báo Họp Phụ Huynh Đầu Năm Học 2026-2027',
      'date': '14/10/2026',
      'sender': 'Ban Giám Hiệu',
      'content': 'Kính gửi quý phụ huynh, Nhà trường trân trọng kính mời quý phụ huynh tham dự buổi họp phụ huynh đầu năm học 2026-2027 vào lúc 08h00 Chủ Nhật tại phòng học lớp của các em để cùng trao đổi về phương hướng học tập.',
      'imageUrl': 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80',
    },
    {
      'title': 'Kế Hoạch Khảo Sát & Lịch Thi Giữa Học Kỳ I',
      'date': '12/10/2026',
      'sender': 'Phòng Đào Tạo',
      'content': 'Nhà trường thông báo kế hoạch tổ chức kiểm tra giữa học kỳ I cho toàn bộ học sinh các khối. Thời gian diễn ra từ ngày 25/10/2026 đến hết 29/10/2026. Đề cương chi tiết đã được đăng tải trên cổng học tập.',
      'imageUrl': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
    },
    {
      'title': 'Điểm Danh Ngày 17/10: Học Sinh Có Mặt Đúng Giờ',
      'date': '17/10/2026',
      'sender': 'Hệ Thống Điểm Danh',
      'content': 'Học sinh đã điểm danh thành công lúc 07:15 sáng nay tại cổng trường và có mặt đúng giờ tại phòng học. Nhà trường kính báo phụ huynh an tâm.',
      'imageUrl': null,
    },
    {
      'title': 'Mở Đăng Ký Câu Lạc Bộ STEM & Tiếng Anh Giao Tiếp',
      'date': '10/10/2026',
      'sender': 'Đoàn Trường',
      'content': 'Đoàn trường chính thức mở cổng đăng ký tham gia các Câu lạc bộ học thuật năm học mới: CLB Sáng tạo Robot & STEM, CLB Tranh biện Tiếng Anh. Hạn chót đăng ký đến hết ngày 20/10/2026.',
      'imageUrl': 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80',
    },
    {
      'title': 'Kế Hoạch Khám Sức Khỏe Định Kỳ Toàn Trường',
      'date': '08/10/2026',
      'sender': 'Phòng Y Tế',
      'content': 'Thực hiện kế hoạch chăm sóc y tế học đường, Phòng Y tế phối hợp với Trung tâm Y tế tổ chức buổi khám sức khỏe định kỳ gồm đo thị lực, khám răng hàm mặt và dinh dưỡng cho các em học sinh.',
      'imageUrl': 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80',
    },
  ];

  List<Map<String, String?>> get latestNotifications => _notifications;

  Future<void> loadData() async {
    _isLoading = true;
    notifyListeners();

    try {
      // 1. Tải thông báo mới nhất từ API
      final annResponse = await ApiServices.announcements.getAnnouncements();
      if (annResponse.success && annResponse.data != null && annResponse.data!.isNotEmpty) {
        _notifications = annResponse.data!.map((item) => {
          'title': item.title,
          'date': item.date,
          'sender': item.sender,
          'content': item.content,
          'imageUrl': item.imageUrl,
        }).toList();
      }

      // 2. Tải chỉ số dashboard từ API nếu có
      final dashResponse = await ApiServices.dashboard.getSummary();
      if (dashResponse.success && dashResponse.data != null) {
        // Cập nhật thông số vào account manager nếu cần
      }
    } catch (_) {
      // Giữ nguyên dữ liệu offline
    }

    _isLoading = false;
    notifyListeners();
  }

  void openProfile() => NavigationService.goToStudentProfile();
  void openNotifications() => NavigationService.goToNotifications();
  void openAcademicResults() => NavigationService.goToAcademicResults();
  void openAttendance() => NavigationService.goToAttendance();
  void openHomework() => NavigationService.goToHomework();

  void openNotificationDetail(int index) {
    final item = latestNotifications[index];
    NavigationService.goToNotificationDetail(
      title: item['title'] ?? '',
      date: item['date'] ?? '',
      sender: item['sender'] ?? 'Nhà Trường',
      content: item['content'] ?? '',
      imageUrl: item['imageUrl'],
    );
  }
}
