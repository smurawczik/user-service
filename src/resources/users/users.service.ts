import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Password } from 'src/resources/password/entities/password.entity';
import { PasswordService } from 'src/resources/password/password.service';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { GetUsersQuery } from './users.types';
import { UserBuilder } from './users.builder';
import { isEmptyObject } from 'src/utils/object';
import { noop } from 'src/utils/noop';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Password)
    private passwordRepository: Repository<Password>,

    private passwordServie: PasswordService,
    private dataSource: DataSource,
    private logger: Logger,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const passwordEntity = new Password();
      const password = await this.passwordServie.create(createUserDto.password);
      passwordEntity.password = password.hash;
      passwordEntity.salt = password.salt;
      await queryRunner.manager.save(passwordEntity);

      const userEntity = new User();
      userEntity.firstName = createUserDto.firstName;
      userEntity.lastName = createUserDto.lastName;
      userEntity.email = createUserDto.email;

      userEntity.password = passwordEntity;
      await queryRunner.manager.save(userEntity);

      await queryRunner.commitTransaction();
    } catch (err) {
      this.logger.error(err);
      await queryRunner.rollbackTransaction();
    } finally {
      this.logger.log('user created successfully');
      await queryRunner.release();
    }
  }

  async findAll(usersQuery?: GetUsersQuery) {
    const limit = usersQuery?.limit || 20;
    const offset = usersQuery?.offset || 0;

    const dbUsers = await this.usersRepository.find({
      take: limit,
      skip: offset,
      relations: ['password'],
      select: {
        password: {
          password: true,
        },
      },
    });

    return dbUsers.map((user) => {
      return this.buildUser(user, usersQuery);
    });
  }

  async findUserById(id: string, usersQuery?: GetUsersQuery) {
    const dbUser = await this.usersRepository.findOne({
      where: {
        id,
      },
      relations: ['password'],
      select: {
        password: {
          password: true,
        },
      },
    });

    return this.buildUser(dbUser, usersQuery);
  }

  async findOneByEmail(email: string, usersQuery?: GetUsersQuery) {
    const dbUser = await this.usersRepository.findOne({
      where: {
        email,
      },
      relations: ['password'],
      select: {
        password: {
          password: true,
        },
      },
    });

    return this.buildUser(dbUser, usersQuery);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);

    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }

  private buildUser(user: User | null, usersQuery?: GetUsersQuery) {
    if (!user || !usersQuery) {
      return null;
    }

    const { limit: _, offset: __, ...filteredQuery } = usersQuery;
    noop(_, __);

    if (isEmptyObject(filteredQuery)) {
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      };
    }

    const userBuilder = new UserBuilder();
    if (usersQuery?.firstName) {
      userBuilder.withFirstName(user.firstName);
    }
    if (usersQuery?.lastName) {
      userBuilder.withLastName(user.lastName);
    }
    if (usersQuery?.email) {
      userBuilder.withEmail(user.email);
    }
    if (usersQuery?.id) {
      userBuilder.withId(user.id);
    }
    if (usersQuery?.password) {
      userBuilder.withPassword(user.password.password);
    }
    return userBuilder.build();
  }
}
