import 'package:flutter/material.dart';
import '../../../logic/profile/student_profile_controller.dart';
import '../../theme/app_theme.dart';

class StudentProfileScreen extends StatefulWidget {
  const StudentProfileScreen({super.key});

  @override
  State<StudentProfileScreen> createState() => _StudentProfileScreenState();
}

class _StudentProfileScreenState extends State<StudentProfileScreen> {
  late final StudentProfileController _controller;

  @override
  void initState() {
    super.initState();
    _controller = StudentProfileController();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _openEditRequestBottomSheet() {
    final requestController = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (bottomSheetContext) {
        return Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(bottomSheetContext).viewInsets.bottom + 20,
            left: 20,
            right: 20,
            top: 24,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey.shade300,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Yêu Cầu Chỉnh Sửa Hồ Sơ',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
              ),
              const SizedBox(height: 8),
              const Text(
                'Nhập các thông tin cần điều chỉnh (VD: số điện thoại phụ huynh, địa chỉ thường trú, đính kèm giấy khai sinh...).',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 13, color: AppTheme.textSecondary),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: requestController,
                maxLines: 4,
                decoration: const InputDecoration(
                  labelText: 'Nội Dung Yêu Cầu Chỉnh Sửa',
                  alignLabelWithHint: true,
                  hintText: 'Nhập chi tiết thông tin bạn muốn cập nhật...',
                ),
              ),
              const SizedBox(height: 20),
              ElevatedButton.icon(
                onPressed: () => _controller.submitEditRequest(bottomSheetContext, requestController.text),
                icon: const Icon(Icons.send_rounded),
                label: const Text('Gửi Yêu Cầu Cho Nhà Trường'),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: _controller,
      builder: (context, _) {
        return Scaffold(
          appBar: AppBar(
            title: const Text('Hồ Sơ Học Sinh'),
          ),
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                // Student Card Header matching Canvas Frame 9
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      children: [
                        CircleAvatar(
                          radius: 46,
                          backgroundColor: _controller.avatarColor.withValues(alpha: 0.15),
                          child: Icon(Icons.person, size: 54, color: _controller.avatarColor),
                        ),
                        const SizedBox(height: 14),
                        Text(
                          _controller.studentName,
                          style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Mã Học Sinh: ${_controller.studentCode} • ${_controller.className}',
                          style: const TextStyle(fontSize: 14, color: AppTheme.primary, fontWeight: FontWeight.w600),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          _controller.schoolName,
                          textAlign: TextAlign.center,
                          style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 16),

                // Detailed Information List from Controller
                Card(
                  child: Column(
                    children: [
                      for (int i = 0; i < _controller.profileDetails.length; i++) ...[
                        if (i > 0) const Divider(height: 1),
                        _buildProfileTile(
                          _controller.profileDetails[i]['icon'] as IconData,
                          _controller.profileDetails[i]['title'] as String,
                          _controller.profileDetails[i]['value'] as String,
                        ),
                      ],
                    ],
                  ),
                ),

                const SizedBox(height: 24),
                // Edit Request Button matching Canvas Frame 23
                ElevatedButton.icon(
                  onPressed: _openEditRequestBottomSheet,
                  icon: const Icon(Icons.edit_note_rounded),
                  label: const Text('Yêu Cầu Chỉnh Sửa Hồ Sơ'),
                  style: ElevatedButton.styleFrom(
                    minimumSize: const Size.fromHeight(50),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildProfileTile(IconData icon, String title, String value) {
    return ListTile(
      leading: CircleAvatar(
        radius: 18,
        backgroundColor: AppTheme.primaryContainer,
        child: Icon(icon, size: 18, color: AppTheme.primary),
      ),
      title: Text(title, style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary)),
      subtitle: Text(value, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppTheme.textPrimary)),
    );
  }
}
