import 'package:flutter/material.dart';

class EventDetailController extends ChangeNotifier {
  bool _isRegistered = false;
  bool _isLoading = false;

  bool get isRegistered => _isRegistered;
  bool get isLoading => _isLoading;

  void registerEvent(BuildContext context) async {
    _isLoading = true;
    notifyListeners();

    await Future.delayed(const Duration(milliseconds: 300));
    _isLoading = false;
    _isRegistered = true;
    notifyListeners();

    if (!context.mounted) return;

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Đã gửi đơn đăng ký tham gia sự kiện thành công!'),
        backgroundColor: Colors.green,
      ),
    );
  }
}
