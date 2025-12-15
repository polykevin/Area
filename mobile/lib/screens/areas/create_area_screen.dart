import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/areas_provider.dart';

const kActionOptions = {
  'timer': [
    {'key': 'timer_every_x_minutes', 'label': 'Every X minutes'},
    {'key': 'timer_at_time', 'label': 'At a specific time'},
    {'key': 'timer_daily', 'label': 'Every day at HH:MM'},
  ],
  'github': [
    {'key': 'github_new_issue', 'label': 'New issue in repo'},
    {'key': 'github_new_pr', 'label': 'New pull request'},
    {'key': 'github_new_push', 'label': 'New push on branch'},
  ],
  'gmail': [
    {'key': 'gmail_new_email', 'label': 'New email received'},
    {'key': 'gmail_from_sender', 'label': 'New email from specific sender'},
    {'key': 'gmail_with_subject', 'label': 'Email with subject keyword'},
  ],
  'weather': [
    {'key': 'weather_temp_below', 'label': 'Temperature below threshold'},
    {'key': 'weather_temp_above', 'label': 'Temperature above threshold'},
    {'key': 'weather_rain_chance', 'label': 'Rain chance above X%'},
  ],
  'slack': [
    {'key': 'slack_new_message', 'label': 'New message in channel'},
    {'key': 'slack_mention_me', 'label': 'I am mentioned'},
  ],
  'rss': [
    {'key': 'rss_new_item', 'label': 'New RSS feed item'},
  ],
};

const kReactionOptions = {
  'timer': [
    {'key': 'timer_log', 'label': 'Log a debug message'},
  ],
  'github': [
    {'key': 'github_create_issue', 'label': 'Create issue'},
    {'key': 'github_comment_issue', 'label': 'Comment on issue'},
  ],
  'gmail': [
    {'key': 'gmail_send_email', 'label': 'Send an email'},
    {'key': 'gmail_send_to_self', 'label': 'Send an email to me'},
  ],
  'weather': [
    {'key': 'weather_send_alert_email', 'label': 'Send weather alert email'},
    {'key': 'weather_create_github_issue', 'label': 'Create GitHub issue'},
  ],
  'slack': [
    {'key': 'slack_send_channel_msg', 'label': 'Send message to channel'},
    {'key': 'slack_send_dm', 'label': 'Send DM to me'},
  ],
  'rss': [
    {'key': 'rss_email_summary', 'label': 'Email RSS summary'},
    {'key': 'rss_create_issue', 'label': 'Create GitHub issue with title'},
  ],
};

const kServicesOrder = [
  'timer',
  'github',
  'gmail',
  'weather',
  'slack',
  'rss',
];

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

class CreateAreaScreen extends StatefulWidget {
  const CreateAreaScreen({super.key});

  @override
  State<CreateAreaScreen> createState() => _CreateAreaScreenState();
}

class _CreateAreaScreenState extends State<CreateAreaScreen> {

  String? _actionService;
  String? _actionKey;

  final _actionConfigController = TextEditingController();

  String? _reactionService;
  String? _reactionKey;

  final _areaNameController = TextEditingController();
  final _reactionConfigController = TextEditingController();

  @override
  void dispose() {
    _actionConfigController.dispose();
    _areaNameController.dispose();
    _reactionConfigController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (_actionService == null || _actionKey == null) {
      _showError('Please choose an action service and an action.');
      return;
    }
    if (_reactionService == null || _reactionKey == null) {
      _showError('Please choose a reaction service and a reaction.');
      return;
    }

    final areasProvider = context.read<AreasProvider>();

    final actionService = _actionService!;
    final reactionService = _reactionService!;

    final actionLabel = _findActionLabel(actionService, _actionKey!);
    final reactionLabel = _findReactionLabel(reactionService, _reactionKey!);

    final name = _areaNameController.text.trim().isEmpty
        ? '${prettyServiceName(actionService)} → ${prettyServiceName(reactionService)}'
        : _areaNameController.text.trim();

    await areasProvider.createAreaLocal(
      name: name,
      actionService: actionService,
      actionLabel: actionLabel,
      reactionService: reactionService,
      reactionLabel: reactionLabel,
    );

    if (!mounted) return;

    Navigator.of(context).pop();

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('AREA "$name" created')),
    );
  }

  String _findActionLabel(String service, String key) {
    final list = kActionOptions[service] ?? [];
    final found =
    list.firstWhere((e) => e['key'] == key, orElse: () => {'label': key});
    return found['label'] as String;
  }

  String _findReactionLabel(String service, String key) {
    final list = kReactionOptions[service] ?? [];
    final found =
    list.firstWhere((e) => e['key'] == key, orElse: () => {'label': key});
    return found['label'] as String;
  }

  void _showError(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(msg)),
    );
  }

  Future<void> _pickActionDialog() async {
    String? tempService = _actionService;
    String? tempKey = _actionKey;

    await showDialog(
      context: context,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (ctx, setStateDialog) {
            final availableServices = kServicesOrder
                .where((s) => kActionOptions[s]?.isNotEmpty ?? false)
                .toList();

            final actionsForService = tempService != null
                ? (kActionOptions[tempService] ?? [])
                : <Map<String, String>>[];

            return AlertDialog(
              title: const Text('Select action'),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  DropdownButtonFormField<String>(
                    value: tempService,
                    decoration: const InputDecoration(labelText: 'Service'),
                    items: availableServices
                        .map(
                          (s) => DropdownMenuItem(
                        value: s,
                        child: Text(prettyServiceName(s)),
                      ),
                    )
                        .toList(),
                    onChanged: (value) {
                      setStateDialog(() {
                        tempService = value;
                        tempKey = null;
                      });
                    },
                  ),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<String>(
                    value: tempKey,
                    decoration: const InputDecoration(labelText: 'Action'),
                    items: actionsForService
                        .map(
                          (opt) => DropdownMenuItem(
                        value: opt['key']!,
                        child: Text(opt['label']!),
                      ),
                    )
                        .toList(),
                    onChanged: (value) {
                      setStateDialog(() {
                        tempKey = value;
                      });
                    },
                  ),
                ],
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.of(ctx).pop(),
                  child: const Text('Cancel'),
                ),
                ElevatedButton(
                  onPressed: (tempService != null && tempKey != null)
                      ? () {
                    setState(() {
                      _actionService = tempService;
                      _actionKey = tempKey;
                    });
                    Navigator.of(ctx).pop();
                  }
                      : null,
                  child: const Text('Use'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  Future<void> _pickReactionDialog() async {
    String? tempService = _reactionService;
    String? tempKey = _reactionKey;

    await showDialog(
      context: context,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (ctx, setStateDialog) {
            final availableServices = kServicesOrder
                .where((s) => kReactionOptions[s]?.isNotEmpty ?? false)
                .toList();

            final reactionsForService = tempService != null
                ? (kReactionOptions[tempService] ?? [])
                : <Map<String, String>>[];

            return AlertDialog(
              title: const Text('Select reaction'),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  DropdownButtonFormField<String>(
                    value: tempService,
                    decoration: const InputDecoration(labelText: 'Service'),
                    items: availableServices
                        .map(
                          (s) => DropdownMenuItem(
                        value: s,
                        child: Text(prettyServiceName(s)),
                      ),
                    )
                        .toList(),
                    onChanged: (value) {
                      setStateDialog(() {
                        tempService = value;
                        tempKey = null;
                      });
                    },
                  ),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<String>(
                    value: tempKey,
                    decoration: const InputDecoration(labelText: 'Reaction'),
                    items: reactionsForService
                        .map(
                          (opt) => DropdownMenuItem(
                        value: opt['key']!,
                        child: Text(opt['label']!),
                      ),
                    )
                        .toList(),
                    onChanged: (value) {
                      setStateDialog(() {
                        tempKey = value;
                      });
                    },
                  ),
                ],
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.of(ctx).pop(),
                  child: const Text('Cancel'),
                ),
                ElevatedButton(
                  onPressed: (tempService != null && tempKey != null)
                      ? () {
                    setState(() {
                      _reactionService = tempService;
                      _reactionKey = tempKey;
                    });
                    Navigator.of(ctx).pop();
                  }
                      : null,
                  child: const Text('Use'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final actionLabel = _actionService == null
        ? 'Service 1'
        : prettyServiceName(_actionService!);
    final reactionLabel = _reactionService == null
        ? 'Service 2'
        : prettyServiceName(_reactionService!);

    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Theme.of(context).colorScheme.surface,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.of(context).pop(),
        ),
        centerTitle: true,
        title: Text(
          'Create an AREA',
          style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.bold),
        ),
      ),
      backgroundColor: Theme.of(context).colorScheme.surface,
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24),
        child: ListView(
          children: [
            const SizedBox(height: 16),

            const Text('Name', style: TextStyle(fontSize: 16)),
            const SizedBox(height: 4),
            TextField(
              controller: _areaNameController,
              decoration: const InputDecoration(
                hintText: 'My cool AREA',
              ),
            ),

            const SizedBox(height: 12),

            const Text('Value', style: TextStyle(fontSize: 16)),
            const SizedBox(height: 4),
            TextField(
              controller: _actionConfigController,
              decoration: const InputDecoration(
                hintText: 'Optional config / value',
              ),
            ),

            const SizedBox(height: 32),

            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _ServiceBox(
                  label: actionLabel,
                  onTap: _pickActionDialog,
                ),
                const SizedBox(width: 16),
                const Icon(Icons.arrow_forward, size: 36),
                const SizedBox(width: 16),
                _ServiceBox(
                  label: reactionLabel,
                  onTap: _pickReactionDialog,
                ),
              ],
            ),

            const SizedBox(height: 24),

            SizedBox(
              height: 50,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Theme.of(context).colorScheme.primary,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                onPressed: _submit,
                child: Text(
                  'Create area',
                  style: TextStyle (
                    fontSize: 16,
                    color : Theme.of(context).colorScheme.onPrimary,
                  )
                ),
              ),
            ),

            const SizedBox(height: 32),
            const Divider(),
            const SizedBox(height: 12),

            const Text(
              'Existing areas',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),

            const SizedBox(height: 16),

            _ExistingAreaRow(
              from: 'Github',
              to: 'Spotify',
              title: 'music push',
              time: 'created 2d ago',
            ),
          ],
        ),
      ),
    );
  }
}

class _ServiceBox extends StatelessWidget {
  final String label;
  final VoidCallback onTap;

  const _ServiceBox({
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(12),
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
        decoration: BoxDecoration(
          color: const Color(0xFFEAE4FF),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 16,
            color: Theme.of(context).colorScheme.primary,
            ),
        ),
      ),
    );
  }
}

class _ExistingAreaRow extends StatelessWidget {
  final String from;
  final String to;
  final String title;
  final String time;

  const _ExistingAreaRow({
    required this.from,
    required this.to,
    required this.title,
    required this.time,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.primary,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Text(from, style: const TextStyle(color: Colors.white)),
        ),
        const SizedBox(width: 16),
        Column(
          children: [
            Text(title, style: const TextStyle(fontSize: 14)),
            const Icon(Icons.arrow_forward),
          ],
        ),
        const SizedBox(width: 16),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          decoration: BoxDecoration(
            color: Colors.green,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Text(to, style: const TextStyle(color: Colors.white)),
        ),
        const Spacer(),
        Text(
          time,
          style: TextStyle(fontSize: 12, color: Theme.of(context).colorScheme.onSurface),
        ),
      ],
    );
  }
}
