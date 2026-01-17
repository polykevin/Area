import { Injectable } from '@nestjs/common';

@Injectable()
export class ClockService {
  getCurrentTime() {
    const now = new Date();

    return {
      iso: now.toISOString(),
      hour: now.getHours(),
      minute: now.getMinutes(),
      second: now.getSeconds(),
      day: now.getDate(),
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      weekday: now.getDay(),
    };
  }
}
