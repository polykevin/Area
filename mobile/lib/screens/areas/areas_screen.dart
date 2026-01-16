import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
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
        onPressed: () async {
          final res = await Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const CreateAreaScreen()),
          );

          if (res == true && context.mounted) {
            context.read<AreasProvider>().loadAreas();
          }
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

    final actionBg = serviceColor(context, area.actionService);
    final reactionBg = serviceColor(context, area.reactionService);

    return InkWell(
      borderRadius: BorderRadius.circular(16),
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => AreaDetailsScreen(area: area),
          ),
        );
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
        decoration: BoxDecoration(
          color: theme.colorScheme.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: theme.dividerColor),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      _ServiceTag(
                        text: actionServiceName,
                        color: actionBg,
                        textColor: onServiceColor(actionBg),
                        width: 140,
                      ),
                      const SizedBox(width: 12),
                      Icon(
                        Icons.arrow_forward,
                        size: 18,
                        color: theme.colorScheme.onSurface.withOpacity(0.7),
                      ),
                      const SizedBox(width: 12),
                      _ServiceTag(
                        text: reactionServiceName,
                        color: reactionBg,
                        textColor: onServiceColor(reactionBg),
                        width: 140,
                      ),
                    ],
                  ),

                  const SizedBox(height: 10),

                  Row(
                    children: [
                      SizedBox(
                        width: 140,
                        child: Text(
                          actionLabel,
                          textAlign: TextAlign.center,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w500,
                            color: theme.colorScheme.onSurface.withOpacity(0.75),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      const SizedBox(width: 18),
                      const SizedBox(width: 12),
                      SizedBox(
                        width: 140,
                        child: Text(
                          reactionLabel,
                          textAlign: TextAlign.center,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w500,
                            color: theme.colorScheme.onSurface.withOpacity(0.75),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(width: 12),

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

class AreaDetailsScreen extends StatelessWidget {
  final Area area;

  const AreaDetailsScreen({super.key, required this.area});

  String _prettyJson(dynamic value) {
    try {
      const encoder = JsonEncoder.withIndent('  ');
      return encoder.convert(value ?? {});
    } catch (_) {
      return (value ?? {}).toString();
    }
  }

  Widget _kv(BuildContext context, String label, String value) {
    final cs = Theme.of(context).colorScheme;

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 110,
            child: Text(
              label,
              style: TextStyle(
                color: cs.onSurfaceVariant,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              value,
              style: TextStyle(color: cs.onSurface),
            ),
          ),
        ],
      ),
    );
  }

  Widget _jsonBlock(BuildContext context, String title, dynamic jsonValue) {
    final cs = Theme.of(context).colorScheme;
    final text = _prettyJson(jsonValue);

    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(top: 12),
      padding: const EdgeInsets.fromLTRB(12, 4, 12, 12),
      decoration: BoxDecoration(
        color: cs.surfaceContainerHigh,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: cs.outlineVariant),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Expanded(
                child: Text(
                  title,
                  style: TextStyle(
                    color: cs.onSurface,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
              IconButton(
                visualDensity: VisualDensity.compact,
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(),
                tooltip: 'Copy',
                onPressed: () async {
                  await Clipboard.setData(ClipboardData(text: text));
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Copied to clipboard')),
                  );
                },
                icon: Icon(Icons.copy, size: 18, color: cs.onSurfaceVariant),
              ),
            ],
          ),
          const SizedBox(height: 4),
          SelectableText(
            text,
            style: TextStyle(
              fontFamily: 'monospace',
              fontSize: 12,
              color: cs.onSurface,
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    final actionServiceName = prettyServiceName(area.actionService);
    final reactionServiceName = prettyServiceName(area.reactionService);

    final actionTypeLabel = prettyType(area.actionType);
    final reactionTypeLabel = prettyType(area.reactionType);

    final actionBg = serviceColor(context, area.actionService);
    final reactionBg = serviceColor(context, area.reactionService);

    return Scaffold(
      backgroundColor: cs.surface,
      appBar: AppBar(
        backgroundColor: cs.surface,
        elevation: 0,
        centerTitle: true,
        title: Text(
          'AREA Details',
          style: TextStyle(
            color: cs.onSurface,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: ListView(
          children: [
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: cs.surface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: theme.dividerColor),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    area.name,
                    style: theme.textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w800,
                      color: cs.onSurface,
                    ),
                  ),
                  if (area.description.trim().isNotEmpty) ...[
                    const SizedBox(height: 8),
                    Text(
                      area.description.trim(),
                      style: theme.textTheme.bodyMedium?.copyWith(
                        color: cs.onSurfaceVariant,
                      ),
                    ),
                  ],
                  const SizedBox(height: 6),
                  Text(
                    area.active ? 'Active' : 'Inactive',
                    style: TextStyle(
                      color: area.active ? Colors.green : cs.onSurfaceVariant,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 10),
                  _kv(context, 'Area ID', area.id.toString()),
                ],
              ),
            ),

            const SizedBox(height: 14),

            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: cs.surface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: theme.dividerColor),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Flow',
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w800,
                      color: cs.onSurface,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: _ServiceTag(
                          text: actionServiceName,
                          color: actionBg,
                          textColor: onServiceColor(actionBg),
                          width: double.infinity,
                        ),
                      ),
                      const SizedBox(width: 10),
                      Icon(Icons.arrow_forward, size: 18, color: cs.onSurfaceVariant),
                      const SizedBox(width: 10),
                      Expanded(
                        child: _ServiceTag(
                          text: reactionServiceName,
                          color: reactionBg,
                          textColor: onServiceColor(reactionBg),
                          width: double.infinity,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  _kv(context, 'Action', actionTypeLabel),
                  _kv(context, 'Reaction', reactionTypeLabel),
                ],
              ),
            ),

            _jsonBlock(context, 'Action params', area.actionParams),
            _jsonBlock(context, 'Reaction params', area.reactionParams),
          ],
        ),
      ),
    );
  }
}

class _ServiceTag extends StatelessWidget {
  final String text;
  final Color color;
  final Color textColor;
  final double width;

  const _ServiceTag({
    required this.text,
    required this.color,
    required this.textColor,
    this.width = 140,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Center(
          child: Text(
            text,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              color: textColor,
              fontSize: 13,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ),
    );
  }
}

String prettyServiceName(String key) {
  switch (key) {
    case 'google':
    case 'gmail':
      return 'Gmail';
    case 'clock':
      return 'Clock';
    case 'github':
      return 'GitHub';
    case 'weather':
      return 'Weather';
    case 'slack':
      return 'Slack';
    case 'dropbox':
      return 'Dropbox';
    case 'instagram':
      return 'Instagram';
    case 'twitter':
      return 'Twitter';
    case 'gitlab':
      return 'GitLab';
    default:
      return key;
  }
}

String prettyType(String key) {
  final s = key.replaceAll('_', ' ').trim();
  if (s.isEmpty) return s;

  return s
      .split(RegExp(r'\s+'))
      .map((w) => w.isEmpty ? w : '${w[0].toUpperCase()}${w.substring(1).toLowerCase()}')
      .join(' ');
}

Color serviceColor(BuildContext context, String key) {
  final cs = Theme.of(context).colorScheme;

  switch (key) {
    case 'google':
    case 'gmail':
      return const Color(0xFFEA4335);
    case 'instagram':
      return const Color(0xFFE1306C);
    case 'github':
      return const Color(0xFF24292E);
    case 'gitlab':
      return const Color(0xFFFC6D26);
    case 'twitter':
      return const Color(0xFF1DA1F2);
    case 'slack':
      return const Color(0xFF4A154B);
    case 'dropbox':
      return const Color(0xFF0061FF);
    case 'weather':
      return const Color(0xFF1E88E5);
    case 'clock':
      return const Color(0xFF00BFA5);
    default:
      return cs.primary;
  }
}

Color onServiceColor(Color bg) {
  return ThemeData.estimateBrightnessForColor(bg) == Brightness.dark
      ? Colors.white
      : Colors.black;
}
