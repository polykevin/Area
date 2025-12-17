import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/areas_provider.dart';

const kActionOptions = {
  'google': [
    {'key': 'new_email', 'label': 'New email received'},
  ],
};

const kReactionOptions = {
  'google': [
    {'key': 'send_email', 'label': 'Send email'},
  ],
};

class CreateAreaScreen extends StatefulWidget {
  const CreateAreaScreen({super.key});

  @override
  State<CreateAreaScreen> createState() => _CreateAreaScreenState();
}

class _CreateAreaScreenState extends State<CreateAreaScreen> {
  String? _actionService;
  String? _actionKey;

  String? _reactionService;
  String? _reactionKey;

  final _areaNameController = TextEditingController();
  final _fromController = TextEditingController();
  final _toController = TextEditingController();
  final _subjectController = TextEditingController(text: 'AREA test');
  final _textController = TextEditingController(
    text: 'You received a new email matching your AREA rule.',
  );

  bool _submitting = false;

  @override
  void initState() {
    super.initState();
    _actionService = 'google';
    _reactionService = 'google';
  }

  @override
  void dispose() {
    _areaNameController.dispose();
    _fromController.dispose();
    _toController.dispose();
    _subjectController.dispose();
    _textController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (_actionService == null || _actionKey == null) {
      _showError('Please choose an action.');
      return;
    }
    if (_reactionService == null || _reactionKey == null) {
      _showError('Please choose a reaction.');
      return;
    }
    if (_toController.text.trim().isEmpty) {
      _showError('Please enter a recipient email for the reaction.');
      return;
    }

    final areasProvider = context.read<AreasProvider>();

    final actionService = _actionService!;
    final reactionService = _reactionService!;
    final actionType = _actionKey!;
    final reactionType = _reactionKey!;

    final name = _areaNameController.text.trim().isEmpty
        ? '${prettyServiceName(actionService)} → ${prettyServiceName(reactionService)}'
        : _areaNameController.text.trim();

    final actionParams = <String, dynamic>{};
    if (_fromController.text.trim().isNotEmpty) {
      actionParams['from'] = _fromController.text.trim();
    }

    final reactionParams = <String, dynamic>{
      'to': _toController.text.trim(),
      'subject': _subjectController.text.trim(),
      'text': _textController.text.trim(),
    };

    setState(() {
      _submitting = true;
    });

    try {
      await areasProvider.createArea(
        name: name,
        actionService: actionService,
        actionType: actionType,
        actionParams: actionParams,
        reactionService: reactionService,
        reactionType: reactionType,
        reactionParams: reactionParams,
      );

      if (!mounted) return;
      Navigator.of(context).pop(true);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('AREA "$name" created')),
      );
    } catch (e) {
      _showError(e.toString());
    } finally {
      if (mounted) {
        setState(() {
          _submitting = false;
        });
      }
    }
  }

  void _pickAction() {
    showDialog(
      context: context,
      builder: (ctx) {
        String? tempService = _actionService ?? 'google';
        String? tempKey = _actionKey;

        final services = kActionOptions.keys.toList();

        return StatefulBuilder(
          builder: (context, setStateDialog) {
            final actionsForService =
                kActionOptions[tempService] ?? <Map<String, String>>[];

            return AlertDialog(
              title: const Text('Choose action'),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  DropdownButtonFormField<String>(
                    value: tempService,
                    decoration: const InputDecoration(labelText: 'Service'),
                    items: services
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
                        value: opt['key'] as String,
                        child: Text(opt['label'] as String),
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

  void _pickReaction() {
    showDialog(
      context: context,
      builder: (ctx) {
        String? tempService = _reactionService ?? 'google';
        String? tempKey = _reactionKey;

        final services = kReactionOptions.keys.toList();

        return StatefulBuilder(
          builder: (context, setStateDialog) {
            final reactionsForService =
                kReactionOptions[tempService] ?? <Map<String, String>>[];

            return AlertDialog(
              title: const Text('Choose reaction'),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  DropdownButtonFormField<String>(
                    value: tempService,
                    decoration: const InputDecoration(labelText: 'Service'),
                    items: services
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
                        value: opt['key'] as String,
                        child: Text(opt['label'] as String),
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

  String _describeSelectedAction() {
    if (_actionService == null || _actionKey == null) {
      return 'Tap to choose...';
    }
    final label = _findActionLabel(_actionService!, _actionKey!);
    return '${prettyServiceName(_actionService!)} • $label';
  }

  String _describeSelectedReaction() {
    if (_reactionService == null || _reactionKey == null) {
      return 'Tap to choose...';
    }
    final label = _findReactionLabel(_reactionService!, _reactionKey!);
    return '${prettyServiceName(_reactionService!)} • $label';
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

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

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
            const SizedBox(height: 24),
            Text(
              'IF',
              style: theme.textTheme.titleMedium!
                  .copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _ServiceBox(
                  label: _describeSelectedAction(),
                  onTap: _pickAction,
                ),
              ],
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _fromController,
              decoration: const InputDecoration(
                labelText: 'Only when email is from (optional)',
                hintText: 'someone@example.com',
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'THEN',
              style: theme.textTheme.titleMedium!
                  .copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _ServiceBox(
                  label: _describeSelectedReaction(),
                  onTap: _pickReaction,
                ),
              ],
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _toController,
              decoration: const InputDecoration(
                labelText: 'Send email to',
                hintText: 'you@example.com',
              ),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _subjectController,
              decoration: const InputDecoration(
                labelText: 'Subject',
              ),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _textController,
              decoration: const InputDecoration(
                labelText: 'Message body',
              ),
              maxLines: 3,
            ),
            const SizedBox(height: 32),
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
