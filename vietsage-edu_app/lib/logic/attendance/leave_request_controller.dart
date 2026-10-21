import 'package:flutter/material.dart';
import '../../core/network/services/api_services.dart';
import '../auth/account_manager.dart';

class LeaveRequestController extends ChangeNotifier {
  final TextEditingController reasonController = TextEditingController();
  final TextEditingController phoneController = TextEditingController();
  
  DateTime _startDate = DateTime.now();
  DateTime _endDate = DateTime.now();
  bool _isLoading = false;

  LeaveRequestController() {
    phoneController.text = AccountManager().currentAccount.phone;
  }

  DateTime get startDate => _startDate;
  DateTime get endDate => _endDate;
  bool get isLoading => _isLoading;

  void setStartDate(DateTime date) {
    _startDate = date;
    if (_endDate.isBefore(_startDate)) {
      _endDate = _startDate;
    }
    notifyListeners();
  }

  void setEndDate(DateTime date) {
    _endDate = date;
    notifyListeners();
  }

  void submitLeaveRequest(BuildContext context) async {
    final reason = reasonController.text.trim();
    final phone = phoneController.text.trim();

    if (reason.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Vui lòng nhập lý do xin nghỉ học!'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    _isLoading = true;
    notifyListeners();

    try {
      final currentAcc = AccountManager().currentAccount;
      final startFormatted = '${_startDate.year}-${_startDate.month.toString().padLeft(2, '0')}-${_startDate.day.toString().padLeft(2, '0')}';
      final endFormatted = '${_endDate.year}-${_endDate.month.toString().padLeft(2, '0')}-${_endDate.day.toString().padLeft(2, '0')}';

      final response = await ApiServices.leaveRequest.createLeaveRequest(
        startDate: startFormatted,
        endDate: endFormatted,
        reason: reason,
        phone: phone.isNotEmpty ? phone : currentAcc.phone,
        studentId: currentAcc.studentCode,
        studentName: currentAcc.name,
        className: currentAcc.studentClass,
      );

      _isLoading = false;
      notifyListeners();

      if (!context.mounted) return;

      if (response.success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Đơn xin phép nghỉ đã được gửi tới Giáo viên chủ nhiệm thành công!'),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.pop(context);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(response.message ?? 'Không thể gửi đơn xin phép nghỉ'),
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
            content: Text('Lỗi kết nối khi gửi đơn: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  void dispose() {
    reasonController.dispose();
    phoneController.dispose();
    super.dispose();
  }
}
