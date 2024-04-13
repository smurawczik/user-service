import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { seedFakeData } from './database/seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    httpsOptions: {
      key: fs.readFileSync('./certs/key.pem'),
      cert: fs.readFileSync('./certs/cert.pem'),
    },
  });

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: `https://localhost:${configService.get<number>('AUTH_SERVICE_PORT') ?? 3000}`,
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
