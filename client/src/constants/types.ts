import { RouterState } from 'connected-react-router';
import { Trip } from '../models/trip';
import { User } from '../models/user';

export interface RootState {
  router?: RouterState;
  dashboard: DashboardState;
  alert: AlertState;
  trip: TripState;
  authentication: AuthenticationState;
}

export interface DashboardState {
  edit: {
    isEditMode: boolean;
    idInEdit: number;
    component: 'trip' | 'tripDay' | 'tripEvent';
  };
  openTripForm: boolean;
  openTripDayForm: boolean;
  openTripEventForm: boolean;
  currentMenu: 'upcoming' | 'current' | 'past' | 'archived';
  selectedTripDayId: number;
}

export interface AlertState {
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
}

export interface TripState {
  isLoading: boolean;
  tripList: Trip[];
  tripDetail: Trip;
}

export interface AuthenticationState {
  status: { loggedIn: boolean };
  user: User;
}
