import * as bcrypt from 'bcrypt';
import * as moment from 'moment-timezone';

import { knex } from './knex';
import { timezoneList } from './timezone';

const importTimeZoneFile = () => {
  const timezoneArray: any = [];
  timezoneList.forEach((timezone: any) => {
    const tz = {
      value: timezone.value,
      abbr: timezone.abbr,
      offset: timezone.offset,
      isdst: timezone.isdst,
      text: timezone.text,
      utc: timezone.utc[0],
    };
    timezoneArray.push(tz);
  });

  knex('timezone')
    .insert(timezoneArray)
    .then((returning: any) => console.log(returning))
    .catch((err: any) => console.error(err));
};

const createCurrency = () => {
  const currencies = [
    {
      code: 'AED',
      name: 'United Arab Emirates Dirham',
    },
    {
      code: 'AUD',
      name: 'Australian Dollar',
    },
    {
      code: 'CAD',
      name: 'Canadian Dollar',
    },
    {
      code: 'CHF',
      name: 'Swiss Franc',
    },
    {
      code: 'CNY',
      name: 'Chinese Yuan Renminbi',
    },
    {
      code: 'EUR',
      name: 'Euro',
    },
    {
      code: 'GBP',
      name: 'British Pound',
    },
    {
      code: 'HKD',
      name: 'Hong Kong Dollar',
    },
    {
      code: 'INR',
      name: 'Indian Rupee',
    },
    {
      code: 'JPY',
      name: 'Japanese Yen',
    },
    {
      code: 'MYR',
      name: 'Malaysian Ringgit',
    },
    {
      code: 'NZD',
      name: 'New Zealand Dollar',
    },
    {
      code: 'SGD',
      name: 'Singapore Dollar',
    },
    {
      code: 'TWD',
      name: 'Taiwan New Dollar',
    },
    {
      code: 'USD',
      name: 'US Dollar',
    },
  ];

  knex('currency')
    .insert(currencies)
    .then((returning: any) => console.log(returning))
    .catch((err: any) => console.error(err));
};

const createCategory = () => {
  const categories = [
    {
      name: 'activity',
    },
    {
      name: 'transportation',
    },
    {
      name: 'info',
    },
    {
      name: 'accommodation',
    },
    {
      name: 'flight',
    },
    {
      name: 'cruise',
    },
  ];

  knex('category')
    .insert(categories)
    .then((returning: any) => console.log(returning))
    .catch((err: any) => console.error(err));
};

const createUser = () => {
  const user = {
    username: 'laurence.ho',
    password: bcrypt.hashSync('abc123', 10),
    email: 'laurence@test.co.nz',
  };

  knex('user')
    .insert(user)
    .then((returning: any) => console.log(returning))
    .catch((err: any) => console.error(err));
};

const createTrip = () => {
  const trips = [
    {
      user_id: 1,
      timezone_id: 99,
      name: 'Go to New Zealand',
      start_date: moment()
        .add(-60, 'd')
        .format('YYYY-MM-DD'),
      end_date: moment()
        .add(-45, 'd')
        .format('YYYY-MM-DD'),
      destination: 'New Zealand',
      archived: false,
    },
    {
      user_id: 1,
      timezone_id: 85,
      name: `Let's go to Taiwan`,
      start_date: moment()
        .add(30, 'd')
        .format('YYYY-MM-DD'),
      end_date: moment()
        .add(45, 'd')
        .format('YYYY-MM-DD'),
      destination: 'Taiwan',
      archived: false,
    },
    {
      user_id: 1,
      timezone_id: 88,
      start_date: moment()
        .add(-5, 'd')
        .format('YYYY-MM-DD'),
      end_date: moment()
        .add(5, 'd')
        .format('YYYY-MM-DD'),
      destination: 'Japan, Tokyo',
      archived: false,
    },
  ];

  knex('trip')
    .insert(trips)
    .then((returning: any) => console.log(returning))
    .catch((err: any) => console.error(err));
};

const createTripDay = () => {
  const tripDays = [
    {
      user_id: 1,
      trip_id: 1,
      trip_date: moment()
        .add(-60, 'd')
        .format('YYYY-MM-DD'),
      name: 'Trip day 1',
    },
    {
      user_id: 1,
      trip_id: 1,
      trip_date: moment()
        .add(-59, 'd')
        .format('YYYY-MM-DD'),
      name: 'Trip day 2',
    },
    {
      user_id: 1,
      trip_id: 1,
      trip_date: moment()
        .add(-57, 'd')
        .format('YYYY-MM-DD'),
      name: 'Trip day 3',
    },
    {
      user_id: 1,
      trip_id: 2,
      trip_date: moment()
        .add(30, 'd')
        .format('YYYY-MM-DD'),
      name: 'Taipei 1',
    },
    {
      user_id: 1,
      trip_id: 2,
      trip_date: moment()
        .add(31, 'd')
        .format('YYYY-MM-DD'),
    },
  ];

  knex('trip_day')
    .insert(tripDays)
    .then((returning: any) => console.log(returning))
    .catch((err: any) => console.error(err));
};

const createEvent = () => {
  const events = [
    {
      user_id: 1,
      trip_day_id: 1,
      category_id: 4,
      start_time_timezone_id: 99,
      end_time_timezone_id: 99,
      title: 'Hostel in Auckland',
      note: 'Cannot refund',
      cost: 100,
      currency_id: 12,
    },
    {
      user_id: 1,
      trip_day_id: 1,
      category_id: 2,
      start_time_timezone_id: 99,
      end_time_timezone_id: 99,
      start_time: moment
        .tz(
          moment()
            .add(-60, 'd')
            .format('YYYY-MM-DD') + ' 07:00',
          'Antarctica/McMurdo'
        )
        .utc()
        .format('YYYY-MM-DD HH:mm'),
      end_time: moment
        .tz(
          moment()
            .add(-60, 'd')
            .format('YYYY-MM-DD') + ' 07:30',
          'Antarctica/McMurdo'
        )
        .utc()
        .format('YYYY-MM-DD HH:mm'),
      title: 'Take the bus from Auckland CBD',
    },
    {
      user_id: 1,
      trip_day_id: 1,
      category_id: 1,
      start_time_timezone_id: 99,
      end_time_timezone_id: 99,
      start_time: moment
        .tz(
          moment()
            .add(-60, 'd')
            .format('YYYY-MM-DD') + ' 09:00',
          'Antarctica/McMurdo'
        )
        .utc()
        .format('YYYY-MM-DD HH:mm'),
      end_time: moment
        .tz(
          moment()
            .add(-60, 'd')
            .format('YYYY-MM-DD') + ' 10:00',
          'Antarctica/McMurdo'
        )
        .utc()
        .format('YYYY-MM-DD HH:mm'),
      title: 'sightseeing in Auckland',
    },
    {
      user_id: 1,
      trip_day_id: 1,
      category_id: 1,
      start_time_timezone_id: 99,
      end_time_timezone_id: 99,
      start_time: moment
        .tz(
          moment()
            .add(-60, 'd')
            .format('YYYY-MM-DD') + ' 12:00',
          'Antarctica/McMurdo'
        )
        .utc()
        .format('YYYY-MM-DD HH:mm'),
      end_time: moment
        .tz(
          moment()
            .add(-60, 'd')
            .format('YYYY-MM-DD') + ' 13:00',
          'Antarctica/McMurdo'
        )
        .utc()
        .format('YYYY-MM-DD HH:mm'),
      title: 'Lunch @ Mt.Eden',
      cost: 50,
      currency_id: 12,
    },
    {
      user_id: 1,
      trip_day_id: 2,
      category_id: 1,
      start_time_timezone_id: 99,
      end_time_timezone_id: 99,
      start_time: moment
        .tz(
          moment()
            .add(-59, 'd')
            .format('YYYY-MM-DD') + ' 06:00',
          'Antarctica/McMurdo'
        )
        .utc()
        .format('YYYY-MM-DD HH:mm'),
      end_time: moment
        .tz(
          moment()
            .add(-59, 'd')
            .format('YYYY-MM-DD') + ' 07:00',
          'Antarctica/McMurdo'
        )
        .utc()
        .format('YYYY-MM-DD HH:mm'),
      title: 'Breakfast',
      cost: 20,
      currency_id: 12,
    },
    {
      user_id: 1,
      trip_day_id: 3,
      category_id: 1,
      start_time_timezone_id: 99,
      end_time_timezone_id: 99,
      start_time: moment
        .tz(
          moment()
            .add(-57, 'd')
            .format('YYYY-MM-DD') + ' 06:30',
          'Antarctica/McMurdo'
        )
        .utc()
        .format('YYYY-MM-DD HH:mm'),
      end_time: moment
        .tz(
          moment()
            .add(-57, 'd')
            .format('YYYY-MM-DD') + ' 07:30',
          'Antarctica/McMurdo'
        )
        .utc()
        .format('YYYY-MM-DD HH:mm'),
      title: 'Breakfast',
      cost: 20,
      currency_id: 12,
    },
    {
      user_id: 1,
      trip_day_id: 4,
      category_id: 1,
      start_time_timezone_id: 85,
      end_time_timezone_id: 85,
      start_time: moment
        .tz(
          moment()
            .add(31, 'd')
            .format('YYYY-MM-DD') + ' 07:00',
          'Asia/Taipei'
        )
        .utc()
        .format('YYYY-MM-DD HH:mm'),
      end_time: moment
        .tz(
          moment()
            .add(31, 'd')
            .format('YYYY-MM-DD') + ' 08:00',
          'Asia/Taipei'
        )
        .utc()
        .format('YYYY-MM-DD HH:mm'),
      title: 'Breakfast',
      cost: 150,
      currency_id: 14,
    },
  ];

  knex('event')
    .insert(events)
    .then((returning: any) => console.log(returning))
    .catch((err: any) => console.error(err));
};

importTimeZoneFile();
createCurrency();
createCategory();
createUser();
setTimeout(createTrip, 3000);
setTimeout(createTripDay, 6000);
setTimeout(createEvent, 9000);
