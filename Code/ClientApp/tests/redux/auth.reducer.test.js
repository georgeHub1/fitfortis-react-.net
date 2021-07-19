import auth from '../../src/redux/auth.reducer.js';
import {
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAILURE,
  LOGIN_USER_REQUEST
} from '../../src/redux/auth.action';
import { createReducer } from '../../src/utils/common';

describe('AUTH', () => {
  it('user should be loggenIn', () => {
    const action = { type: LOGIN_USER_SUCCESS };
    const initialState = {
      loading: false,
      loggenIn: true,
      error: null
    };

    expect(createReducer(auth)(undefined, action)).toEqual(initialState);
  });
  it('should be failed', () => {
    const action = { type: LOGIN_USER_FAILURE, error: 'fail' };
    const initialState = {
      loading: false,
      loggenIn: false,
      error: 'fail'
    };

    expect(createReducer(auth)(undefined, action)).toEqual(initialState);
  });
  it('should be loading', () => {
    const action = { type: LOGIN_USER_REQUEST };
    const initialState = {
      loading: true,
      loggenIn: false,
      error: null
    };
    const defaultState = {
      loading: false,
      loggenIn: false,
      error: null
    };

    expect(createReducer(auth)(defaultState, action)).toEqual(initialState);
  });
});
