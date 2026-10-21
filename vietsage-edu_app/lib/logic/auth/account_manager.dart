import 'package:flutter/material.dart';

class SavedAccount {
  final String id;
  final String name;
  final String studentClass;
  final String school;
  final String phone;
  final String studentCode;
  final String lastLogin;
  final bool isCurrent;
  final Color color;

  // Chi tiết hồ sơ cá nhân đồng bộ theo tài khoản
  final String birthDate;
  final String gender;
  final String placeOfBirth;
  final String parentInfo;
  final String address;

  // Dữ liệu học tập & thống kê đồng bộ theo tài khoản
  final String gpa;
  final String gpaClassification;
  final String attendanceRatio;
  final String attendanceStatus;
  final String scheduleToday;
  final Map<String, String> urgentHomework;

  SavedAccount({
    required this.id,
    required this.name,
    required this.studentClass,
    required this.school,
    required this.phone,
    required this.studentCode,
    required this.lastLogin,
    this.isCurrent = false,
    required this.color,
    required this.birthDate,
    required this.gender,
    required this.placeOfBirth,
    required this.parentInfo,
    required this.address,
    required this.gpa,
    required this.gpaClassification,
    required this.attendanceRatio,
    required this.attendanceStatus,
    required this.scheduleToday,
    required this.urgentHomework,
  });

  SavedAccount copyWith({
    bool? isCurrent,
    String? lastLogin,
    String? name,
    String? studentClass,
    String? school,
    String? phone,
    String? studentCode,
    String? birthDate,
    String? gender,
    String? placeOfBirth,
    String? parentInfo,
    String? address,
    String? gpa,
    String? gpaClassification,
    String? attendanceRatio,
    String? attendanceStatus,
    String? scheduleToday,
    Map<String, String>? urgentHomework,
    Color? color,
  }) {
    return SavedAccount(
      id: id,
      name: name ?? this.name,
      studentClass: studentClass ?? this.studentClass,
      school: school ?? this.school,
      phone: phone ?? this.phone,
      studentCode: studentCode ?? this.studentCode,
      lastLogin: lastLogin ?? this.lastLogin,
      isCurrent: isCurrent ?? this.isCurrent,
      color: color ?? this.color,
      birthDate: birthDate ?? this.birthDate,
      gender: gender ?? this.gender,
      placeOfBirth: placeOfBirth ?? this.placeOfBirth,
      parentInfo: parentInfo ?? this.parentInfo,
      address: address ?? this.address,
      gpa: gpa ?? this.gpa,
      gpaClassification: gpaClassification ?? this.gpaClassification,
      attendanceRatio: attendanceRatio ?? this.attendanceRatio,
      attendanceStatus: attendanceStatus ?? this.attendanceStatus,
      scheduleToday: scheduleToday ?? this.scheduleToday,
      urgentHomework: urgentHomework ?? this.urgentHomework,
    );
  }
}

class AccountManager extends ChangeNotifier {
  static final AccountManager _instance = AccountManager._internal();
  factory AccountManager() => _instance;
  AccountManager._internal();

  List<SavedAccount> _accounts = [
    // 1. Cấp Mầm Non (Preschool)
    SavedAccount(
      id: 'acc_01',
      name: 'Bé Nguyễn Bảo An (Bé Bo)',
      studentClass: 'Lớp Lá 1 (Mầm Non)',
      school: 'Mầm Non VietSage Kids',
      phone: '0912 888 777',
      studentCode: 'VS-MN-001',
      lastLogin: 'Hiện tại',
      isCurrent: true,
      color: const Color(0xFFF59E0B),
      birthDate: '10/04/2021',
      gender: 'Nam • Dân tộc Kinh',
      placeOfBirth: 'Hà Nội, Việt Nam',
      parentInfo: 'Nguyễn Quốc Anh (Bố) - 0912 888 777',
      address: 'Số 15 Vạn Phúc, Ba Đình, Hà Nội',
      gpa: 'Bé Ngoan ⭐',
      gpaClassification: 'Xuất sắc',
      attendanceRatio: '25/25',
      attendanceStatus: 'Đúng giờ',
      scheduleToday: 'Hôm nay: Tạo hình sắc màu, Ăn trưa bán trú, Ngủ trưa, Ăn xế',
      urgentHomework: {
        'subject': 'Vui học tại nhà: Cùng bố mẹ gấp giấy Origami con thỏ',
        'deadline': 'Hạn chót: 20:00 Chủ Nhật • Cô Đặng Minh Châu',
      },
    ),

    // 2. Cấp THCS (Trung học cơ sở)
    SavedAccount(
      id: 'acc_02',
      name: 'Nguyễn Thị Mai',
      studentClass: 'Lớp 7B2 (THCS)',
      school: 'THCS VietSage',
      phone: '0912 345 678',
      studentCode: 'VS-CS-001',
      lastLogin: 'Hôm qua, 18:30',
      isCurrent: false,
      color: const Color(0xFF0D9488),
      birthDate: '20/11/2014',
      gender: 'Nữ • Dân tộc Kinh',
      placeOfBirth: 'Đà Nẵng, Việt Nam',
      parentInfo: 'Nguyễn Thị Lan (Mẹ) - 0912 345 678',
      address: 'Tòa Park 2 Times City, Hai Bà Trưng, Hà Nội',
      gpa: '9.4',
      gpaClassification: 'Xuất sắc',
      attendanceRatio: '26/26',
      attendanceStatus: 'Đầy đủ',
      scheduleToday: 'Hôm nay có 4 tiết học • Tiết 1: Tiếng Anh lúc 07:45',
      urgentHomework: {
        'subject': 'Tiếng Anh THCS: Viết đoạn văn về My School',
        'deadline': 'Hạn chót: 21:00 tối nay • Cô Vũ Thúy Hằng',
      },
    ),

    // 3. Cấp THPT (Trung học phổ thông)
    SavedAccount(
      id: 'acc_03',
      name: 'Nguyễn Minh Quân',
      studentClass: 'Lớp 10A1 (THPT)',
      school: 'THPT VietSage',
      phone: '0912 999 111',
      studentCode: 'VS-2026-001',
      lastLogin: '12/10/2026 09:15',
      isCurrent: false,
      color: const Color(0xFF1E3A8A),
      birthDate: '12/04/2010',
      gender: 'Nam • Dân tộc Kinh',
      placeOfBirth: 'Hà Nội, Việt Nam',
      parentInfo: 'Nguyễn Văn Thành (Bố) - 0912 999 111',
      address: 'Số 45 Cầu Giấy, Hà Nội',
      gpa: '9.3',
      gpaClassification: 'Xuất sắc',
      attendanceRatio: '24/26',
      attendanceStatus: 'Đúng giờ',
      scheduleToday: 'Hôm nay có 5 tiết học • Tiết 1: Toán Đại số lúc 07:15',
      urgentHomework: {
        'subject': 'Toán Đại số: Bài tập Khảo sát hàm số bậc hai',
        'deadline': 'Hạn chót: 23:59 hôm nay • ThS. Nguyễn Văn Hùng',
      },
    ),
  ];

  List<SavedAccount> get accounts => List.unmodifiable(_accounts);

  SavedAccount get currentAccount =>
      _accounts.firstWhere((a) => a.isCurrent, orElse: () => _accounts.first);

  void switchAccount(String id) {
    _accounts = _accounts.map((a) {
      if (a.id == id) {
        return a.copyWith(isCurrent: true, lastLogin: 'Vừa xong');
      } else {
        return a.copyWith(isCurrent: false);
      }
    }).toList();
    notifyListeners();
  }

  bool removeAccount(String id) {
    if (_accounts.length <= 1) return false;
    final target = _accounts.firstWhere((a) => a.id == id, orElse: () => _accounts.first);
    if (target.isCurrent) return false;
    _accounts.removeWhere((a) => a.id == id);
    notifyListeners();
    return true;
  }

  void addAccount({
    required String name,
    required String studentClass,
    required String school,
    required String phone,
  }) {
    final newAcc = SavedAccount(
      id: 'acc_${DateTime.now().millisecondsSinceEpoch}',
      name: name,
      studentClass: studentClass,
      school: school,
      phone: phone,
      studentCode: 'HS2026-${(1000 + _accounts.length).toString()}',
      lastLogin: 'Vừa xong',
      isCurrent: true,
      color: const Color(0xFFD97706),
      birthDate: '10/10/2010',
      gender: 'Học sinh • Dân tộc Kinh',
      placeOfBirth: 'Việt Nam',
      parentInfo: 'Phụ huynh học sinh - $phone',
      address: 'Đang cập nhật địa chỉ thường trú',
      gpa: '8.6',
      gpaClassification: 'Khá Giỏi',
      attendanceRatio: '26/26',
      attendanceStatus: 'Đầy đủ',
      scheduleToday: 'Hôm nay có 5 tiết học • Tiết 1 lúc 07:30',
      urgentHomework: {
        'subject': 'Bài tập ôn tập tuần mới',
        'deadline': 'Hạn chót: 23:59 hôm nay',
      },
    );
    _accounts = _accounts.map((a) => a.copyWith(isCurrent: false)).toList();
    _accounts.add(newAcc);
    notifyListeners();
  }

  void syncLoggedInUser(dynamic user) {
    final String userId = user.id?.toString() ?? 'acc_current';
    final String userPhone = user.phone?.toString() ?? '';
    final String userName = user.fullName?.toString() ?? 'Người dùng VietSage';
    final String? userClass = user.studentClass?.toString();
    final String? studentId = user.studentId?.toString();

    final existingIndex = _accounts.indexWhere((a) => a.id == userId || (userPhone.isNotEmpty && a.phone.contains(userPhone)));
    if (existingIndex >= 0) {
      _accounts = _accounts.map((a) {
        if (a.id == userId || (userPhone.isNotEmpty && a.phone.contains(userPhone))) {
          return a.copyWith(
            isCurrent: true,
            lastLogin: 'Hiện tại',
            name: userName,
            studentClass: userClass != null ? '$userClass (Đã xác thực)' : a.studentClass,
            studentCode: studentId ?? a.studentCode,
          );
        }
        return a.copyWith(isCurrent: false);
      }).toList();
    } else {
      final newAcc = SavedAccount(
        id: userId,
        name: userName,
        studentClass: userClass ?? 'Lớp 10A1 (THPT)',
        school: 'THPT VietSage',
        phone: userPhone,
        studentCode: studentId ?? 'VS-2026-001',
        lastLogin: 'Hiện tại',
        isCurrent: true,
        color: const Color(0xFF1E3A8A),
        birthDate: '12/04/2010',
        gender: 'Học sinh • Dân tộc Kinh',
        placeOfBirth: 'Hà Nội, Việt Nam',
        parentInfo: '$userName - $userPhone',
        address: 'Hà Nội, Việt Nam',
        gpa: '9.3',
        gpaClassification: 'Xuất sắc',
        attendanceRatio: '25/26',
        attendanceStatus: 'Đúng giờ',
        scheduleToday: 'Hôm nay có 5 tiết học • Tiết 1: Toán Đại số lúc 07:15',
        urgentHomework: {
          'subject': 'Toán Đại số: Bài tập Khảo sát hàm số bậc hai',
          'deadline': 'Hạn chót: 23:59 hôm nay • ThS. Nguyễn Văn Hùng',
        },
      );
      _accounts = _accounts.map((a) => a.copyWith(isCurrent: false)).toList();
      _accounts.insert(0, newAcc);
    }
    notifyListeners();
  }
}
