import '../api_client.dart';
import '../api_config.dart';
import '../api_response.dart';
import '../models/api_models.dart';

/// Dịch vụ kết nối API Học sinh & Lớp học
class StudentApiService {
  final ApiClient _client = ApiClient.instance;

  /// Lấy danh sách lớp học
  Future<ApiResponse<List<String>>> getClasses() async {
    return _client.get<List<String>>(
      ApiConfig.studentClasses,
      fromJson: (json) => (json as List<dynamic>).map((e) => e.toString()).toList(),
    );
  }

  /// Lấy danh sách học sinh theo lớp hoặc tìm kiếm
  Future<ApiResponse<List<UserModel>>> getStudents({
    String? className,
    String? search,
    String? schoolLevel,
  }) async {
    return _client.get<List<UserModel>>(
      ApiConfig.students,
      queryParameters: {
        'className': className,
        'search': search,
        'schoolLevel': schoolLevel,
      },
      fromJson: (json) => (json as List<dynamic>)
          .map((e) => UserModel.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }

  /// Lấy chi tiết thông tin học sinh
  Future<ApiResponse<Map<String, dynamic>>> getStudentById(String id) async {
    return _client.get<Map<String, dynamic>>(
      ApiConfig.studentDetail(id),
      fromJson: (json) => json as Map<String, dynamic>,
    );
  }
}
