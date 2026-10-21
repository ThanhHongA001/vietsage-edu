/// Standard response wrapper for all Vietsage Edu API calls.
class ApiResponse<T> {
  final bool success;
  final T? data;
  final String? message;
  final int? statusCode;
  final String? error;

  const ApiResponse({
    required this.success,
    this.data,
    this.message,
    this.statusCode,
    this.error,
  });

  factory ApiResponse.success(T data, {String? message, int statusCode = 200}) {
    return ApiResponse(
      success: true,
      data: data,
      message: message,
      statusCode: statusCode,
    );
  }

  factory ApiResponse.failure(String message, {int? statusCode, String? error}) {
    return ApiResponse(
      success: false,
      message: message,
      statusCode: statusCode,
      error: error,
    );
  }

  factory ApiResponse.fromJson(
    Map<String, dynamic> json,
    T Function(dynamic json)? fromJsonT,
  ) {
    final bool success = json['success'] == true;
    final dynamic rawData = json['data'];
    final T? parsedData = (success && rawData != null && fromJsonT != null)
        ? fromJsonT(rawData)
        : (rawData as T?);

    return ApiResponse(
      success: success,
      data: parsedData,
      message: json['message'] as String?,
      statusCode: json['statusCode'] as int?,
      error: json['error'] as String?,
    );
  }

  @override
  String toString() =>
      'ApiResponse(success: $success, data: $data, message: $message, error: $error)';
}

/// Custom Exception cho các lỗi mạng, xác thực, HTTP lỗi của Vietsage Edu API.
class ApiException implements Exception {
  final String message;
  final int? statusCode;
  final String? error;

  ApiException(this.message, {this.statusCode, this.error});

  @override
  String toString() => message;
}
