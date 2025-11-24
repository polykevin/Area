import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../api/auth_api.dart';
import '../models/auth_tokens.dart';
import '../models/user.dart';

class AuthProvider extends ChangeNotifier {
  final _storage = const FlutterSecureStorage();
  final _authApi = AuthApi();

  AuthTokens? _tokens;
  User? _user;

  bool get isAuthenticated => _tokens != null;
  User? get user => _user;

  Future<void> init() async {
    final token = await _storage.read(key: 'jwt');
    if (token != null && token.isNotEmpty) {
      _tokens = AuthTokens(accessToken: token);
      try {
        final meJson = await _authApi.getMe();
        _user = User.fromJson(meJson);
      } catch (_) {
        // token invalid
        await logout();
      }
    }
    notifyListeners();
  }

  Future<String?> login(String email, String password) async {
    try {
      final json = await _authApi.login(email, password);
      final tokens = AuthTokens.fromJson(json);
      _tokens = tokens;
      await _storage.write(key: 'jwt', value: tokens.accessToken);

      final meJson = await _authApi.getMe();
      _user = User.fromJson(meJson);

      notifyListeners();
      return null; // null = success
    } catch (e) {
      return 'Login failed: ${e.toString()}';
    }
  }

  Future<String?> register(String email, String password) async {
    try {
      final json = await _authApi.register(email, password);
      final tokens = AuthTokens.fromJson(json);
      _tokens = tokens;
      await _storage.write(key: 'jwt', value: tokens.accessToken);

      final meJson = await _authApi.getMe();
      _user = User.fromJson(meJson);

      notifyListeners();
      return null;
    } catch (e) {
      return 'Register failed: ${e.toString()}';
    }
  }

  Future<void> logout() async {
    _tokens = null;
    _user = null;
    await _storage.delete(key: 'jwt');
    notifyListeners();
  }
}
