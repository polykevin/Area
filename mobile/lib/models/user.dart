class User {
  final int id;
  final String email;
  final String? displayName;
  final String? provider;
  final String? photoUrl;
  final DateTime? createdAt;

  bool get isGoogle => provider == 'google';

  User({
    required this.id,
    required this.email,
    this.displayName,
    this.provider,
    this.photoUrl,
    this.createdAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    final dynamic rawId = json['id'] ?? json['sub'];

    DateTime? created;
    final createdRaw = json['createdAt'];
    if (createdRaw is String) {
      created = DateTime.tryParse(createdRaw);
    }

    return User(
      id: rawId is int ? rawId : int.parse(rawId.toString()),
      email: json['email'] as String,
      displayName:
      (json['displayName'] ?? json['name']) as String?,
      provider: json['provider'] as String?,
      photoUrl: json['photoUrl'] as String?,
      createdAt: created,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      if (displayName != null) 'displayName': displayName,
      if (provider != null) 'provider': provider,
      if (photoUrl != null) 'photoUrl': photoUrl,
      if (createdAt != null) 'createdAt': createdAt!.toIso8601String(),
    };
  }
}
