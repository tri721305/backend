export const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'sa',
    password: '(IJN8uhb',
    database: 'tripplanner',
    timezone: 'utc',
    dateStrings: ['DATE', 'DATETIME'],
  },
  pool: { min: 0, max: 7 },
  acquireConnectionTimeout: 10000,
  debug: true,
});
