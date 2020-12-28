import { Trip } from '../models/trip';
import { TripRepository } from '../repositories/trip-repository';
import { BaseService } from './base-service';

const tripRepository = new TripRepository();

export class TripService implements BaseService<Trip> {
  retrieveDetail(whereClauses: any, callback: any): void {
    tripRepository.retrieveDetail(whereClauses, callback);
  }

  retrieve(columns: string[], whereClauses: any, callback: any): void {
    tripRepository.retrieve(null, whereClauses, callback);
  }

  create(item: Trip, callback: any): void {
    tripRepository.create(item, callback);
  }

  update(item: Trip, callback: any): void {
    tripRepository.update(item, callback);
  }
}
