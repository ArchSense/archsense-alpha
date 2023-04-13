import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

export type Result = string;

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  ping() {
    return 'pong';
  }

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
