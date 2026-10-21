import 'package:flutter/material.dart';
import '../../../logic/academic/academic_results_controller.dart';
import '../../theme/app_theme.dart';

class AcademicResultsScreen extends StatefulWidget {
  const AcademicResultsScreen({super.key});

  @override
  State<AcademicResultsScreen> createState() => _AcademicResultsScreenState();
}

class _AcademicResultsScreenState extends State<AcademicResultsScreen> {
  late final AcademicResultsController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AcademicResultsController();
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
        final currentSemester = _controller.currentSemester;

        return Scaffold(
          appBar: AppBar(
            title: const Text('Kết Quả Học Tập'),
            elevation: 0,
          ),
          body: Column(
            children: [
              // Menu Thả Xuống (Dropdown Menu) chọn học kỳ
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  color: Colors.white,
                  border: Border(
                    bottom: BorderSide(color: AppTheme.border.withValues(alpha: 0.8)),
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.03),
                      blurRadius: 4,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 2),
                  decoration: BoxDecoration(
                    color: AppTheme.background,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: AppTheme.border),
                  ),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      value: _controller.selectedSemesterId,
                      isExpanded: true,
                      icon: const Icon(
                        Icons.keyboard_arrow_down_rounded,
                        color: AppTheme.primary,
                        size: 26,
                      ),
                      dropdownColor: Colors.white,
                      borderRadius: BorderRadius.circular(14),
                      elevation: 4,
                      items: _controller.semestersData.map((sem) {
                        final isSelected = sem.id == _controller.selectedSemesterId;
                        return DropdownMenuItem<String>(
                          value: sem.id,
                          child: Row(
                            children: [
                              Icon(
                                Icons.calendar_month_rounded,
                                color: isSelected ? AppTheme.primary : AppTheme.textSecondary,
                                size: 20,
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Text(
                                  sem.name,
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                                    color: isSelected ? AppTheme.primary : AppTheme.textPrimary,
                                  ),
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                              if (isSelected)
                                const Icon(
                                  Icons.check_circle_rounded,
                                  color: AppTheme.primary,
                                  size: 18,
                                ),
                            ],
                          ),
                        );
                      }).toList(),
                      onChanged: (val) {
                        if (val != null) {
                          _controller.selectSemester(val);
                        }
                      },
                    ),
                  ),
                ),
              ),

              // Toàn bộ màn hình bên dưới thay đổi theo học kỳ được chọn từ menu thả xuống
              Expanded(
                child: AnimatedSwitcher(
                  duration: const Duration(milliseconds: 250),
                  transitionBuilder: (child, animation) {
                    return FadeTransition(opacity: animation, child: child);
                  },
                  child: KeyedSubtree(
                    key: ValueKey(currentSemester.id),
                    child: _buildSemesterContent(currentSemester),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildSemesterContent(SemesterData semester) {
    final isPreschool = semester.gpa.contains('Bé Ngoan');

    return ListView(
      padding: const EdgeInsets.symmetric(vertical: 16),
      children: [
        // 1. Thẻ tổng quan GPA & Xếp loại (thay đổi theo học kỳ)
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 16),
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF1E3A8A), Color(0xFF2563EB)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(18),
            boxShadow: [
              BoxShadow(
                color: AppTheme.primary.withValues(alpha: 0.28),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      semester.name,
                      style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.18),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      isPreschool ? '5 Lĩnh Vực' : '${semester.subjects.length} Môn học',
                      style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          isPreschool ? 'Danh Hiệu Định Kỳ' : 'Điểm Trung Bình (ĐTB)',
                          style: const TextStyle(color: Colors.white70, fontSize: 13),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          semester.gpa,
                          style: TextStyle(
                            color: isPreschool ? const Color(0xFFFDE047) : Colors.white,
                            fontSize: isPreschool ? 22 : 26,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(width: 1, height: 44, color: Colors.white24, margin: const EdgeInsets.symmetric(horizontal: 12)),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          isPreschool ? 'Đánh Giá Chung' : 'Xếp Loại Học Lực',
                          style: const TextStyle(color: Colors.white70, fontSize: 13),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          semester.rank,
                          style: const TextStyle(
                            color: Color(0xFFFDE047),
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),

        const SizedBox(height: 20),

          // 2. Tiêu đề mục bảng điểm
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Text(
              semester.gpa.contains('Bé Ngoan')
                  ? 'Đánh Giá 5 Lĩnh Vực Phát Triển (Chuẩn GD Mầm Non)'
                  : 'Danh Sách Bảng Điểm',
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: AppTheme.textPrimary,
              ),
            ),
          ),
          const SizedBox(height: 8),

          // 3. Danh sách môn học cụ thể của học kỳ được chọn từ menu thả xuống
          ...semester.subjects.map((sub) {
            final isPreschoolItem = semester.gpa.contains('Bé Ngoan');
            final isScoreNumeric = double.tryParse(sub['score'] ?? '') != null;
            final isExcellent = isScoreNumeric
                ? double.parse(sub['score']!) >= 9.0
                : (sub['score']?.toString().contains('Tốt') ?? false);

            return Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              child: Card(
                elevation: 1,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                  side: BorderSide(color: AppTheme.border.withValues(alpha: 0.6)),
                ),
                child: ListTile(
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                  leading: CircleAvatar(
                    backgroundColor: isPreschoolItem
                        ? const Color(0xFFFEF3C7)
                        : (isExcellent ? const Color(0xFFEFF6FF) : AppTheme.primaryContainer),
                    child: Icon(
                      isPreschoolItem ? Icons.star_rounded : Icons.menu_book_rounded,
                      color: isPreschoolItem
                          ? const Color(0xFFD97706)
                          : (isExcellent ? const Color(0xFF2563EB) : AppTheme.primary),
                    ),
                  ),
                  title: Text(
                    sub['name'] ?? '',
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                  ),
                  subtitle: Text(
                    '${sub['teacher'] ?? ''} • ${sub['status'] ?? ''}',
                    style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                  ),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: isExcellent
                              ? const Color(0xFFDCFCE7)
                              : AppTheme.primary.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          sub['score'] ?? '',
                          style: TextStyle(
                            color: isExcellent ? AppTheme.success : AppTheme.primary,
                            fontWeight: FontWeight.bold,
                            fontSize: isScoreNumeric ? 16 : 13,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      const Icon(Icons.chevron_right, size: 18, color: AppTheme.textSecondary),
                    ],
                  ),
                  onTap: () => _controller.openGradeDetail(sub),
                ),
              ),
            );
          }),
      ],
    );
  }
}
