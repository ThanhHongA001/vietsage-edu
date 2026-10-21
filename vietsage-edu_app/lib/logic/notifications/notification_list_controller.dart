import 'package:flutter/material.dart';
import '../../core/network/services/api_services.dart';
import '../auth/account_manager.dart';
import '../navigation/navigation_service.dart';

class NotificationListController extends ChangeNotifier {
  bool isLoading = false;

  NotificationListController() {
    loadAnnouncements();
  }

  List<Map<String, dynamic>> notifications = [
    {
      'id': 'noti_1',
      'title': 'Điểm Danh Hôm Nay: Học Sinh Có Mặt Đúng Giờ',
      'date': 'Hôm nay',
      'sender': 'Hệ Thống Điểm Danh',
      'content': 'Học sinh ${AccountManager().currentAccount.name} đã điểm danh thành công lúc 07:15 sáng nay tại cổng trường và có mặt đúng giờ tại phòng học ${AccountManager().currentAccount.studentClass}.',
      'imageUrl': null,
      'isNew': true,
    },
    {
      'id': 'noti_2',
      'title': 'Họp Phụ Huynh Đầu Năm Học 2026-2027',
      'date': '14/10/2026',
      'sender': 'Ban Giám Hiệu',
      'content': 'Kính gửi quý phụ huynh, Nhà trường trân trọng thông báo buổi họp phụ huynh đầu năm học sẽ được tổ chức vào 08h00 Chủ Nhật tuần này tại phòng học các lớp.',
      'imageUrl': 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80',
      'isNew': true,
    },
    {
      'id': 'noti_3',
      'title': 'Khảo Sát & Kế Hoạch Thi Giữa Học Kỳ I',
      'date': '12/10/2026',
      'sender': 'Phòng Đào Tạo',
      'content': 'Thời gian thi giữa kỳ dự kiến từ ngày 25/10/2026 đến hết 29/10/2026. Học sinh chủ động ôn tập kỹ theo đề cương đã ban hành.',
      'imageUrl': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
      'isNew': true,
    },
    {
      'id': 'noti_4',
      'title': 'Đăng Ký Câu Lạc Bộ STEM & Tiếng Anh',
      'date': '10/10/2026',
      'sender': 'Đoàn Thanh Niên',
      'content': 'Mở cổng đăng ký sinh hoạt CLB Khoa học kỹ thuật và CLB Tiếng Anh giao tiếp. Học sinh quan tâm đăng ký trực tuyến trước ngày 20/10.',
      'imageUrl': 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80',
      'isNew': false,
    },
    {
      'id': 'noti_5',
      'title': 'Khám Sức Khỏe Định Kỳ Toàn Trường',
      'date': '08/10/2026',
      'sender': 'Phòng Y Tế',
      'content': 'Nhà trường phối hợp cùng Trung tâm Y tế tổ chức khám sức khỏe tổng quát, mắt, răng hàm mặt cho toàn thể học sinh khối 10.',
      'imageUrl': 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80',
      'isNew': false,
    },
  ];

  Future<void> loadAnnouncements() async {
    isLoading = true;
    notifyListeners();

    try {
      final response = await ApiServices.announcements.getAnnouncements();
      if (response.success && response.data != null && response.data!.isNotEmpty) {
        notifications = response.data!.map((item) => {
          'id': item.id,
          'title': item.title,
          'date': item.date,
          'sender': item.sender,
          'content': item.content,
          'imageUrl': item.imageUrl,
          'isNew': !item.isRead,
        }).toList();
      }
    } catch (_) {}

    isLoading = false;
    notifyListeners();
  }

  void openNotificationDetail(int index) {
    notifications[index]['isNew'] = false;
    notifyListeners();

    final item = notifications[index];
    final String? id = item['id'];
    if (id != null) {
      ApiServices.announcements.markAsRead(id);
    }

    NavigationService.goToNotificationDetail(
      title: item['title'] as String,
      date: item['date'] as String,
      sender: item['sender'] as String,
      content: item['content'] as String,
      imageUrl: item['imageUrl'] as String?,
    );
  }
}
