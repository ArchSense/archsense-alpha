import { NestFactory } from '@nestjs/core';
import * as open from 'open';
import { RootModule } from './root.module';

const PORT = 4501;
const STATICS_URL = `http://localhost:${PORT}`;

export async function bootstrap() {
  const app = await NestFactory.create(RootModule, { cors: true });
  await app.listen(PORT, () => {
    console.log(`Orakul UI is accessible at ${STATICS_URL}`);
    open(STATICS_URL);
  });
}
bootstrap();
