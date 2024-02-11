import { NestFactory } from '@nestjs/core';
import { AnotherAppModule } from './another-app.module';

async function bootstrap() {
  const app = await NestFactory.create(AnotherAppModule);
  await app.listen(3000);
}
bootstrap();
