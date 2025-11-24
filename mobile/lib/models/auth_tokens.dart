class AuthTokens {
  final String accessToken;

  AuthTokens({required this.accessToken});

  factory AuthTokens.fromJson(Map<String, dynamic> json) {
    return AuthTokens(
      accessToken: json['access_token'] as String,
    );
  }
}
