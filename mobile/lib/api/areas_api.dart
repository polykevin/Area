import 'package:dio/dio.dart';
import 'api_client.dart';
import '../models/area.dart';

class AreasApi {
  final Dio _dio = ApiClient().dio;

  Future<List<Area>> fetchAreas() async {
    final res = await _dio.get('/areas');

    final data = res.data as List<dynamic>;
    return data
        .map((e) => Area.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<Area> createArea({
    required String actionService,
    required String actionType,
    required Map<String, dynamic> actionParams,
    required String reactionService,
    required String reactionType,
    required Map<String, dynamic> reactionParams,
    String? name,
    required String description,
  }) async {
    final payload = <String, dynamic>{
      if (name != null) 'name': name,
      'description': description,
      'actionService': actionService,
      'actionType': actionType,
      'actionParams': actionParams,
      'reactionService': reactionService,
      'reactionType': reactionType,
      'reactionParams': reactionParams,
    };

    final res = await _dio.post('/areas', data: payload);
    return Area.fromJson(res.data as Map<String, dynamic>);
  }

  Future<Area> updateArea({
    required int id,
    Map<String, dynamic>? actionParams,
    Map<String, dynamic>? reactionParams,
    bool? active,
    String? name,
  }) async {
    final payload = <String, dynamic>{};
    if (name != null) payload['name'] = name;
    if (actionParams != null) payload['actionParams'] = actionParams;
    if (reactionParams != null) payload['reactionParams'] = reactionParams;
    if (active != null) payload['active'] = active;

    final res = await _dio.put('/areas/$id', data: payload);
    return Area.fromJson(res.data as Map<String, dynamic>);
  }

  Future<void> deleteArea(int id) async {
    await _dio.delete('/areas/$id');
  }
}
