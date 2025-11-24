import 'package:flutter/foundation.dart';

import '../api/services_api.dart';
import '../models/service.dart';

class ServicesProvider extends ChangeNotifier {
  final _api = ServicesApi();

  List<Service> _services = [];
  bool _loading = false;
  String? _error;

  List<Service> get services => _services;
  bool get loading => _loading;
  String? get error => _error;

  Future<void> loadServices({bool mockIfFail = true}) async { //placeholder since backend is not ready
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await _api.getServices();
      _services = result;
    } catch (e) {
      if (mockIfFail) {
        _services = _mockServices();
        _error = 'Using mocked services (backend not ready yet).';
      } else {
        _error = 'Failed to load services: $e';
      }
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<void> connect(String serviceName) async {
    try {
      final updated = await _api.connectService(serviceName);
      _services = _services
          .map((s) => s.name == serviceName ? updated : s)
          .toList();
      notifyListeners();
    } catch (e) {
      _error = 'Failed to connect $serviceName: $e';
      notifyListeners();
    }
  }

  Future<void> disconnect(String serviceName) async {
    try {
      final updated = await _api.disconnectService(serviceName);
      _services = _services
          .map((s) => s.name == serviceName ? updated : s)
          .toList();
      notifyListeners();
    } catch (e) {
      _error = 'Failed to disconnect $serviceName: $e';
      notifyListeners();
    }
  }

  List<Service> _mockServices() {
    return [
      Service(
        id: '1',
        name: 'timer',
        displayName: 'Timer',
        description: 'Internal timer-based triggers.',
        connected: true,
      ),
      Service(
        id: '2',
        name: 'github',
        displayName: 'GitHub',
        description: 'Track issues, PRs, and commits.',
        connected: false,
      ),
      Service(
        id: '3',
        name: 'gmail',
        displayName: 'Gmail',
        description: 'Send and receive emails.',
        connected: false,
      ),
      Service(
        id: '4',
        name: 'weather',
        displayName: 'Weather',
        description: 'Weather-based conditions.',
        connected: false,
      ),
      Service(
        id: '5',
        name: 'slack',
        displayName: 'Slack',
        description: 'Post messages to channels.',
        connected: false,
      ),
      Service(
        id: '6',
        name: 'rss',
        displayName: 'RSS',
        description: 'Trigger on new RSS items.',
        connected: false,
      ),
    ];
  }
}
