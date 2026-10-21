import 'package:flutter/material.dart';
import '../../../logic/notifications/notification_list_controller.dart';
import '../../theme/app_theme.dart';

class NotificationListScreen extends StatefulWidget {
  const NotificationListScreen({super.key});

  @override
  State<NotificationListScreen> createState() => _NotificationListScreenState();
}

class _NotificationListScreenState extends State<NotificationListScreen> {
  late final NotificationListController _controller;

  @override
  void initState() {
    super.initState();
    _controller = NotificationListController();
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
            title: const Text('Danh Sách Thông Báo'),
          ),
          body: ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: _controller.notifications.length,
            itemBuilder: (context, index) {
              final item = _controller.notifications[index];
              final isNew = item['isNew'] as bool;

              return Card(
                margin: const EdgeInsets.only(bottom: 10),
                child: ListTile(
                  leading: CircleAvatar(
                    backgroundColor: isNew ? AppTheme.primaryContainer : AppTheme.background,
                    child: Icon(
                      Icons.campaign,
                      color: isNew ? AppTheme.primary : AppTheme.textSecondary,
                    ),
                  ),
                  title: Text(
                    item['title'] as String,
                    style: TextStyle(
                      fontWeight: isNew ? FontWeight.bold : FontWeight.w600,
                      fontSize: 14,
                      color: AppTheme.textPrimary,
                    ),
                  ),
                  subtitle: Text(
                    '${item['sender']} • ${item['date']}',
                    style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                  ),
                  trailing: isNew
                      ? Container(
                          width: 8,
                          height: 8,
                          decoration: const BoxDecoration(
                            color: AppTheme.danger,
                            shape: BoxShape.circle,
                          ),
                        )
                      : const Icon(Icons.chevron_right, color: AppTheme.textSecondary),
                  onTap: () => _controller.openNotificationDetail(index),
                ),
              );
            },
          ),
        );
      },
    );
  }
}
