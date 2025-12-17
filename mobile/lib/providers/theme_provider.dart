import 'package:flutter/material.dart';

class ThemeProvider extends ChangeNotifier {
  bool _isDark = false;

  bool get isDark => _isDark;

  ThemeData get currentTheme => _isDark ? darkTheme : lightTheme;

  ThemeMode get themeMode => _isDark ? ThemeMode.dark : ThemeMode.light;

  void toggleTheme() {
    _isDark = !_isDark;
    notifyListeners();
  }
}

// Light theme
final lightTheme = ThemeData(
  colorScheme: ColorScheme.light(
    surface: Colors.white,
    onSurface: Colors.black,
    primary: Colors.black,
    onPrimary: Colors.white,
    secondary: Colors.grey,
    onSecondary: Colors.black,
    error: Colors.red,
    onError: Colors.white,
  ),
);

final darkTheme = ThemeData(
  colorScheme: ColorScheme.dark(
    surface: Colors.black,
    onSurface: Colors.white,
    primary: Colors.white,
    onPrimary: Colors.black,
    secondary: Colors.grey,
    onSecondary: Colors.white,
    error: Colors.red,
    onError: Colors.black,
  ),
);

