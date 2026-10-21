import 'package:flutter/material.dart';
import '../../core/network/services/api_services.dart';
import '../navigation/navigation_service.dart';
import 'account_manager.dart';

class AuthFlowController {
  static final AuthFlowController _instance = AuthFlowController._internal();
  factory AuthFlowController() => _instance;
  AuthFlowController._internal();

  bool _isLoggedIn = false;

  bool get isLoggedIn => _isLoggedIn;
  String get currentUser => AccountManager().currentAccount.name;
  String get studentCode => AccountManager().currentAccount.studentCode;

  // Handle Login Flow
  void login({
    required BuildContext context,
    required String username,
    required String password,
  }) {
    if (username.trim().isEmpty || password.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    _isLoggedIn = true;
    NavigationService.goToHome();
  }

  // Handle Logout Flow
  void logout(BuildContext context) {
    _isLoggedIn = false;
    ApiServices.auth.logout();
    NavigationService.goToLogin();
  }

  // Handle Forgot Password Flow
  void requestForgotPassword({
    required BuildContext context,
    required String contact,
  }) {
    if (contact.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Vui lòng nhập số điện thoại hoặc email!'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    NavigationService.goToOtp();
  }

  // Handle Verify OTP Flow
  void verifyOtp({
    required BuildContext context,
    required String otp,
  }) {
    if (otp.length < 6) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Mã OTP phải đủ 6 chữ số!'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    NavigationService.goToResetPassword();
  }

  // Handle Reset Password Flow
  void completeResetPassword({
    required BuildContext context,
    required String newPassword,
    required String confirmPassword,
  }) {
    if (newPassword.length < 8) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Mật khẩu mới phải có tối thiểu 8 ký tự!'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    if (newPassword != confirmPassword) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Mật khẩu xác nhận không trùng khớp!'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Đặt lại mật khẩu thành công! Vui lòng đăng nhập.'),
        backgroundColor: Colors.green,
      ),
    );

    NavigationService.goToLogin();
  }
}
