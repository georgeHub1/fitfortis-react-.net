import configureStore from 'redux-mock-store';
import * as actions from '../../src/redux/profile.action';

const middlewares = [];
const mockStore = configureStore(middlewares);

const store = mockStore();

describe('should dispatch action', () => {
  beforeEach(() => {
    store.clearActions();
  });

  it('action UPDATE_PROFILE', () => {
    const action = { type: actions.UPDATE_PROFILE };
    const expectedAction = [action];

    store.dispatch(actions.updateProfile());
    expect(store.getActions()).toEqual(expectedAction);
  });
});
