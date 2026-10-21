import 'package:flutter/material.dart';
import '../auth/auth_flow_controller.dart';
import '../navigation/navigation_service.dart';

class SettingsController extends ChangeNotifier {
  void openProfile() => NavigationService.goToStudentProfile();
  void openChangePassword() => NavigationService.goToForgotPassword();
  void openNotificationsSetting() => NavigationService.goToAppNotificationsSetting();
  void openAppearanceLanguage() => NavigationService.goToAppearanceLanguage();

  void logout(BuildContext context) {
    AuthFlowController().logout(context);
  }
}
