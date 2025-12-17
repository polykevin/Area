import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/areas_provider.dart';
import '../../models/area.dart';
import './create_area_screen.dart';

class AreasScreen extends StatefulWidget {
  const AreasScreen({super.key});

  @override
  State<AreasScreen> createState() => _AreasScreenState();
}

class _AreasScreenState extends State<AreasScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<AreasProvider>().loadAreas();
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: theme.colorScheme.surface,
      appBar: AppBar(
        backgroundColor: theme.colorScheme.surface,
        elevation: 0,
        centerTitle: true,
        title: Text(
          'Existing areas',
          style: TextStyle(
            color: theme.colorScheme.onSurface,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: theme.colorScheme.primary,
        foregroundColor: theme.colorScheme.onPrimary,
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const CreateAreaScreen()),
          );
        },
        child: const Icon(Icons.add),
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        child: Consumer<AreasProvider>(
          builder: (context, provider, _) {
            if (provider.loading && provider.areas.isEmpty) {
              return const Center(child: CircularProgressIndicator());
            }

            final areas = provider.areas;

            if (areas.isEmpty) {
              return Center(
                child: Text(
                  'No AREAs yet.\nTap + to create one!',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 18,
                    color: theme.colorScheme.onSurface.withOpacity(0.6),
                  ),
                ),
              );
            }

            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (provider.error != null)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Text(
                      provider.error!,
                      style: TextStyle(
                        color: theme.colorScheme.error,
                        fontSize: 12,
                      ),
                    ),
                  ),
                Expanded(
                  child: ListView.separated(
                    itemCount: areas.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final area = areas[index];
                      return _AreaRow(area: area);
                    },
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}

class _AreaRow extends StatelessWidget {
  final Area area;

  const _AreaRow({required this.area});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    final actionServiceName = prettyServiceName(area.actionService);
    final reactionServiceName = prettyServiceName(area.reactionService);

    final actionLabel = prettyType(area.actionType);
    final reactionLabel = prettyType(area.reactionType);

    final isActive = area.active;

    final displayName = '$actionServiceName → $reactionServiceName';

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: theme.dividerColor),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              _ServiceTag(
                text: actionServiceName,
                color: theme.colorScheme.primary,
                textColor: theme.colorScheme.onPrimary,
              ),
              const SizedBox(width: 8),
              Icon(Icons.arrow_forward, size: 18, color: theme.iconTheme.color),
              const SizedBox(width: 8),
              _ServiceTag(
                text: reactionServiceName,
                color: Colors.green,
                textColor: Colors.white,
              ),
            ],
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  displayName,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: theme.colorScheme.onSurface,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '$actionLabel → $reactionLabel',
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 11,
                    color: theme.colorScheme.onSurface.withOpacity(0.6),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Switch(
                value: isActive,
                activeColor: Colors.green,
                onChanged: (_) {
                  context.read<AreasProvider>().toggleArea(area.id);
                },
              ),
              IconButton(
                icon: Icon(
                  Icons.delete_outline,
                  color: theme.colorScheme.error,
                  size: 20,
                ),
                onPressed: () => _confirmDelete(context, area),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _confirmDelete(BuildContext context, Area area) {
    final theme = Theme.of(context);

    showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          title: Text(
            'Delete AREA?',
            style: TextStyle(color: theme.colorScheme.onSurface),
          ),
          content: Text(
            'Are you sure you want to delete this AREA?',
            style: TextStyle(color: theme.colorScheme.onSurface),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: Text(
                'Cancel',
                style: TextStyle(color: theme.colorScheme.onSurface),
              ),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: theme.colorScheme.error,
                foregroundColor: theme.colorScheme.onError,
              ),
              onPressed: () {
                Navigator.pop(ctx);
                context.read<AreasProvider>().deleteArea(area.id);
              },
              child: const Text('Delete'),
            ),
          ],
        );
      },
    );
  }
}

class _ServiceTag extends StatelessWidget {
  final String text;
  final Color color;
  final Color textColor;

  const _ServiceTag({
    required this.text,
    required this.color,
    required this.textColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 8),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        text,
        style: TextStyle(
          color: textColor,
          fontSize: 13,
        ),
      ),
    );
  }
}

String prettyServiceName(String key) {
  switch (key) {
    case 'google':
      return 'Gmail';
    case 'gmail':
      return 'Gmail';
    case 'timer':
      return 'Timer';
    case 'github':
      return 'GitHub';
    case 'weather':
      return 'Weather';
    case 'slack':
      return 'Slack';
    case 'rss':
      return 'RSS';
    default:
      return key;
  }
}

String prettyType(String key) {
  return key.replaceAll('_', ' ');
}
