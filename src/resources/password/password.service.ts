import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  async create(password: string) {
    const salt = await this.generateSalt();
    const hash = await bcrypt.hash(password, salt);

    return {
      salt,
      hash,
    };
  }

  async generateSalt() {
    return await bcrypt.genSalt(8);
  }
}
