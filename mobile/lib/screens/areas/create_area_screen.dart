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
                  child: const Text('OK'),
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
                    decoration:
                    const InputDecoration(labelText: 'Reaction'),
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
                  child: const Text('OK'),
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
        title: const Text('Create AREA'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TextField(
              controller: _areaNameController,
              decoration: const InputDecoration(
                labelText: 'AREA name (optional)',
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'IF',
              style: theme.textTheme.titleMedium!
                  .copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            _PickerTile(
              title: 'Trigger',
              description: _describeSelectedAction(),
              onTap: _pickAction,
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
            _PickerTile(
              title: 'Action',
              description: _describeSelectedReaction(),
              onTap: _pickReaction,
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
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _submitting ? null : _submit,
                child: _submitting
                    ? const SizedBox(
                  width: 18,
                  height: 18,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
                    : const Text('Create AREA'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _PickerTile extends StatelessWidget {
  final String title;
  final String description;
  final VoidCallback onTap;

  const _PickerTile({
    required this.title,
    required this.description,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Ink(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
        decoration: BoxDecoration(
          color: Colors.grey.shade100,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.grey.shade300),
        ),
        child: Row(
          children: [
            Icon(Icons.bolt, color: theme.colorScheme.primary),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: theme.textTheme.bodyMedium!
                        .copyWith(fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    description,
                    style: theme.textTheme.bodySmall!
                        .copyWith(color: Colors.black54),
                  ),
                ],
              ),
            ),
            const Icon(Icons.chevron_right),
          ],
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
    default:
      return key;
  }
}
