import 'package:flutter/material.dart';
import '../../core/network/services/api_services.dart';
import '../auth/account_manager.dart';

class HomeworkController extends ChangeNotifier {
  bool isLoading = false;

  HomeworkController() {
    loadHomework();
  }

  List<Map<String, dynamic>> pendingTasks = [
    {
      'id': 'hw_math_1',
      'subject': 'Toán Học',
      'title': 'Bài tập về Hàm Số Bậc Hai & Đồ Thị (Bài 1 -> 5 SGK)',
      'deadline': 'Hạn chót: 23:59 Hôm nay (14/10)',
      'teacher': 'Thầy Trần Minh Đức',
      'assignedDate': '14/10/2026 - 07:30',
      'isUrgent': true,
      'content': '''Các em học sinh hoàn thành các bài tập sau trong SGK Toán 10 tập 1 (Phần Đại Số):

• Bài 1 (trang 45): Tìm tập xác định, tọa độ đỉnh và vẽ đồ thị hàm số y = 2x² - 4x + 1.
• Bài 2 (trang 46): Lập bảng biến thiên, chỉ ra các khoảng đồng biến và nghịch biến của hàm số bậc hai.
• Bài 3 & 4 (trang 47): Tìm giá trị lớn nhất, giá trị nhỏ nhất của hàm số trên đoạn [-1; 3]. Tìm tham số m để phương trình có hai nghiệm phân biệt cùng dấu.
• Bài 5 (trang 48): Bài toán thực tế - Tính độ cao lớn nhất của cây cầu vòm hình parabol bắc qua sông.

📌 Chú ý từ giáo viên:
- Trình bày chi tiết, vẽ hình cẩn thận bằng thước kẻ vào vở bài tập Toán.
- Chụp ảnh rõ nét từng trang vở, xoay đúng chiều và gửi bài trước hạn chót.''',
      'attachments': [
        {'name': 'De_bai_Ham_so_bac_hai_Toan10.pdf', 'size': '1.4 MB'},
        {'name': 'Huong_dan_ve_parabol_mau.png', 'size': '850 KB'},
      ],
      'isSubmitted': false,
    },
    {
      'id': 'hw_phys_2',
      'subject': 'Vật Lý',
      'title': 'Trắc nghiệm chuyên đề Chuyển Động Biến Đổi Đều (20 câu)',
      'deadline': 'Hạn chót: 23:59 - 16/10/2026',
      'teacher': 'Thầy Vũ Tuấn Anh',
      'assignedDate': '13/10/2026 - 14:00',
      'isUrgent': false,
      'content': '''Nhiệm vụ ôn tập chương 1 - Động học chất điểm:

1. Đọc lại lý thuyết trong SGK Vật lý 10:
   - Công thức vận tốc: v = v₀ + at
   - Phương trình tọa độ và quãng đường: s = v₀t + ½at²
   - Công thức độc lập với thời gian: v² - v₀² = 2as

2. Làm chi tiết 20 câu hỏi trắc nghiệm trong phiếu đính kèm:
   - Ghi đáp án A, B, C, D vào phiếu trả lời.
   - Với các câu tính toán số liệu (từ câu 11 đến câu 20), viết vắn tắt các bước tính toán bên cạnh đáp án để thầy kiểm tra phương pháp làm bài.''',
      'attachments': [
        {'name': '20_Cau_Trac_Nghiem_Dong_Hoc.pdf', 'size': '2.1 MB'},
      ],
      'isSubmitted': false,
    },
  ];

  List<Map<String, dynamic>> submittedTasks = [
    {
      'id': 'hw_sub_1',
      'subject': 'Ngữ Văn',
      'title': 'Phân tích nhân vật Vũ Nương trong Chuyện người con gái Nam Xương',
      'deadline': 'Hạn chót: 12/10/2026',
      'teacher': 'Cô Nguyễn Thị Mai',
      'assignedDate': '08/10/2026',
      'date': '12/10/2026',
      'submittedDate': '12/10/2026 - 20:15',
      'score': '8.5 / 10',
      'teacherComment': 'Bài viết cảm xúc, dẫn chứng phân tích vẻ đẹp đức hạnh và bi kịch nhân vật rất thuyết phục. Cần lưu ý một số lỗi chính tả ở phần kết bài.',
      'content': '''Đề bài Ngữ Văn 10:
Viết bài văn ngắn (khoảng 2 trang giấy thi) phân tích vẻ đẹp đức hạnh và nỗi oan khuất bi kịch của nhân vật Vũ Nương trong tác phẩm "Chuyện người con gái Nam Xương" của Nguyễn Dữ.''',
      'attachments': [
        {'name': 'De_Van_Vu_Nuong.pdf', 'size': '640 KB'},
      ],
      'submittedFiles': ['Bai_lam_Van_Trang1.jpg', 'Bai_lam_Van_Trang2.jpg'],
      'isSubmitted': true,
    },
  ];

  Future<void> loadHomework() async {
    isLoading = true;
    notifyListeners();

    try {
      final currentAcc = AccountManager().currentAccount;
      final response = await ApiServices.homework.getHomeworkList(
        className: currentAcc.studentClass.split(' ').first,
      );

      if (response.success && response.data != null && response.data!.isNotEmpty) {
        final List<Map<String, dynamic>> apiPending = [];
        final List<Map<String, dynamic>> apiSubmitted = [];

        for (var hw in response.data!) {
          final item = {
            'id': hw.id,
            'subject': hw.subject,
            'title': hw.title,
            'deadline': 'Hạn chót: ${hw.deadline}',
            'teacher': hw.teacherName,
            'assignedDate': 'Năm học 2026',
            'isUrgent': hw.status == 'PENDING',
            'content': hw.description,
            'attachments': [
              {'name': 'Tai_lieu_${hw.subject}.pdf', 'size': '1.2 MB'},
            ],
            'isSubmitted': hw.status == 'SUBMITTED' || hw.status == 'GRADED',
            'score': hw.mySubmission?.score != null ? '${hw.mySubmission!.score} / 10' : 'Chờ chấm điểm',
            'teacherComment': hw.mySubmission?.feedback ?? 'Bài tập giao từ hệ thống Vietsage',
            'submittedFiles': hw.mySubmission?.fileUrls ?? [],
            'date': hw.deadline,
          };

          if (hw.status == 'SUBMITTED' || hw.status == 'GRADED') {
            apiSubmitted.add(item);
          } else {
            apiPending.add(item);
          }
        }

        if (apiPending.isNotEmpty) pendingTasks = apiPending;
        if (apiSubmitted.isNotEmpty) submittedTasks = apiSubmitted;
      }
    } catch (_) {
      // Giữ fallback
    }

    isLoading = false;
    notifyListeners();
  }

  bool submitTask({
    required String taskId,
    List<dynamic>? files,
    String? note,
  }) {
    final index = pendingTasks.indexWhere((t) => t['id'] == taskId);
    if (index != -1) {
      final task = Map<String, dynamic>.from(pendingTasks[index]);
      task['isSubmitted'] = true;
      task['date'] = 'Hôm nay';
      task['submittedDate'] = 'Vừa xong';
      task['score'] = 'Chờ chấm điểm';
      task['teacherComment'] = 'Bài tập đã được gửi tới giáo viên, đang chờ chấm điểm.';
      task['submittedFiles'] = (files != null && files.isNotEmpty)
          ? files
          : ['Anh_chup_bai_lam_1.jpg'];
      task['studentNote'] = note ?? '';

      pendingTasks.removeAt(index);
      submittedTasks.insert(0, task);
      notifyListeners();

      _syncSubmitToApi(taskId, files, note);
      return true;
    }
    return false;
  }

  void _syncSubmitToApi(String taskId, List<dynamic>? files, String? note) async {
    try {
      final currentAcc = AccountManager().currentAccount;
      await ApiServices.homework.submitHomework(
        homeworkId: taskId,
        studentId: currentAcc.studentCode,
        studentName: currentAcc.name,
        content: note,
        fileUrls: files?.map((f) => f.toString()).toList(),
      );
    } catch (_) {}
  }
}
