import 'package:flutter/material.dart';
import '../auth/account_manager.dart';

class StudentProfileController extends ChangeNotifier {
  final AccountManager _accountManager = AccountManager();

  StudentProfileController() {
    _accountManager.addListener(_onAccountChanged);
  }

  void _onAccountChanged() {
    notifyListeners();
  }

  @override
  void dispose() {
    _accountManager.removeListener(_onAccountChanged);
    super.dispose();
  }

  // Getters phản hồi động theo tài khoản đang kích hoạt
  String get studentName => _accountManager.currentAccount.name;
  String get studentCode => _accountManager.currentAccount.studentCode;
  String get className => _accountManager.currentAccount.studentClass;
  String get schoolName => '${_accountManager.currentAccount.school} • Niên khóa 2026-2029';
  Color get avatarColor => _accountManager.currentAccount.color;

  List<Map<String, dynamic>> get profileDetails => [
    {
      'icon': Icons.cake_rounded,
      'title': 'Ngày Sinh',
      'value': _accountManager.currentAccount.birthDate,
    },
    {
      'icon': Icons.wc_rounded,
      'title': 'Giới Tính & Dân Tộc',
      'value': _accountManager.currentAccount.gender,
    },
    {
      'icon': Icons.place_rounded,
      'title': 'Nơi Sinh',
      'value': _accountManager.currentAccount.placeOfBirth,
    },
    {
      'icon': Icons.supervisor_account_rounded,
      'title': 'Phụ Huynh / Người Giám Hộ',
      'value': _accountManager.currentAccount.parentInfo,
    },
    {
      'icon': Icons.home_rounded,
      'title': 'Địa Chỉ Thường Trú',
      'value': _accountManager.currentAccount.address,
    },
  ];

  void submitEditRequest(BuildContext context, String content) {
    if (content.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Vui lòng nhập nội dung cần chỉnh sửa!'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    Navigator.pop(context);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Yêu cầu chỉnh sửa hồ sơ đã được gửi đến Ban Giám Hiệu!'),
        backgroundColor: Colors.green,
      ),
    );
  }
}
