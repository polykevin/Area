class ServiceAction {
  final String name;
  final String description;

  ServiceAction({
    required this.name,
    required this.description,
  });

  factory ServiceAction.fromJson(Map<String, dynamic> json) {
    return ServiceAction(
      name: json['name'] as String,
      description: json['description'] as String? ?? '',
    );
  }
}

class Service {
  final String name;
  final List<ServiceAction> actions;
  final List<ServiceAction> reactions;

  Service({
    required this.name,
    required this.actions,
    required this.reactions,
  });

  String get displayName => name[0].toUpperCase() + name.substring(1);

  factory Service.fromJson(Map<String, dynamic> json) {
    final actionsList = (json['actions'] as List<dynamic>? ?? [])
        .map((e) => ServiceAction.fromJson(e as Map<String, dynamic>))
        .toList();
    
    final reactionsList = (json['reactions'] as List<dynamic>? ?? [])
        .map((e) => ServiceAction.fromJson(e as Map<String, dynamic>))
        .toList();

    return Service(
      name: json['name'] as String,
      actions: actionsList,
      reactions: reactionsList,
    );
  }
}
