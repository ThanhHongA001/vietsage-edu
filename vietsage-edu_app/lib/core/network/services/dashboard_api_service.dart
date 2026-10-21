import '../api_client.dart';
import '../api_config.dart';
import '../api_response.dart';
import '../models/api_models.dart';

/// Dịch vụ kết nối API Báo cáo & Tổng quan điều hành
class DashboardApiService {
  final ApiClient _client = ApiClient.instance;

  /// Lấy tổng quan các chỉ số hệ thống trường học
  Future<ApiResponse<DashboardSummary>> getSummary() async {
    return _client.get<DashboardSummary>(
      ApiConfig.dashboardSummary,
      fromJson: (json) => DashboardSummary.fromJson(json as Map<String, dynamic>),
    );
  }
}
