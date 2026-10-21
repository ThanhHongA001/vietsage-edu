import 'package:flutter/material.dart';
import '../../../logic/homework/homework_controller.dart';
import '../../theme/app_theme.dart';
import 'homework_detail_screen.dart';

class HomeworkScreen extends StatefulWidget {
  const HomeworkScreen({super.key});

  @override
  State<HomeworkScreen> createState() => _HomeworkScreenState();
}

class _HomeworkScreenState extends State<HomeworkScreen> {
  late final HomeworkController _controller;

  @override
  void initState() {
    super.initState();
    _controller = HomeworkController();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _openDetail(Map<String, dynamic> task) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => HomeworkDetailScreen(
          task: task,
          controller: _controller,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: _controller,
      builder: (context, _) {
        return DefaultTabController(
          length: 2,
          child: Scaffold(
            appBar: AppBar(
              title: const Text('Bài Tập Về Nhà'),
              bottom: TabBar(
                labelColor: Colors.white,
                unselectedLabelColor: Colors.white70,
                indicatorColor: Colors.white,
                tabs: [
                  Tab(text: 'Cần Hoàn Thành (${_controller.pendingTasks.length})'),
                  Tab(text: 'Đã Nộp Bài (${_controller.submittedTasks.length})'),
                ],
              ),
            ),
            body: TabBarView(
              children: [
                _buildPendingHomework(context),
                _buildSubmittedHomework(),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildPendingHomework(BuildContext context) {
    if (_controller.pendingTasks.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: const [
            Icon(Icons.check_circle_outline_rounded, size: 54, color: AppTheme.success),
            SizedBox(height: 12),
            Text(
              'Tuyệt vời! Đã hoàn thành hết bài tập.',
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _controller.pendingTasks.length,
      itemBuilder: (context, index) {
        final t = _controller.pendingTasks[index];
        final isUrgent = t['isUrgent'] == true;

        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: InkWell(
            borderRadius: BorderRadius.circular(16),
            onTap: () => _openDetail(t),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppTheme.primaryContainer,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          t['subject'] as String? ?? 'Môn Học',
                          style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primary, fontSize: 12),
                        ),
                      ),
                      Row(
                        children: [
                          if (isUrgent) ...[
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: const Color(0xFFFEF2F2),
                                borderRadius: BorderRadius.circular(6),
                                border: Border.all(color: AppTheme.danger),
                              ),
                              child: const Text('Gấp', style: TextStyle(color: AppTheme.danger, fontSize: 11, fontWeight: FontWeight.bold)),
                            ),
                            const SizedBox(width: 8),
                          ],
                          const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: AppTheme.textSecondary),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Text(
                    t['title'] as String? ?? '',
                    style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Giáo viên giao: ${t['teacher'] ?? ''}',
                    style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Icon(Icons.access_time, size: 14, color: isUrgent ? AppTheme.danger : AppTheme.textSecondary),
                      const SizedBox(width: 4),
                      Text(
                        t['deadline'] as String? ?? '',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: isUrgent ? FontWeight.bold : FontWeight.normal,
                          color: isUrgent ? AppTheme.danger : AppTheme.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildSubmittedHomework() {
    if (_controller.submittedTasks.isEmpty) {
      return const Center(
        child: Text(
          'Chưa có bài tập nào đã nộp',
          style: TextStyle(color: AppTheme.textSecondary, fontSize: 14),
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _controller.submittedTasks.length,
      itemBuilder: (context, index) {
        final s = _controller.submittedTasks[index];
        final score = s['score'] as String? ?? '';
        final date = s['date'] as String? ?? s['submittedDate'] as String? ?? '';

        return Card(
          margin: const EdgeInsets.only(bottom: 8),
          child: ListTile(
            onTap: () => _openDetail(s),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            leading: const CircleAvatar(
              backgroundColor: Color(0xFFDCFCE7),
              child: Icon(Icons.check, color: AppTheme.success),
            ),
            title: Text(s['title'] as String? ?? '', style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
            subtitle: Text('${s['subject']} • $date', style: const TextStyle(fontSize: 12)),
            trailing: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  score,
                  style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primary, fontSize: 14),
                ),
                const SizedBox(width: 6),
                const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: AppTheme.textSecondary),
              ],
            ),
          ),
        );
      },
    );
  }
}
