import { knex } from '../database/knex';
import { User } from '../models/user';
import { BaseRepository } from './base-repository';

export class UserRepository implements BaseRepository<User> {
  retrieve(columns: string[], whereClauses: any, callback: any): void {
    knex('user')
      .where(whereClauses)
      .then((results: User[]) => callback(results[0]))
      .catch((err: any) => callback(null, err));
  }

  create(item: User, callback: any): void {
    knex('user')
      .insert(item)
      .then((returning: any) => callback({ user_id: returning[0] }))
      .catch((err: any) => callback(null, err));
  }

  update(item: User, callback: any): void {
    item.updated_at = knex.fn.now();

    knex('user')
      .where({ id: item.id })
      .update(item)
      .then((result: any) => callback(result))
      .catch((err: any) => callback(null, err));
  }

  delete(id: number, callback: any): void {
    // Do nothing
    console.log(id, callback);
  }
}
