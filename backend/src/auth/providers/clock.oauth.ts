export class ClockOAuthProvider {
  getAuthUrl(state?: string) {
    return `${process.env.PUBLIC_BASE_URL}/oauth/clock/service-callback?state=${state}`;
  }

  async exchangeCode(code: string) {
    return {
      access_token: 'clock_internal_service',
      refresh_token: null,
      expiry_date: null,
    };
  }

  async getUserProfile(tokens: any) {
    return {
      id: 'clock_service',
      email: 'clock@internal.service',
      name: 'Clock Service',
    };
  }
}
