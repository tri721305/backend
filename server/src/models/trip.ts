import { TripDay } from './trip-day';

export interface Trip {
  id: number;
  user_id: number;
  timezone_id: number;
  start_date: string;
  end_date: string;
  name: string;
  destination: string;
  archived: boolean;
  trip_day: TripDay[];
  created_at: string;
  updated_at: string;
}
