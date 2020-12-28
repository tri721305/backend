import { push } from 'connected-react-router';
import { Action, ActionCreator, AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { Actions } from '../../constants/actions';
import { Messages } from '../../constants/messages';
import { User } from '../../models/user';
import { UserService } from '../../services/user-service';
import { clearAlert, createAlert } from './alert-actions';

const userService = new UserService();

export const userLoginSuccess: ActionCreator<Action> = (userAccount: User) => {
  return {
    type: Actions.USER_LOGIN_SUCCESS,
    userAccount,
  };
};

export const userLoginFailure: ActionCreator<Action> = () => {
  return {
    type: Actions.USER_LOGIN_FAILURE,
  };
};

export const userLogin = (userLoginPayload: { email: string; password: string }) => {
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(clearAlert());
    userService
      .login(userLoginPayload)
      .then((result: any) => {
        if (result.success) {
          localStorage.setItem('user', JSON.stringify(result.user));
          dispatch(userLoginSuccess(result.user));
          dispatch(push('/dashboard'));
        } else {
          dispatch(userLoginFailure());
          dispatch(createAlert({ type: 'error', message: result.error }));
        }
      })
      .catch((error: any) => {
        dispatch(userLoginFailure());
        dispatch(createAlert({ type: 'error', message: error.error }));
      });
  };
};

export const userRegister = (userLoginPayload: { username: string; email: string; password: string }) => {
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(clearAlert());
    userService
      .register(userLoginPayload)
      .then((result: any) => {
        if (result.success) {
          dispatch(createAlert({ type: 'success', message: Messages.registerSuccess.message }));
          setTimeout(() => {
            dispatch(push('/login'));
            dispatch(clearAlert());
          }, 3000);
        } else {
          dispatch(createAlert({ type: 'error', message: result.error }));
        }
      })
      .catch((error: any) => {
        dispatch(createAlert({ type: 'error', message: error.error }));
      });
  };
};
