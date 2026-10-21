import '../api_client.dart';
import '../api_config.dart';
import '../api_response.dart';
import '../models/api_models.dart';

/// Dịch vụ kết nối API Suất ăn Bán trú & Căng tin
class CanteenApiService {
  final ApiClient _client = ApiClient.instance;

  /// Lấy thực đơn trong tuần (Thứ 2 đến Thứ 7)
  Future<ApiResponse<List<CanteenMealItem>>> getWeeklyMenu() async {
    return _client.get<List<CanteenMealItem>>(
      ApiConfig.canteenMenu,
      fromJson: (json) => (json as List<dynamic>)
          .map((e) => CanteenMealItem.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }

  /// Lấy thực đơn của ngày hôm nay
  Future<ApiResponse<CanteenMealItem>> getTodayMeal() async {
    return _client.get<CanteenMealItem>(
      ApiConfig.canteenToday,
      fromJson: (json) => CanteenMealItem.fromJson(json as Map<String, dynamic>),
    );
  }

  /// Đăng ký suất ăn bán trú và chọn món
  Future<ApiResponse<Map<String, dynamic>>> registerMeal({
    String? studentId,
    String? studentName,
    required String dayId,
    String? date,
    required List<dynamic> selectedItems,
  }) async {
    return _client.post<Map<String, dynamic>>(
      ApiConfig.canteenRegister,
      body: {
        'studentId': studentId,
        'studentName': studentName,
        'dayId': dayId,
        'date': date,
        'selectedItems': selectedItems,
      },
      fromJson: (json) => json as Map<String, dynamic>,
    );
  }

  /// Lấy lịch sử đăng ký suất ăn của học sinh
  Future<ApiResponse<List<dynamic>>> getRegistrations({String? studentId}) async {
    return _client.get<List<dynamic>>(
      ApiConfig.canteenRegistrations,
      queryParameters: {
        'studentId': studentId,
      },
      fromJson: (json) => json as List<dynamic>,
    );
  }
}
