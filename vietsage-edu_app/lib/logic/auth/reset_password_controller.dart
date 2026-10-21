import 'package:flutter/material.dart';
import '../../core/network/services/api_services.dart';
import '../navigation/navigation_service.dart';

class ResetPasswordController extends ChangeNotifier {
  final TextEditingController newPasswordController = TextEditingController();
  final TextEditingController confirmPasswordController = TextEditingController();

  bool _obscureNewPass = true;
  bool _obscureConfirmPass = true;
  bool _isLoading = false;

  bool get obscureNewPass => _obscureNewPass;
  bool get obscureConfirmPass => _obscureConfirmPass;
  bool get isLoading => _isLoading;

  void toggleNewPassVisibility() {
    _obscureNewPass = !_obscureNewPass;
    notifyListeners();
  }

  void toggleConfirmPassVisibility() {
    _obscureConfirmPass = !_obscureConfirmPass;
    notifyListeners();
  }

  void resetPassword(BuildContext context) async {
    final newPass = newPasswordController.text;
    final confirmPass = confirmPasswordController.text;

    if (newPass.length < 8) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Mật khẩu mới phải có tối thiểu 8 ký tự!'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    if (newPass != confirmPass) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Mật khẩu xác nhận không trùng khớp!'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    _isLoading = true;
    notifyListeners();

    try {
      final response = await ApiServices.auth.resetPassword(
        newPassword: newPass,
        confirmPassword: confirmPass,
      );
      _isLoading = false;
      notifyListeners();

      if (!context.mounted) return;

      if (response.success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Đổi mật khẩu thành công! Vui lòng đăng nhập.'),
            backgroundColor: Colors.green,
          ),
        );
        NavigationService.goToLogin();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(response.message ?? 'Đổi mật khẩu không thành công'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Lỗi kết nối: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  void dispose() {
    newPasswordController.dispose();
    confirmPasswordController.dispose();
    super.dispose();
  }
}
