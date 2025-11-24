import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/services_provider.dart';
import '../../models/service.dart';

class ServicesScreen extends StatefulWidget {
  const ServicesScreen({super.key});

  @override
  State<ServicesScreen> createState() => _ServicesScreenState();
}

class _ServicesScreenState extends State<ServicesScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      final provider = context.read<ServicesProvider>();
      provider.loadServices(); // mockIfFail = true
    });
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<ServicesProvider>();

    if (provider.loading && provider.services.isEmpty) {
      return const Center(child: CircularProgressIndicator());
    }

    return RefreshIndicator(
      onRefresh: () => provider.loadServices(mockIfFail: false),
      child: ListView.builder(
        padding: const EdgeInsets.all(12),
        itemCount: provider.services.length + (provider.error != null ? 1 : 0),
        itemBuilder: (context, index) {
          if (provider.error != null && index == 0) {
            //show error
            return Padding(
              padding: const EdgeInsets.only(bottom: 8.0),
              child: Card(
                color: Colors.amber.shade100,
                child: Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Text(
                    provider.error!,
                    style: const TextStyle(color: Colors.black87),
                  ),
                ),
              ),
            );
          }

          final offset = provider.error != null ? 1 : 0;
          final Service service = provider.services[index - offset];

          return Card(
            child: ListTile(
              leading: CircleAvatar(
                child: Text(
                  service.displayName.isNotEmpty
                      ? service.displayName[0]
                      : service.name[0],
                ),
              ),
              title: Text(service.displayName),
              subtitle: Text(service.description),
              trailing: _buildTrailingButton(context, provider, service),
            ),
          );
        },
      ),
    );
  }

  Widget _buildTrailingButton(
      BuildContext context,
      ServicesProvider provider,
      Service service,
      ) {
    final isConnected = service.connected;

    return TextButton.icon(
      onPressed: () {
        if (isConnected) {
          provider.disconnect(service.name);
        } else {
          provider.connect(service.name);
        }
      },
      icon: Icon(
        isConnected ? Icons.check_circle : Icons.link,
        color: isConnected ? Colors.green : Colors.blue,
      ),
      label: Text(isConnected ? 'Connected' : 'Connect'),
    );
  }
}
