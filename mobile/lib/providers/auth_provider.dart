import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:image_picker/image_picker.dart';

import '../api/auth_api.dart';
import '../api/api_client.dart';
import '../models/auth_tokens.dart';
import '../models/user.dart';

class AuthProvider extends ChangeNotifier {
  final _storage = const FlutterSecureStorage();
  final _authApi = AuthApi();

  final GoogleSignIn _googleSignIn = GoogleSignIn(
    scopes: <String>['email', 'profile'],
    serverClientId: '1008857371236-3d09ddvj4l7p3deubnufbih0susfpt5a.apps.googleusercontent.com',
  );

  GoogleSignInAccount? _googleAccount;
  AuthTokens? _tokens;
  User? _user;

  static const _avatarKeyPrefix = 'avatarIndex_';
  static const _avatarPathKeyPrefix = 'avatarPath_';
  int _localAvatarIndex = 0;
  String? _localAvatarPath;

  bool get isAuthenticated => _tokens != null;
  User? get user => _user;
  bool get isGoogleUser => _user?.isGoogle ?? false;
  String? get accessToken => _tokens?.accessToken;

  String? get avatarUrl {
    if (!isGoogleUser && _localAvatarPath != null && _localAvatarPath!.isNotEmpty) {
      return _localAvatarPath;
    }
    return _user?.photoUrl;
  }

  int get localAvatarIndex => _localAvatarIndex;

  Future<void> init() async {
    await ApiClient().loadTokenFromStorage();
    final token = await _storage.read(key: 'jwt');
    _googleAccount = await _googleSignIn.signInSilently();
    if (token != null && token.isNotEmpty) {
      _tokens = AuthTokens(accessToken: token);
      try {
        final meJson = await _authApi.getMe();
        if (_googleAccount != null) {
          meJson['displayName'] ??= _googleAccount!.displayName;
          meJson['photoUrl'] ??= _googleAccount!.photoUrl;
        }
        _user = User.fromJson(meJson);

        final idxStr = await _storage.read(key: '$_avatarKeyPrefix${_user!.id}');
        if (idxStr != null) {
          _localAvatarIndex = int.tryParse(idxStr) ?? 0;
        }

        final pathStr = await _storage.read(key: '$_avatarPathKeyPrefix${_user!.id}');
        _localAvatarPath = pathStr;
      } catch (_) {
        await logout();
      }
    }
    notifyListeners();
  }

  Future<String?> login(String email, String password) async {
    try {
      _googleAccount = null;
      final json = await _authApi.login(email, password);
      final tokens = AuthTokens.fromJson(json);
      _tokens = tokens;
      await ApiClient().setToken(tokens.accessToken);

      final meJson = await _authApi.getMe();
      _user = User.fromJson(meJson);

      final idxStr = await _storage.read(key: '$_avatarKeyPrefix${_user!.id}');
      _localAvatarIndex = int.tryParse(idxStr ?? '0') ?? 0;

      final pathStr = await _storage.read(key: '$_avatarPathKeyPrefix${_user!.id}');
      _localAvatarPath = pathStr;

      notifyListeners();
      return null;
    } catch (e) {
      return 'Login failed: ${e.toString()}';
    }
  }

  Future<String?> register(String email, String password) async {
    try {
      await _authApi.register(email, password);
      final loginError = await login(email, password);
      if (loginError != null) {
        return loginError;
      }

      return null;
    } catch (e) {
      return 'Register failed: ${e.toString()}';
    }
  }

  Future<void> changeLocalAvatar() async {
    if (_user == null) return;
    if (isGoogleUser) return;

    _localAvatarIndex = (_localAvatarIndex + 1) % 6;
    await _storage.write(
      key: '$_avatarKeyPrefix${_user!.id}',
      value: _localAvatarIndex.toString(),
    );

    _localAvatarPath = null;
    await _storage.delete(key: '$_avatarPathKeyPrefix${_user!.id}');

    notifyListeners();
  }

  Future<void> setLocalAvatarFromFile(XFile file) async {
    if (_user == null) return;
    if (isGoogleUser) return;

    _localAvatarPath = file.path;
    await _storage.write(
      key: '$_avatarPathKeyPrefix${_user!.id}',
      value: _localAvatarPath!,
    );

    notifyListeners();
  }

  Future<String?> loginWithGoogle() async {
    try {
      await _googleSignIn.signOut();

      final account = await _googleSignIn.signIn();
      if (account == null) {
        return 'Login canceled';
      }

      _googleAccount = account;

      final auth = await account.authentication;
      final idToken = auth.idToken;

      if (idToken == null || idToken.isEmpty) {
        return 'Failed to retrieve idToken from Google';
      }

      debugPrint('GOOGLE ID TOKEN (first 40 chars): ${idToken.substring(0, 40)}...');

      final json = await _authApi.loginWithGoogleIdToken(idToken);
      

      final tokens = AuthTokens.fromJson(json);
      _tokens = tokens;
      await ApiClient().setToken(tokens.accessToken);

      final meJson = await _authApi.getMe();
      meJson['displayName'] ??= account.displayName;
      meJson['photoUrl'] ??= account.photoUrl;
      _user = User.fromJson(meJson);
      _localAvatarIndex = 0;
      _localAvatarPath = null;

      debugPrint('LOGIN OK, JWT = ${tokens.accessToken}');
      notifyListeners();
      return null;
    } catch (e, st) {
      debugPrint('Google login failed: $e');
      debugPrint('STACKTRACE: $st');

      await logout();

      return 'Google login failed: ${e.toString()}';
    }
  }



  Future<String?> loginWithGoogleToken(String token) async {
    try {
      _tokens = AuthTokens(accessToken: token);
      await _storage.write(key: 'jwt', value: token);

      final meJson = await _authApi.getMe();
      _user = User.fromJson(meJson);
      _localAvatarPath = null;

      notifyListeners();
      return null;
    } catch (e) {
      await logout();
      return 'Google login failed: ${e.toString()}';
    }
  }

  Future<void> completeOAuthLogin(String accessToken) async {
    _tokens = AuthTokens(accessToken: accessToken);
    await _storage.write(key: 'jwt', value: accessToken);

    final meJson = await _authApi.getMe();
    _user = User.fromJson(meJson);
    _localAvatarPath = null;

    notifyListeners();
  }

  Future<void> logout() async {
    _tokens = null;
    _user = null;
    _googleAccount = null;
    _localAvatarIndex = 0;
    _localAvatarPath = null;
    await _googleSignIn.signOut();
    await ApiClient().setToken(null);
    notifyListeners();
  }
}
