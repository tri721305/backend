import { isEmpty } from 'lodash';
import * as moment from 'moment-timezone';
import { timezone } from '../assets/timezone';
import { DATE_TIME_TZ_FORMAT } from '../constants/general';
import { Event } from '../models/event';

export const parseToLocalTime = (tripEvent: Event, timezoneId: number): Event => {
  if (!isEmpty(tripEvent.start_time)) {
    const startTimeTimezoneId = tripEvent.start_time_timezone_id || timezoneId;
    const startTimeTimezone = timezone.find(tz => tz.id === startTimeTimezoneId);
    tripEvent.start_time = moment
      .utc(tripEvent.start_time)
      .tz(startTimeTimezone.utc)
      .format(DATE_TIME_TZ_FORMAT);
  }
  if (!isEmpty(tripEvent.end_time)) {
    const endTimeTimezoneId = tripEvent.end_time_timezone_id || timezoneId;
    const endTimeTimezone = timezone.find(tz => tz.id === endTimeTimezoneId);
    tripEvent.end_time = moment
      .utc(tripEvent.end_time)
      .tz(endTimeTimezone.utc)
      .format(DATE_TIME_TZ_FORMAT);
  }
  return tripEvent;
};
