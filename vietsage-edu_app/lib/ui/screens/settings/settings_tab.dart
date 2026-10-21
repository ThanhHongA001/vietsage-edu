import 'package:flutter/material.dart';
import '../../../logic/auth/account_manager.dart';
import '../../../logic/settings/appearance_language_controller.dart';
import '../../../logic/settings/settings_controller.dart';
import '../../theme/app_theme.dart';

class SettingsTab extends StatefulWidget {
  const SettingsTab({super.key});

  @override
  State<SettingsTab> createState() => _SettingsTabState();
}

class _SettingsTabState extends State<SettingsTab> {
  late final SettingsController _controller;
  final AccountManager _accountManager = AccountManager();
  final AppearanceLanguageController _appSettings = AppearanceLanguageController();

  @override
  void initState() {
    super.initState();
    _controller = SettingsController();
    _accountManager.addListener(_onAccountsUpdated);
    _appSettings.addListener(_onAccountsUpdated);
  }

  @override
  void dispose() {
    _appSettings.removeListener(_onAccountsUpdated);
    _accountManager.removeListener(_onAccountsUpdated);
    _controller.dispose();
    super.dispose();
  }

  void _onAccountsUpdated() {
    if (mounted) setState(() {});
  }

  void _showAccountSwitcherBottomSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (sheetContext) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            final accounts = _accountManager.accounts;

            return SafeArea(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Handle bar
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

                    // Header
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: const [
                            Icon(Icons.switch_account_rounded, color: AppTheme.primary, size: 24),
                            SizedBox(width: 10),
                            Text(
                              'Đổi Tài Khoản',
                              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                        IconButton(
                          icon: const Icon(Icons.close, color: AppTheme.textSecondary),
                          onPressed: () => Navigator.pop(sheetContext),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Danh sách các tài khoản đã, đang và từng đăng nhập trên thiết bị:',
                      style: TextStyle(fontSize: 13, color: AppTheme.textSecondary),
                    ),
                    const SizedBox(height: 16),

                    // Accounts List
                    Flexible(
                      child: ListView.separated(
                        shrinkWrap: true,
                        itemCount: accounts.length,
                        separatorBuilder: (context, index) => const SizedBox(height: 10),
                        itemBuilder: (context, index) {
                          final acc = accounts[index];
                          final isCurrent = acc.isCurrent;

                          return Container(
                            decoration: BoxDecoration(
                              color: isCurrent ? AppTheme.primaryContainer.withValues(alpha: 0.35) : AppTheme.background,
                              borderRadius: BorderRadius.circular(14),
                              border: Border.all(
                                color: isCurrent ? AppTheme.primary : AppTheme.border,
                                width: isCurrent ? 1.5 : 1.0,
                              ),
                            ),
                            child: ListTile(
                              contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                              leading: CircleAvatar(
                                radius: 24,
                                backgroundColor: acc.color,
                                child: Text(
                                  acc.name.isNotEmpty ? acc.name.trim().split(' ').last[0] : 'U',
                                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                                ),
                              ),
                              title: Row(
                                children: [
                                  Flexible(
                                    child: Text(
                                      acc.name,
                                      style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 15,
                                        color: isCurrent ? AppTheme.primary : AppTheme.textPrimary,
                                      ),
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                  if (isCurrent) ...[
                                    const SizedBox(width: 8),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: AppTheme.success,
                                        borderRadius: BorderRadius.circular(10),
                                      ),
                                      child: const Text(
                                        'Đang dùng',
                                        style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600),
                                      ),
                                    ),
                                  ],
                                ],
                              ),
                              subtitle: Padding(
                                padding: const EdgeInsets.only(top: 4),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      '${acc.studentClass} • ${acc.school}',
                                      style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      'SĐT: ${acc.phone} • ${acc.lastLogin}',
                                      style: TextStyle(
                                        fontSize: 11,
                                        color: isCurrent ? AppTheme.primary : AppTheme.textSecondary,
                                        fontWeight: isCurrent ? FontWeight.w500 : FontWeight.normal,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              trailing: isCurrent
                                  ? const Icon(Icons.check_circle_rounded, color: AppTheme.success, size: 24)
                                  : Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        OutlinedButton(
                                          onPressed: () {
                                            _accountManager.switchAccount(acc.id);
                                            setSheetState(() {});
                                            Navigator.pop(sheetContext);
                                            ScaffoldMessenger.of(context).showSnackBar(
                                              SnackBar(
                                                content: Text('🎉 Đã chuyển sang tài khoản: ${acc.name}'),
                                                backgroundColor: AppTheme.success,
                                                duration: const Duration(seconds: 2),
                                              ),
                                            );
                                          },
                                          style: OutlinedButton.styleFrom(
                                            visualDensity: VisualDensity.compact,
                                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                            side: const BorderSide(color: AppTheme.primary),
                                          ),
                                          child: const Text('Chọn', style: TextStyle(fontSize: 12, color: AppTheme.primary)),
                                        ),
                                        IconButton(
                                          icon: const Icon(Icons.delete_outline_rounded, color: AppTheme.textSecondary, size: 20),
                                          onPressed: () => _confirmRemoveAccount(sheetContext, acc.id, acc.name, setSheetState),
                                        ),
                                      ],
                                    ),
                              onTap: isCurrent
                                  ? null
                                  : () {
                                      _accountManager.switchAccount(acc.id);
                                      setSheetState(() {});
                                      Navigator.pop(sheetContext);
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        SnackBar(
                                          content: Text('🎉 Đã chuyển sang tài khoản: ${acc.name}'),
                                          backgroundColor: AppTheme.success,
                                          duration: const Duration(seconds: 2),
                                        ),
                                      );
                                    },
                            ),
                          );
                        },
                      ),
                    ),

                    const SizedBox(height: 16),

                    // Add another account button
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        onPressed: () => _showAddAccountDialog(sheetContext, setSheetState),
                        icon: const Icon(Icons.person_add_alt_1_rounded, size: 20),
                        label: const Text('Đăng Nhập Tài Khoản Khác', style: TextStyle(fontWeight: FontWeight.bold)),
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  void _confirmRemoveAccount(BuildContext context, String id, String name, StateSetter setSheetState) {
    showDialog(
      context: context,
      builder: (dialogCtx) => AlertDialog(
        title: const Text('Xóa tài khoản khỏi máy?'),
        content: Text('Bạn có chắc muốn xóa thông tin lưu của tài khoản "$name" khỏi thiết bị này không?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogCtx),
            child: const Text('Hủy', style: TextStyle(color: AppTheme.textSecondary)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppTheme.danger),
            onPressed: () {
              Navigator.pop(dialogCtx);
              _accountManager.removeAccount(id);
              setSheetState(() {});
            },
            child: const Text('Xóa Khỏi Máy'),
          ),
        ],
      ),
    );
  }

  void _showAddAccountDialog(BuildContext sheetContext, StateSetter setSheetState) {
    final nameCtrl = TextEditingController();
    final phoneCtrl = TextEditingController();
    final classCtrl = TextEditingController();
    final schoolCtrl = TextEditingController();

    showDialog(
      context: sheetContext,
      builder: (dialogCtx) => AlertDialog(
        title: Row(
          children: const [
            Icon(Icons.person_add_alt_1_rounded, color: AppTheme.primary),
            SizedBox(width: 8),
            Text('Thêm Tài Khoản Mới', style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold)),
          ],
        ),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: nameCtrl,
                decoration: const InputDecoration(
                  labelText: 'Họ và tên học sinh',
                  hintText: 'Nhập họ và tên học sinh',
                  prefixIcon: Icon(Icons.person_outline),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: phoneCtrl,
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(
                  labelText: 'Số điện thoại đăng nhập',
                  hintText: 'Nhập số điện thoại liên hệ',
                  prefixIcon: Icon(Icons.phone_outlined),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: classCtrl,
                decoration: const InputDecoration(
                  labelText: 'Lớp học',
                  hintText: 'Nhập tên lớp học',
                  prefixIcon: Icon(Icons.school_outlined),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: schoolCtrl,
                decoration: const InputDecoration(
                  labelText: 'Trường học',
                  hintText: 'Nhập tên trường học',
                  prefixIcon: Icon(Icons.location_city_outlined),
                ),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogCtx),
            child: const Text('Hủy', style: TextStyle(color: AppTheme.textSecondary)),
          ),
          ElevatedButton(
            onPressed: () {
              final name = nameCtrl.text.trim();
              final phone = phoneCtrl.text.trim();
              if (name.isEmpty || phone.isEmpty) {
                ScaffoldMessenger.of(sheetContext).showSnackBar(
                  const SnackBar(
                    content: Text('Vui lòng nhập họ tên và số điện thoại!'),
                    backgroundColor: AppTheme.danger,
                  ),
                );
                return;
              }
              Navigator.pop(dialogCtx);
              _accountManager.addAccount(
                name: name,
                studentClass: classCtrl.text.trim(),
                school: schoolCtrl.text.trim(),
                phone: phone,
              );
              setSheetState(() {});
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('🎉 Đã thêm và chuyển sang tài khoản: $name'),
                  backgroundColor: AppTheme.success,
                ),
              );
            },
            child: const Text('Lưu & Đăng Nhập'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final currentAccount = _accountManager.currentAccount;
    final accountCount = _accountManager.accounts.length;
    final tr = _appSettings.tr;

    return Scaffold(
      appBar: AppBar(
        title: Text(tr(vi: 'Cài Đặt', en: 'Settings')),
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(vertical: 12),
        children: [
          // Thẻ Đổi Tài Khoản thay thế cho thẻ hồ sơ cá nhân cũ
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
            child: Card(
              elevation: 1.5,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: BorderSide(color: AppTheme.primary.withValues(alpha: 0.2), width: 1.2),
              ),
              child: InkWell(
                borderRadius: BorderRadius.circular(16),
                onTap: () => _showAccountSwitcherBottomSheet(context),
                child: Padding(
                  padding: const EdgeInsets.all(14),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: AppTheme.primaryContainer,
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: const Icon(Icons.switch_account_rounded, color: AppTheme.primary, size: 26),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              tr(vi: 'Đổi Tài Khoản', en: 'Switch Account'),
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                            ),
                            const SizedBox(height: 3),
                            Text(
                              '${tr(vi: "Đang dùng", en: "Active")}: ${currentAccount.name} (${currentAccount.studentClass})',
                              style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                        decoration: BoxDecoration(
                          color: AppTheme.primary.withValues(alpha: 0.08),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              '$accountCount acc',
                              style: const TextStyle(
                                fontSize: 12,
                                color: AppTheme.primary,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(width: 2),
                            const Icon(Icons.swap_horiz_rounded, size: 16, color: AppTheme.primary),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),

          const SizedBox(height: 6),

          // Settings Menu matching Canvas Frame 7
          Card(
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            child: Column(
              children: [
                ListTile(
                  leading: const CircleAvatar(
                    backgroundColor: AppTheme.primaryContainer,
                    child: Icon(Icons.badge_outlined, color: AppTheme.primary),
                  ),
                  title: Text(tr(vi: 'Thông Tin Cá Nhân', en: 'Personal Information'), style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                  trailing: const Icon(Icons.chevron_right, color: AppTheme.textSecondary),
                  onTap: _controller.openProfile,
                ),
                const Divider(height: 1),
                ListTile(
                  leading: const CircleAvatar(
                    backgroundColor: Color(0xFFFEF3C7),
                    child: Icon(Icons.lock_outline, color: AppTheme.warning),
                  ),
                  title: Text(tr(vi: 'Đổi Mật Khẩu', en: 'Change Password'), style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                  trailing: const Icon(Icons.chevron_right, color: AppTheme.textSecondary),
                  onTap: _controller.openChangePassword,
                ),
                const Divider(height: 1),
                ListTile(
                  leading: const CircleAvatar(
                    backgroundColor: Color(0xFFE0E7FF),
                    child: Icon(Icons.notifications_outlined, color: Color(0xFF4338CA)),
                  ),
                  title: Text(tr(vi: 'Thông Báo Ứng Dụng', en: 'App Notifications'), style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                  trailing: const Icon(Icons.chevron_right, color: AppTheme.textSecondary),
                  onTap: _controller.openNotificationsSetting,
                ),
                const Divider(height: 1),
                ListTile(
                  leading: const CircleAvatar(
                    backgroundColor: Color(0xFFDCFCE7),
                    child: Icon(Icons.dark_mode_outlined, color: AppTheme.success),
                  ),
                  title: Text(tr(vi: 'Giao Diện & Ngôn Ngữ', en: 'Appearance & Language'), style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                  trailing: const Icon(Icons.chevron_right, color: AppTheme.textSecondary),
                  onTap: _controller.openAppearanceLanguage,
                ),
                const Divider(height: 1),
                ListTile(
                  leading: const CircleAvatar(
                    backgroundColor: Color(0xFFF1F5F9),
                    child: Icon(Icons.headset_mic_outlined, color: AppTheme.textSecondary),
                  ),
                  title: Text(tr(vi: 'Trợ Giúp & Tổng Đài Hỗ Trợ', en: 'Help & Support Center'), style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                  subtitle: Text(tr(vi: 'Hotline: 1900 8899 (8h-17h)', en: 'Hotline: 1900 8899 (8am-5pm)'), style: const TextStyle(fontSize: 12)),
                  trailing: const Icon(Icons.chevron_right, color: AppTheme.textSecondary),
                  onTap: () {},
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),

          // Logout Button matching Canvas Frame 7
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: OutlinedButton.icon(
              onPressed: () => _controller.logout(context),
              icon: const Icon(Icons.logout, color: AppTheme.danger),
              label: Text(tr(vi: 'Đăng Xuất Tài Khoản', en: 'Log Out Account'), style: const TextStyle(color: AppTheme.danger, fontWeight: FontWeight.bold)),
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: AppTheme.danger),
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ),

          const SizedBox(height: 20),
          const Center(
            child: Text(
              'Vietsage Edu v1.0.0 (Build 2026)',
              style: TextStyle(fontSize: 12, color: AppTheme.textSecondary),
            ),
          ),
        ],
      ),
    );
  }
}
