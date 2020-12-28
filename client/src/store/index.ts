import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory, History } from 'history';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { alertReducers } from './reducers/alert-reducers';
import { dashboardReducers } from './reducers/dashboard-reducers';
import { tripReducers } from './reducers/trip-reducers';
import { userReducers } from './reducers/user-reducers';

export const history: History<any> = createBrowserHistory();
const rootReducer = (history: History<any>) =>
  combineReducers({
    router: connectRouter(history),
    dashboard: dashboardReducers,
    alert: alertReducers,
    user: userReducers,
    trip: tripReducers,
  });

const composeEnhancer: typeof compose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer(history), composeEnhancer(applyMiddleware(routerMiddleware(history), thunk)));
export default store;
