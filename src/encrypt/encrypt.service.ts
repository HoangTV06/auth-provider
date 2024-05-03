import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const salt = 10;
@Injectable()
export class EncryptService {
  hash(password: string) {
    return bcrypt.hash(password, salt);
  }

  match(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}
