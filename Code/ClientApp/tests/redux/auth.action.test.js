import configureStore from 'redux-mock-store';
import * as actions from '../../src/redux/auth.action';

const middlewares = [];
const mockStore = configureStore(middlewares);

const store = mockStore();

describe('should dispatch action', () => {
  beforeEach(() => {
    store.clearActions();
  });

  it(' action LOGIN_USER_SUCCESS', () => {
    const action = { type: actions.LOGIN_USER_SUCCESS };
    const expectedAction = [action];

    store.dispatch(actions.loginUserSuccess());
    expect(store.getActions()).toEqual(expectedAction);
  });

  it(' action LOGIN_USER_REQUEST', () => {
    const action = { type: actions.LOGIN_USER_REQUEST };
    const expectedAction = [action];

    store.dispatch(actions.loginUserRequest());
    expect(store.getActions()).toEqual(expectedAction);
  });

  it(' action LOGIN_USER_FAILURE', () => {
    const action = { type: actions.LOGIN_USER_FAILURE };
    const expectedAction = [action];

    store.dispatch(actions.loginUserFailure());
    expect(store.getActions()).toEqual(expectedAction);
  });
});
