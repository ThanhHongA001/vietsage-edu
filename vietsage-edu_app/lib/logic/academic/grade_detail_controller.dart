import 'package:flutter/material.dart';
import '../auth/account_manager.dart';

class GradeDetailController extends ChangeNotifier {
  final String subjectName;
  final String score;
  final String teacher;

  GradeDetailController({
    required this.subjectName,
    required this.score,
    required this.teacher,
  });

  List<Map<String, dynamic>> get scoreComponents => [
    {
      'icon': Icons.edit_note,
      'title': 'Kiểm Tra Miệng / Đọc Bài',
      'weight': 'Hệ số 1',
      'scores': ['9.0', '10.0'],
    },
    {
      'icon': Icons.assignment_outlined,
      'title': 'Kiểm Tra 15 Phút',
      'weight': 'Hệ số 1 (2 cột điểm)',
      'scores': ['9.5', '9.0'],
    },
    {
      'icon': Icons.quiz_outlined,
      'title': 'Kiểm Tra 1 Tiết (Giữa Kỳ)',
      'weight': 'Hệ số 2',
      'scores': ['9.0'],
    },
    {
      'icon': Icons.military_tech_outlined,
      'title': 'Kiểm Tra Cuối Học Kỳ I',
      'weight': 'Hệ số 3',
      'scores': ['9.0'],
    },
  ];

  String get teacherComment =>
      'Học sinh ${AccountManager().currentAccount.name} có tư duy logic rất tốt, chú ý nghe giảng và tích cực tham gia xây dựng bài trên lớp. Cần tiếp tục duy trì phong độ xuất sắc này.';
}
