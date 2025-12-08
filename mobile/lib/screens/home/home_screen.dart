import 'dart:io';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/auth_provider.dart';
import '../areas/areas_screen.dart';
import '../services/services_screen.dart';
import '../auth/login_screen.dart';
import '../auth/register_screen.dart';
import '../profile/profile_screen.dart';

class HomeScreen extends StatefulWidget {
  static const routeName = '/home';

  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _index = 0;

  final _screens = const [
    ServicesScreen(),
    AreasScreen(),
  ];

  void _goToLogin() {
    Navigator.of(context).push(
      MaterialPageRoute(builder: (_) => const LoginScreen()),
    );
  }

  void _goToRegister() {
    Navigator.of(context).push(
      MaterialPageRoute(builder: (_) => const RegisterScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    final avatarUrl = auth.avatarUrl;
    ImageProvider? avatarImage;
    if (avatarUrl != null) {
      if (avatarUrl.startsWith('http')) {
        avatarImage = NetworkImage(avatarUrl);
      } else {
        avatarImage = FileImage(File(avatarUrl));
      }
    }

    return Scaffold(
      appBar: AppBar(
        title: Text('AREA – ${auth.user?.email ?? ''}'),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: GestureDetector(
              onTap: () {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (_) => const ProfileScreen(),
                  ),
                );
              },
              child: CircleAvatar(
                radius: 18,
                backgroundColor: Colors.purple,
                backgroundImage: avatarImage,
                child: avatarImage == null
                    ? const Icon(Icons.person, color: Colors.white)
                    : null,
              ),
            ),
          ),
        ],
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            SizedBox(
              height: 100,
              child: DrawerHeader(
                decoration: const BoxDecoration(color: Colors.blue),
                child: Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    'Menu',
                    style: Theme.of(context)
                        .textTheme
                        .titleLarge
                        ?.copyWith(color: Colors.white),
                  ),
                ),
              ),
            ),
            ListTile(
              leading: const Icon(Icons.extension),
              title: const Text('Services'),
              onTap: () {
                setState(() => _index = 0);
                Navigator.pop(context);
              },
            ),
            ListTile(
              leading: const Icon(Icons.account_tree),
              title: const Text('AREAs'),
              onTap: () {
                setState(() => _index = 1);
                Navigator.pop(context);
              },
            ),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.login),
              title: const Text('Login'),
              onTap: _goToLogin,
            ),
            ListTile(
              leading: const Icon(Icons.app_registration),
              title: const Text('Register'),
              onTap: _goToRegister,
            ),
          ],
        ),
      ),
      body: _screens[_index],
    );
  }
}
