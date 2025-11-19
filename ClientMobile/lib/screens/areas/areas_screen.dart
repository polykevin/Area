import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'create_area_screen.dart';

import '../../providers/areas_provider.dart';
import '../../models/area.dart';

class AreasScreen extends StatefulWidget {
  const AreasScreen({super.key});

  @override
  State<AreasScreen> createState() => _AreasScreenState();
}

class _AreasScreenState extends State<AreasScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      final provider = context.read<AreasProvider>();
      provider.loadAreas(); // mockIfFail = true
    });
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AreasProvider>();

    if (provider.loading && provider.areas.isEmpty) {
      return const Center(child: CircularProgressIndicator());
    }

    return Scaffold(
      body: RefreshIndicator(
        onRefresh: () => provider.loadAreas(mockIfFail: false),
        child: ListView.builder(
          padding: const EdgeInsets.all(12),
          itemCount: provider.areas.length + (provider.error != null ? 1 : 0),
          itemBuilder: (context, index) {
            if (provider.error != null && index == 0) {
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
            final Area area = provider.areas[index - offset];

            return Dismissible(
              key: ValueKey(area.id),
              direction: DismissDirection.endToStart,
              background: Container(
                color: Colors.red,
                alignment: Alignment.centerRight,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: const Icon(Icons.delete, color: Colors.white),
              ),
              confirmDismiss: (direction) async {
                return await showDialog<bool>(
                  context: context,
                  builder: (_) => AlertDialog(
                    title: const Text('Delete AREA'),
                    content: Text(
                      'Are you sure you want to delete '
                          '"${area.name.isNotEmpty ? area.name : area.actionLabel}"?',
                    ),
                    actions: [
                      TextButton(
                        onPressed: () =>
                            Navigator.of(context).pop(false),
                        child: const Text('Cancel'),
                      ),
                      TextButton(
                        onPressed: () =>
                            Navigator.of(context).pop(true),
                        child: const Text('Delete'),
                      ),
                    ],
                  ),
                ) ??
                    false;
              },
              onDismissed: (_) {
                provider.deleteArea(area.id);
              },
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(12.0),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      //title + details
                      Expanded(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              area.name.isNotEmpty
                                  ? area.name
                                  : '${area.actionService} → ${area.reactionService}',
                              style: Theme.of(context)
                                  .textTheme
                                  .titleMedium
                                  ?.copyWith(fontWeight: FontWeight.w600),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              area.actionLabel,
                              style: Theme.of(context).textTheme.bodyMedium,
                            ),
                            Text(
                              '→ ${area.reactionLabel}',
                              style: Theme.of(context).textTheme.bodyMedium,
                            ),
                            if (area.createdAt != null) ...[
                              const SizedBox(height: 4),
                              Text(
                                'Created: ${area.createdAt}',
                                style: Theme.of(context)
                                    .textTheme
                                    .bodySmall
                                    ?.copyWith(color: Colors.grey),
                              ),
                            ],
                          ],
                        ),
                      ),

                      const SizedBox(width: 8),

                      //switch + label
                      Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Switch(
                            value: area.isActive,
                            onChanged: (_) {
                              provider.toggleArea(area.id);
                            },
                          ),
                          Text(
                            area.isActive ? 'Active' : 'Paused',
                            style: TextStyle(
                              fontSize: 11,
                              color: area.isActive
                                  ? Colors.green
                                  : Colors.grey[600],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          Navigator.of(context).push(
            MaterialPageRoute(builder: (_) => const CreateAreaScreen()),
          );
        },
        icon: const Icon(Icons.add),
        label: const Text('New AREA'),
      ),
    );
  }
}
