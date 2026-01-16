import 'package:flutter/foundation.dart';

import '../models/area.dart';
import '../api/areas_api.dart';

class AreasProvider with ChangeNotifier {
  final AreasApi _api;

  AreasProvider({required AreasApi api}) : _api = api;

  final List<Area> _areas = [];
  bool loading = false;
  String? error;

  List<Area> get areas => List.unmodifiable(_areas);

  Future<void> loadAreas() async {
    loading = true;
    error = null;
    notifyListeners();

    try {
      final fetched = await _api.fetchAreas();
      _areas
        ..clear()
        ..addAll(fetched);
    } catch (e) {
      error = 'Failed to load areas';
      if (kDebugMode) {
        print('loadAreas error: $e');
      }
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<void> refreshAreas() => loadAreas();

  Future<void> toggleArea(int id) async {
    final index = _areas.indexWhere((a) => a.id == id);
    if (index == -1) return;

    final current = _areas[index];
    final newActive = !current.active;

    _areas[index] = current.copyWith(active: newActive);
    notifyListeners();

    try {
      final updated = await _api.updateArea(
        id: id,
        active: newActive,
      );
      _areas[index] = updated;
      notifyListeners();
    } catch (e) {
      _areas[index] = current;
      error = 'Failed to toggle area';
      if (kDebugMode) {
        print('toggleArea error: $e');
      }
      notifyListeners();
    }
  }

  Future<void> deleteArea(int id) async {
    final index = _areas.indexWhere((a) => a.id == id);
    if (index == -1) return;

    final removed = _areas.removeAt(index);
    notifyListeners();

    try {
      await _api.deleteArea(id);
    } catch (e) {
      _areas.insert(index, removed);
      error = 'Failed to delete area';
      if (kDebugMode) {
        print('deleteArea error: $e');
      }
      notifyListeners();
    }
  }

  Future<void> createArea({
    required String name,
    required String description,
    required String actionService,
    required String actionType,
    required Map<String, dynamic> actionParams,
    required String reactionService,
    required String reactionType,
    required Map<String, dynamic> reactionParams,
  }) async {
    try {
      final created = await _api.createArea(
        name: name,
        description: description,
        actionService: actionService,
        actionType: actionType,
        actionParams: actionParams,
        reactionService: reactionService,
        reactionType: reactionType,
        reactionParams: reactionParams,
      );
      _areas.insert(0, created);
      notifyListeners();
    } catch (e) {
      error = 'Failed to create area';
      if (kDebugMode) {
        print('createArea error: $e');
      }
      notifyListeners();
      rethrow;
    }
  }
}
