import 'package:flutter/material.dart';
import '../../../logic/attendance/leave_request_controller.dart';
import '../../../logic/auth/account_manager.dart';
import '../../theme/app_theme.dart';

class LeaveRequestScreen extends StatefulWidget {
  const LeaveRequestScreen({super.key});

  @override
  State<LeaveRequestScreen> createState() => _LeaveRequestScreenState();
}

class _LeaveRequestScreenState extends State<LeaveRequestScreen> {
  late final LeaveRequestController _controller;

  @override
  void initState() {
    super.initState();
    _controller = LeaveRequestController();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final currentAccount = AccountManager().currentAccount;

    return ListenableBuilder(
      listenable: _controller,
      builder: (context, _) {
        return Scaffold(
          appBar: AppBar(
            title: const Text('Gửi Đơn Xin Phép Nghỉ'),
          ),
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Card(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Row(
                      children: [
                        const CircleAvatar(
                          backgroundColor: AppTheme.primaryContainer,
                          child: Icon(Icons.assignment_late, color: AppTheme.primary),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Đơn Xin Nghỉ Học Trực Tuyến',
                                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                              ),
                              Text(
                                'Học sinh: ${currentAccount.name} • ${currentAccount.studentClass}',
                                style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const Divider(height: 24),
                    Text(
                      'Đơn xin phép sẽ được chuyển trực tiếp tới GVCN lớp ${currentAccount.studentClass} để duyệt và ghi nhận vào sổ điểm danh.',
                      style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary, height: 1.4),
                    ),
                    const SizedBox(height: 20),

                    // Date Picker Row
                    const Text(
                      'Thời Gian Xin Nghỉ',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton.icon(
                            icon: const Icon(Icons.calendar_today, size: 16),
                            label: Text('${_controller.startDate.day}/${_controller.startDate.month}/${_controller.startDate.year}'),
                            onPressed: () async {
                              final picked = await showDatePicker(
                                context: context,
                                initialDate: _controller.startDate,
                                firstDate: DateTime.now().subtract(const Duration(days: 7)),
                                lastDate: DateTime.now().add(const Duration(days: 30)),
                              );
                              if (picked != null) _controller.setStartDate(picked);
                            },
                          ),
                        ),
                        const Padding(
                          padding: EdgeInsets.symmetric(horizontal: 8),
                          child: Text('đến'),
                        ),
                        Expanded(
                          child: OutlinedButton.icon(
                            icon: const Icon(Icons.event, size: 16),
                            label: Text('${_controller.endDate.day}/${_controller.endDate.month}/${_controller.endDate.year}'),
                            onPressed: () async {
                              final picked = await showDatePicker(
                                context: context,
                                initialDate: _controller.endDate,
                                firstDate: _controller.startDate,
                                lastDate: DateTime.now().add(const Duration(days: 30)),
                              );
                              if (picked != null) _controller.setEndDate(picked);
                            },
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Reason input
                    TextField(
                      controller: _controller.reasonController,
                      maxLines: 3,
                      decoration: const InputDecoration(
                        labelText: 'Lý Do Xin Nghỉ',
                        hintText: 'Nhập chi tiết lý do (VD: Bị sốt xuất huyết cần điều trị, có việc gia đình...)',
                        alignLabelWithHint: true,
                        prefixIcon: Padding(
                          padding: EdgeInsets.only(bottom: 40),
                          child: Icon(Icons.edit_note, color: AppTheme.primary),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Phone input
                    TextField(
                      controller: _controller.phoneController,
                      keyboardType: TextInputType.phone,
                      decoration: const InputDecoration(
                        labelText: 'SĐT Phụ Huynh Xác Nhận',
                        hintText: 'Nhập số điện thoại liên hệ xác nhận',
                        prefixIcon: Icon(Icons.phone, color: AppTheme.primary),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Attach file button
                    OutlinedButton.icon(
                      onPressed: () {},
                      icon: const Icon(Icons.attach_file),
                      label: const Text('Đính Kèm Giấy Khám Bệnh / Minh Chứng (Tùy chọn)'),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Disclaimer
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppTheme.background,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: AppTheme.border),
                      ),
                      child: const Text(
                        'Cam đoan thông tin khai báo chính xác và nhắc học sinh tự chép bài đầy đủ sau khi đi học lại.',
                        style: TextStyle(fontSize: 12, color: AppTheme.textSecondary, fontStyle: FontStyle.italic),
                      ),
                    ),
                    const SizedBox(height: 24),

                    ElevatedButton.icon(
                      onPressed: _controller.isLoading ? null : () => _controller.submitLeaveRequest(context),
                      icon: _controller.isLoading
                          ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                          : const Icon(Icons.send_rounded),
                      label: const Text('Gửi Đơn Đến Giáo Viên Chủ Nhiệm'),
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}
