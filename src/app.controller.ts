import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PingResponse } from './app.types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  ping(): PingResponse {
    return this.appService.ping(Date.now());
  }
}
