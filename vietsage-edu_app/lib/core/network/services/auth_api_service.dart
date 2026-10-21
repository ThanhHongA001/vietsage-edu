import '../api_client.dart';
import '../api_config.dart';
import '../api_response.dart';
import '../models/api_models.dart';

/// Dịch vụ kết nối API Xác thực & Tài khoản
class AuthApiService {
  final ApiClient _client = ApiClient.instance;

  /// Đăng nhập linh hoạt qua Số điện thoại, Email hoặc Tên đăng nhập
  Future<ApiResponse<AuthData>> login({
    String? phone,
    String? email,
    String? username,
    required String password,
  }) async {
    final Map<String, dynamic> body = {
      'password': password,
      'clientPlatform': 'app',
    };
    if (phone != null && phone.isNotEmpty) {
      body['phone'] = phone;
      body['identifier'] = phone;
    } else if (email != null && email.isNotEmpty) {
      body['email'] = email;
      body['identifier'] = email;
    } else if (username != null && username.isNotEmpty) {
      body['username'] = username;
      body['identifier'] = username;
    }

    final response = await _client.post<AuthData>(
      ApiConfig.authLogin,
      body: body,
      fromJson: (json) => AuthData.fromJson(json as Map<String, dynamic>),
    );

    if (response.success && response.data != null) {
      await _client.setSession(
        accessToken: response.data!.accessToken,
        refreshToken: response.data!.refreshToken,
      );
    }
    return response;
  }

  /// Yêu cầu gửi mã OTP để đặt lại mật khẩu
  Future<ApiResponse<Map<String, dynamic>>> forgotPassword(String contact) async {
    return _client.post<Map<String, dynamic>>(
      ApiConfig.authForgotPassword,
      body: {'contact': contact},
      fromJson: (json) => json as Map<String, dynamic>,
    );
  }

  /// Xác thực mã OTP
  Future<ApiResponse<Map<String, dynamic>>> verifyOtp(String otp, String? contact) async {
    return _client.post<Map<String, dynamic>>(
      ApiConfig.authVerifyOtp,
      body: {'otp': otp, 'contact': contact},
      fromJson: (json) => json as Map<String, dynamic>,
    );
  }

  /// Đặt lại mật khẩu mới
  Future<ApiResponse<dynamic>> resetPassword({
    required String newPassword,
    String? confirmPassword,
    String? contact,
  }) async {
    return _client.post(
      ApiConfig.authResetPassword,
      body: {
        'newPassword': newPassword,
        'confirmPassword': confirmPassword ?? newPassword,
        'contact': contact,
      },
    );
  }

  /// Đăng xuất và dọn dẹp token
  Future<void> logout() async {
    try {
      final refresh = _client.refreshToken;
      if (refresh != null) {
        await _client.post(ApiConfig.authLogout, body: {'refreshToken': refresh});
      }
    } catch (_) {}
    await _client.clearSession();
  }
}
