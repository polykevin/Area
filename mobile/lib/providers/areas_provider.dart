import 'package:flutter/foundation.dart';

import '../models/area.dart';
import '../api/areas_api.dart';

class AreasProvider with ChangeNotifier {
  final AreasApi _api = AreasApi();

  final List<Area> _areas = [];
  bool loading = false;
  String? error;

  List<Area> get areas => List.unmodifiable(_areas);

  Future<void> loadAreas() async {
    loading = true;
    error = null;
    notifyListeners();

    try {
      final fetched = await _api.getAreas();
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

  Future<void> toggleArea(String id) async {
    try {
      final updated = await _api.toggleArea(id);
      final index = _areas.indexWhere((a) => a.id == id);
      if (index != -1) {
        _areas[index] = updated;
        notifyListeners();
      }
    } catch (e) {
      error = 'Failed to toggle area';
      if (kDebugMode) {
        print('toggleArea error: $e');
      }
      notifyListeners();
    }
  }

  Future<void> deleteArea(String id) async {
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

  Future<void> createAreaLocal({
    required String name,
    required String actionService,
    required String actionLabel,
    required String reactionService,
    required String reactionLabel,
  }) async {
    try {
      final created = await _api.createArea(
        name: name,
        actionService: actionService,
        actionLabel: actionLabel,
        reactionService: reactionService,
        reactionLabel: reactionLabel,
      );

      _areas.insert(0, created);
      notifyListeners();
    } catch (e) {
      error = 'Failed to create area';
      if (kDebugMode) {
        print('createAreaLocal error: $e');
      }
      notifyListeners();
      rethrow;
    }
  }
}
