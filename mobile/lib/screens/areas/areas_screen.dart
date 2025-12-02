import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/areas_provider.dart';
import '../../models/area.dart';
import './create_area_screen.dart'; // adjust path

class AreasScreen extends StatefulWidget {
  const AreasScreen({super.key});

  @override
  State<AreasScreen> createState() => _AreasScreenState();
}

class _AreasScreenState extends State<AreasScreen> {
  @override
  void initState() {
    super.initState();
    // load areas once when page opens
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<AreasProvider>().loadAreas();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,

      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        title: const Text(
          'Existing areas',
          style: TextStyle(
            color: Colors.black,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),

      floatingActionButton: FloatingActionButton(
        backgroundColor: Colors.black,
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const CreateAreaScreen()),
          );
        },
        child: const Icon(Icons.add, color: Colors.white),
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
              return const Center(
                child: Text(
                  'No AREAs yet.\nTap + to create one!',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 18,
                    color: Colors.black54,
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
                      style: const TextStyle(
                        color: Colors.orange,
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
    final actionServiceName = prettyServiceName(area.actionService);
    final reactionServiceName = prettyServiceName(area.reactionService);
    final createdAgo = _formatCreatedAgo(area.createdAt);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE0E0E0)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // LEFT: black tag -> arrow -> green tag
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              _ServiceTag(
                text: actionServiceName,
                color: Colors.black,
              ),
              const SizedBox(width: 8),
              const Icon(Icons.arrow_forward, size: 18),
              const SizedBox(width: 8),
              _ServiceTag(
                text: reactionServiceName,
                color: Colors.green,
              ),
            ],
          ),

          const SizedBox(width: 16),

          // MIDDLE: AREA name + labels
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  area.name.isEmpty ? 'Unnamed AREA' : area.name,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '${area.actionLabel} → ${area.reactionLabel}',
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 11,
                    color: Colors.black54,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(width: 8),

          // RIGHT: switch + delete + createdAgo
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Switch(
                    value: area.isActive,
                    activeColor: Colors.green,
                    onChanged: (_) {
                      context.read<AreasProvider>().toggleArea(area.id);
                    },
                  ),
                  IconButton(
                    icon: const Icon(
                      Icons.delete_outline,
                      color: Colors.red,
                      size: 20,
                    ),
                    onPressed: () => _confirmDelete(context, area),
                  ),
                ],
              ),
              if (createdAgo.isNotEmpty)
                Text(
                  createdAgo,
                  style: const TextStyle(
                    fontSize: 11,
                    color: Colors.black54,
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }

  void _confirmDelete(BuildContext context, Area area) {
    showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          title: const Text('Delete AREA?'),
          content: Text(
            'Are you sure you want to delete "${area.name.isEmpty ? 'this AREA' : area.name}"?',
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
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

  const _ServiceTag({
    required this.text,
    required this.color,
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
        style: const TextStyle(
          color: Colors.white,
          fontSize: 13,
        ),
      ),
    );
  }
}

// ------- helpers -------

String _formatCreatedAgo(DateTime? createdAt) {
  if (createdAt == null) return '';
  final diff = DateTime.now().difference(createdAt);

  if (diff.inDays >= 2) return 'created ${diff.inDays}d ago';
  if (diff.inDays == 1) return 'created 1d ago';
  if (diff.inHours >= 1) return 'created ${diff.inHours}h ago';
  if (diff.inMinutes >= 1) return 'created ${diff.inMinutes}m ago';
  return 'created just now';
}

/// Optional: if you don't want to import prettyServiceName from elsewhere,
/// you can keep a local copy here or import it from your create_area file.
String prettyServiceName(String key) {
  switch (key) {
    case 'timer':
      return 'Timer';
    case 'github':
      return 'GitHub';
    case 'gmail':
      return 'Gmail';
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
