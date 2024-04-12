import { Injectable } from '@nestjs/common';
import { PingResponse } from './app.types';

@Injectable()
export class AppService {
  ping(now: number): PingResponse {
    return { ping: `${Date.now() - now}ms` };
  }
}
