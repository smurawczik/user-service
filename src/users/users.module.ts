import { Logger, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Password } from 'src/password/entities/password.entity';
import { UsersSeeder } from './utils/users.seeder';
import { PasswordService } from 'src/password/password.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Password])],
  controllers: [UsersController],
  providers: [PasswordService, UsersService, UsersSeeder, Logger],
})
export class UsersModule {}
