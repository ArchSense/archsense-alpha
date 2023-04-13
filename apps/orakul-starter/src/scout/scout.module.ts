import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScoutService } from './scout.service';

@Module({
  imports: [ConfigModule],
  providers: [ScoutService],
  exports: [ScoutService],
})
export class ScoutModule {}
