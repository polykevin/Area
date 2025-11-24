import 'package:flutter/foundation.dart';

import '../api/areas_api.dart';
import '../models/area.dart';

class AreasProvider extends ChangeNotifier {
  final _api = AreasApi();

  List<Area> _areas = [];
  bool _loading = false;
  String? _error;

  List<Area> get areas => _areas;
  bool get loading => _loading;
  String? get error => _error;

  Future<void> loadAreas({bool mockIfFail = true}) async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await _api.getAreas();
      _areas = result;
    } catch (e) {
      if (mockIfFail) {
        _areas = _mockAreas();
        _error = 'Using mocked AREAs (backend not ready yet).';
      } else {
        _error = 'Failed to load AREAs: $e';
      }
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<void> toggleArea(String id) async {
    try {
      final updated = await _api.toggleArea(id);
      _areas = _areas.map((a) => a.id == id ? updated : a).toList();
      notifyListeners();
    } catch (e) {
      _error = 'Failed to toggle AREA: $e';
      notifyListeners();
    }
  }

  Future<void> deleteArea(String id) async {
    final old = List<Area>.from(_areas);
    _areas = _areas.where((a) => a.id != id).toList();
    notifyListeners();

    try {
      await _api.deleteArea(id);
    } catch (e) {
      _error = 'Failed to delete AREA: $e';
      _areas = old;
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
    final newArea = Area(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      name: name,
      actionService: actionService,
      actionLabel: actionLabel,
      reactionService: reactionService,
      reactionLabel: reactionLabel,
      isActive: true,
      createdAt: DateTime.now(),
    );

    _areas = [newArea, ..._areas];
    notifyListeners();
  }

  List<Area> _mockAreas() { //placeholders
    return [
      Area(
        id: '1',
        name: 'GitHub → Gmail',
        actionService: 'github',
        actionLabel: 'New issue in repo "area-backend"',
        reactionService: 'gmail',
        reactionLabel: 'Send email to me',
        isActive: true,
        createdAt: DateTime.now().subtract(const Duration(hours: 2)),
      ),
      Area(
        id: '2',
        name: 'Weather → Slack',
        actionService: 'weather',
        actionLabel: 'Rain chance > 60%',
        reactionService: 'slack',
        reactionLabel: 'Post alert to #weather',
        isActive: false,
        createdAt: DateTime.now().subtract(const Duration(days: 1)),
      ),
      Area(
        id: '3',
        name: 'Timer → RSS',
        actionService: 'timer',
        actionLabel: 'Every day at 09:00',
        reactionService: 'rss',
        reactionLabel: 'Check RSS feed and email summary',
        isActive: true,
        createdAt: DateTime.now().subtract(const Duration(days: 3)),
      ),
    ];
  }
}
