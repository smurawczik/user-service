import { User } from 'src/resources/users/entities/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Password {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @OneToOne(() => User, (user) => user.password)
  user: User;
}
