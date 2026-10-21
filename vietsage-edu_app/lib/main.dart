import 'package:flutter/material.dart';
import 'logic/navigation/app_router.dart';
import 'logic/navigation/app_routes.dart';
import 'logic/navigation/navigation_service.dart';
import 'logic/settings/appearance_language_controller.dart';
import 'ui/theme/app_theme.dart';

void main() {
  runApp(const VietsageEduApp());
}

class VietsageEduApp extends StatelessWidget {
  const VietsageEduApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: AppearanceLanguageController(),
      builder: (context, _) {
        final settings = AppearanceLanguageController();
        return MaterialApp(
          title: 'Vietsage Edu',
          debugShowCheckedModeBanner: false,
          theme: AppTheme.lightTheme,
          darkTheme: AppTheme.darkTheme,
          themeMode: settings.themeMode,
          locale: settings.locale,
          navigatorKey: NavigationService.navigatorKey,
          initialRoute: AppRoutes.login,
          onGenerateRoute: AppRouter.onGenerateRoute,
        );
      },
    );
  }
}
