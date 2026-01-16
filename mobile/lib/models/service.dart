class Service {
  final String id;
  final String displayName;
  final String? color;   // hex like "#EA4335"
  final String iconKey;

  final List<ServiceAction> actions;
  final List<ServiceReaction> reactions;

  Service({
    required this.id,
    required this.displayName,
    required this.color,
    required this.iconKey,
    required this.actions,
    required this.reactions,
  });

  factory Service.fromJson(Map<String, dynamic> json) {
    final actionsJson = (json['actions'] as List?) ?? const [];
    final reactionsJson = (json['reactions'] as List?) ?? const [];

    return Service(
      id: (json['id'] ?? '').toString(),
      displayName: (json['displayName'] ?? json['id'] ?? '').toString(),
      color: json['color']?.toString(),
      iconKey: (json['iconKey'] ?? json['id'] ?? '').toString(),
      actions: actionsJson
          .map((e) => ServiceAction.fromJson(e as Map<String, dynamic>))
          .toList(),
      reactions: reactionsJson
          .map((e) => ServiceReaction.fromJson(e as Map<String, dynamic>))
          .toList(),
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

  factory ServiceAction.fromJson(Map<String, dynamic> json) {
    final schemaJson = (json['paramsSchema'] as List?) ?? const [];

    return ServiceAction(
      id: (json['id'] ?? '').toString(),
      displayName: (json['displayName'] ?? json['id'] ?? '').toString(),
      description: (json['description'] ?? '').toString(),
      paramsSchema: schemaJson
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

  factory ServiceReaction.fromJson(Map<String, dynamic> json) {
    final schemaJson = (json['paramsSchema'] as List?) ?? const [];

    return ServiceReaction(
      id: (json['id'] ?? '').toString(),
      displayName: (json['displayName'] ?? json['id'] ?? '').toString(),
      description: (json['description'] ?? '').toString(),
      paramsSchema: schemaJson
          .map((e) => InputFieldDefinition.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }
}

/// Keep this aligned with your backend type union:
/// "string" | "number" | "boolean"
enum ParamType { string, number, boolean }

class InputFieldDefinition {
  final String key;
  final String label;
  final ParamType type;
  final bool requiredField;
  final String? placeholder;
  final String? helpText;

  InputFieldDefinition({
    required this.key,
    required this.label,
    required this.type,
    required this.requiredField,
    this.placeholder,
    this.helpText,
  });

  factory InputFieldDefinition.fromJson(Map<String, dynamic> json) {
    final rawType = (json['type'] ?? 'string').toString();

    return InputFieldDefinition(
      key: (json['key'] ?? '').toString(),
      label: (json['label'] ?? json['key'] ?? '').toString(),
      type: _parseParamType(rawType),
      requiredField: json['required'] == true,
      placeholder: json['placeholder']?.toString(),
      helpText: json['helpText']?.toString(),
    );
  }

  static ParamType _parseParamType(String raw) {
    switch (raw) {
      case 'number':
        return ParamType.number;
      case 'boolean':
        return ParamType.boolean;
      case 'string':
      default:
        return ParamType.string;
    }
  }
}
