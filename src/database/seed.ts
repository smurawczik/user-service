import { INestApplication } from '@nestjs/common';
import { UsersSeeder } from 'src/users/utils/users.seeder';
import { UsersService } from 'src/users/users.service';

export async function seedFakeData(app: INestApplication) {
  const userFactory = app.get(UsersSeeder);
  const userService = app.get(UsersService);

  const numberOfUsers = 30;
  for (let i = 0; i < numberOfUsers; i++) {
    const user = userFactory.create();
    await userService.create(user);
  }
}
