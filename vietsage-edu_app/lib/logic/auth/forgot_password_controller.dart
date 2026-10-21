import 'package:flutter/material.dart';
import '../../core/network/services/api_services.dart';
import '../navigation/navigation_service.dart';

class ForgotPasswordController extends ChangeNotifier {
  final TextEditingController contactController = TextEditingController();
  bool _isLoading = false;

  bool get isLoading => _isLoading;

  void sendOtp(BuildContext context) async {
    final contact = contactController.text.trim();
    if (contact.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Vui lòng nhập số điện thoại hoặc email!'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    _isLoading = true;
    notifyListeners();

    try {
      final response = await ApiServices.auth.forgotPassword(contact);
      _isLoading = false;
      notifyListeners();

      if (!context.mounted) return;

      if (response.success) {
        final otp = response.data?['otp']?.toString() ?? '123456';
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Mã OTP đã được gửi! (Mã thử nghiệm: $otp)'),
            backgroundColor: Colors.green,
            duration: const Duration(seconds: 4),
          ),
        );
        NavigationService.goToOtp();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(response.message ?? 'Không thể gửi mã OTP'),
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

  void backToLogin() {
    NavigationService.goBack();
  }

  @override
  void dispose() {
    contactController.dispose();
    super.dispose();
  }
}
