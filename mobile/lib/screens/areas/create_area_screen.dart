import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/areas_provider.dart';

const kActionOptions = {
  'google': [
    {'key': 'new_email', 'label': 'New email received'},
  ],
  'instagram': [
    {'key': 'new_post', 'label': 'New post published'},
    {'key': 'new_follower', 'label': 'New follower'},
  ],
};

const kReactionOptions = {
  'google': [
    {'key': 'send_email', 'label': 'Send email'},
  ],
  'instagram': [
    {'key': 'post_photo', 'label': 'Post a photo'},
    {'key': 'post_story', 'label': 'Post a story'},
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
    // Start null so action/reaction dropdown doesn't appear until service chosen
    _actionService = null;
    _reactionService = null;
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

    // Validate only what is required for the selected reaction
    if (_reactionKey == 'send_email' && _toController.text.trim().isEmpty) {
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
    if (actionType == 'new_email' && _fromController.text.trim().isNotEmpty) {
      actionParams['from'] = _fromController.text.trim();
    }

    // Build reaction params based on selected reaction
    final reactionParams = <String, dynamic>{};
    if (reactionType == 'send_email') {
      reactionParams['to'] = _toController.text.trim();
      reactionParams['subject'] = _subjectController.text.trim();
      reactionParams['text'] = _textController.text.trim();
    }

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
        String? tempService = _actionService; // start null
        String? tempKey = _actionKey;

        final services = kActionOptions.keys.toList();

        return StatefulBuilder(
          builder: (context, setStateDialog) {
            final theme = Theme.of(context);
            final cs = theme.colorScheme;

            InputDecoration deco(String label) => InputDecoration(
              labelText: label,
              labelStyle: TextStyle(color: cs.onSurfaceVariant),
            );

            final actionsForService = (tempService == null)
                ? const <Map<String, Object?>>[]
                : (kActionOptions[tempService] ?? const <Map<String, Object?>>[]);

            return AlertDialog(
              backgroundColor: cs.surface,
              titleTextStyle: theme.textTheme.titleLarge?.copyWith(
                color: cs.onSurface,
                fontWeight: FontWeight.w600,
              ),
              contentTextStyle: theme.textTheme.bodyMedium?.copyWith(
                color: cs.onSurface,
              ),
              title: const Text('Choose action'),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  DropdownButtonFormField<String>(
                    value: tempService,
                    decoration: deco('Service'),
                    dropdownColor: cs.surface,
                    style: TextStyle(color: cs.onSurface),
                    iconEnabledColor: cs.onSurfaceVariant,
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

                  // Only show after service chosen
                  if (tempService != null) ...[
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      value: tempKey,
                      decoration: deco('Action'),
                      dropdownColor: cs.surface,
                      style: TextStyle(color: cs.onSurface),
                      iconEnabledColor: cs.onSurfaceVariant,
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
                ],
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.of(ctx).pop(),
                  child: Text('Cancel', style: TextStyle(color: cs.primary)),
                ),
                ElevatedButton(
                  onPressed: (tempService != null && tempKey != null)
                      ? () {
                    setState(() {
                      _actionService = tempService;
                      _actionKey = tempKey;

                      // Clear action params that no longer apply
                      if (_actionKey != 'new_email') {
                        _fromController.clear();
                      }
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
        String? tempService = _reactionService; // start null
        String? tempKey = _reactionKey;

        final services = kReactionOptions.keys.toList();

        return StatefulBuilder(
          builder: (context, setStateDialog) {
            final theme = Theme.of(context);
            final cs = theme.colorScheme;

            InputDecoration deco(String label) => InputDecoration(
              labelText: label,
              labelStyle: TextStyle(color: cs.onSurfaceVariant),
            );

            final reactionsForService = (tempService == null)
                ? const <Map<String, Object?>>[]
                : (kReactionOptions[tempService] ?? const <Map<String, Object?>>[]);

            return AlertDialog(
              backgroundColor: cs.surface,
              titleTextStyle: theme.textTheme.titleLarge?.copyWith(
                color: cs.onSurface,
                fontWeight: FontWeight.w600,
              ),
              contentTextStyle: theme.textTheme.bodyMedium?.copyWith(
                color: cs.onSurface,
              ),
              title: const Text('Choose reaction'),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  DropdownButtonFormField<String>(
                    value: tempService,
                    decoration: deco('Service'),
                    dropdownColor: cs.surface,
                    style: TextStyle(color: cs.onSurface),
                    iconEnabledColor: cs.onSurfaceVariant,
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
                        tempKey = null; // reset reaction when service changes
                      });
                    },
                  ),

                  // Only show after service chosen
                  if (tempService != null) ...[
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      value: tempKey,
                      decoration: deco('Reaction'),
                      dropdownColor: cs.surface,
                      style: TextStyle(color: cs.onSurface),
                      iconEnabledColor: cs.onSurfaceVariant,
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
                ],
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.of(ctx).pop(),
                  child: Text('Cancel', style: TextStyle(color: cs.primary)),
                ),
                ElevatedButton(
                  onPressed: (tempService != null && tempKey != null)
                      ? () {
                    setState(() {
                      _reactionService = tempService;
                      _reactionKey = tempKey;

                      // Clear reaction params that no longer apply
                      if (_reactionKey != 'send_email') {
                        _toController.clear();
                        _subjectController.clear();
                        _textController.clear();
                      } else {
                        // Restore defaults if empty
                        if (_subjectController.text.trim().isEmpty) {
                          _subjectController.text = 'AREA test';
                        }
                        if (_textController.text.trim().isEmpty) {
                          _textController.text =
                          'You received a new email matching your AREA rule.';
                        }
                      }
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
      return 'Tap to choose action...';
    }
    final label = _findActionLabel(_actionService!, _actionKey!);
    return '${prettyServiceName(_actionService!)} • $label';
  }

  String _describeSelectedReaction() {
    if (_reactionService == null || _reactionKey == null) {
      return 'Tap to choose reaction...';
    }
    final label = _findReactionLabel(_reactionService!, _reactionKey!);
    return '${prettyServiceName(_reactionService!)} • $label';
  }

  String _findActionLabel(String service, String key) {
    final list = kActionOptions[service] ?? const [];
    final found =
    list.firstWhere((e) => e['key'] == key, orElse: () => {'label': key});
    return found['label'] as String;
  }

  String _findReactionLabel(String service, String key) {
    final list = kReactionOptions[service] ?? const [];
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
    final cs = theme.colorScheme;

    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        backgroundColor: cs.surface,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: cs.onSurface),
          onPressed: () => Navigator.of(context).pop(),
        ),
        centerTitle: true,
        title: Text(
          'Create an AREA',
          style: TextStyle(
            color: cs.onSurface,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      backgroundColor: cs.surface,
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
              textAlign: TextAlign.center,
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
                color: Theme.of(context).colorScheme.onSurface,
              ),
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

            // Action params only after selecting action
            if (_actionKey == 'new_email') ...[
              const SizedBox(height: 8),
              TextField(
                controller: _fromController,
                decoration: const InputDecoration(
                  labelText: 'Only when email is from (optional)',
                  hintText: 'someone@example.com',
                ),
              ),
            ],

            const SizedBox(height: 24),
            Text(
              'THEN',
              textAlign: TextAlign.center,
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
                color: Theme.of(context).colorScheme.onSurface,
              ),
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

            // Reaction params only after selecting reaction
            if (_reactionKey == 'send_email') ...[
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
            ],

            const SizedBox(height: 32),
            SizedBox(
              height: 50,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: cs.primary,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                onPressed: _submitting ? null : _submit,
                child: _submitting
                    ? SizedBox(
                  width: 22,
                  height: 22,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    valueColor: AlwaysStoppedAnimation<Color>(cs.onPrimary),
                  ),
                )
                    : Text(
                  'Create area',
                  style: TextStyle(
                    fontSize: 16,
                    color: cs.onPrimary,
                  ),
                ),
              ),
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
    final cs = Theme.of(context).colorScheme;

    return InkWell(
      borderRadius: BorderRadius.circular(12),
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
        decoration: BoxDecoration(
          color: cs.surfaceContainerHigh,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 16,
            color: cs.onSurface,
          ),
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
    case 'instagram':
      return 'Instagram';
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
