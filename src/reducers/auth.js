import * as Auth from '../action-types/auth';
import initialState from './initialState';

function auth(state = initialState.auth, action = {}) {
  switch (action.type) {
    case Auth.Auth_Request:
      return {
        ...state,
        isFetchingAuth: true,
        isValidatingAuth: false,
      };
    case Auth.Auth_Validate:
      return {
        ...state,
        isFetchingAuth: false,
        isValidatingAuth: true
      };
    case Auth.Auth_Success:
      return {
        ...state,
        isFetchingAuth: false,
        isValidatingAuth: false,
        isLoggedIn: true,
        xUserId: action.xUserId
      };
    case Auth.Auth_Checked:
      return {
        ...state,
        isAuthChecked: true,
        isLoggedIn: action.isLoggedIn,
        xUserId: action.xUserId
      };
    default:
      return state;
  }
}

export default auth;
