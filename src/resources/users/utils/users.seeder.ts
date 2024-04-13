import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersSeeder {
  create(): CreateUserDto {
    const user = new CreateUserDto();
    user.firstName = faker.person.firstName();
    user.lastName = faker.person.lastName();
    user.email = faker.internet.email();
    user.password = '12345678';
    return user;
  }
}
