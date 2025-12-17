import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/area.dart';

class AreasApi {
  final String baseUrl;
  final String token;

  AreasApi({
    required this.baseUrl,
    required this.token,
  });

  Map<String, String> get _headers => {
    'Authorization': 'Bearer $token',
    'Content-Type': 'application/json',
  };

  Future<List<Area>> fetchAreas() async {
    final uri = Uri.parse('$baseUrl/areas');
    final res = await http.get(uri, headers: _headers);

    if (res.statusCode != 200) {
      throw Exception('Failed to load areas: ${res.statusCode}');
    }

    final List<dynamic> data = json.decode(res.body);
    return data.map((e) => Area.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<Area> createArea({
    required String actionService,
    required String actionType,
    required Map<String, dynamic> actionParams,
    required String reactionService,
    required String reactionType,
    required Map<String, dynamic> reactionParams,
  }) async {
    final uri = Uri.parse('$baseUrl/areas');
    final body = json.encode({
      'actionService': actionService,
      'actionType': actionType,
      'actionParams': actionParams,
      'reactionService': reactionService,
      'reactionType': reactionType,
      'reactionParams': reactionParams,
    });

    final res = await http.post(uri, headers: _headers, body: body);

    if (res.statusCode != 201 && res.statusCode != 200) {
      throw Exception('Failed to create area: ${res.statusCode} ${res.body}');
    }

    final data = json.decode(res.body) as Map<String, dynamic>;
    return Area.fromJson(data);
  }

  Future<Area> updateArea({
    required int id,
    Map<String, dynamic>? actionParams,
    Map<String, dynamic>? reactionParams,
    bool? active,
  }) async {
    final uri = Uri.parse('$baseUrl/areas/$id');
    final payload = <String, dynamic>{};

    if (actionParams != null) payload['actionParams'] = actionParams;
    if (reactionParams != null) payload['reactionParams'] = reactionParams;
    if (active != null) payload['active'] = active;

    final res = await http.put(
      uri,
      headers: _headers,
      body: json.encode(payload),
    );

    if (res.statusCode != 200) {
      throw Exception('Failed to update area: ${res.statusCode} ${res.body}');
    }

    final data = json.decode(res.body) as Map<String, dynamic>;
    return Area.fromJson(data);
  }

  Future<void> deleteArea(int id) async {
    final uri = Uri.parse('$baseUrl/areas/$id');
    final res = await http.delete(uri, headers: _headers);

    if (res.statusCode != 200 && res.statusCode != 204) {
      throw Exception('Failed to delete area: ${res.statusCode} ${res.body}');
    }
  }
}
