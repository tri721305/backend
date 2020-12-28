import { Action, ActionCreator } from 'redux';
import { Actions } from '../../constants/actions';

export const clearAlert: ActionCreator<Action> = () => {
  return {
    type: Actions.CLEAR_ALERT,
  };
};

export const createAlert: ActionCreator<Action> = (alert: { type: string; message: string }) => {
  return {
    type: Actions.CREATE_ALERT,
    alert,
  };
};
