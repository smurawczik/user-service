import { BuildUserDto } from './dto/build-user.dto';

export class UserBuilder {
  private user: BuildUserDto;

  constructor() {
    this.user = new BuildUserDto();
  }

  withFirstName(firstName: string): UserBuilder {
    this.user.firstName = firstName;
    return this;
  }

  withLastName(lastName: string): UserBuilder {
    this.user.lastName = lastName;
    return this;
  }

  withEmail(email: string): UserBuilder {
    this.user.email = email;
    return this;
  }

  withId(id: string): UserBuilder {
    this.user.id = id;
    return this;
  }

  withPassword(password: string): UserBuilder {
    this.user.password = password;
    return this;
  }

  build(): BuildUserDto {
    return this.user;
  }
}
