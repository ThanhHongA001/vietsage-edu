import '../api_client.dart';
import '../api_config.dart';
import '../api_response.dart';
import '../models/api_models.dart';

/// Dịch vụ kết nối API Bài tập về nhà
class HomeworkApiService {
  final ApiClient _client = ApiClient.instance;

  /// Lấy danh sách bài tập được giao
  Future<ApiResponse<List<HomeworkItem>>> getHomeworkList({
    String? className,
    String? subject,
    String? studentId,
  }) async {
    return _client.get<List<HomeworkItem>>(
      ApiConfig.homework,
      queryParameters: {
        'className': className,
        'subject': subject,
        'studentId': studentId,
      },
      fromJson: (json) => (json as List<dynamic>)
          .map((e) => HomeworkItem.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }

  /// Lấy chi tiết một bài tập cụ thể
  Future<ApiResponse<HomeworkItem>> getHomeworkDetail(String id) async {
    return _client.get<HomeworkItem>(
      ApiConfig.homeworkDetail(id),
      fromJson: (json) => HomeworkItem.fromJson(json as Map<String, dynamic>),
    );
  }

  /// Học sinh nộp bài tập
  Future<ApiResponse<HomeworkSubmission>> submitHomework({
    required String homeworkId,
    String? studentId,
    String? studentName,
    String? studentCode,
    String? content,
    List<String>? fileUrls,
  }) async {
    return _client.post<HomeworkSubmission>(
      ApiConfig.homeworkSubmit(homeworkId),
      body: {
        'studentId': studentId,
        'studentName': studentName,
        'studentCode': studentCode,
        'content': content,
        'fileUrls': fileUrls ?? [],
      },
      fromJson: (json) => HomeworkSubmission.fromJson(json as Map<String, dynamic>),
    );
  }
}
