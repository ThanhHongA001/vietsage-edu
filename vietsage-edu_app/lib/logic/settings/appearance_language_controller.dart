import 'package:flutter/material.dart';

class AppearanceLanguageController extends ChangeNotifier {
  static final AppearanceLanguageController _instance = AppearanceLanguageController._internal();
  factory AppearanceLanguageController() => _instance;
  AppearanceLanguageController._internal();

  String _selectedTheme = 'Sáng'; // 'Sáng', 'Tối', 'Hệ thống'
  String _selectedLanguage = 'Tiếng Việt'; // 'Tiếng Việt', 'English'

  String get selectedTheme => _selectedTheme;
  String get selectedLanguage => _selectedLanguage;

  bool get isDarkMode => _selectedTheme == 'Tối';
  bool get isVietnamese => _selectedLanguage == 'Tiếng Việt';
  bool get isEnglish => _selectedLanguage == 'English';

  ThemeMode get themeMode {
    switch (_selectedTheme) {
      case 'Tối':
        return ThemeMode.dark;
      case 'Hệ thống':
        return ThemeMode.system;
      case 'Sáng':
      default:
        return ThemeMode.light;
    }
  }

  Locale get locale {
    switch (_selectedLanguage) {
      case 'English':
        return const Locale('en', 'US');
      case 'Tiếng Việt':
      default:
        return const Locale('vi', 'VN');
    }
  }

  void setTheme(String theme) {
    if (_selectedTheme == theme) return;
    _selectedTheme = theme;
    notifyListeners();
  }

  void setLanguage(String lang) {
    if (_selectedLanguage == lang) return;
    _selectedLanguage = lang;
    notifyListeners();
  }

  /// Dịch chuỗi song ngữ tương thích thời gian thực
  String tr({required String vi, required String en}) {
    return isEnglish ? en : vi;
  }
}
