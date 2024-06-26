import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './resources/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordModule } from './resources/password/password.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ResponseTimeMiddleware } from './middlewares/response.time.middleware';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 1000,
        limit: 1000,
      },
    ]),
    CacheModule.register({
      isGlobal: true,
      ttl: 500,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST') ?? 'localhost',
        port: 3306,
        username: 'user',
        password: 'admin',
        database: 'users',
        autoLoadEntities: true,
        synchronize: true,
        dropSchema: true,
      }),
    }),
    UsersModule,
    PasswordModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ResponseTimeMiddleware).forRoutes('*');
  }
}
