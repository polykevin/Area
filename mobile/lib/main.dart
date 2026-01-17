import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/areas_provider.dart';
import 'providers/services_provider.dart';
import 'providers/theme_provider.dart';
import 'providers/auth_provider.dart';

import 'api/areas_api.dart';
import 'api/api_client.dart';

import 'screens/auth/login_screen.dart';
import 'screens/home/home_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await ApiClient().setBackendUrl("http://192.168.1.172:8080"); // Paul's local dev server
  //await ApiClient().setBackendUrl("http://10.68.251.81:8080"); //local ip lan address, this is the epitech one
  //await ApiClient().setBackendUrl("http://10.192.64.132:8080"); //this is my home in france
  //await ApiClient().setBackendUrl("http://10.68.240.88:8080"); //this is another epitech one
  //await ApiClient().setBackendUrl("http://192.168.0.161:8080");
  //await ApiClient().setBackendUrl("http://10.68.246.170:8080"); //this is another epitech one
  await ApiClient().init();
  final authProvider = AuthProvider();
  await authProvider.init();

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider<AuthProvider>.value(value: authProvider),
        ChangeNotifierProvider(create: (_) => ServicesProvider()),
        ChangeNotifierProvider(create: (_) => AreasProvider(api: AreasApi())),
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
      ],
      child: const AreaApp(),
    ),
  );
}


class AreaApp extends StatelessWidget {
  const AreaApp({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    print("JWT FROM AUTH PROVIDER: ${auth.accessToken}");
    final themeProvider = context.watch<ThemeProvider>();

    return MaterialApp(
      title: 'AREA Mobile',

      // Light theme
      theme: ThemeData(
        brightness: Brightness.light,
        scaffoldBackgroundColor: Colors.white,
        fontFamily: 'SF Pro',
        textTheme: const TextTheme(
          bodyLarge: TextStyle(color: Colors.black), // text1
          bodyMedium: TextStyle(color: Colors.black),
          titleMedium: TextStyle(color: Colors.white), // text2
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: const Color(0xFFF2F2F7),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide.none,
          ),
          contentPadding:
          const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white,
          foregroundColor: Colors.black,
          elevation: 0,
        ),
      ),

      // Dark theme
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: Colors.black,
        fontFamily: 'SF Pro',
        textTheme: const TextTheme(
          bodyLarge: TextStyle(color: Colors.white), // text1
          bodyMedium: TextStyle(color: Colors.white),
          titleMedium: TextStyle(color: Colors.black), // text2
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: const Color(0xFF2C2C2E),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide.none,
          ),
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.black,
          foregroundColor: Colors.white,
          elevation: 0,
        ),
      ),

      // Theme mode from provider
      themeMode: themeProvider.themeMode,
      debugShowCheckedModeBanner: false,
      home: auth.isAuthenticated ? const HomeScreen() : const LoginScreen(),
      routes: {
        LoginScreen.routeName: (_) => const LoginScreen(),
        HomeScreen.routeName:   (_) => const HomeScreen(),
      },
    );
  }
}