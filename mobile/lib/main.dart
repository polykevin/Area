import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'providers/areas_provider.dart';
import 'providers/services_provider.dart';
import 'providers/auth_provider.dart';

import 'api/areas_api.dart';

import 'screens/auth/login_screen.dart';
import 'screens/home/home_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final authProvider = AuthProvider();
  await authProvider.init();

  runApp(
    MultiProvider(
      providers: [
        // Auth provider (already initialized above)
        ChangeNotifierProvider<AuthProvider>.value(value: authProvider),

        // Services provider
        ChangeNotifierProvider<ServicesProvider>(
          create: (_) => ServicesProvider(),
        ),

        // Areas provider, wired to backend
        ChangeNotifierProvider<AreasProvider>(
          create: (_) {
            // TODO: adjust to your real backend URL
            const baseUrl = 'http://10.0.2.2:8080';

            // We use the token already loaded in authProvider.init()
            final token = authProvider.accessToken ?? '';

            return AreasProvider(
              api: AreasApi(
                baseUrl: baseUrl,
                token: token,
              ),
            );
          },
        ),
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

    return MaterialApp(
      title: 'AREA Mobile',
      theme: ThemeData(
        brightness: Brightness.light,
        scaffoldBackgroundColor: Colors.white,
        fontFamily: 'SF Pro',
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
      ),
      debugShowCheckedModeBanner: false,
      home: auth.isAuthenticated ? const HomeScreen() : const LoginScreen(),
      routes: {
        LoginScreen.routeName: (_) => const LoginScreen(),
        HomeScreen.routeName:   (_) => const HomeScreen(),
      },
    );
  }
}
