import { Event } from './event';

export interface TripDay {
  id?: number;
  trip_id: number;
  name?: string;
  trip_date: string;
  events?: Event[];
}
