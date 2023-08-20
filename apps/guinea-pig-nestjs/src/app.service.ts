import { Injectable } from '@nestjs/common';
import { Result } from './app.controller';

@Injectable()
export class AppService {
  getHello(): Result {
    return `Hello ${this.getWorld()}`;
  }

  // used to ensure private methods are filtered by @archsense/scout
  private getWorld() {
    return 'World';
  }
}
