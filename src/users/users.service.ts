import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Password } from 'src/password/entities/password.entity';
import { PasswordService } from 'src/password/password.service';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

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

  findAll() {
    return this.usersRepository.find({
      take: 30,
    });
  }

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);

    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
