import { isEmpty } from 'lodash';
import { Event as TripEvent } from '../models/event';
import { Trip } from '../models/trip';
import { TripDay } from '../models/trip-day';
import { EventRepository } from '../repositories/event-repository';
import { TripDayRepository } from '../repositories/trip-day-repository';
import { TripRepository } from '../repositories/trip-repository';
import { parameterIdValidation } from '../utils';

const eventRepository = new EventRepository();
const tripRepository = new TripRepository();
const tripDayRepository = new TripDayRepository();

const _handleResponse = (error: any, items: Trip[] | TripDay[] | TripEvent[], res: any, req: any, next: any) => {
  if (error) {
    res.status(400).send({ error });
  } else {
    if (!isEmpty(items)) {
      if (items[0].user_id !== req.user.id) {
        res.status(403).send({ error: 'You have no permission' });
      } else {
        next();
      }
    } else {
      res.status(404).send({ error: 'Not found' });
    }
  }
};
const _checkTripDayOwner = (id: number, res: any, req: any, next: any) => {
  tripDayRepository.retrieve(['user_id'], { id }, (tripDays: TripDay[], error: any) => {
    _handleResponse(error, tripDays, res, req, next);
  });
};

const _checkTripEventOwner = (id: number, res: any, req: any, next: any) => {
  eventRepository.retrieve(['user_id'], { id }, (events: TripEvent[], error: any) => {
    _handleResponse(error, events, res, req, next);
  });
};

export const checkTripOwnerByUrl = (req: any, res: any, next: any): void => {
  if (req.user) {
    try {
      const id: number = parameterIdValidation(req.params.trip_id);
      tripRepository.retrieve(['user_id'], { id }, (trips: Trip[], error: any) => {
        _handleResponse(error, trips, res, req, next);
      });
    } catch (error) {
      res.status(400).send({ error });
    }
  } else {
    res.status(401).send({ error: 'Please login first' });
  }
};

export const checkTripDayOwnerByPayload = (req: any, res: any, next: any): void => {
  if (req.user) {
    try {
      const tripDay: TripDay = req.body;
      if (tripDay.trip_id) {
        const id: number = parameterIdValidation(tripDay.trip_id);
        tripRepository.retrieve(['user_id'], { id }, (trips: Trip[], error: any) => {
          if (error) {
            res.status(400).send({ error });
          } else {
            if (!isEmpty(trips)) {
              if (trips[0].user_id !== req.user.id) {
                res.status(403).send({ error: 'You have no permission' });
              } else {
                if (tripDay.id) {
                  // Update trip day
                  const id: number = parameterIdValidation(tripDay.id);
                  _checkTripDayOwner(id, res, req, next);
                } else {
                  // Create trip day
                  next();
                }
              }
            } else {
              res.status(404).send({ error: 'Not found' });
            }
          }
        });
      } else {
        res.status(400).send({ error: 'Bad request' });
      }
    } catch (error) {
      res.status(400).send({ error });
    }
  } else {
    res.status(401).send({ error: 'Please login first' });
  }
};

export const checkTripDayOwnerByUrl = (req: any, res: any, next: any): void => {
  if (req.user) {
    try {
      const id: number = parameterIdValidation(req.params.trip_day_id);
      _checkTripDayOwner(id, res, req, next);
    } catch (error) {
      res.status(400).send({ error });
    }
  } else {
    res.status(401).send({ error: 'Please login first' });
  }
};

export const checkEventOwnerByUrl = (req: any, res: any, next: any): void => {
  if (req.user) {
    try {
      const eventId: number = parameterIdValidation(req.params.event_id);
      _checkTripEventOwner(eventId, res, req, next);
    } catch (error) {
      res.status(400).send({ error });
    }
  } else {
    res.status(401).send({ error: 'Please login first' });
  }
};

export const checkEventOwnerByPayload = (req: any, res: any, next: any): void => {
  if (req.user) {
    try {
      const event: TripEvent = req.body;
      if (event.trip_day_id) {
        // Update or create trip event based on trip da
        const id: number = parameterIdValidation(event.trip_day_id);
        tripDayRepository.retrieve(['user_id'], { id }, (tripDays: TripDay[], error: any) => {
          if (error) {
            res.status(400).send({ error });
          } else {
            if (!isEmpty(tripDays)) {
              if (tripDays[0].user_id !== req.user.id) {
                res.status(403).send({ error: 'You have no permission' });
              } else {
                if (event.id) {
                  // Update trip event
                  const id: number = parameterIdValidation(event.id);
                  _checkTripEventOwner(id, res, req, next);
                } else {
                  // Create trip event
                  next();
                }
              }
            } else {
              res.status(404).send({ error: 'Not found' });
            }
          }
        });
      } else {
        // Update or create independent trip event
        if (event.id) {
          // Update trip event
          const eventId: number = parameterIdValidation(event.id);
          _checkTripEventOwner(eventId, res, req, next);
        } else {
          // Create trip event
          next();
        }
      }
    } catch (error) {
      res.status(400).send({ error });
    }
  } else {
    res.status(401).send({ error: 'Please login first' });
  }
};
