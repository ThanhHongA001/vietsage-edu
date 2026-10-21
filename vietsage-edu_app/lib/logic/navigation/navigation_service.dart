import 'package:flutter/material.dart';
import 'app_routes.dart';

class NavigationService {
  static final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

  static BuildContext? get currentContext => navigatorKey.currentContext;

  // Generic navigation methods
  static Future<T?>? navigateTo<T>(String routeName, {dynamic arguments}) {
    return navigatorKey.currentState?.pushNamed<T>(routeName, arguments: arguments);
  }

  static Future<T?>? replaceWith<T, TO>(String routeName, {dynamic arguments, TO? result}) {
    return navigatorKey.currentState?.pushReplacementNamed<T, TO>(
      routeName,
      arguments: arguments,
      result: result,
    );
  }

  static Future<T?>? clearAndNavigateTo<T>(String routeName, {dynamic arguments}) {
    return navigatorKey.currentState?.pushNamedAndRemoveUntil<T>(
      routeName,
      (Route<dynamic> route) => false,
      arguments: arguments,
    );
  }

  static void goBack<T>([T? result]) {
    if (navigatorKey.currentState?.canPop() ?? false) {
      navigatorKey.currentState?.pop<T>(result);
    }
  }

  // Domain-specific Flow Helpers
  static void goToLogin() {
    clearAndNavigateTo(AppRoutes.login);
  }

  static void goToHome() {
    clearAndNavigateTo(AppRoutes.main);
  }

  static void goToForgotPassword() {
    navigateTo(AppRoutes.forgotPassword);
  }

  static void goToOtp() {
    navigateTo(AppRoutes.otp);
  }

  static void goToResetPassword() {
    replaceWith(AppRoutes.resetPassword);
  }

  static void goToAcademicResults() {
    navigateTo(AppRoutes.academicResults);
  }

  static void goToGradeDetail({
    required String subjectName,
    required String score,
    required String teacher,
  }) {
    navigateTo(
      AppRoutes.gradeDetail,
      arguments: {
        'subjectName': subjectName,
        'score': score,
        'teacher': teacher,
      },
    );
  }

  static void goToAttendance() {
    navigateTo(AppRoutes.attendance);
  }

  static void goToAttendanceHistory() {
    navigateTo(AppRoutes.attendanceHistory);
  }

  static void goToLeaveRequest() {
    navigateTo(AppRoutes.leaveRequest);
  }

  static void goToCanteen() {
    navigateTo(AppRoutes.canteen);
  }

  static void goToUniform() {
    navigateTo(AppRoutes.uniform);
  }

  static void goToEvents() {
    navigateTo(AppRoutes.events);
  }

  static void goToEventDetail({
    required String title,
    required String date,
    required String location,
    required String description,
    required IconData icon,
  }) {
    navigateTo(
      AppRoutes.eventDetail,
      arguments: {
        'title': title,
        'date': date,
        'location': location,
        'description': description,
        'icon': icon,
      },
    );
  }

  static void goToHomework() {
    navigateTo(AppRoutes.homework);
  }

  static void goToHomeworkDetail(Map<String, dynamic> task) {
    navigateTo(AppRoutes.homeworkDetail, arguments: {'task': task});
  }

  static void goToNotifications() {
    navigateTo(AppRoutes.notifications);
  }

  static void goToNotificationDetail({
    required String title,
    required String date,
    required String sender,
    required String content,
    String? imageUrl,
  }) {
    navigateTo(
      AppRoutes.notificationDetail,
      arguments: {
        'title': title,
        'date': date,
        'sender': sender,
        'content': content,
        'imageUrl': imageUrl,
      },
    );
  }

  static void goToStudentProfile() {
    navigateTo(AppRoutes.studentProfile);
  }

  static void goToAppearanceLanguage() {
    navigateTo(AppRoutes.appearanceLanguage);
  }

  static void goToAppNotificationsSetting() {
    navigateTo(AppRoutes.appNotificationsSetting);
  }
}
