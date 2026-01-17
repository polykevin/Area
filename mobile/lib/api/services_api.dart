import 'package:dio/dio.dart';

import 'api_client.dart';
import '../models/service.dart';

class ServicesApi {
  final Dio _dio = ApiClient().dio;

  Future<List<Service>> getServices() async {
    try {
      final response = await _dio.get('/services');
      final raw = response.data;
      print('[DEBUG] /services raw = $raw');
      print('[DEBUG] /services rawType = ${raw.runtimeType}');

      final List<dynamic> data;
      if (raw is List) {
        data = raw;
      } else if (raw is Map<String, dynamic>) {
        if (raw['services'] is List) {
          data = raw['services'] as List<dynamic>;
        } else if (raw['data'] is List) {
          data = raw['data'] as List<dynamic>;
        } else {
          throw Exception('Unexpected /services response shape: $raw');
        }
      } else {
        throw Exception('Unexpected /services response type: ${raw.runtimeType}');
      }

      return data
          .map((e) => Service.fromJson(e as Map<String, dynamic>))
          .toList();
    } catch (e) {
      print('[ERROR] ServicesApi.getServices - error: $e');
      rethrow;
    }
  }

  Future<Service> connectService(String serviceName) async {
    final response = await _dio.post('/services/$serviceName/connect');
    return Service.fromJson(response.data as Map<String, dynamic>);
  }

  Future<Service> disconnectService(String serviceName) async {
    final response = await _dio.post('/services/$serviceName/disconnect');
    return Service.fromJson(response.data as Map<String, dynamic>);
  }
}
