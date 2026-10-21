import 'package:flutter/material.dart';
import '../../core/network/services/api_services.dart';
import '../navigation/navigation_service.dart';

class OtpController extends ChangeNotifier {
  final List<TextEditingController> controllers = List.generate(6, (_) => TextEditingController());
  final List<FocusNode> focusNodes = List.generate(6, (_) => FocusNode());
  int _countdown = 59;
  bool _isLoading = false;

  int get countdown => _countdown;
  bool get isLoading => _isLoading;

  String get otpCode => controllers.map((c) => c.text).join();

  void onDigitChanged(int index, String value) {
    if (value.isNotEmpty && index < 5) {
      focusNodes[index + 1].requestFocus();
    }
    if (value.isEmpty && index > 0) {
      focusNodes[index - 1].requestFocus();
    }
    notifyListeners();
  }

  void resendCode(BuildContext context) async {
    _countdown = 59;
    notifyListeners();
    try {
      final response = await ApiServices.auth.forgotPassword('0988123456');
      if (context.mounted) {
        final otp = response.data?['otp']?.toString() ?? '123456';
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Đã gửi lại mã OTP! (Mã thử nghiệm: $otp)')),
        );
      }
    } catch (_) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Đã gửi lại mã OTP qua tin nhắn SMS!')),
        );
      }
    }
  }

  void verifyOtp(BuildContext context) async {
    if (otpCode.length < 6) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Mã OTP phải bao gồm đủ 6 chữ số!'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    _isLoading = true;
    notifyListeners();

    try {
      final response = await ApiServices.auth.verifyOtp(otpCode, null);
      _isLoading = false;
      notifyListeners();

      if (!context.mounted) return;

      if (response.success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Xác thực OTP thành công! Vui lòng đặt mật khẩu mới.'),
            backgroundColor: Colors.green,
          ),
        );
        NavigationService.goToResetPassword();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(response.message ?? 'Mã OTP không chính xác hoặc đã hết hạn'),
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
            content: Text('Lỗi xác thực: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  void dispose() {
    for (var c in controllers) {
      c.dispose();
    }
    for (var f in focusNodes) {
      f.dispose();
    }
    super.dispose();
  }
}
