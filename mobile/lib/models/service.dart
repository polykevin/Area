class Service {
  final String id;
  final String name;
  final String displayName;
  final String description;
  final bool connected;

  Service({
    required this.id,
    required this.name,
    required this.displayName,
    required this.description,
    required this.connected,
  });

  factory Service.fromJson(Map<String, dynamic> json) {
    return Service(
      id: json['id'] as String,
      name: json['name'] as String,
      displayName: json['display_name'] as String? ?? json['displayName'] as String? ?? json['name'] as String,
      description: json['description'] as String? ?? '',
      connected: json['connected'] as bool? ?? false,
    );
  }
}
