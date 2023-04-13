import { Injectable } from '@nestjs/common';
import { Result } from './app.controller';

@Injectable()
export class AppService {
  getHello(): Result {
    return 'Hello World!';
  }
}
