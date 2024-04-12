import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordModule } from './password/password.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ResponseTimeMiddleware } from './middlewares/response.time.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 1,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'user',
      password: 'admin',
      database: 'users',
      autoLoadEntities: true,
      synchronize: true,
      dropSchema: true,
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
