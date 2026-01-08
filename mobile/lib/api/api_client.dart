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
        //baseUrl: 'http://10.68.251.81:8080', //local ip lan address, this is the epitech one
        baseUrl: 'http://10.192.64.132:8080', //this is my home in france
        //baseUrl: 'http://10.68.240.88:8080', //this is another epitech one
        //baseUrl: 'http://192.168.0.161:8080',
        //baseUrl: 'http://10.68.246.170:8080', //this is another epitech one
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

  String get baseUrl => dio.options.baseUrl;

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
