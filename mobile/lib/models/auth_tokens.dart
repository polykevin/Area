class AuthTokens {
  final String accessToken;
  final String? refreshToken;

  AuthTokens({
    required this.accessToken,
    this.refreshToken,
  });

  factory AuthTokens.fromJson(Map<String, dynamic> json) {
    final access =
    (json['access_token'] ?? json['accessToken']) as String; //handle both
    final dynamic refreshRaw = json['refresh_token'] ?? json['refreshToken'];

    return AuthTokens(
      accessToken: access,
      refreshToken: refreshRaw == null ? null : refreshRaw as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'access_token': accessToken,
    if (refreshToken != null) 'refresh_token': refreshToken,
  };
}
