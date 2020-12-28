import { isEmpty } from 'lodash';
import { knex } from '../database/knex';
import { Event } from '../models/event';
import { Trip } from '../models/trip';
import { TripDay } from '../models/trip-day';
import { BaseRepository } from './base-repository';
import { EventRepository } from './event-repository';
import { TripDayRepository } from './trip-day-repository';

const eventRepository = new EventRepository();
const tripDayRepository = new TripDayRepository();

export class TripRepository implements BaseRepository<Trip> {
  retrieveDetail(whereClauses: any, callback: any): void {
    let trip: Trip = null;
    const columns = ['id', 'timezone_id', 'start_date', 'end_date', 'name', 'destination', 'archived'];
    knex
      .column(columns)
      .select()
      .from('trip')
      .where(whereClauses)
      .then((results: Trip[]) => {
        trip = results[0];
        if (trip) {
          tripDayRepository.retrieve(
            null,
            { trip_id: whereClauses.id, user_id: whereClauses.user_id },
            (results: TripDay[], error: any) => {
              if (error) {
                callback(null, error);
              }
              trip.trip_day = results;
              if (!isEmpty(trip.trip_day)) {
                let count = 0;
                for (let i = 0; i < trip.trip_day.length; i++) {
                  eventRepository.retrieve(
                    null,
                    { trip_day_id: trip.trip_day[i].id, user_id: whereClauses.user_id },
                    (tripEvents: Event[], error: any) => {
                      if (error) {
                        callback(null, error);
                      } else {
                        trip.trip_day[i].events = tripEvents;
                        ++count;
                        if (count == trip.trip_day.length) {
                          callback(trip);
                        }
                      }
                    }
                  );
                }
              } else {
                callback(trip);
              }
            }
          );
        } else {
          callback();
        }
      })
      .catch((err: any) => callback(null, err));
  }

  retrieve(columns: string[], whereClauses: any, callback: any): void {
    if (isEmpty(columns)) {
      columns = ['id', 'start_date', 'end_date', 'name', 'destination', 'archived'];
    }
    if (!isEmpty(whereClauses.start_date) && !isEmpty(whereClauses.end_date)) {
      knex
        .column(columns)
        .select()
        .from('trip')
        .where('start_date', '<=', whereClauses.start_date)
        .andWhere('end_date', '>=', whereClauses.end_date)
        .andWhere('archived', false)
        .orderBy('start_date') // TODO
        .then((results: Trip[]) => callback(results))
        .catch((err: any) => callback(null, err));
    } else if (!isEmpty(whereClauses.start_date) && isEmpty(whereClauses.end_date)) {
      knex
        .column(columns)
        .select()
        .from('trip')
        .where('start_date', '>', whereClauses.start_date)
        .andWhere('archived', false)
        .orderBy('start_date') // TODO, can be order by different column
        .then((results: Trip[]) => callback(results))
        .catch((err: any) => callback(null, err));
    } else if (isEmpty(whereClauses.start_date) && !isEmpty(whereClauses.end_date)) {
      knex
        .column(columns)
        .select()
        .from('trip')
        .where('end_date', '<', whereClauses.end_date)
        .andWhere('archived', false)
        .orderBy('start_date') // TODO, can be order by different column
        .then((results: Trip[]) => callback(results))
        .catch((err: any) => callback(null, err));
    } else {
      knex
        .column(columns)
        .select()
        .from('trip')
        .where(whereClauses)
        .orderBy('start_date') // TODO, can be order by different column
        .then((results: Trip[]) => callback(results))
        .catch((err: any) => callback(null, err));
    }
  }

  create(item: Trip, callback: any): void {
    knex('trip')
      .insert(item)
      .then((returning: any) => callback({ trip_id: returning[0] }))
      .catch((err: any) => callback(null, err));
  }

  update(item: Trip, callback: any): void {
    item.updated_at = knex.fn.now();
    knex('trip')
      .where({ id: item.id, user_id: item.user_id })
      .update(item)
      .then((result: any) => callback(result))
      .catch((err: any) => callback(null, err));
  }
}
