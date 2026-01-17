export class WeatherOAuthProvider {
  getAuthUrl(state?: string) {
    return `${process.env.PUBLIC_BASE_URL}/oauth/weather/service-callback?state=${state}`;
  }

  async exchangeCode(code: string) {
    return {
      access_token: 'weather_public_api', //weather token
      refresh_token: null,
      expiry_date: null,
    };
  }

  async getUserProfile(tokens: any) {
    return {
      id: 'weather_service',
      email: 'weather@openmeteo.com',
      name: 'Weather Service',
      latitude: 48.8566,  // Paris
      longitude: 2.3522,
    };
  }
}
