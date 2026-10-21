import 'package:flutter/material.dart';
import '../../core/network/services/api_services.dart';
import '../auth/account_manager.dart';
import '../navigation/navigation_service.dart';

class SemesterData {
  final String id;
  final String name;
  final String gpa;
  final String rank;
  final List<Map<String, dynamic>> subjects;

  const SemesterData({
    required this.id,
    required this.name,
    required this.gpa,
    required this.rank,
    required this.subjects,
  });
}

class AcademicResultsController extends ChangeNotifier {
  bool isLoading = false;

  AcademicResultsController() {
    _initForCurrentAccount();
    loadApiGrades();
  }

  void _initForCurrentAccount() {
    final acc = AccountManager().currentAccount;
    final isPreschool = acc.id == 'acc_01' || acc.studentClass.contains('Mầm Non') || acc.school.contains('Mầm Non');
    final isTHCS = acc.id == 'acc_02' || acc.studentClass.contains('THCS') || acc.school.contains('THCS');

    if (isPreschool) {
      _semestersData = const [
        SemesterData(
          id: 'hk1_26_27_mn',
          name: 'Học Kì I (2026-2027) • Lớp Lá 1 (Mầm Non)',
          gpa: 'Bé Ngoan ⭐',
          rank: 'XUẤT SẮC',
          subjects: [
            {'name': '1. Phát triển Thể chất', 'score': 'Đạt Tốt', 'teacher': 'Cô Đặng Minh Châu', 'status': 'Khỏe mạnh, nhanh nhẹn'},
            {'name': '2. Phát triển Nhận thức', 'score': 'Đạt Tốt', 'teacher': 'Cô Đặng Minh Châu', 'status': 'Nhận biết hình khối tốt'},
            {'name': '3. Phát triển Ngôn ngữ', 'score': 'Rất Tốt', 'teacher': 'Cô Hoàng Thu Trang', 'status': 'Giao tiếp hoạt bát, kể chuyện hay'},
            {'name': '4. Phát triển TC - Kỹ năng XH', 'score': 'Đạt Tốt', 'teacher': 'Cô Đặng Minh Châu', 'status': 'Hòa đồng, lễ phép, tự phục vụ'},
            {'name': '5. Phát triển Thẩm mỹ', 'score': 'Đạt Tốt', 'teacher': 'Cô Hoàng Thu Trang', 'status': 'Hát múa, vẽ tranh sáng tạo'},
          ],
        ),
      ];
    } else if (isTHCS) {
      _semestersData = const [
        SemesterData(
          id: 'hk1_26_27_cs',
          name: 'Học Kì I (2026-2027) • Lớp 7B2 (THCS)',
          gpa: '9.4 / 10.0',
          rank: 'XUẤT SẮC',
          subjects: [
            {'name': 'Toán học (THCS)', 'score': '9.5', 'teacher': 'Cô Vũ Thúy Hằng', 'status': 'Giỏi'},
            {'name': 'Khoa học Tự nhiên', 'score': '9.2', 'teacher': 'Cô Vũ Thúy Hằng', 'status': 'Giỏi'},
            {'name': 'Ngữ văn (THCS)', 'score': '9.0', 'teacher': 'Thầy Phạm Quốc Toàn', 'status': 'Giỏi'},
            {'name': 'Tiếng Anh THCS', 'score': '9.6', 'teacher': 'Thầy David Miller', 'status': 'Xuất Sắc'},
          ],
        ),
      ];
    } else {
      _semestersData = const [
        SemesterData(
          id: 'hk1_26_27_pt',
          name: 'Học Kì I (2026-2027) • Lớp 10A1 (THPT)',
          gpa: '9.3 / 10.0',
          rank: 'XUẤT SẮC',
          subjects: [
            {'name': 'Toán Đại số 10', 'score': '9.4', 'teacher': 'ThS. Nguyễn Văn Hùng', 'status': 'Giỏi'},
            {'name': 'Toán Hình học 10', 'score': '9.2', 'teacher': 'ThS. Nguyễn Văn Hùng', 'status': 'Giỏi'},
            {'name': 'Ngữ văn 10', 'score': '8.8', 'teacher': 'Cô Trần Thị Mai', 'status': 'Giỏi'},
            {'name': 'Tiếng Anh 10', 'score': '9.5', 'teacher': 'Thầy David Miller', 'status': 'Xuất Sắc'},
            {'name': 'Vật lý 10', 'score': '9.1', 'teacher': 'Thầy Vũ Tuấn Anh', 'status': 'Giỏi'},
            {'name': 'Hóa học 10', 'score': '9.0', 'teacher': 'Cô Phan Thu Trang', 'status': 'Giỏi'},
            {'name': 'Tin học 10', 'score': '9.8', 'teacher': 'Thầy Lê Hoàng Long', 'status': 'Xuất Sắc'},
          ],
        ),
      ];
    }
    _selectedSemesterId = _semestersData.first.id;
  }

  late List<SemesterData> _semestersData;
  List<SemesterData> get semestersData => _semestersData;

  late String _selectedSemesterId;
  String get selectedSemesterId => _selectedSemesterId;

  SemesterData get currentSemester =>
      semestersData.firstWhere((s) => s.id == _selectedSemesterId, orElse: () => semestersData.first);

  Future<void> loadApiGrades() async {
    isLoading = true;
    notifyListeners();

    try {
      final currentAcc = AccountManager().currentAccount;
      final studentId = currentAcc.studentCode.isNotEmpty ? currentAcc.studentCode : 'hs_001';
      final response = await ApiServices.grades.getStudentGrades(studentId: studentId);

      if (response.success && response.data != null) {
        final data = response.data!;
        final List<Map<String, dynamic>> subjectList = data.subjectGrades.map((g) {
          return {
            'name': g.subject,
            'score': g.averageScore.toStringAsFixed(1),
            'teacher': 'Giáo viên bộ môn',
            'status': g.evaluation ?? (g.averageScore >= 8.0 ? 'Giỏi' : 'Khá'),
          };
        }).toList();

        if (subjectList.isNotEmpty) {
          _semestersData = [
            SemesterData(
              id: 'api_hk1',
              name: '${data.semester} • ${data.className ?? "Lớp 10A1"}',
              gpa: data.gpa.contains('/') ? data.gpa : '${data.gpa} / 10.0',
              rank: data.classification.toUpperCase(),
              subjects: subjectList,
            ),
            ..._semestersData,
          ];
          _selectedSemesterId = _semestersData.first.id;
        }
      }
    } catch (_) {
      // Giữ dữ liệu offline
    }

    isLoading = false;
    notifyListeners();
  }

  void selectSemester(String semesterId) {
    if (_selectedSemesterId != semesterId) {
      _selectedSemesterId = semesterId;
      notifyListeners();
    }
  }

  void openGradeDetail(Map<String, dynamic> subject) {
    NavigationService.goToGradeDetail(
      subjectName: subject['name'] ?? '',
      score: subject['score'] ?? '',
      teacher: subject['teacher'] ?? '',
    );
  }
}
