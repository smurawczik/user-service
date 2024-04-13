import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { seedFakeData } from './database/seed';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: `http://localhost:${configService.get<number>('AUTH_SERVICE_PORT') ?? 3000}`,
    credentials: true,
  });
  app.use(cookieParser());
  app.use(compression());
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());

  const port = configService.get<number>('PORT') ?? 3005;
  await app.listen(port);

  seedFakeData(app);
}
bootstrap();
