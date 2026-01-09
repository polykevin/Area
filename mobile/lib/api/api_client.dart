import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiClient {
  static final ApiClient _instance = ApiClient._internal();
  factory ApiClient() => _instance;

  late Dio dio;
  final _storage = const FlutterSecureStorage();
  String? _token;
  bool _initialized = false;

  ApiClient._internal();

  Future<void> init() async {
    if (_initialized) return;
    final prefs = await SharedPreferences.getInstance();
    final stored = prefs.getString('backend_url');

    const hardcodedFallback = 'http://192.168.1.228:8080';

    final base = (stored != null && stored.isNotEmpty) ? stored : hardcodedFallback;

    dio = Dio(
      BaseOptions(
        baseUrl: base,
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 10),
      ),
    );

    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = _token ?? await _storage.read(key: 'jwt');

          if (token != null && token.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $token';
          } else {
            options.headers.remove('Authorization');
          }

          return handler.next(options);
        },
      ),
    );

    _initialized = true;
  }

  String get baseUrl {
    if (!_initialized) {
      throw StateError('ApiClient not initialized. Call await ApiClient().init() first.');
    }
    return dio.options.baseUrl;
  }

  Future<void> setToken(String? token) async {
    _token = token;

    if (token == null || token.isEmpty) {
      await _storage.delete(key: 'jwt');
    } else {
      await _storage.write(key: 'jwt', value: token);
    }
  }
  Future<void> setBackendUrl(String? url) async {
    final prefs = await SharedPreferences.getInstance();
    if (url == null || url.isEmpty) {
      await prefs.remove('backend_url');
    } else {
      await prefs.setString('backend_url', url);
    }
    // update runtime baseUrl if initialized
    if (_initialized) {
      dio.options.baseUrl = url ?? dio.options.baseUrl;
    }
  }

  Future<void> loadTokenFromStorage() async {
    _token = await _storage.read(key: 'jwt');
  }
}
