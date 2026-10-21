import 'dart:io';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:vietsage_edu/core/network/services/api_services.dart';

class RealHttpOverrides extends HttpOverrides {}

void main() {
  setUpAll(() {
    HttpOverrides.global = RealHttpOverrides();
    SharedPreferences.setMockInitialValues({});
    // Ép buộc ApiConfig dùng localhost của desktop
    ApiConfig.setBaseUrl(ApiConfig.localDesktopUrl);
  });

  group('VietSage Edu API Integration Tests', () {
    test('1. Auth Login - Valid Phone & Password', () async {
      final res = await ApiServices.auth.login(
        phone: '0988123456',
        password: 'AdminPassword_123!',
      );
      if (!res.success) {
        final parentRes = await ApiServices.auth.login(
          phone: '0988123456',
          password: '12345678',
        );
        expect(parentRes.success, isTrue);
        expect(parentRes.data?.user.fullName, isNotEmpty);
        expect(parentRes.data?.accessToken, isNotEmpty);
      } else {
        expect(res.success, isTrue);
        expect(res.data?.accessToken, isNotEmpty);
      }
    });

    test('2. Auth - Forgot Password & OTP', () async {
      final forgotRes = await ApiServices.auth.forgotPassword('0988123456');
      expect(forgotRes.success, isTrue);

      final otp = forgotRes.data?['otp']?.toString() ?? '123456';
      final verifyRes = await ApiServices.auth.verifyOtp(otp, '0988123456');
      expect(verifyRes.success, isTrue);
    });

    test('3. Dashboard Summary', () async {
      final res = await ApiServices.dashboard.getSummary();
      expect(res.success, isTrue);
      expect(res.data, isNotNull);
      expect(res.data!.totalStudents, greaterThan(0));
    });

    test('4. Students & Classes', () async {
      final classesRes = await ApiServices.student.getClasses();
      expect(classesRes.success, isTrue);
      expect(classesRes.data, isNotNull);

      final studentsRes = await ApiServices.student.getStudents(className: '10A1');
      expect(studentsRes.success, isTrue);
    });

    test('5. Attendance History & Stats', () async {
      final historyRes = await ApiServices.attendance.getAttendanceHistory(limit: 10);
      expect(historyRes.success, isTrue);

      final statsRes = await ApiServices.attendance.getStats(className: '10A1');
      expect(statsRes.success, isTrue);
    });

    test('6. Leave Requests', () async {
      final listRes = await ApiServices.leaveRequest.getLeaveRequests();
      expect(listRes.success, isTrue);

      final createRes = await ApiServices.leaveRequest.createLeaveRequest(
        startDate: '2026-10-25',
        endDate: '2026-10-26',
        reason: 'Khám sức khỏe răng miệng theo lịch',
        phone: '0988123456',
        studentName: 'Nguyễn Minh Quân',
        className: '10A1',
      );
      expect(createRes.success, isTrue);
    });

    test('7. Grades', () async {
      final gradesRes = await ApiServices.grades.getStudentGrades(studentId: 'hs_001');
      expect(gradesRes.success, isTrue);
      expect(gradesRes.data?.subjectGrades, isNotEmpty);
    });

    test('8. Homework', () async {
      final hwRes = await ApiServices.homework.getHomeworkList();
      expect(hwRes.success, isTrue);
      expect(hwRes.data, isNotNull);
    });

    test('9. Canteen Menu & Meal Registration', () async {
      final menuRes = await ApiServices.canteen.getWeeklyMenu();
      expect(menuRes.success, isTrue);

      final todayRes = await ApiServices.canteen.getTodayMeal();
      expect(todayRes.success, isTrue);

      final regRes = await ApiServices.canteen.registerMeal(
        studentId: 'hs_001',
        studentName: 'Nguyễn Minh Quân',
        dayId: 't4',
        selectedItems: ['Sườn Heo Ram', 'Canh Cua Mồng Tơi'],
      );
      expect(regRes.success, isTrue);
    });

    test('10. Uniform Catalog & Orders', () async {
      final catalogRes = await ApiServices.uniform.getUniforms();
      expect(catalogRes.success, isTrue);

      final ordersRes = await ApiServices.uniform.getOrders();
      expect(ordersRes.success, isTrue);

      final newOrderRes = await ApiServices.uniform.createOrder(
        items: [
          {'name': 'Áo Sơ Mi Nam Tay Ngắn', 'size': 'L', 'quantity': 1, 'unitPrice': 150000}
        ],
        totalAmount: 150000,
        studentName: 'Nguyễn Minh Quân',
        studentClass: '10A1',
      );
      expect(newOrderRes.success, isTrue);
    });

    test('11. School Events', () async {
      final eventsRes = await ApiServices.events.getEvents();
      expect(eventsRes.success, isTrue);
      expect(eventsRes.data, isNotEmpty);
    });

    test('12. School Announcements', () async {
      final annRes = await ApiServices.announcements.getAnnouncements();
      expect(annRes.success, isTrue);
      expect(annRes.data, isNotEmpty);
    });

    test('13. Class Schedules', () async {
      final schedRes = await ApiServices.schedules.getSchedules(className: '10A1');
      expect(schedRes.success, isTrue);
    });
  });
}
