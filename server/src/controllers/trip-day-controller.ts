import { Request, Response } from 'express';
import { TripDay } from '../models/trip-day';
import { TripDayService } from '../services/trip-day-service';
import { BaseController } from './base-controller';
import { parameterIdValidation } from '../utils';

const tripDayService = new TripDayService();

export class TripDayController implements BaseController<TripDayService> {
  create(req: Request, res: Response): void {
    try {
      const tripDay: TripDay = req.body;
      tripDay.user_id = req['user'].id;
      tripDayService.create(tripDay, (result: any, error: any) => {
        if (error) {
          res.status(400).send({ error: error.sqlMessage });
        } else {
          res.status(200).send({ success: true, result });
        }
      });
    } catch (error) {
      res.status(400).send({ error });
    }
  }

  update(req: Request, res: Response): void {
    try {
      const tripDay: TripDay = req.body;
      tripDay.user_id = req['user'].id;
      tripDayService.update(tripDay, (result: any, error: any) => {
        if (error) {
          res.status(400).send({ error: error.sqlMessage });
        } else {
          res.status(200).send({ success: true, result });
        }
      });
    } catch (error) {
      res.status(400).send({ error });
    }
  }

  delete(req: Request, res: Response): void {
    try {
      const trip_day_id: number = parameterIdValidation(req.params.trip_day_id);
      tripDayService.delete(trip_day_id, (result: any, error: any) => {
        if (error) {
          res.status(400).send({ error: error.sqlMessage });
        } else {
          res.status(200).send({ success: true, result });
        }
      });
    } catch (error) {
      res.status(400).send({ error });
    }
  }
}
