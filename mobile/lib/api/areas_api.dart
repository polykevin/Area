import 'package:dio/dio.dart';

import 'api_client.dart';
import '../models/area.dart';

class AreasApi {
  final Dio _dio = ApiClient().dio;

  Future<List<Area>> getAreas() async {
    final response = await _dio.get('/areas');
    final data = response.data as List<dynamic>;
    return data
        .map((e) => Area.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<Area> createArea({
    required String name,
    required String actionService,
    required String actionLabel,
    required String reactionService,
    required String reactionLabel,
  }) async {
    final response = await _dio.post(
      '/areas',
      data: {
        'name': name,
        'action_service': actionService,
        'action_label': actionLabel,
        'reaction_service': reactionService,
        'reaction_label': reactionLabel,
      },
    );

    return Area.fromJson(response.data as Map<String, dynamic>);
  }

  Future<Area> toggleArea(String id) async {
    final response = await _dio.patch('/areas/$id/toggle');
    return Area.fromJson(response.data as Map<String, dynamic>);
  }

  Future<void> deleteArea(String id) async {
    await _dio.delete('/areas/$id');
  }
}
