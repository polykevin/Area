class Area {
  final String id;
  final String name;
  final String actionService;
  final String actionLabel;
  final String reactionService;
  final String reactionLabel;
  final bool isActive;
  final DateTime? createdAt;

  Area({
    required this.id,
    required this.name,
    required this.actionService,
    required this.actionLabel,
    required this.reactionService,
    required this.reactionLabel,
    required this.isActive,
    this.createdAt,
  });

  factory Area.fromJson(Map<String, dynamic> json) {
    return Area(
      id: json['id'] as String,
      name: (json['name'] ?? '') as String,
      actionService: json['action_service'] as String? ??
          json['actionService'] as String? ??
          '',
      actionLabel: json['action_label'] as String? ??
          json['actionLabel'] as String? ??
          '',
      reactionService: json['reaction_service'] as String? ??
          json['reactionService'] as String? ??
          '',
      reactionLabel: json['reaction_label'] as String? ??
          json['reactionLabel'] as String? ??
          '',
      isActive: json['is_active'] as bool? ??
          json['isActive'] as bool? ??
          false,
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at'] as String)
          : null,
    );
  }
}
