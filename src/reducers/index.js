import { combineReducers } from 'redux';
import auth from './auth';
import log from './log';
import {routerReducer} from 'react-router-redux';

const rootReducer = combineReducers({
  auth,
  log,
  routing: routerReducer
});

export default rootReducer;
