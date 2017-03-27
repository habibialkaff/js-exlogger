import * as Log from '../action-types/log';
import initialState from './initialState';

function log(state = initialState.log, action = {}) {
  switch (action.type) {
    case Log.GetLog_Request:
      return {
        ...state,
        isFetchingLogs: true,
      };

    case Log.GetLog_Success:
      return {
        ...state,
        isFetchingLogs: false,
        logs: action.logs
      };

    default:
      return state;
  }
}

export default log;

