import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/areas_provider.dart';
import '../../providers/services_provider.dart';

class CreateAreaScreen extends StatefulWidget {
  const CreateAreaScreen({super.key});

  @override
  State<CreateAreaScreen> createState() => _CreateAreaScreenState();
}

class _CreateAreaScreenState extends State<CreateAreaScreen> {
  String? _actionServiceId;
  String? _actionId;

  String? _reactionServiceId;
  String? _reactionId;

  final _areaNameController = TextEditingController();
  final _areaDescriptionController = TextEditingController();

  // dynamic params (built from backend schema)
  final Map<String, TextEditingController> _actionParamCtrls = {};
  final Map<String, TextEditingController> _reactionParamCtrls = {};

  bool _submitting = false;

  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      context.read<ServicesProvider>().loadServices();
    });
  }

  @override
  void dispose() {
    _areaNameController.dispose();
    _areaDescriptionController.dispose();
    for (final c in _actionParamCtrls.values) {
      c.dispose();
    }
    for (final c in _reactionParamCtrls.values) {
      c.dispose();
    }
    super.dispose();
  }

  // ------------------------
  // Helpers to access backend service definitions
  // ------------------------

  dynamic _findService(String serviceId) {
    final sp = context.read<ServicesProvider>();
    return sp.services.firstWhere(
          (s) => s.id == serviceId,
      orElse: () => throw Exception('Service not found: $serviceId'),
    );
  }

  dynamic _findAction(String serviceId, String actionId) {
    final svc = _findService(serviceId);
    final actions = (svc.actions as List);
    return actions.firstWhere(
          (a) => (a.id ?? a.name) == actionId,
      orElse: () => throw Exception('Action not found: $serviceId/$actionId'),
    );
  }

  dynamic _findReaction(String serviceId, String reactionId) {
    final svc = _findService(serviceId);
    final reactions = (svc.reactions as List);
    return reactions.firstWhere(
          (r) => (r.id ?? r.name) == reactionId,
      orElse: () => throw Exception('Reaction not found: $serviceId/$reactionId'),
    );
  }

  String _svcLabel(dynamic svc) => (svc.displayName ?? svc.name ?? svc.id ?? '').toString();
  String _defLabel(dynamic def) => (def.displayName ?? def.name ?? def.id ?? '').toString();

  List<dynamic> _inputSchema(dynamic def) {
    final input = def.input;
    if (input is List) return input;
    // if backend returns null/empty
    return const [];
  }

  // create controllers for new schema; keep existing values if possible
  void _rebuildActionParamCtrls() {
    for (final c in _actionParamCtrls.values) {
      c.dispose();
    }
    _actionParamCtrls.clear();

    if (_actionServiceId == null || _actionId == null) return;

    final action = _findAction(_actionServiceId!, _actionId!);
    for (final f in _inputSchema(action)) {
      final key = f.key.toString();
      final placeholder = (f.placeholder ?? '').toString();
      _actionParamCtrls[key] = TextEditingController(text: placeholder.isNotEmpty ? '' : '');
    }
  }

  void _rebuildReactionParamCtrls() {
    for (final c in _reactionParamCtrls.values) {
      c.dispose();
    }
    _reactionParamCtrls.clear();

    if (_reactionServiceId == null || _reactionId == null) return;

    final reaction = _findReaction(_reactionServiceId!, _reactionId!);
    for (final f in _inputSchema(reaction)) {
      final key = f.key.toString();
      final placeholder = (f.placeholder ?? '').toString();
      _reactionParamCtrls[key] = TextEditingController(text: placeholder.isNotEmpty ? '' : '');
    }
  }

  // read controllers -> params map, with basic type casting based on schema
  Map<String, dynamic> _buildParamsFromSchema(
      List<dynamic> schema,
      Map<String, TextEditingController> ctrls,
      ) {
    final out = <String, dynamic>{};

    for (final f in schema) {
      final key = f.key.toString();
      final requiredField = f.required == true;

      final raw = (ctrls[key]?.text ?? '').trim();
      if (raw.isEmpty) {
        if (requiredField) {
          throw Exception('Missing required field: $key');
        }
        continue;
      }

      final type = (f.type ?? 'string').toString();

      if (type == 'number') {
        final n = num.tryParse(raw);
        if (n == null) throw Exception('Field "$key" must be a number.');
        out[key] = n;
      } else if (type == 'boolean') {
        final v = raw.toLowerCase();
        out[key] = (v == 'true' || v == '1' || v == 'yes' || v == 'y');
      } else {
        out[key] = raw;
      }
    }

    return out;
  }

  // ------------------------
  // UI interactions
  // ------------------------

  void _pickAction() {
    final sp = context.read<ServicesProvider>();
    final services = sp.services;

    showDialog(
      context: context,
      builder: (ctx) {
        String? tempServiceId = _actionServiceId;
        String? tempActionId = _actionId;

        final serviceIds = services.map((s) => s.id as String).toList();

        return StatefulBuilder(
          builder: (context, setStateDialog) {
            final theme = Theme.of(context);
            final cs = theme.colorScheme;

            InputDecoration deco(String label) => InputDecoration(
              labelText: label,
              labelStyle: TextStyle(color: cs.onSurfaceVariant),
            );

            List<dynamic> actions = const [];
            if (tempServiceId != null) {
              try {
                final svc = _findService(tempServiceId!);
                actions = (svc.actions as List);
              } catch (_) {}
            }

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
                    initialValue: tempServiceId,
                    decoration: deco('Service'),
                    dropdownColor: cs.surface,
                    style: TextStyle(color: cs.onSurface),
                    iconEnabledColor: cs.onSurfaceVariant,
                    items: serviceIds
                        .map((id) {
                      final svc = services.firstWhere((s) => s.id == id);
                      return DropdownMenuItem(
                        value: id,
                        child: Text(_svcLabel(svc)),
                      );
                    })
                        .toList(),
                    onChanged: (value) {
                      setStateDialog(() {
                        tempServiceId = value;
                        tempActionId = null;
                      });
                    },
                  ),
                  if (tempServiceId != null && actions.isNotEmpty) ...[
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      initialValue: tempActionId,
                      decoration: deco('Action'),
                      dropdownColor: cs.surface,
                      style: TextStyle(color: cs.onSurface),
                      iconEnabledColor: cs.onSurfaceVariant,
                      items: actions
                          .map((a) => DropdownMenuItem(
                        value: (a.id ?? a.name) as String,
                        child: Text(_defLabel(a)),
                      ))
                          .toList(),
                      onChanged: (value) {
                        setStateDialog(() {
                          tempActionId = value;
                        });
                      },
                    ),
                  ] else if (tempServiceId != null && actions.isEmpty)
                    Padding(
                      padding: const EdgeInsets.only(top: 12),
                      child: Text(
                        'No actions available for this service',
                        style: TextStyle(color: cs.onSurfaceVariant),
                      ),
                    ),
                ],
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.of(ctx).pop(),
                  child: Text('Cancel', style: TextStyle(color: cs.primary)),
                ),
                ElevatedButton(
                  onPressed: (tempServiceId != null && tempActionId != null)
                      ? () {
                    setState(() {
                      _actionServiceId = tempServiceId;
                      _actionId = tempActionId;
                      _rebuildActionParamCtrls();
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
    final sp = context.read<ServicesProvider>();
    final services = sp.services;

    showDialog(
      context: context,
      builder: (ctx) {
        String? tempServiceId = _reactionServiceId;
        String? tempReactionId = _reactionId;

        final serviceIds = services.map((s) => s.id as String).toList();

        return StatefulBuilder(
          builder: (context, setStateDialog) {
            final theme = Theme.of(context);
            final cs = theme.colorScheme;

            InputDecoration deco(String label) => InputDecoration(
              labelText: label,
              labelStyle: TextStyle(color: cs.onSurfaceVariant),
            );

            List<dynamic> reactions = const [];
            if (tempServiceId != null) {
              try {
                final svc = _findService(tempServiceId!);
                reactions = (svc.reactions as List);
              } catch (_) {}
            }

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
                    initialValue: tempServiceId,
                    decoration: deco('Service'),
                    dropdownColor: cs.surface,
                    style: TextStyle(color: cs.onSurface),
                    iconEnabledColor: cs.onSurfaceVariant,
                    items: serviceIds
                        .map((id) {
                      final svc = services.firstWhere((s) => s.id == id);
                      return DropdownMenuItem(
                        value: id,
                        child: Text(_svcLabel(svc)),
                      );
                    })
                        .toList(),
                    onChanged: (value) {
                      setStateDialog(() {
                        tempServiceId = value;
                        tempReactionId = null;
                      });
                    },
                  ),
                  if (tempServiceId != null && reactions.isNotEmpty) ...[
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      initialValue: tempReactionId,
                      decoration: deco('Reaction'),
                      dropdownColor: cs.surface,
                      style: TextStyle(color: cs.onSurface),
                      iconEnabledColor: cs.onSurfaceVariant,
                      items: reactions
                          .map((r) => DropdownMenuItem(
                        value: (r.id ?? r.name) as String,
                        child: Text(_defLabel(r)),
                      ))
                          .toList(),
                      onChanged: (value) {
                        setStateDialog(() {
                          tempReactionId = value;
                        });
                      },
                    ),
                  ] else if (tempServiceId != null && reactions.isEmpty)
                    Padding(
                      padding: const EdgeInsets.only(top: 12),
                      child: Text(
                        'No reactions available for this service',
                        style: TextStyle(color: cs.onSurfaceVariant),
                      ),
                    ),
                ],
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.of(ctx).pop(),
                  child: Text('Cancel', style: TextStyle(color: cs.primary)),
                ),
                ElevatedButton(
                  onPressed: (tempServiceId != null && tempReactionId != null)
                      ? () {
                    setState(() {
                      _reactionServiceId = tempServiceId;
                      _reactionId = tempReactionId;
                      _rebuildReactionParamCtrls();
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
    if (_actionServiceId == null || _actionId == null) return 'Tap to choose action...';
    final svc = _findService(_actionServiceId!);
    final a = _findAction(_actionServiceId!, _actionId!);
    return '${_svcLabel(svc)} • ${_defLabel(a)}';
  }

  String _describeSelectedReaction() {
    if (_reactionServiceId == null || _reactionId == null) return 'Tap to choose reaction...';
    final svc = _findService(_reactionServiceId!);
    final r = _findReaction(_reactionServiceId!, _reactionId!);
    return '${_svcLabel(svc)} • ${_defLabel(r)}';
  }

  List<Widget> _buildParamFields({
    required BuildContext context,
    required List<dynamic> schema,
    required Map<String, TextEditingController> ctrls,
  }) {
    if (schema.isEmpty) return const [];

    return [
      const SizedBox(height: 8),
      ...schema.map((f) {
        final cs = Theme.of(context).colorScheme;

        final key = f.key.toString();
        final label = (f.label ?? key).toString();
        final placeholder = (f.placeholder ?? '').toString();
        final helpText = (f.helpText ?? '').toString();
        final requiredField = f.required == true;
        final type = (f.type ?? 'string').toString();

        final ctrl = ctrls.putIfAbsent(key, () => TextEditingController());

        TextInputType keyboard = TextInputType.text;
        if (type == 'number') keyboard = TextInputType.number;

        return Padding(
          padding: const EdgeInsets.only(bottom: 8),
          child: TextField(
            controller: ctrl,
            keyboardType: keyboard,
            decoration: InputDecoration(
              labelText: requiredField ? label : '$label (optional)',
              hintText: placeholder.isEmpty ? null : placeholder,
              helperText: helpText.isEmpty ? null : helpText,
              helperStyle: TextStyle(color: cs.onSurfaceVariant),
            ),
          ),
        );
      }),
    ];
  }

  Future<void> _submit() async {
    if (_actionServiceId == null || _actionId == null) {
      _showError('Please choose an action.');
      return;
    }
    if (_reactionServiceId == null || _reactionId == null) {
      _showError('Please choose a reaction.');
      return;
    }

    final areasProvider = context.read<AreasProvider>();

    final actionService = _actionServiceId!;
    final actionType = _actionId!;
    final reactionService = _reactionServiceId!;
    final reactionType = _reactionId!;

    final fallbackName = '${_svcLabel(_findService(actionService))} → ${_svcLabel(_findService(reactionService))}';
    final name = _areaNameController.text.trim().isEmpty
        ? fallbackName
        : _areaNameController.text.trim();

    final description = _areaDescriptionController.text.trim().isEmpty
        ? 'Nice Area'
        : _areaDescriptionController.text.trim();

    try {
      final actionDef = _findAction(actionService, actionType);
      final reactionDef = _findReaction(reactionService, reactionType);

      final actionSchema = _inputSchema(actionDef);
      final reactionSchema = _inputSchema(reactionDef);

      final actionParams = _buildParamsFromSchema(actionSchema, _actionParamCtrls);
      final reactionParams = _buildParamsFromSchema(reactionSchema, _reactionParamCtrls);

      setState(() => _submitting = true);

      await areasProvider.createArea(
        name: name,
        description: description,
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
      if (mounted) setState(() => _submitting = false);
    }
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

    // build schemas (or empty) for current selection
    final actionSchema = (_actionServiceId != null && _actionId != null)
        ? _inputSchema(_findAction(_actionServiceId!, _actionId!))
        : const <dynamic>[];

    final reactionSchema = (_reactionServiceId != null && _reactionId != null)
        ? _inputSchema(_findReaction(_reactionServiceId!, _reactionId!))
        : const <dynamic>[];

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

            const SizedBox(height: 12),

            const Text('Description', style: TextStyle(fontSize: 16)),
            const SizedBox(height: 4),
            TextField(
              controller: _areaDescriptionController,
              decoration: const InputDecoration(
                hintText: 'Short description (optional)',
              ),
              maxLines: 2,
            ),

            const SizedBox(height: 24),
            Text(
              'IF',
              textAlign: TextAlign.center,
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
                color: cs.onSurface,
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

            ..._buildParamFields(
              context: context,
              schema: actionSchema,
              ctrls: _actionParamCtrls,
            ),

            const SizedBox(height: 24),
            Text(
              'THEN',
              textAlign: TextAlign.center,
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
                color: cs.onSurface,
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

            ..._buildParamFields(
              context: context,
              schema: reactionSchema,
              ctrls: _reactionParamCtrls,
            ),

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
