import 'package:flutter/material.dart';
import '../../../logic/settings/appearance_language_controller.dart';
import '../../theme/app_theme.dart';

class AppearanceLanguageScreen extends StatefulWidget {
  const AppearanceLanguageScreen({super.key});

  @override
  State<AppearanceLanguageScreen> createState() => _AppearanceLanguageScreenState();
}

class _AppearanceLanguageScreenState extends State<AppearanceLanguageScreen> {
  final AppearanceLanguageController _controller = AppearanceLanguageController();

  void _onThemeChanged(String theme) {
    if (_controller.selectedTheme == theme) return;
    _controller.setTheme(theme);

    final msg = theme == 'Tối'
        ? _controller.tr(vi: '🌙 Đã chuyển sang Chế độ Tối (Dark Mode)', en: '🌙 Switched to Dark Mode')
        : theme == 'Sáng'
            ? _controller.tr(vi: '☀️ Đã chuyển sang Chế độ Sáng (Light Mode)', en: '☀️ Switched to Light Mode')
            : _controller.tr(vi: '⚙️ Đã đồng bộ giao diện theo cài đặt hệ thống', en: '⚙️ Theme synced with System settings');

    ScaffoldMessenger.of(context).clearSnackBars();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(msg),
        backgroundColor: AppTheme.primary,
        duration: const Duration(seconds: 2),
      ),
    );
  }

  void _onLanguageChanged(String lang) {
    if (_controller.selectedLanguage == lang) return;
    _controller.setLanguage(lang);

    final msg = lang == 'English'
        ? '🌐 Language switched to English'
        : '🌐 Đã chuyển ngôn ngữ sang Tiếng Việt';

    ScaffoldMessenger.of(context).clearSnackBars();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(msg),
        backgroundColor: AppTheme.success,
        duration: const Duration(seconds: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: _controller,
      builder: (context, _) {
        final tr = _controller.tr;

        return Scaffold(
          appBar: AppBar(
            title: Text(tr(vi: 'Giao Diện & Ngôn Ngữ', en: 'Appearance & Language')),
          ),
          body: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 8),
                child: Text(
                  tr(vi: 'Chế Độ Giao Diện', en: 'Theme Mode'),
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                ),
              ),
              Card(
                child: Column(
                  children: [
                    _buildOption(
                      icon: Icons.light_mode_rounded,
                      iconColor: const Color(0xFFD97706),
                      title: tr(vi: 'Chế Độ Sáng (Light Mode)', en: 'Light Mode'),
                      subtitle: tr(vi: 'Giao diện nền sáng rõ nét tiêu chuẩn', en: 'Clear standard bright interface'),
                      isSelected: _controller.selectedTheme == 'Sáng',
                      onTap: () => _onThemeChanged('Sáng'),
                    ),
                    const Divider(height: 1),
                    _buildOption(
                      icon: Icons.dark_mode_rounded,
                      iconColor: const Color(0xFF6366F1),
                      title: tr(vi: 'Chế Độ Tối (Dark Mode)', en: 'Dark Mode'),
                      subtitle: tr(vi: 'Bảo vệ mắt và tiết kiệm pin khi sử dụng ban đêm', en: 'Protects eyes and saves battery at night'),
                      isSelected: _controller.selectedTheme == 'Tối',
                      onTap: () => _onThemeChanged('Tối'),
                    ),
                    const Divider(height: 1),
                    _buildOption(
                      icon: Icons.phone_android_rounded,
                      iconColor: AppTheme.primary,
                      title: tr(vi: 'Theo Cài Đặt Hệ Thống', en: 'System Default'),
                      subtitle: tr(vi: 'Tự động đồng bộ theo chế độ sáng/tối của điện thoại', en: 'Automatically syncs with phone settings'),
                      isSelected: _controller.selectedTheme == 'Hệ thống',
                      onTap: () => _onThemeChanged('Hệ thống'),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 8),
                child: Text(
                  tr(vi: 'Ngôn Ngữ Ứng Dụng', en: 'Application Language'),
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                ),
              ),
              Card(
                child: Column(
                  children: [
                    _buildOption(
                      icon: Icons.language_rounded,
                      iconColor: const Color(0xFFDC2626),
                      title: 'Tiếng Việt (Vietnamese)',
                      subtitle: tr(vi: 'Ngôn ngữ mặc định', en: 'Primary language'),
                      isSelected: _controller.selectedLanguage == 'Tiếng Việt',
                      onTap: () => _onLanguageChanged('Tiếng Việt'),
                    ),
                    const Divider(height: 1),
                    _buildOption(
                      icon: Icons.translate_rounded,
                      iconColor: const Color(0xFF2563EB),
                      title: 'English (Tiếng Anh)',
                      subtitle: tr(vi: 'Ngôn ngữ quốc tế', en: 'International language'),
                      isSelected: _controller.selectedLanguage == 'English',
                      onTap: () => _onLanguageChanged('English'),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildOption({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String subtitle,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: iconColor.withValues(alpha: 0.12),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(icon, color: iconColor, size: 22),
      ),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
      subtitle: Text(subtitle, style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary)),
      trailing: isSelected
          ? const Icon(Icons.check_circle_rounded, color: AppTheme.primary, size: 22)
          : const Icon(Icons.radio_button_unchecked_rounded, color: AppTheme.textSecondary, size: 22),
      onTap: onTap,
    );
  }
}
