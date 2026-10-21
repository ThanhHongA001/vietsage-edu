import 'package:flutter/material.dart';
import '../../../logic/events/event_detail_controller.dart';
import '../../theme/app_theme.dart';

class EventDetailScreen extends StatefulWidget {
  final String title;
  final String date;
  final String location;
  final String description;
  final IconData icon;

  const EventDetailScreen({
    super.key,
    required this.title,
    required this.date,
    required this.location,
    required this.description,
    required this.icon,
  });

  @override
  State<EventDetailScreen> createState() => _EventDetailScreenState();
}

class _EventDetailScreenState extends State<EventDetailScreen> {
  late final EventDetailController _controller;

  @override
  void initState() {
    super.initState();
    _controller = EventDetailController();
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
            title: const Text('Chi Tiết Sự Kiện'),
          ),
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Banner Container
                Container(
                  height: 180,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [AppTheme.primary, Color(0xFF3B82F6)],
                    ),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Center(
                    child: Icon(widget.icon, size: 72, color: Colors.white),
                  ),
                ),
                const SizedBox(height: 16),

                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          widget.title,
                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            const Icon(Icons.calendar_today, size: 16, color: AppTheme.primary),
                            const SizedBox(width: 8),
                            Text(widget.date, style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary)),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            const Icon(Icons.place, size: 16, color: AppTheme.danger),
                            const SizedBox(width: 8),
                            Text(widget.location, style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary)),
                          ],
                        ),
                        const Divider(height: 24),
                        const Text(
                          'Nội Dung Hoạt Động',
                          style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          widget.description,
                          style: const TextStyle(fontSize: 14, height: 1.5, color: AppTheme.textPrimary),
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 20),
                ElevatedButton.icon(
                  onPressed: _controller.isRegistered
                      ? null
                      : () => _controller.registerEvent(context),
                  icon: _controller.isRegistered
                      ? const Icon(Icons.check_circle)
                      : const Icon(Icons.how_to_reg_rounded),
                  label: Text(_controller.isRegistered
                      ? 'Đã Đăng Ký Tham Gia'
                      : 'Đăng Ký Tham Gia Hoạt Động'),
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    backgroundColor: _controller.isRegistered ? Colors.grey : AppTheme.primary,
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
