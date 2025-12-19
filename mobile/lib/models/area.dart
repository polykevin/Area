class Area {
  final int id;
  final String actionService;
  final String actionType;
  final Map<String, dynamic> actionParams;
  final String reactionService;
  final String reactionType;
  final Map<String, dynamic> reactionParams;
  final bool active;

  Area({
    required this.id,
    required this.actionService,
    required this.actionType,
    required this.actionParams,
    required this.reactionService,
    required this.reactionType,
    required this.reactionParams,
    required this.active,
  });

  factory Area.fromJson(Map<String, dynamic> json) {
    return Area(
      id: json['id'] as int,
      actionService: json['actionService'] as String,
      actionType: json['actionType'] as String,
      actionParams: (json['actionParams'] as Map?)?.cast<String, dynamic>() ?? {},
      reactionService: json['reactionService'] as String,
      reactionType: json['reactionType'] as String,
      reactionParams: (json['reactionParams'] as Map?)?.cast<String, dynamic>() ?? {},
      active: json['active'] as bool? ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'actionService': actionService,
      'actionType': actionType,
      'actionParams': actionParams,
      'reactionService': reactionService,
      'reactionType': reactionType,
      'reactionParams': reactionParams,
      'active': active,
    };
  }

  Area copyWith({
    bool? active,
    Map<String, dynamic>? actionParams,
    Map<String, dynamic>? reactionParams,
  }) {
    return Area(
      id: id,
      actionService: actionService,
      actionType: actionType,
      actionParams: actionParams ?? this.actionParams,
      reactionService: reactionService,
      reactionType: reactionType,
      reactionParams: reactionParams ?? this.reactionParams,
      active: active ?? this.active,
    );
  }
}
