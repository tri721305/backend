import { Actions } from '../../constants/actions';
import { User } from '../../models/user';

const user: User = JSON.parse(localStorage.getItem('user'));
const userInitialState = user ? { status: { loggedIn: true }, user } : { status: { loggedIn: false }, user };

export const userReducers = (state: any = userInitialState, action: any) => {
  switch (action.type) {
    case Actions.USER_LOGIN_SUCCESS:
      return {
        status: { loggedIn: true },
        user: action.userAccount,
      };

    case Actions.USER_LOGIN_FAILURE:
      return {
        status: { loggedIn: false },
        user: null,
      };

    default:
      return state;
  }
};
