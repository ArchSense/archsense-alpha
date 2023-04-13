import { Injectable } from '@nestjs/common';
import { Span } from 'nestjs-otel';

@Injectable()
export class IdsService {
  private lastGeneratedId = 0;

  @Span()
  generateId(): number {
    this.lastGeneratedId += 1;
    return this.lastGeneratedId;
  }
}
