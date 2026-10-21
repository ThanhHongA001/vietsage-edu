import '../api_client.dart';
import '../api_config.dart';
import '../api_response.dart';
import '../models/api_models.dart';

/// Dịch vụ kết nối API Đơn xin nghỉ phép
class LeaveRequestApiService {
  final ApiClient _client = ApiClient.instance;

  /// Lấy danh sách đơn xin nghỉ phép
  Future<ApiResponse<List<LeaveRequestItem>>> getLeaveRequests({
    String? className,
    String? status,
    String? studentId,
  }) async {
    return _client.get<List<LeaveRequestItem>>(
      ApiConfig.leaveRequests,
      queryParameters: {
        'className': className,
        'status': status,
        'studentId': studentId,
      },
      fromJson: (json) => (json as List<dynamic>)
          .map((e) => LeaveRequestItem.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }

  /// Gửi đơn xin nghỉ phép mới từ Phụ huynh / Học sinh
  Future<ApiResponse<LeaveRequestItem>> createLeaveRequest({
    required String startDate,
    required String endDate,
    required String reason,
    required String phone,
    String? studentId,
    String? studentName,
    String? className,
  }) async {
    return _client.post<LeaveRequestItem>(
      ApiConfig.leaveRequests,
      body: {
        'startDate': startDate,
        'endDate': endDate,
        'reason': reason,
        'phone': phone,
        'studentId': studentId,
        'studentName': studentName,
        'className': className,
      },
      fromJson: (json) => LeaveRequestItem.fromJson(json as Map<String, dynamic>),
    );
  }

  /// Cập nhật trạng thái đơn nghỉ phép (APPROVED / REJECTED)
  Future<ApiResponse<LeaveRequestItem>> updateStatus({
    required String id,
    required String status,
    String? reviewNote,
  }) async {
    return _client.patch<LeaveRequestItem>(
      ApiConfig.leaveRequestStatus(id),
      body: {
        'status': status,
        'reviewNote': reviewNote,
      },
      fromJson: (json) => LeaveRequestItem.fromJson(json as Map<String, dynamic>),
    );
  }
}
