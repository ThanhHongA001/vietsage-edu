import 'package:flutter/material.dart';

class AppNotificationsController extends ChangeNotifier {
  bool attendanceNotification = true;
  bool gradeNotification = true;
  bool homeworkNotification = true;
  bool serviceNotification = true;
  bool schoolEventsNotification = true;

  void toggleAttendance(bool val) {
    attendanceNotification = val;
    notifyListeners();
  }

  void toggleGrade(bool val) {
    gradeNotification = val;
    notifyListeners();
  }

  void toggleHomework(bool val) {
    homeworkNotification = val;
    notifyListeners();
  }

  void toggleService(bool val) {
    serviceNotification = val;
    notifyListeners();
  }

  void toggleSchoolEvents(bool val) {
    schoolEventsNotification = val;
    notifyListeners();
  }
}
