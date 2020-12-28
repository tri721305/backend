import { Request, Response } from 'express';
import { Event } from '../models/event';
import { EventService } from '../services/event-service';
import { BaseController } from './base-controller';
import { parameterIdValidation } from '../utils';

const eventService = new EventService();

export class EventController implements BaseController<EventService> {
  retrieve(req: Request, res: Response): void {
    try {
      const whereClauses: any = req.body;
      whereClauses.user_id = req['user'].id;
      eventService.retrieve(null, whereClauses, (result: Event[], error: any) => {
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
      const event: Event = req.body;
      event.user_id = req['user'].id;
      eventService.create(event, (result: any, error: any) => {
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
      const event: Event = req.body;
      event.user_id = req['user'].id;
      eventService.update(event, (result: any, error: any) => {
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
      const id: number = parameterIdValidation(req.params.event_id);
      eventService.delete(id, (result: any, error: any) => {
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
