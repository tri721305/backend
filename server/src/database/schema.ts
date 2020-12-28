import { knex } from './knex';

export const schema = () => {
  knex.schema.hasTable('user').then((exists: boolean) => {
    if (!exists) {
      knex.schema
        .createTable('user', (table: any) => {
          table.increments('id').primary();
          table.string('username').notNullable();
          table.string('password').notNullable();
          table
            .string('email')
            .notNullable()
            .unique();
          table.timestamp('created_at').defaultTo(knex.fn.now());
          table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
        .catch((err: any) => console.error(err));
    }
  });

  knex.schema.hasTable('currency').then((exists: boolean) => {
    if (!exists) {
      knex.schema
        .createTable('currency', (table: any) => {
          table.increments('id').primary();
          table
            .string('code')
            .notNullable()
            .unique();
          table.string('name').notNullable();
          table.timestamp('created_at').defaultTo(knex.fn.now());
          table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
        .catch((err: any) => console.error(err));
    }
  });

  knex.schema.hasTable('timezone').then((exists: boolean) => {
    if (!exists) {
      knex.schema
        .createTable('timezone', (table: any) => {
          table.increments('id').primary();
          table.string('value').notNullable();
          table.string('abbr').notNullable();
          table.integer('offset').notNullable();
          table.boolean('isdst').notNullable();
          table.string('text').notNullable();
          table.string('utc').notNullable();
          table.timestamp('created_at').defaultTo(knex.fn.now());
          table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
        .catch((err: any) => console.error(err));
    }
  });

  knex.schema.hasTable('category').then((exists: boolean) => {
    if (!exists) {
      knex.schema
        .createTable('category', (table: any) => {
          table.increments('id').primary();
          table
            .string('name')
            .notNullable()
            .unique();
          table.timestamp('created_at').defaultTo(knex.fn.now());
          table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
        .catch((err: any) => console.error(err));
    }
  });

  knex.schema.hasTable('trip').then((exists: boolean) => {
    if (!exists) {
      knex.schema
        .createTable('trip', (table: any) => {
          table.increments('id').primary();
          table
            .integer('user_id')
            .unsigned()
            .notNullable();
          table
            .integer('timezone_id')
            .unsigned()
            .notNullable();
          table.date('start_date').notNullable();
          table.date('end_date').notNullable();
          table.string('name');
          table.string('destination').notNullable();
          table.boolean('archived').notNullable();
          table.timestamp('created_at').defaultTo(knex.fn.now());
          table.timestamp('updated_at').defaultTo(knex.fn.now());
          table.foreign('user_id').references('user.id');
          table.foreign('timezone_id').references('timezone.id');
        })
        .catch((err: any) => console.error(err));
    }
  });

  knex.schema.hasTable('trip_day').then((exists: boolean) => {
    if (!exists) {
      knex.schema
        .createTable('trip_day', (table: any) => {
          table.increments('id').primary();
          table
            .integer('trip_id')
            .unsigned()
            .notNullable();
          table
            .integer('user_id')
            .unsigned()
            .notNullable();
          table.string('name');
          table.date('trip_date').notNullable();
          table.timestamp('created_at').defaultTo(knex.fn.now());
          table.timestamp('updated_at').defaultTo(knex.fn.now());
          table.foreign('trip_id').references('trip.id');
          table.foreign('user_id').references('user.id');
        })
        .catch((err: any) => console.error(err));
    }
  });

  knex.schema.hasTable('event').then((exists: boolean) => {
    if (!exists) {
      knex.schema
        .createTable('event', (table: any) => {
          table.increments('id').primary();
          table.integer('trip_day_id').unsigned();
          table
            .integer('category_id')
            .unsigned()
            .notNullable();
          table
            .integer('user_id')
            .unsigned()
            .notNullable();
          table.integer('start_time_timezone_id').unsigned();
          table.integer('end_time_timezone_id').unsigned();
          table.integer('currency_id').unsigned();
          table.datetime('start_time');
          table.datetime('end_time');
          table.string('title').notNullable();
          table.string('start_location');
          table.string('end_location');
          table.text('note');
          table.text('tag');
          table.integer('cost');
          table.timestamp('created_at').defaultTo(knex.fn.now());
          table.timestamp('updated_at').defaultTo(knex.fn.now());
          table.foreign('trip_day_id').references('trip_day.id');
          table.foreign('category_id').references('category.id');
          table.foreign('user_id').references('user.id');
          table.foreign('start_time_timezone_id').references('timezone.id');
          table.foreign('end_time_timezone_id').references('timezone.id');
          table.foreign('currency_id').references('currency.id');
        })
        .catch((err: any) => console.error(err));
    }
  });
};
