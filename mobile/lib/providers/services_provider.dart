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

  Future<void> loadServices() async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await _api.getServices();
      _services = result;
    } catch (e) {
      if (kDebugMode) {
        print('[ERROR] ServicesProvider.loadServices - error: $e');
      }
      _services = [];
      _error = 'Failed to load services: $e';
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  void _upsertService(Service updated) {
    final idx = _services.indexWhere((s) => s.id == updated.id);
    if (idx == -1) {
      _services = [updated, ..._services];
    } else {
      final copy = [..._services];
      copy[idx] = updated;
      _services = copy;
    }
  }

  Future<void> connect(String serviceId) async {
    _error = null;
    notifyListeners();

    try {
      final updated = await _api.connectService(serviceId);
      _upsertService(updated);
      notifyListeners();
    } catch (e) {
      _error = 'Failed to connect $serviceId: $e';
      notifyListeners();
    }
  }

  Future<void> disconnect(String serviceId) async {
    _error = null;
    notifyListeners();

    try {
      final updated = await _api.disconnectService(serviceId);
      _upsertService(updated);
      notifyListeners();
    } catch (e) {
      _error = 'Failed to disconnect $serviceId: $e';
      notifyListeners();
    }
  }
}
