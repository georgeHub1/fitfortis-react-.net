import {LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS, LOGIN_USER_FAILURE} from './auth.action';

const getInitialState = () => ({
  loading: false,
  loggenIn: false,
  error: null
});

export default {
  [LOGIN_USER_REQUEST]: (state = getInitialState()) => ({
    ...state,
    error: null,
    loading: true
  }),

  [LOGIN_USER_SUCCESS]: (state = getInitialState()) => ({
    loading: false,
    loggenIn: true,
    error: null
  }),

  [LOGIN_USER_FAILURE]: (state = getInitialState(), action) => ({
    loading: false,
    loggenIn: false,
    error: action.error
  })

};

export const defaultAuth = getInitialState();
