// Tập hợp các mô hình dữ liệu (DTO Models) ánh xạ 1:1 với Backend API Vietsage Edu

// ==========================================
// 1. AUTH & USER MODELS
// ==========================================
class UserModel {
  final String id;
  final String email;
  final String fullName;
  final String role;
  final String? phone;
  final String? studentId;
  final String? studentName;
  final String? studentClass;

  UserModel({
    required this.id,
    required this.email,
    required this.fullName,
    required this.role,
    this.phone,
    this.studentId,
    this.studentName,
    this.studentClass,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? '',
      email: json['email'] ?? '',
      fullName: json['fullName'] ?? '',
      role: json['role'] ?? 'PARENT',
      phone: json['phone']?.toString(),
      studentId: json['studentId']?.toString(),
      studentName: json['studentName']?.toString(),
      studentClass: json['studentClass']?.toString(),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'email': email,
    'fullName': fullName,
    'role': role,
    'phone': phone,
    'studentId': studentId,
    'studentName': studentName,
    'studentClass': studentClass,
  };
}

class AuthData {
  final UserModel user;
  final String accessToken;
  final String refreshToken;
  final String tokenType;
  final int expiresIn;

  AuthData({
    required this.user,
    required this.accessToken,
    required this.refreshToken,
    required this.tokenType,
    required this.expiresIn,
  });

  factory AuthData.fromJson(Map<String, dynamic> json) {
    return AuthData(
      user: UserModel.fromJson(json['user'] ?? {}),
      accessToken: json['accessToken'] ?? '',
      refreshToken: json['refreshToken'] ?? '',
      tokenType: json['tokenType'] ?? 'Bearer',
      expiresIn: json['expiresIn'] ?? 900,
    );
  }
}

// ==========================================
// 2. ATTENDANCE MODELS
// ==========================================
class AttendanceRecord {
  final String id;
  final String studentId;
  final String studentName;
  final String className;
  final String timestamp;
  final String status; // PRESENT | LATE | EXCUSED | ABSENT
  final String? method; // HN212_FACIAL | RFID_CARD | MANUAL
  final String? note;
  final String? deviceName;

  AttendanceRecord({
    required this.id,
    required this.studentId,
    required this.studentName,
    required this.className,
    required this.timestamp,
    required this.status,
    this.method,
    this.note,
    this.deviceName,
  });

  factory AttendanceRecord.fromJson(Map<String, dynamic> json) {
    return AttendanceRecord(
      id: json['id'] ?? '',
      studentId: json['studentId'] ?? '',
      studentName: json['studentName'] ?? '',
      className: json['className'] ?? '',
      timestamp: json['timestamp'] ?? '',
      status: json['status'] ?? 'PRESENT',
      method: json['method'],
      note: json['note'],
      deviceName: json['deviceName'],
    );
  }
}

class AttendanceStats {
  final int totalScans;
  final int present;
  final int late;
  final int excused;
  final double attendanceRate;

  AttendanceStats({
    required this.totalScans,
    required this.present,
    required this.late,
    required this.excused,
    required this.attendanceRate,
  });

  factory AttendanceStats.fromJson(Map<String, dynamic> json) {
    return AttendanceStats(
      totalScans: json['totalScans'] ?? 0,
      present: json['present'] ?? 0,
      late: json['late'] ?? 0,
      excused: json['excused'] ?? 0,
      attendanceRate: (json['attendanceRate'] as num?)?.toDouble() ?? 100.0,
    );
  }
}

// ==========================================
// 3. LEAVE REQUEST MODELS
// ==========================================
class LeaveRequestItem {
  final String id;
  final String studentId;
  final String studentName;
  final String className;
  final String startDate;
  final String endDate;
  final String reason;
  final String phone;
  final String status; // PENDING | APPROVED | REJECTED
  final String? reviewNote;
  final String createdAt;

  LeaveRequestItem({
    required this.id,
    required this.studentId,
    required this.studentName,
    required this.className,
    required this.startDate,
    required this.endDate,
    required this.reason,
    required this.phone,
    required this.status,
    this.reviewNote,
    required this.createdAt,
  });

  factory LeaveRequestItem.fromJson(Map<String, dynamic> json) {
    return LeaveRequestItem(
      id: json['id'] ?? '',
      studentId: json['studentId'] ?? '',
      studentName: json['studentName'] ?? '',
      className: json['className'] ?? '',
      startDate: json['startDate'] ?? '',
      endDate: json['endDate'] ?? '',
      reason: json['reason'] ?? '',
      phone: json['phone'] ?? '',
      status: json['status'] ?? 'PENDING',
      reviewNote: json['reviewNote'],
      createdAt: json['createdAt'] ?? '',
    );
  }
}

// ==========================================
// 4. SCHEDULE & GRADES MODELS
// ==========================================
class ScheduleItem {
  final String id;
  final String className;
  final int dayOfWeek; // 2 -> 7, 8 (CN)
  final int period;
  final String subject;
  final String teacherName;
  final String room;
  final String startTime;
  final String endTime;

  ScheduleItem({
    required this.id,
    required this.className,
    required this.dayOfWeek,
    required this.period,
    required this.subject,
    required this.teacherName,
    required this.room,
    required this.startTime,
    required this.endTime,
  });

  factory ScheduleItem.fromJson(Map<String, dynamic> json) {
    return ScheduleItem(
      id: json['id'] ?? '',
      className: json['className'] ?? '',
      dayOfWeek: json['dayOfWeek'] ?? 2,
      period: json['period'] ?? 1,
      subject: json['subject'] ?? '',
      teacherName: json['teacherName'] ?? '',
      room: json['room'] ?? '',
      startTime: json['startTime'] ?? '',
      endTime: json['endTime'] ?? '',
    );
  }
}

class SubjectGrade {
  final String subject;
  final String score;
  final double averageScore;
  final String? evaluation;
  final double? scoreOral1;
  final double? scoreOral2;
  final double? score15m1;
  final double? score15m2;
  final double? score1Period;
  final double? scoreMidTerm;
  final double? scoreFinal;
  final List<double> score15m;
  final List<double> score45m;
  final double? scoreSemester;

  SubjectGrade({
    required this.subject,
    this.score = '',
    required this.averageScore,
    this.evaluation,
    this.scoreOral1,
    this.scoreOral2,
    this.score15m1,
    this.score15m2,
    this.score1Period,
    this.scoreMidTerm,
    this.scoreFinal,
    this.score15m = const [],
    this.score45m = const [],
    this.scoreSemester,
  });

  factory SubjectGrade.fromJson(Map<String, dynamic> json) {
    final avg = (json['averageScore'] as num?)?.toDouble() ??
        (double.tryParse(json['score']?.toString() ?? '') ?? 0.0);
    return SubjectGrade(
      subject: json['subject']?.toString() ?? '',
      score: json['score']?.toString() ?? avg.toStringAsFixed(1),
      averageScore: avg,
      evaluation: json['evaluation']?.toString(),
      scoreOral1: (json['scoreOral1'] as num?)?.toDouble(),
      scoreOral2: (json['scoreOral2'] as num?)?.toDouble(),
      score15m1: (json['score15m1'] as num?)?.toDouble(),
      score15m2: (json['score15m2'] as num?)?.toDouble(),
      score1Period: (json['score1Period'] as num?)?.toDouble(),
      scoreMidTerm: (json['scoreMidTerm'] as num?)?.toDouble(),
      scoreFinal: (json['scoreFinal'] as num?)?.toDouble(),
      score15m: (json['score15m'] as List<dynamic>?)
              ?.map((e) => (e as num).toDouble())
              .toList() ??
          [],
      score45m: (json['score45m'] as List<dynamic>?)
              ?.map((e) => (e as num).toDouble())
              .toList() ??
          [],
      scoreSemester: (json['scoreSemester'] as num?)?.toDouble(),
    );
  }
}

class StudentGradesSummary {
  final String studentId;
  final String? studentName;
  final String? className;
  final String semester;
  final String gpa;
  final String classification;
  final List<SubjectGrade> subjectGrades;

  StudentGradesSummary({
    required this.studentId,
    this.studentName,
    this.className,
    required this.semester,
    required this.gpa,
    required this.classification,
    required this.subjectGrades,
  });

  factory StudentGradesSummary.fromJson(Map<String, dynamic> json) {
    final rawSubjects = (json['subjects'] ?? json['subjectGrades']) as List<dynamic>?;
    return StudentGradesSummary(
      studentId: json['studentId']?.toString() ?? '',
      studentName: json['studentName']?.toString(),
      className: json['className']?.toString(),
      semester: json['semester']?.toString() ?? 'Học kỳ I',
      gpa: json['gpa']?.toString() ?? '0.0',
      classification: json['rank']?.toString() ?? json['classification']?.toString() ?? 'Đang cập nhật',
      subjectGrades: rawSubjects
              ?.map((e) => SubjectGrade.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }
}

// ==========================================
// 5. HOMEWORK MODELS
// ==========================================
class HomeworkSubmission {
  final String id;
  final String studentId;
  final String studentName;
  final String? content;
  final List<String> fileUrls;
  final String submittedAt;
  final double? score;
  final String? feedback;

  HomeworkSubmission({
    required this.id,
    required this.studentId,
    required this.studentName,
    this.content,
    required this.fileUrls,
    required this.submittedAt,
    this.score,
    this.feedback,
  });

  factory HomeworkSubmission.fromJson(Map<String, dynamic> json) {
    return HomeworkSubmission(
      id: json['id'] ?? '',
      studentId: json['studentId'] ?? '',
      studentName: json['studentName'] ?? '',
      content: json['content'],
      fileUrls: (json['fileUrls'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      submittedAt: json['submittedAt'] ?? '',
      score: (json['score'] as num?)?.toDouble(),
      feedback: json['feedback'],
    );
  }
}

class HomeworkItem {
  final String id;
  final String title;
  final String subject;
  final String className;
  final String teacherName;
  final String deadline;
  final String description;
  final String status; // PENDING | SUBMITTED | GRADED
  final int submissionCount;
  final int totalStudents;
  final HomeworkSubmission? mySubmission;

  HomeworkItem({
    required this.id,
    required this.title,
    required this.subject,
    required this.className,
    required this.teacherName,
    required this.deadline,
    required this.description,
    required this.status,
    required this.submissionCount,
    required this.totalStudents,
    this.mySubmission,
  });

  factory HomeworkItem.fromJson(Map<String, dynamic> json) {
    return HomeworkItem(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      subject: json['subject'] ?? '',
      className: json['className'] ?? '',
      teacherName: json['teacherName'] ?? '',
      deadline: json['deadline'] ?? '',
      description: json['description'] ?? '',
      status: json['status'] ?? 'PENDING',
      submissionCount: json['submissionCount'] ?? 0,
      totalStudents: json['totalStudents'] ?? 0,
      mySubmission: json['mySubmission'] != null
          ? HomeworkSubmission.fromJson(json['mySubmission'])
          : null,
    );
  }
}

// ==========================================
// 6. CANTEEN MODELS
// ==========================================
class CanteenMealItem {
  final String id;
  final String dayOfWeek;
  final String dayName;
  final String? date;
  final String mainDish;
  final String sideDish;
  final String soup;
  final String dessert;
  final int nutritionKcal;
  final int registeredCount;

  CanteenMealItem({
    required this.id,
    required this.dayOfWeek,
    required this.dayName,
    this.date,
    required this.mainDish,
    required this.sideDish,
    required this.soup,
    required this.dessert,
    required this.nutritionKcal,
    required this.registeredCount,
  });

  factory CanteenMealItem.fromJson(Map<String, dynamic> json) {
    return CanteenMealItem(
      id: json['id'] ?? '',
      dayOfWeek: json['dayOfWeek'] ?? '',
      dayName: json['dayName'] ?? '',
      date: json['date'],
      mainDish: json['mainDish'] ?? '',
      sideDish: json['sideDish'] ?? '',
      soup: json['soup'] ?? '',
      dessert: json['dessert'] ?? '',
      nutritionKcal: json['nutritionKcal'] ?? 0,
      registeredCount: json['registeredCount'] ?? 0,
    );
  }
}

// ==========================================
// 7. UNIFORM MODELS
// ==========================================
class UniformProduct {
  final String id;
  final String name;
  final String category;
  final double price;
  final String gradeGroup;
  final List<String> sizes;
  final int stock;
  final String? imageUrl;
  final String? description;

  UniformProduct({
    required this.id,
    required this.name,
    required this.category,
    required this.price,
    required this.gradeGroup,
    required this.sizes,
    required this.stock,
    this.imageUrl,
    this.description,
  });

  factory UniformProduct.fromJson(Map<String, dynamic> json) {
    return UniformProduct(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      category: json['category'] ?? '',
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      gradeGroup: json['gradeGroup'] ?? '',
      sizes: (json['sizes'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      stock: json['stock'] ?? 0,
      imageUrl: json['imageUrl'],
      description: json['description'],
    );
  }
}

class UniformOrder {
  final String id;
  final String orderCode;
  final String studentName;
  final String studentClass;
  final List<dynamic> items;
  final double totalAmount;
  final String status; // PENDING | CONFIRMED | READY | COMPLETED
  final String orderDate;

  UniformOrder({
    required this.id,
    required this.orderCode,
    required this.studentName,
    required this.studentClass,
    required this.items,
    required this.totalAmount,
    required this.status,
    required this.orderDate,
  });

  factory UniformOrder.fromJson(Map<String, dynamic> json) {
    return UniformOrder(
      id: json['id'] ?? '',
      orderCode: json['orderCode'] ?? '',
      studentName: json['studentName'] ?? '',
      studentClass: json['studentClass'] ?? '',
      items: json['items'] ?? [],
      totalAmount: (json['totalAmount'] as num?)?.toDouble() ?? 0.0,
      status: json['status'] ?? 'PENDING',
      orderDate: json['orderDate'] ?? '',
    );
  }
}

// ==========================================
// 8. EVENTS & ANNOUNCEMENTS MODELS
// ==========================================
class EventItem {
  final String id;
  final String title;
  final String category;
  final String date;
  final String time;
  final String location;
  final String organizer;
  final String description;
  final int participantsCount;
  final String? imageUrl;

  EventItem({
    required this.id,
    required this.title,
    required this.category,
    required this.date,
    required this.time,
    required this.location,
    required this.organizer,
    required this.description,
    required this.participantsCount,
    this.imageUrl,
  });

  factory EventItem.fromJson(Map<String, dynamic> json) {
    return EventItem(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      category: json['category'] ?? '',
      date: json['date'] ?? '',
      time: json['time'] ?? '',
      location: json['location'] ?? '',
      organizer: json['organizer'] ?? '',
      description: json['description'] ?? '',
      participantsCount: json['participantsCount'] ?? 0,
      imageUrl: json['imageUrl'],
    );
  }
}

class AnnouncementItem {
  final String id;
  final String title;
  final String category;
  final String priority;
  final String date;
  final String sender;
  final String content;
  final bool isRead;
  final String? imageUrl;

  AnnouncementItem({
    required this.id,
    required this.title,
    required this.category,
    required this.priority,
    required this.date,
    required this.sender,
    required this.content,
    required this.isRead,
    this.imageUrl,
  });

  factory AnnouncementItem.fromJson(Map<String, dynamic> json) {
    return AnnouncementItem(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      category: json['category'] ?? 'Chung',
      priority: json['priority'] ?? 'NORMAL',
      date: json['date'] ?? '',
      sender: json['sender'] ?? 'Nhà Trường',
      content: json['content'] ?? '',
      isRead: json['isRead'] ?? false,
      imageUrl: json['imageUrl'],
    );
  }
}

// ==========================================
// 9. DASHBOARD SUMMARY MODEL
// ==========================================
class DashboardSummary {
  final int totalStudents;
  final int totalTeachers;
  final int totalClasses;
  final int onlineDevices;
  final double attendanceRate;
  final int pendingLeaveRequests;
  final int activeHomeworks;
  final double uniformRevenue;

  DashboardSummary({
    required this.totalStudents,
    required this.totalTeachers,
    required this.totalClasses,
    required this.onlineDevices,
    required this.attendanceRate,
    required this.pendingLeaveRequests,
    required this.activeHomeworks,
    required this.uniformRevenue,
  });

  factory DashboardSummary.fromJson(Map<String, dynamic> json) {
    final attToday = json['attendanceToday'] as Map<String, dynamic>?;
    return DashboardSummary(
      totalStudents: json['totalStudents'] ?? 0,
      totalTeachers: json['totalTeachers'] ?? 0,
      totalClasses: json['totalClasses'] ?? 0,
      onlineDevices: json['onlineDevices'] ?? 0,
      attendanceRate: (attToday?['attendanceRate'] as num?)?.toDouble() ?? 0.0,
      pendingLeaveRequests: json['pendingLeaveRequests'] ?? 0,
      activeHomeworks: json['activeHomeworks'] ?? 0,
      uniformRevenue: (json['uniformRevenue'] as num?)?.toDouble() ?? 0.0,
    );
  }
}
