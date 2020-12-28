import { Request, Response } from 'express';
import { Trip } from '../models/trip';
import { TripService } from '../services/trip-service';
import { BaseController } from './base-controller';
import { parameterIdValidation } from '../utils';

const tripService = new TripService();

export class TripController implements BaseController<TripService> {
  retrieveDetail(req: Request, res: Response): void {
    try {
      const id: number = parameterIdValidation(req.params.trip_id);
      const user_id: number = req['user'].id;
      tripService.retrieveDetail({ id, user_id }, (result: Trip, error: any) => {
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

  retrieve(req: Request, res: Response): void {
    try {
      const whereClauses: any = req.body;
      whereClauses.user_id = req['user'].id;
      tripService.retrieve(null, whereClauses, (result: Trip[], error: any) => {
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

  create(req: Request, res: Response): void {
    try {
      const trip: Trip = req.body;
      trip.user_id = req['user'].id;
      tripService.create(trip, (result: any, error: any) => {
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
      const trip: Trip = req.body;
      trip.user_id = req['user'].id;
      tripService.update(trip, (result: any, error: any) => {
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
