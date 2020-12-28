import { Action, ActionCreator } from 'redux';
import { Actions } from '../../constants/actions';

export const setSideMenu: ActionCreator<Action> = (menu: string) => {
  return {
    type: Actions.SET_SIDE_MENU,
    menu,
  };
};

export const updateSelectedTripDayId: ActionCreator<Action> = (tripDayId: string) => {
  return {
    type: Actions.UPDATE_SELECTED_TRIP_DAY_ID,
    tripDayId,
  };
};

export const openTripForm: ActionCreator<Action> = (payload: boolean) => {
  return {
    type: Actions.OPEN_TRIP_FORM,
    payload,
  };
};

export const openTripDayForm: ActionCreator<Action> = (payload: boolean) => {
  return {
    type: Actions.OPEN_TRIP_DAY_FORM,
    payload,
  };
};

export const openTripEventForm: ActionCreator<Action> = (payload: boolean) => {
  return {
    type: Actions.OPEN_TRIP_EVENT_FORM,
    payload,
  };
};

export const setEditMode: ActionCreator<Action> = (payload: {
  isEditMode: boolean;
  idInEdit: number;
  component: 'trip' | 'tripDay' | 'tripEvent';
}) => {
  return {
    type: Actions.SET_EDIT_MODE,
    payload,
  };
};
