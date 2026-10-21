import 'package:flutter/material.dart';
import '../../../logic/navigation/navigation_service.dart';
import '../../theme/app_theme.dart';

class ServicesTab extends StatelessWidget {
  const ServicesTab({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dịch Vụ Trường Học'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // 1. Thành Tích & Điểm Số
          _buildServiceCard(
            title: 'Thành Tích & Điểm Số',
            subtitle: 'Tra cứu bảng điểm, nhận xét của giáo viên các môn',
            icon: Icons.emoji_events_rounded,
            color: const Color(0xFF2563EB),
            onTap: NavigationService.goToAcademicResults,
          ),
          const SizedBox(height: 12),

          // 2. Thực Đơn
          _buildServiceCard(
            title: 'Thực Đơn',
            subtitle: 'Thực đơn dinh dưỡng bữa chính, bữa phụ hàng ngày',
            icon: Icons.restaurant_rounded,
            color: const Color(0xFF0D9488),
            onTap: NavigationService.goToCanteen,
          ),
          const SizedBox(height: 12),

          // 3. Đồng Phục
          _buildServiceCard(
            title: 'Đồng Phục',
            subtitle: 'Đặt mua đồng phục chính khóa, thể dục, áo khoác ấm',
            icon: Icons.checkroom_rounded,
            color: const Color(0xFF7C3AED),
            onTap: NavigationService.goToUniform,
          ),
          const SizedBox(height: 12),

          // 4. Chuyên Cần & Điểm Danh
          _buildServiceCard(
            title: 'Chuyên Cần & Điểm Danh',
            subtitle: 'Theo dõi giờ giấc đi học, muộn, gửi đơn xin phép nghỉ',
            icon: Icons.calendar_month_rounded,
            color: const Color(0xFFEA580C),
            onTap: NavigationService.goToAttendance,
          ),
          const SizedBox(height: 12),

          // 5. Sự Kiện Nhà Trường (Chuyển từ Tiện ích sang)
          _buildServiceCard(
            title: 'Sự Kiện Nhà Trường',
            subtitle: 'Lịch hoạt động ngoại khóa, hội thao, ngày hội 20/11',
            icon: Icons.celebration_rounded,
            color: const Color(0xFFDB2777),
            onTap: NavigationService.goToEvents,
          ),
          const SizedBox(height: 12),

          // 6. Bài Tập Về Nhà (Chuyển từ Tiện ích sang)
          _buildServiceCard(
            title: 'Bài Tập Về Nhà',
            subtitle: 'Danh sách bài tập cần hoàn thành, chụp ảnh nộp bài',
            icon: Icons.assignment_rounded,
            color: const Color(0xFF4F46E5),
            onTap: NavigationService.goToHomework,
          ),
        ],
      ),
    );
  }

  Widget _buildServiceCard({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(18),
        side: BorderSide(color: color.withValues(alpha: 0.3)),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(18),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Row(
            children: [
              Container(
                width: 58,
                height: 58,
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Icon(icon, color: color, size: 30),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      subtitle,
                      style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary, height: 1.3),
                    ),
                  ],
                ),
              ),
              const Icon(Icons.arrow_forward_ios_rounded, size: 16, color: AppTheme.textSecondary),
            ],
          ),
        ),
      ),
    );
  }
}
