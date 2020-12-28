export interface Event {
  id: number;
  trip_day_id: number;
  category_id: number;
  start_time_timezone_id: number;
  end_time_timezone_id: number;
  currency_id: number;
  user_id: number;
  start_time: string;
  end_time: string;
  title: string;
  start_location: string;
  end_location: string;
  note: string;
  tag: string;
  cost: number;
  created_at: string;
  updated_at: string;
}
