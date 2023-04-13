import { Module } from '@nestjs/common';
import { OpenTelemetryModule } from 'nestjs-otel';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InvoicesModule } from '@invoices/invoices.module';
// import { InvoicesModule } from './invoices/invoices.module';

const OpenTelemetryModuleConfig = OpenTelemetryModule.forRoot({
  metrics: {
    hostMetrics: true, // Includes Host Metrics
    apiMetrics: {
      enable: true, // Includes api metrics
      defaultAttributes: {
        // You can set default labels for api metrics
        custom: 'label',
      },
      ignoreRoutes: ['/favicon.ico'], // You can ignore specific routes (See https://docs.nestjs.com/middleware#excluding-routes for options)
      ignoreUndefinedRoutes: false, //Records metrics for all URLs, even undefined ones
    },
  },
});

@Module({
  imports: [OpenTelemetryModuleConfig, InvoicesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
