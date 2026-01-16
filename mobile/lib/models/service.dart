class InputFieldDefinition {
  final String key;
  final String label;
  final String type;
  final bool required;
  final String? placeholder;
  final String? helpText;

  InputFieldDefinition({
    required this.key,
    required this.label,
    required this.type,
    required this.required,
    this.placeholder,
    this.helpText,
  });

  factory InputFieldDefinition.fromJson(Map<String, dynamic> json) {
    return InputFieldDefinition(
      key: json['key'] as String,
      label: json['label'] as String? ?? json['key'] as String,
      type: json['type'] as String? ?? 'string',
      required: json['required'] as bool? ?? false,
      placeholder: json['placeholder'] as String?,
      helpText: json['helpText'] as String?,
    );
  }
}

class ServiceAction {
  final String id;
  final String displayName;
  final String description;
  final List<InputFieldDefinition> paramsSchema;

  ServiceAction({
    required this.id,
    required this.displayName,
    required this.description,
    required this.paramsSchema,
  });

  List<InputFieldDefinition> get input => paramsSchema;

  factory ServiceAction.fromJson(Map<String, dynamic> json) {
    final raw = (json['paramsSchema'] as List?) ?? const [];
    return ServiceAction(
      id: json['id'] as String,
      displayName: json['displayName'] as String? ?? (json['id'] as String),
      description: json['description'] as String? ?? '',
      paramsSchema: raw
          .map((e) => InputFieldDefinition.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }
}

class ServiceReaction {
  final String id;
  final String displayName;
  final String description;
  final List<InputFieldDefinition> paramsSchema;

  ServiceReaction({
    required this.id,
    required this.displayName,
    required this.description,
    required this.paramsSchema,
  });

  List<InputFieldDefinition> get input => paramsSchema;

  factory ServiceReaction.fromJson(Map<String, dynamic> json) {
    final raw = (json['paramsSchema'] as List?) ?? const [];
    return ServiceReaction(
      id: json['id'] as String,
      displayName: json['displayName'] as String? ?? (json['id'] as String),
      description: json['description'] as String? ?? '',
      paramsSchema: raw
          .map((e) => InputFieldDefinition.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }
}

class Service {
  final String id;
  final String displayName;
  final String? color;
  final String iconKey;
  final List<ServiceAction> actions;
  final List<ServiceReaction> reactions;

  Service({
    required this.id,
    required this.displayName,
    required this.iconKey,
    required this.actions,
    required this.reactions,
    this.color,
  });

  factory Service.fromJson(Map<String, dynamic> json) {
    return Service(
      id: json['id'] as String,
      displayName: json['displayName'] as String? ?? (json['id'] as String),
      color: json['color'] as String?,
      iconKey: json['iconKey'] as String? ?? (json['id'] as String),
      actions: ((json['actions'] as List?) ?? const [])
          .map((e) => ServiceAction.fromJson(e as Map<String, dynamic>))
          .toList(),
      reactions: ((json['reactions'] as List?) ?? const [])
          .map((e) => ServiceReaction.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }
}
