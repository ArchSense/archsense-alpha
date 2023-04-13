import otelSDK from './tracing';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  await otelSDK.start();
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(4000);
}
bootstrap();
