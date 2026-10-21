import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../constants/sp_keys.dart';
import 'api_config.dart';
import 'api_response.dart';

/// HTTP Client trung tâm quản lý toàn bộ kết nối, xác thực token, auto-refresh và xử lý lỗi.
class ApiClient {
  static final ApiClient _instance = ApiClient._internal();
  factory ApiClient() => _instance;
  static ApiClient get instance => _instance;

  ApiClient._internal() {
    _client = http.Client();
    _loadTokensFromStorage();
  }

  late http.Client _client;

  String? _accessToken;
  String? _refreshToken;
  bool _isRefreshing = false;

  String? get accessToken => _accessToken;
  String? get refreshToken => _refreshToken;
  bool get isAuthenticated => _accessToken != null && _accessToken!.isNotEmpty;

  /// Nạp token từ bộ nhớ SharedPreferences khi khởi động
  Future<void> _loadTokensFromStorage() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      _accessToken = prefs.getString(SPKeys.spAuthToken);
      _refreshToken = prefs.getString('${SPKeys.spAuthToken}_refresh');
    } catch (e) {
      debugPrint('[ApiClient] Lỗi nạp token từ local storage: $e');
    }
  }

  /// Cập nhật phiên đăng nhập và lưu vào bộ nhớ cục bộ
  Future<void> setSession({
    required String accessToken,
    String? refreshToken,
  }) async {
    _accessToken = accessToken;
    if (refreshToken != null) {
      _refreshToken = refreshToken;
    }
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(SPKeys.spAuthToken, accessToken);
      if (refreshToken != null) {
        await prefs.setString('${SPKeys.spAuthToken}_refresh', refreshToken);
      }
    } catch (e) {
      debugPrint('[ApiClient] Lỗi lưu token: $e');
    }
  }

  /// Xóa phiên đăng nhập (đăng xuất)
  Future<void> clearSession() async {
    _accessToken = null;
    _refreshToken = null;
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(SPKeys.spAuthToken);
      await prefs.remove('${SPKeys.spAuthToken}_refresh');
    } catch (e) {
      debugPrint('[ApiClient] Lỗi xóa session: $e');
    }
  }

  /// Tạo headers mặc định
  Map<String, String> _buildHeaders({Map<String, String>? extraHeaders}) {
    final headers = <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
      'Accept': 'application/json',
      'x-client-platform': 'app',
      'X-Tunnel-Skip-Anti-Phishing-Page': 'true',
    };

    if (_accessToken != null && _accessToken!.isNotEmpty) {
      headers['Authorization'] = 'Bearer $_accessToken';
    }

    if (extraHeaders != null) {
      headers.addAll(extraHeaders);
    }
    return headers;
  }

  // ==========================================
  // HTTP REQUEST METHODS
  // ==========================================

  /// GET Request
  Future<ApiResponse<T>> get<T>(
    String url, {
    Map<String, dynamic>? queryParameters,
    Map<String, String>? headers,
    T Function(dynamic json)? fromJson,
  }) async {
    final uri = _buildUri(url, queryParameters);
    return _sendWithRetry<T>(
      () => _client.get(uri, headers: _buildHeaders(extraHeaders: headers)),
      fromJson: fromJson,
    );
  }

  /// POST Request
  Future<ApiResponse<T>> post<T>(
    String url, {
    dynamic body,
    Map<String, dynamic>? queryParameters,
    Map<String, String>? headers,
    T Function(dynamic json)? fromJson,
  }) async {
    final uri = _buildUri(url, queryParameters);
    final encodedBody = body != null ? jsonEncode(body) : null;
    return _sendWithRetry<T>(
      () => _client.post(
        uri,
        headers: _buildHeaders(extraHeaders: headers),
        body: encodedBody,
      ),
      fromJson: fromJson,
    );
  }

  /// PATCH Request
  Future<ApiResponse<T>> patch<T>(
    String url, {
    dynamic body,
    Map<String, dynamic>? queryParameters,
    Map<String, String>? headers,
    T Function(dynamic json)? fromJson,
  }) async {
    final uri = _buildUri(url, queryParameters);
    final encodedBody = body != null ? jsonEncode(body) : null;
    return _sendWithRetry<T>(
      () => _client.patch(
        uri,
        headers: _buildHeaders(extraHeaders: headers),
        body: encodedBody,
      ),
      fromJson: fromJson,
    );
  }

  /// PUT Request
  Future<ApiResponse<T>> put<T>(
    String url, {
    dynamic body,
    Map<String, dynamic>? queryParameters,
    Map<String, String>? headers,
    T Function(dynamic json)? fromJson,
  }) async {
    final uri = _buildUri(url, queryParameters);
    final encodedBody = body != null ? jsonEncode(body) : null;
    return _sendWithRetry<T>(
      () => _client.put(
        uri,
        headers: _buildHeaders(extraHeaders: headers),
        body: encodedBody,
      ),
      fromJson: fromJson,
    );
  }

  /// DELETE Request
  Future<ApiResponse<T>> delete<T>(
    String url, {
    Map<String, dynamic>? queryParameters,
    Map<String, String>? headers,
    T Function(dynamic json)? fromJson,
  }) async {
    final uri = _buildUri(url, queryParameters);
    return _sendWithRetry<T>(
      () => _client.delete(uri, headers: _buildHeaders(extraHeaders: headers)),
      fromJson: fromJson,
    );
  }

  // ==========================================
  // HELPER METHODS & AUTO REFRESH LOGIC
  // ==========================================

  Uri _buildUri(String url, Map<String, dynamic>? queryParameters) {
    final parsedUri = Uri.parse(url);
    if (queryParameters == null || queryParameters.isEmpty) {
      return parsedUri;
    }
    final cleanParams = <String, String>{};
    queryParameters.forEach((key, value) {
      if (value != null) {
        cleanParams[key] = value.toString();
      }
    });
    return parsedUri.replace(
      queryParameters: {...parsedUri.queryParameters, ...cleanParams},
    );
  }

  /// Thực thi request và tự động refresh token nếu gặp 401 Unauthorized
  Future<ApiResponse<T>> _sendWithRetry<T>(
    Future<http.Response> Function() requestFunc, {
    T Function(dynamic json)? fromJson,
  }) async {
    try {
      http.Response response = await requestFunc().timeout(ApiConfig.requestTimeout);

      // Nếu gặp mã 401 và có refreshToken -> Thử làm mới token và chạy lại 1 lần
      if (response.statusCode == 401 && _refreshToken != null && !_isRefreshing) {
        final refreshSuccess = await _tryRefreshToken();
        if (refreshSuccess) {
          response = await requestFunc().timeout(ApiConfig.requestTimeout);
        }
      }

      return _handleResponse<T>(response, fromJson);
    } on SocketException {
      return ApiResponse<T>.failure(
        'Không thể kết nối đến máy chủ Vietsage Edu. Vui lòng kiểm tra mạng hoặc dịch vụ backend.',
        error: 'CONNECTION_ERROR',
      );
    } on TimeoutException {
      return ApiResponse<T>.failure(
        'Yêu cầu mạng quá thời gian chờ (Timeout). Vui lòng thử lại.',
        error: 'TIMEOUT_ERROR',
      );
    } on FormatException catch (e) {
      return ApiResponse<T>.failure(
        'Lỗi định dạng dữ liệu phản hồi từ máy chủ: ${e.message}',
        error: 'FORMAT_ERROR',
      );
    } catch (e) {
      return ApiResponse<T>.failure(
        'Đã xảy ra lỗi không xác định: $e',
        error: 'UNKNOWN_ERROR',
      );
    }
  }

  /// Xử lý HTTP response chuẩn hóa
  ApiResponse<T> _handleResponse<T>(
    http.Response response,
    T Function(dynamic json)? fromJson,
  ) {
    final int statusCode = response.statusCode;
    final String responseBody = utf8.decode(response.bodyBytes);

    dynamic decodedJson;
    try {
      decodedJson = responseBody.isNotEmpty ? jsonDecode(responseBody) : {};
    } catch (_) {
      decodedJson = {'message': responseBody};
    }

    if (statusCode >= 200 && statusCode < 300) {
      if (decodedJson is Map<String, dynamic>) {
        return ApiResponse<T>.fromJson(decodedJson, fromJson);
      } else {
        final T? data = fromJson != null ? fromJson(decodedJson) : (decodedJson as T?);
        return ApiResponse<T>.success(data as T, statusCode: statusCode);
      }
    } else {
      String errorMessage = 'Yêu cầu thất bại (Mã lỗi: $statusCode)';
      String? errorType;
      if (decodedJson is Map<String, dynamic>) {
        if (decodedJson['message'] != null) {
          final msg = decodedJson['message'];
          errorMessage = msg is List ? msg.join(', ') : msg.toString();
        }
        errorType = decodedJson['error']?.toString();
      }
      return ApiResponse<T>.failure(
        errorMessage,
        statusCode: statusCode,
        error: errorType,
      );
    }
  }

  /// Cố gắng xoay vòng Token qua endpoint /auth/refresh
  Future<bool> _tryRefreshToken() async {
    if (_refreshToken == null || _isRefreshing) return false;
    _isRefreshing = true;

    try {
      final refreshUri = Uri.parse(ApiConfig.authRefresh);
      final response = await _client.post(
        refreshUri,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'refreshToken': _refreshToken}),
      ).timeout(const Duration(seconds: 5));

      if (response.statusCode == 200) {
        final data = jsonDecode(utf8.decode(response.bodyBytes));
        if (data['success'] == true && data['data'] != null) {
          final newAccess = data['data']['accessToken'] as String?;
          final newRefresh = data['data']['refreshToken'] as String?;
          if (newAccess != null) {
            await setSession(accessToken: newAccess, refreshToken: newRefresh);
            _isRefreshing = false;
            return true;
          }
        }
      }
    } catch (e) {
      debugPrint('[ApiClient] Refresh token thất bại: $e');
    }

    _isRefreshing = false;
    return false;
  }
}
