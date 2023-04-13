import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from './api/api.module';
import configuration from './config/configuration';
import { ScoutModule } from './scout/scout.module';
import { StaticsModule } from './statics/statics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      ignoreEnvFile: true,
    }),
    ScoutModule,
    StaticsModule,
    ApiModule,
  ],
  controllers: [],
  providers: [],
})
export class RootModule {}
