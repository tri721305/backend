import { cloneDeep, isEmpty, map } from 'lodash';
import * as moment from 'moment-timezone';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { timezone } from '../../assets/timezone';
import { Actions } from '../../constants/actions';
import { DATE_FORMAT, DATE_TIME_FORMAT } from '../../constants/general';
import { Messages } from '../../constants/messages';
import { RootState } from '../../constants/types';
import { Event } from '../../models/event';
import { Trip } from '../../models/trip';
import { TripDay } from '../../models/trip-day';
import { EventService } from '../../services/event-service';
import { TripService } from '../../services/trip-service';
import { parseToLocalTime } from '../helpers';
import { clearAlert, createAlert } from './alert-actions';
import { updateSelectedTripDayId } from './dashboard-actions';

const eventService = new EventService();
const tripService = new TripService();

const _generateGetTripListPayload = (currentMenu: 'upcoming' | 'current' | 'past' | 'archived') => {
  let requestBody = null;
  if (currentMenu === 'archived') {
    requestBody = {
      archived: true,
    };
  } else if (currentMenu === 'current') {
    requestBody = {
      start_date: moment().format(DATE_FORMAT),
      end_date: moment().format(DATE_FORMAT),
      archived: false,
    };
  } else if (currentMenu === 'upcoming') {
    requestBody = {
      start_date: moment().format(DATE_FORMAT),
      archived: false,
    };
  } else if (currentMenu === 'past') {
    requestBody = {
      end_date: moment().format(DATE_FORMAT),
      archived: false,
    };
  } else {
    requestBody = {
      archived: false,
    };
  }
  return requestBody;
};

const _generateDateTimePayload = (key: 'start_time' | 'end_time', newPayload: Event, state: RootState) => {
  if (newPayload[key]) {
    newPayload[`${key}_timezone_id`] = newPayload[`${key}_timezone_id`]
      ? newPayload[`${key}_timezone_id`]
      : state.trip.tripDetail.timezone_id;
    const timezoneItem = timezone.find(tz => tz.id === newPayload[`${key}_timezone_id`]);
    newPayload.start_time = moment
      .tz(moment(newPayload[key]).format(DATE_TIME_FORMAT), timezoneItem.utc)
      .utc()
      .format(DATE_TIME_FORMAT);
  } else {
    newPayload[key] = null;
  }
};

const _createEventRequestPayload = (payload: Event, state: RootState) => {
  const newPayload = cloneDeep(payload);
  Object.keys(newPayload).forEach(prop => {
    // Convert to UTC date time string before sending request to server
    if (prop === 'start_time') {
      _generateDateTimePayload('start_time', newPayload, state);
    } else if (prop === 'end_time') {
      _generateDateTimePayload('end_time', newPayload, state);
    } else if (prop === 'currency_id' && newPayload.currency_id === 0) {
      newPayload.currency_id = null;
    } else if (prop === 'start_time_timezone_id' && newPayload.start_time_timezone_id === 0) {
      newPayload.start_time_timezone_id = null;
    } else if (prop === 'end_time_timezone_id' && newPayload.end_time_timezone_id === 0) {
      newPayload.end_time_timezone_id = null;
    } else if (prop === 'cost' && isEmpty(newPayload.cost)) {
      newPayload.cost = null;
    }
  });

  return newPayload;
};

/** Fetching **/
const _fetchingTripList = () => {
  return {
    type: Actions.FETCHING_TRIP_LIST,
  };
};

const _fetchingTripListFailure = () => {
  return {
    type: Actions.FETCHING_TRIP_LIST_FAILURE,
  };
};

const _fetchingTripListSuccess = (tripList: Trip[]) => {
  return {
    type: Actions.FETCHING_TRIP_LIST_SUCCESS,
    tripList,
  };
};

const _fetchTripListFailure = (message: string) => {
  return (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    dispatch(_fetchingTripListFailure());
    dispatch(createAlert({ type: 'error', message }));
  };
};

export const getTripList = () => {
  return (dispatch: ThunkDispatch<RootState, {}, AnyAction>, getState: any) => {
    dispatch(clearAlert());
    dispatch(_fetchingTripList());
    const requestPayload = _generateGetTripListPayload(getState().dashboard.currentMenu);
    tripService
      .getTripList(requestPayload)
      .then((result: { success: boolean; result: Trip[]; error?: string }) => {
        if (result.success) {
          map(result.result, (trip: Trip) => {
            trip.start_date = moment(trip.start_date).format(DATE_FORMAT);
            trip.end_date = moment(trip.end_date).format(DATE_FORMAT);
            return trip;
          });
          dispatch(_fetchingTripListSuccess(result.result));
        } else {
          dispatch(_fetchTripListFailure(result.error));
        }
      })
      .catch((error: any) => dispatch(_fetchTripListFailure(error.error)));
  };
};

const _fetchingTripDetail = () => {
  return {
    type: Actions.FETCHING_TRIP_DETAIL,
  };
};

const _fetchingTripDetailFailure = () => {
  return {
    type: Actions.FETCHING_TRIP_DETAIL_FAILURE,
  };
};

const _fetchingTripDetailSuccess = (tripDetail: Trip) => {
  return {
    type: Actions.FETCHING_TRIP_DETAIL_SUCCESS,
    tripDetail,
  };
};

const _fetchTripDetailFailure = (message: string) => {
  return (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    dispatch(_fetchingTripDetailFailure());
    dispatch(createAlert({ type: 'error', message }));
  };
};

export const getTripDetail = (tripId: number) => {
  return (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    dispatch(clearAlert());
    dispatch(_fetchingTripDetail());
    tripService
      .getTripDetail(tripId)
      .then((tripDetailResult: { success: boolean; result: Trip }) => {
        if (tripDetailResult.success) {
          tripDetailResult.result.start_date = moment(tripDetailResult.result.start_date).format(DATE_FORMAT);
          tripDetailResult.result.end_date = moment(tripDetailResult.result.end_date).format(DATE_FORMAT);
          if (!isEmpty(tripDetailResult.result.trip_day)) {
            map(tripDetailResult.result.trip_day, (tripDay: TripDay) => {
              tripDay.trip_date = moment(tripDay.trip_date).format(DATE_FORMAT);
              map(tripDay.events, (tripEvent: Event) => {
                return parseToLocalTime(tripEvent, tripDetailResult.result.timezone_id);
              });
              return tripDay;
            });
            dispatch(updateSelectedTripDayId(tripDetailResult.result.trip_day[0].id));
          }
          tripDetailResult.result.archived = tripDetailResult.result.archived === 1;
          dispatch(_fetchingTripDetailSuccess(tripDetailResult.result));
        } else {
          dispatch(_fetchTripDetailFailure(Messages.response.message));
        }
      })
      .catch((error: any) => {
        dispatch(_fetchTripDetailFailure(error.error));
      });
  };
};

/** Creating **/
const _creatingTrip = () => {
  return {
    type: Actions.CREATING_TRIP,
  };
};

const _creatingTripFailure = () => {
  return {
    type: Actions.CREATING_TRIP_FAILURE,
  };
};

const _creatingTripSuccess = (trip: Trip) => {
  return {
    type: Actions.CREATING_TRIP_SUCCESS,
    trip,
  };
};

const _createTripFailure = (message: string) => {
  return (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    dispatch(_creatingTripFailure());
    dispatch(createAlert({ type: 'error', message }));
  };
};

export const createTrip = (payload: Trip) => {
  return (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    dispatch(clearAlert());
    dispatch(_creatingTrip());
    tripService
      .createTrip(payload)
      .then((result: any) => {
        if (result.success) {
          payload.id = result.result.trip_id;
          dispatch(_creatingTripSuccess(payload));
        } else {
          dispatch(_createTripFailure(Messages.response.message));
        }
      })
      .catch((error: any) => {
        dispatch(_createTripFailure(error.error));
      });
  };
};

const _creatingTripDay = () => {
  return {
    type: Actions.CREATING_TRIP_DAY,
  };
};

const _creatingTripDayFailure = () => {
  return {
    type: Actions.CREATING_TRIP_DAY_FAILURE,
  };
};

const _creatingTripDaySuccess = (tripDay: TripDay) => {
  return {
    type: Actions.CREATING_TRIP_DAY_SUCCESS,
    tripDay,
  };
};

const _createTripDayFailure = (message: string) => {
  return (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    dispatch(_creatingTripDayFailure());
    dispatch(createAlert({ type: 'error', message }));
  };
};

export const createTripDay = (payload: TripDay) => {
  return (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    dispatch(_creatingTripDay());
    tripService
      .createTripDay(payload)
      .then((result: any) => {
        if (result.success) {
          payload.id = result.result.trip_day_id;
          dispatch(updateSelectedTripDayId(result.result.trip_day_id));
          dispatch(_creatingTripDaySuccess(payload));
        } else {
          dispatch(_createTripDayFailure(Messages.response.message));
        }
      })
      .catch((error: any) => {
        dispatch(_createTripDayFailure(error.error));
      });
  };
};

const _creatingTripEvent = () => {
  return {
    type: Actions.CREATING_TRIP_EVENT,
  };
};

const _creatingTripEventFailure = () => {
  return {
    type: Actions.CREATING_TRIP_EVENT_FAILURE,
  };
};

const _creatingTripEventSuccess = (tripEvent: Event) => {
  return {
    type: Actions.CREATING_TRIP_EVENT_SUCCESS,
    tripEvent,
  };
};

const _createTripEventFailure = (message: string) => {
  return (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    dispatch(_creatingTripEventFailure());
    dispatch(createAlert({ type: 'error', message }));
  };
};

export const createTripEvent = (payload: Event) => {
  return (dispatch: ThunkDispatch<RootState, {}, AnyAction>, getState: any) => {
    const newPayload = _createEventRequestPayload(payload, getState());

    dispatch(_creatingTripEvent());
    eventService
      .createTripEvent(newPayload)
      .then((result: any) => {
        if (result.success) {
          newPayload.id = result.result.event_id;
          dispatch(_creatingTripEventSuccess(newPayload));
        } else {
          dispatch(_createTripEventFailure(Messages.response.message));
        }
      })
      .catch((error: any) => {
        dispatch(_createTripEventFailure(error.error));
      });
  };
};

/** Updating **/
const _updatingTrip = () => {
  return {
    type: Actions.UPDATING_TRIP,
  };
};

const _updatingTripFailure = () => {
  return {
    type: Actions.UPDATING_TRIP_FAILURE,
  };
};

const _updatingTripSuccess = (trip: Trip) => {
  return {
    type: Actions.UPDATING_TRIP_SUCCESS,
    trip,
  };
};

const _updateTripFailure = (message: string) => {
  return (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    dispatch(_updatingTripFailure());
    dispatch(createAlert({ type: 'error', message }));
  };
};

export const updateTrip = (payload: Trip) => {
  return (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    dispatch(_updatingTrip());
    tripService
      .updateTrip(payload)
      .then((result: any) => {
        if (result.success) {
          dispatch(_updatingTripSuccess(payload));
        } else {
          dispatch(_updateTripFailure(Messages.response.message));
        }
      })
      .catch((error: any) => {
        dispatch(_updateTripFailure(error.error));
      });
  };
};

const _updatingTripDay = () => {
  return {
    type: Actions.UPDATING_TRIP_DAY,
  };
};

const _updatingTripDayFailure = () => {
  return {
    type: Actions.UPDATING_TRIP_DAY_FAILURE,
  };
};

const _updatingTripDaySuccess = (tripDay: TripDay) => {
  return {
    type: Actions.UPDATING_TRIP_DAY_SUCCESS,
    tripDay,
  };
};

const _updateTripDayFailure = (message: string) => {
  return (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    dispatch(_updatingTripDayFailure());
    dispatch(createAlert({ type: 'error', message }));
  };
};

export const updateTripDay = (payload: TripDay) => {
  return (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    dispatch(_updatingTripDay());
    tripService
      .updateTripDay(payload)
      .then((result: any) => {
        if (result.success) {
          dispatch(_updatingTripDaySuccess(payload));
        } else {
          dispatch(_updateTripDayFailure(Messages.response.message));
        }
      })
      .catch((error: any) => {
        dispatch(_updateTripDayFailure(error.error));
      });
  };
};

/** Deleting **/
const _deletingTripDay = () => {
  return {
    type: Actions.DELETING_TRIP_DAY,
  };
};

const _deletingTripDayFailure = () => {
  return {
    type: Actions.DELETING_TRIP_DAY_FAILURE,
  };
};

const _deletingTripDaySuccess = (tripDayId: number) => {
  return {
    type: Actions.DELETING_TRIP_DAY_SUCCESS,
    tripDayId,
  };
};

const _deleteTripDayFailure = (message: string) => {
  return (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    dispatch(_deletingTripDayFailure());
    dispatch(createAlert({ type: 'error', message }));
  };
};

export const deleteTripDay = (tripDayId: number) => {
  return (dispatch: ThunkDispatch<RootState, {}, AnyAction>, getState: any) => {
    dispatch(_deletingTripDay());
    tripService
      .deleteTripDay(tripDayId)
      .then((result: any) => {
        if (result.success) {
          const updateTripDayId = getState().trip.tripDetail.trip_day[0].id || 0;
          dispatch(updateSelectedTripDayId(updateTripDayId));
          dispatch(_deletingTripDaySuccess(tripDayId));
        } else {
          dispatch(_deleteTripDayFailure(Messages.response.message));
        }
      })
      .catch((error: any) => {
        dispatch(_deleteTripDayFailure(error.error));
      });
  };
};

const _deletingTripEvent = () => {
  return {
    type: Actions.DELETING_TRIP_EVENT,
  };
};

const _deletingTripEventFailure = () => {
  return {
    type: Actions.DELETING_TRIP_EVENT_FAILURE,
  };
};

const _deletingTripEventSuccess = (tripEvent: Event) => {
  return {
    type: Actions.DELETING_TRIP_EVENT_SUCCESS,
    tripEvent,
  };
};

const _deleteTripEventFailure = (message: string) => {
  return (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    dispatch(_deletingTripEventFailure());
    dispatch(createAlert({ type: 'error', message }));
  };
};

export const deleteTripEvent = (payload: Event) => {
  return (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    dispatch(_deletingTripEvent());
    eventService
      .deleteTripEvent(payload.id)
      .then((result: any) => {
        if (result.success) {
          dispatch(_deletingTripEventSuccess(payload));
        } else {
          dispatch(_deleteTripEventFailure(Messages.response.message));
        }
      })
      .catch((error: any) => {
        dispatch(_deleteTripEventFailure(error.error));
      });
  };
};
