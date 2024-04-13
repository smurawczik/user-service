import { User } from './entities/user.entity';

export class UserBuilder {
  private user: User;

  constructor() {
    this.user = new User();
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

  build(): User {
    return this.user;
  }
}
