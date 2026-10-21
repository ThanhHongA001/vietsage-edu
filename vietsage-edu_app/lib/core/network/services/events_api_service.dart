import '../api_client.dart';
import '../api_config.dart';
import '../api_response.dart';
import '../models/api_models.dart';

/// Dịch vụ kết nối API Sự kiện & Hoạt động trường học
class EventsApiService {
  final ApiClient _client = ApiClient.instance;

  /// Lấy danh sách sự kiện toàn trường
  Future<ApiResponse<List<EventItem>>> getEvents() async {
    return _client.get<List<EventItem>>(
      ApiConfig.events,
      fromJson: (json) => (json as List<dynamic>)
          .map((e) => EventItem.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }

  /// Lấy thông tin chi tiết một sự kiện
  Future<ApiResponse<EventItem>> getEventDetail(String id) async {
    return _client.get<EventItem>(
      ApiConfig.eventDetail(id),
      fromJson: (json) => EventItem.fromJson(json as Map<String, dynamic>),
    );
  }
}
