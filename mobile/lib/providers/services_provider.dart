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
      print('[ERROR] ServicesProvider.loadServices - error: $e');
      _services = [];
      _error = 'Failed to load services: $e';
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
}
