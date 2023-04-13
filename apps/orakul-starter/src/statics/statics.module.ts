import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), './node_modules/@archsense/orakul-ui', './build'),
    }),
  ],
})
export class StaticsModule {}
