import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiClient {
  static final ApiClient _instance = ApiClient._internal();
  factory ApiClient() => _instance;

  late final Dio dio;
  final _storage = const FlutterSecureStorage();

  String? _token;

  ApiClient._internal() {
    dio = Dio(
      BaseOptions(
        baseUrl: 'http://192.168.1.35:8080', //local ip lan address
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
  }

  Future<void> setToken(String? token) async {
    _token = token;

    if (token == null || token.isEmpty) {
      await _storage.delete(key: 'jwt');
    } else {
      await _storage.write(key: 'jwt', value: token);
    }
  }

  Future<void> loadTokenFromStorage() async {
    _token = await _storage.read(key: 'jwt');
  }
}
