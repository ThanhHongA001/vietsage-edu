import '../api_client.dart';
import '../api_config.dart';
import '../api_response.dart';
import '../models/api_models.dart';

/// Dịch vụ kết nối API Đồng phục học sinh
class UniformApiService {
  final ApiClient _client = ApiClient.instance;

  /// Lấy danh mục sản phẩm đồng phục
  Future<ApiResponse<List<UniformProduct>>> getUniforms({
    String? category,
    String? gradeGroup,
  }) async {
    return _client.get<List<UniformProduct>>(
      ApiConfig.uniforms,
      queryParameters: {
        'category': category,
        'gradeGroup': gradeGroup,
      },
      fromJson: (json) => (json as List<dynamic>)
          .map((e) => UniformProduct.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }

  /// Lấy danh sách đơn hàng đồng phục đã đặt
  Future<ApiResponse<List<UniformOrder>>> getOrders({
    String? studentName,
    String? status,
  }) async {
    return _client.get<List<UniformOrder>>(
      ApiConfig.uniformOrders,
      queryParameters: {
        'studentName': studentName,
        'status': status,
      },
      fromJson: (json) => (json as List<dynamic>)
          .map((e) => UniformOrder.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }

  /// Tạo đơn đặt hàng đồng phục mới
  Future<ApiResponse<UniformOrder>> createOrder({
    required List<dynamic> items,
    required double totalAmount,
    String? studentName,
    String? studentClass,
  }) async {
    return _client.post<UniformOrder>(
      ApiConfig.uniformOrders,
      body: {
        'items': items,
        'totalAmount': totalAmount,
        'studentName': studentName,
        'studentClass': studentClass,
      },
      fromJson: (json) => UniformOrder.fromJson(json as Map<String, dynamic>),
    );
  }
}
