import 'package:flutter/material.dart';
import '../../core/network/services/api_services.dart';
import '../auth/account_manager.dart';
import '../navigation/navigation_service.dart';

class LoginController extends ChangeNotifier {
  final TextEditingController phoneController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  TextEditingController get usernameController => phoneController;
  
  bool _obscurePassword = true;
  bool _isLoading = false;
  String? _errorMessage;

  bool get obscurePassword => _obscurePassword;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  void togglePasswordVisibility() {
    _obscurePassword = !_obscurePassword;
    notifyListeners();
  }

  void login(BuildContext context) async {
    final input = phoneController.text.trim();
    final password = passwordController.text.trim();

    if (input.isEmpty || password.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final isEmail = input.contains('@');
      final isDigitsOnly = RegExp(r'^[0-9+]+$').hasMatch(input);
      final response = await ApiServices.auth.login(
        phone: isDigitsOnly ? input : null,
        email: isEmail ? input : null,
        username: (!isEmail && !isDigitsOnly) ? input : null,
        password: password,
      );

      _isLoading = false;
      notifyListeners();

      if (!context.mounted) return;

      if (response.success && response.data != null) {
        final user = response.data!.user;
        final normalizedRole = user.role.toUpperCase();

        if (normalizedRole != 'PARENT') {
          await ApiServices.auth.logout();
          _errorMessage =
              'Tài khoản "${user.fullName}" là ${normalizedRole == 'ADMIN' ? 'Quản Trị Viên' : 'Giáo Viên'}. Vui lòng đăng nhập trên hệ thống Web của trường.';
          notifyListeners();

          if (context.mounted) {
            showDialog(
              context: context,
              builder: (ctx) => AlertDialog(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                title: const Row(
                  children: [
                    Icon(Icons.warning_amber_rounded, color: Colors.orange, size: 28),
                    SizedBox(width: 8),
                    Text('Từ Chối Truy Cập', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  ],
                ),
                content: Text(
                  'Tài khoản này có vai trò là ${normalizedRole == 'ADMIN' ? 'Quản Trị Viên' : 'Giáo Viên'}.\n\nTheo quy định của VietSage Edu:\n• Ứng dụng di động CHỈ DÀNH CHO PHỤ HUYNH HỌC SINH.\n• Quản trị viên và Giáo viên vui lòng đăng nhập trên Cổng Thông Tin Web.',
                  style: const TextStyle(fontSize: 14, height: 1.4),
                ),
                actions: [
                  TextButton(
                    onPressed: () => Navigator.of(ctx).pop(),
                    child: const Text('Đã hiểu', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            );
          }
          return;
        }

        // Đồng bộ dữ liệu người dùng vào AccountManager
        AccountManager().syncLoggedInUser(user);

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Đăng nhập thành công! Chào mừng ${user.fullName}'),
            backgroundColor: Colors.green,
          ),
        );
        NavigationService.goToHome();
      } else {
        _errorMessage = response.message ?? 'Đăng nhập không thành công';
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(_errorMessage!),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (e) {
      _isLoading = false;
      _errorMessage = 'Lỗi kết nối máy chủ: $e';
      notifyListeners();
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(_errorMessage!),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  void goToForgotPassword() {
    NavigationService.goToForgotPassword();
  }

  @override
  void dispose() {
    phoneController.dispose();
    passwordController.dispose();
    super.dispose();
  }
}
