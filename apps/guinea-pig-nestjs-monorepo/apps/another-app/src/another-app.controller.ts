import { Controller, Get } from '@nestjs/common';
import { AnotherAppService } from './another-app.service';

@Controller()
export class AnotherAppController {
  constructor(private readonly anotherAppService: AnotherAppService) {}

  @Get()
  getHello(): string {
    return this.anotherAppService.getHello();
  }
}
