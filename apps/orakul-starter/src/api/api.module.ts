import { Module } from '@nestjs/common';
import { ScoutModule } from '../scout/scout.module';
import { ApiController } from './api.controller';

@Module({
  imports: [ScoutModule],
  controllers: [ApiController],
})
export class ApiModule {}
