import 'package:flutter/material.dart';
import '../../core/network/services/api_services.dart';
import '../navigation/navigation_service.dart';

class EventsController extends ChangeNotifier {
  bool isLoading = false;

  EventsController() {
    loadEvents();
  }

  List<Map<String, dynamic>> events = [
    {
      'title': 'Hội Thao & Giải Bóng Đá Nam Khối 10',
      'date': '20/10/2026 - 25/10/2026',
      'location': 'Sân Vận Động Trường',
      'icon': Icons.sports_soccer,
      'tag': 'Thể thao',
      'desc': 'Giải đấu bóng đá thường niên nhằm nâng cao tinh thần rèn luyện thể chất và đoàn kết giữa các chi đoàn khối 10.',
    },
    {
      'title': 'Lễ Hội Hóa Trang Halloween Đa Văn Hóa',
      'date': '31/10/2026 • 18:30',
      'location': 'Hội Trường Lớn',
      'icon': Icons.celebration,
      'tag': 'Văn hóa',
      'desc': 'Đêm hội trải nghiệm văn hóa thế giới với các gian hàng ẩm thực, thi hóa trang sáng tạo và ca nhạc giao lưu.',
    },
    {
      'title': 'Hội Diễn Văn Nghệ Chào Mừng 20/11',
      'date': '19/11/2026 • 08:00',
      'location': 'Sân Khấu Ngoài Trời',
      'icon': Icons.music_note,
      'tag': 'Tri ân',
      'desc': 'Chương trình biểu diễn nghệ thuật đặc sắc dâng tặng các thầy cô giáo nhân ngày Nhà Giáo Việt Nam.',
    },
    {
      'title': 'Quyên Góp Sách Vở Ủng Hộ Bạn Vùng Cao',
      'date': 'Đến hết ngày 30/11/2026',
      'location': 'Thư Viện Trường',
      'icon': Icons.volunteer_activism,
      'tag': 'Thiện nguyện',
      'desc': 'Chiến dịch thu gom sách giáo khoa, vở trắng và đồ dùng học tập gửi tặng học sinh vùng sâu vùng xa.',
    },
  ];

  Future<void> loadEvents() async {
    isLoading = true;
    notifyListeners();

    try {
      final response = await ApiServices.events.getEvents();
      if (response.success && response.data != null && response.data!.isNotEmpty) {
        events = response.data!.map((ev) {
          IconData icon = Icons.event;
          if (ev.category.contains('Thể thao')) {
            icon = Icons.sports_soccer;
          } else if (ev.category.contains('Văn hóa') || ev.category.contains('Lễ hội')) {
            icon = Icons.celebration;
          } else if (ev.category.contains('Tri ân') || ev.category.contains('Nghệ thuật')) {
            icon = Icons.music_note;
          } else if (ev.category.contains('Thiện nguyện')) {
            icon = Icons.volunteer_activism;
          }

          return {
            'title': ev.title,
            'date': '${ev.date} • ${ev.time}',
            'location': ev.location,
            'icon': icon,
            'tag': ev.category,
            'desc': ev.description,
          };
        }).toList();
      }
    } catch (_) {}

    isLoading = false;
    notifyListeners();
  }

  void openEventDetail(Map<String, dynamic> event) {
    NavigationService.goToEventDetail(
      title: event['title'] ?? '',
      date: event['date'] ?? '',
      location: event['location'] ?? '',
      description: event['desc'] ?? '',
      icon: event['icon'] ?? Icons.celebration,
    );
  }
}
