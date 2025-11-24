import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/areas_provider.dart';

/// Mocked definitions for actions & reactions per service.
/// You can sync these with backend later.
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
  int _currentStep = 0;

  // Step 1
  String? _actionService;
  String? _actionKey;

  // Step 2
  final _actionConfigController = TextEditingController();

  // Step 3
  String? _reactionService;
  String? _reactionKey;

  // Step 4
  final _areaNameController = TextEditingController();
  final _reactionConfigController = TextEditingController();

  @override
  void dispose() {
    _actionConfigController.dispose();
    _areaNameController.dispose();
    _reactionConfigController.dispose();
    super.dispose();
  }

  void _nextStep() {
    if (_currentStep == 0) {
      if (_actionService == null || _actionKey == null) {
        _showError('Please choose an action service and an action.');
        return;
      }
    } else if (_currentStep == 1) {
      // Action config is optional for now
    } else if (_currentStep == 2) {
      if (_reactionService == null || _reactionKey == null) {
        _showError('Please choose a reaction service and a reaction.');
        return;
      }
    } else if (_currentStep == 3) {
      _submit();
      return;
    }

    setState(() {
      _currentStep = (_currentStep + 1).clamp(0, 3);
    });
  }

  void _prevStep() {
    if (_currentStep == 0) {
      Navigator.of(context).pop();
      return;
    }
    setState(() {
      _currentStep = (_currentStep - 1).clamp(0, 3);
    });
  }

  Future<void> _submit() async {
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

    Navigator.of(context).pop(); // go back to list

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('AREA "$name" created'),
      ),
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('New AREA'),
      ),
      body: Stepper(
        type: StepperType.vertical,
        currentStep: _currentStep,
        onStepContinue: _nextStep,
        onStepCancel: _prevStep,
        controlsBuilder: (context, details) {
          final isLast = _currentStep == 3;
          return Padding(
            padding: const EdgeInsets.only(top: 16.0),
            child: Row(
              children: [
                ElevatedButton(
                  onPressed: details.onStepContinue,
                  child: Text(isLast ? 'Create AREA' : 'Next'),
                ),
                const SizedBox(width: 12),
                TextButton(
                  onPressed: details.onStepCancel,
                  child: Text(_currentStep == 0 ? 'Cancel' : 'Back'),
                ),
              ],
            ),
          );
        },
        steps: [
          Step(
            title: const Text('Action'),
            isActive: _currentStep >= 0,
            state:
            _currentStep > 0 ? StepState.complete : StepState.indexed,
            content: _buildActionStep(),
          ),
          Step(
            title: const Text('Action config'),
            isActive: _currentStep >= 1,
            state:
            _currentStep > 1 ? StepState.complete : StepState.indexed,
            content: _buildActionConfigStep(),
          ),
          Step(
            title: const Text('Reaction'),
            isActive: _currentStep >= 2,
            state:
            _currentStep > 2 ? StepState.complete : StepState.indexed,
            content: _buildReactionStep(),
          ),
          Step(
            title: const Text('Name & confirm'),
            isActive: _currentStep >= 3,
            state: _currentStep == 3
                ? StepState.editing
                : StepState.indexed,
            content: _buildConfirmStep(),
          ),
        ],
      ),
    );
  }

  Widget _buildActionStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Choose the service that will TRIGGER the AREA:'),
        const SizedBox(height: 8),
        DropdownButtonFormField<String>(
          value: _actionService,
          decoration: const InputDecoration(
            labelText: 'Action service',
            border: OutlineInputBorder(),
          ),
          items: kServicesOrder
              .where((s) => kActionOptions[s]?.isNotEmpty ?? false)
              .map(
                (s) => DropdownMenuItem(
              value: s,
              child: Text(prettyServiceName(s)),
            ),
          )
              .toList(),
          onChanged: (value) {
            setState(() {
              _actionService = value;
              _actionKey = null; // reset action when service changes
            });
          },
        ),
        const SizedBox(height: 16),
        DropdownButtonFormField<String>(
          value: _actionKey,
          decoration: const InputDecoration(
            labelText: 'Action',
            border: OutlineInputBorder(),
          ),
          items: (_actionService != null
              ? (kActionOptions[_actionService] ?? [])
              : <Map<String, String>>[])
              .map(
                (opt) => DropdownMenuItem(
              value: opt['key']!,
              child: Text(opt['label']!),
            ),
          )
              .toList(),
          onChanged: (value) {
            setState(() {
              _actionKey = value;
            });
          },
        ),
      ],
    );
  }

  Widget _buildActionConfigStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Configure the action (optional for now).\n'
              'Example: repo name, time interval, thresholds, etc.',
          style: Theme.of(context).textTheme.bodyMedium,
        ),
        const SizedBox(height: 8),
        TextField(
          controller: _actionConfigController,
          decoration: const InputDecoration(
            labelText: 'Action configuration',
            border: OutlineInputBorder(),
          ),
          maxLines: 3,
        ),
      ],
    );
  }

  Widget _buildReactionStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Choose the service that will REACT:'),
        const SizedBox(height: 8),
        DropdownButtonFormField<String>(
          value: _reactionService,
          decoration: const InputDecoration(
            labelText: 'Reaction service',
            border: OutlineInputBorder(),
          ),
          items: kServicesOrder
              .where((s) => kReactionOptions[s]?.isNotEmpty ?? false)
              .map(
                (s) => DropdownMenuItem(
              value: s,
              child: Text(prettyServiceName(s)),
            ),
          )
              .toList(),
          onChanged: (value) {
            setState(() {
              _reactionService = value;
              _reactionKey = null;
            });
          },
        ),
        const SizedBox(height: 16),
        DropdownButtonFormField<String>(
          value: _reactionKey,
          decoration: const InputDecoration(
            labelText: 'Reaction',
            border: OutlineInputBorder(),
          ),
          items: (_reactionService != null
              ? (kReactionOptions[_reactionService] ?? [])
              : <Map<String, String>>[])
              .map(
                (opt) => DropdownMenuItem(
              value: opt['key']!,
              child: Text(opt['label']!),
            ),
          )
              .toList(),
          onChanged: (value) {
            setState(() {
              _reactionKey = value;
            });
          },
        ),
      ],
    );
  }

  Widget _buildConfirmStep() {
    final actionServiceName =
    _actionService != null ? prettyServiceName(_actionService!) : '-';
    final reactionServiceName =
    _reactionService != null ? prettyServiceName(_reactionService!) : '-';

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Give your AREA a name and optionally configure the reaction:\n',
          style: Theme.of(context).textTheme.bodyMedium,
        ),
        TextField(
          controller: _areaNameController,
          decoration: InputDecoration(
            labelText: 'AREA name (optional)',
            helperText:
            'If left empty, a name like "$actionServiceName → $reactionServiceName" will be used.',
            border: const OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 16),
        Text(
          'Reaction configuration (optional).\n'
              'Example: email recipient, Slack channel, etc.',
          style: Theme.of(context).textTheme.bodyMedium,
        ),
        const SizedBox(height: 8),
        TextField(
          controller: _reactionConfigController,
          decoration: const InputDecoration(
            labelText: 'Reaction configuration',
            border: OutlineInputBorder(),
          ),
          maxLines: 3,
        ),
      ],
    );
  }
}
