import 'package:flutter/material.dart';
import '../../../logic/auth/reset_password_controller.dart';
import '../../theme/app_theme.dart';

class ResetPasswordScreen extends StatefulWidget {
  const ResetPasswordScreen({super.key});

  @override
  State<ResetPasswordScreen> createState() => _ResetPasswordScreenState();
}

class _ResetPasswordScreenState extends State<ResetPasswordScreen> {
  late final ResetPasswordController _controller;

  @override
  void initState() {
    super.initState();
    _controller = ResetPasswordController();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: _controller,
      builder: (context, _) {
        return Scaffold(
          appBar: AppBar(
            title: const Text('Đặt Lại Mật Khẩu'),
          ),
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Card(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const Icon(
                      Icons.password_rounded,
                      size: 64,
                      color: AppTheme.primary,
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'Tạo Mật Khẩu Mới',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Mật khẩu tối thiểu 8 ký tự, bao gồm chữ cái và chữ số.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 14,
                        color: AppTheme.textSecondary,
                      ),
                    ),
                    const SizedBox(height: 28),
                    TextField(
                      controller: _controller.newPasswordController,
                      obscureText: _controller.obscureNewPass,
                      decoration: InputDecoration(
                        labelText: 'Mật Khẩu Mới',
                        prefixIcon: const Icon(Icons.lock_outline, color: AppTheme.primary),
                        suffixIcon: IconButton(
                          icon: Icon(_controller.obscureNewPass ? Icons.visibility_off : Icons.visibility),
                          onPressed: _controller.toggleNewPassVisibility,
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: _controller.confirmPasswordController,
                      obscureText: _controller.obscureConfirmPass,
                      decoration: InputDecoration(
                        labelText: 'Xác Nhận Mật Khẩu',
                        prefixIcon: const Icon(Icons.lock_reset, color: AppTheme.primary),
                        suffixIcon: IconButton(
                          icon: Icon(_controller.obscureConfirmPass ? Icons.visibility_off : Icons.visibility),
                          onPressed: _controller.toggleConfirmPassVisibility,
                        ),
                      ),
                    ),
                    const SizedBox(height: 28),
                    ElevatedButton.icon(
                      onPressed: _controller.isLoading ? null : () => _controller.resetPassword(context),
                      icon: _controller.isLoading
                          ? const SizedBox(
                              width: 16,
                              height: 16,
                              child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                            )
                          : const Icon(Icons.done_all, size: 20),
                      label: const Text('Đổi Mật Khẩu & Đăng Nhập'),
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
