import { Actions } from '../../constants/actions';
import { AlertState } from '../../constants/types';

const initialState: AlertState = {
  type: null,
  message: null,
};

export const alertReducers = (state: AlertState = initialState, action: any) => {
  switch (action.type) {
    case Actions.CLEAR_ALERT:
      return {
        type: null,
        message: null,
      };

    case Actions.CREATE_ALERT:
      return {
        type: action.alert.type,
        message: action.alert.message,
      };

    default:
      return state;
  }
};
