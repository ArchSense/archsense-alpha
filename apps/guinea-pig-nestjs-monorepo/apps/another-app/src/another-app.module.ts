import { Module } from '@nestjs/common';
import { AnotherAppController } from './another-app.controller';
import { AnotherAppService } from './another-app.service';

@Module({
  imports: [],
  controllers: [AnotherAppController],
  providers: [AnotherAppService],
})
export class AnotherAppModule {}
