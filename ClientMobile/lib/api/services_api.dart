import 'package:dio/dio.dart';

import 'api_client.dart';
import '../models/service.dart';

class ServicesApi {
  final Dio _dio = ApiClient().dio;

  Future<List<Service>> getServices() async {
    final response = await _dio.get('/services');
    final data = response.data as List<dynamic>;
    return data.map((e) => Service.fromJson(e as Map<String, dynamic>)).toList();
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
