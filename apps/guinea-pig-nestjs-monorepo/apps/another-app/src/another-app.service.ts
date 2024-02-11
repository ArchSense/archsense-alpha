import { Injectable } from '@nestjs/common';

@Injectable()
export class AnotherAppService {
  getHello(): string {
    return 'Hello World!';
  }
}
