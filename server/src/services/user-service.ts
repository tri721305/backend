import { isEmpty } from 'lodash';
import * as bcrypt from 'bcrypt';
import { User } from '../models/user';
import { UserRepository } from '../repositories/user-repository';
import { BaseService } from './base-service';

const userRepository = new UserRepository();

export class UserService implements BaseService<User> {
  retrieve(columns: string[], whereClauses: any, callback: any): void {
    userRepository.retrieve(null, whereClauses, callback);
  }

  create(item: User, callback: any): void {
    for (const prop in item) {
      if (item.hasOwnProperty(prop)) {
        if (isEmpty(item[prop].trim())) {
          callback(null, `${prop} cannot be empty`);
          return;
        }
      }
    }
    item.password = bcrypt.hashSync(item.password, 10);

    userRepository.create(item, callback);
  }

  update(item: User, callback: any): void {
    for (const prop in item) {
      if (item.hasOwnProperty(prop)) {
        if (isEmpty(item[prop].trim())) {
          callback(null, `${prop} cannot be empty`);
          return;
        }
      }
    }
    item.password = bcrypt.hashSync(item.password, 10);

    userRepository.update(item, callback);
  }

  checkPassword(password: string, hashPassword: string): boolean {
    return bcrypt.compareSync(password, hashPassword);
  }
}
