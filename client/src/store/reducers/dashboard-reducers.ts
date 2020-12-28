import { Actions } from '../../constants/actions';
import { DashboardState } from '../../constants/types';

const initialState: DashboardState = {
  edit: {
    isEditMode: false,
    idInEdit: 0,
    component: null,
  },
  openTripForm: false,
  openTripDayForm: false,
  openTripEventForm: false,
  currentMenu: 'current',
  selectedTripDayId: 0,
};

export const dashboardReducers = (state: DashboardState = initialState, action: any) => {
  switch (action.type) {
    case Actions.SET_SIDE_MENU:
      return {
        ...state,
        currentMenu: action.menu,
      };

    case Actions.UPDATE_SELECTED_TRIP_DAY_ID:
      return {
        ...state,
        selectedTripDayId: action.tripDayId,
      };

    case Actions.OPEN_TRIP_FORM:
      return {
        ...state,
        openTripForm: action.payload,
      };

    case Actions.OPEN_TRIP_DAY_FORM:
      return {
        ...state,
        openTripDayForm: action.payload,
      };

    case Actions.OPEN_TRIP_EVENT_FORM:
      return {
        ...state,
        openTripEventForm: action.payload,
      };

    case Actions.SET_EDIT_MODE:
      return {
        ...state,
        edit: action.payload,
      };

    default:
      return state;
  }
};
