import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { GetUsersQuery } from './users.types';
import { BooleanPipe } from 'src/pipes/boolean.pipe';
import { isEmail, isUUID } from 'class-validator';

@Controller('users')
@UseInterceptors(CacheInterceptor)
@CacheTTL(60)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query(BooleanPipe) usersQuery: GetUsersQuery) {
    return this.usersService.findAll(usersQuery);
  }

  @Get(':param')
  findOne(
    @Param('param') param: string,
    @Query(BooleanPipe) usersQuery: GetUsersQuery,
  ) {
    if (isUUID(param)) {
      return this.usersService.findUserById(param, usersQuery);
    }
    if (isEmail(param)) {
      return this.usersService.findOneByEmail(param, usersQuery);
    }
    return null;
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
