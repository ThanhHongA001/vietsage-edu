import '../api_client.dart';
import '../api_config.dart';
import '../api_response.dart';
import '../models/api_models.dart';

/// Dịch vụ kết nối API Thông báo toàn trường
class AnnouncementsApiService {
  final ApiClient _client = ApiClient.instance;

  /// Lấy danh sách thông báo
  Future<ApiResponse<List<AnnouncementItem>>> getAnnouncements({
    String? category,
    String? priority,
  }) async {
    return _client.get<List<AnnouncementItem>>(
      ApiConfig.announcements,
      queryParameters: {
        'category': category,
        'priority': priority,
      },
      fromJson: (json) => (json as List<dynamic>)
          .map((e) => AnnouncementItem.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }

  /// Đánh dấu thông báo đã đọc
  Future<ApiResponse<dynamic>> markAsRead(String id) async {
    return _client.patch(ApiConfig.announcementMarkRead(id));
  }
}
