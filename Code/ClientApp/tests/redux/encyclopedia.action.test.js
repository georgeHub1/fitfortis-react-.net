import configureStore from 'redux-mock-store';
import * as actions from '../../src/redux/encyclopedia.action';

const middlewares = [];
const mockStore = configureStore(middlewares);

const store = mockStore();

describe('should dispatch action', () => {
  beforeEach(() => {
    store.clearActions();
  });

  it(' action UPDATE_PREV_SEARCH', () => {
    const action = { type: actions.UPDATE_PREV_SEARCH };
    const expectedAction = [action];

    store.dispatch(actions.updatePrevSearch());
    expect(store.getActions()).toEqual(expectedAction);
  });
  it(' action DELETE_PREV_SEARCH', () => {
    const action = { type: actions.DELETE_PREV_SEARCH };
    const expectedAction = [action];

    store.dispatch(actions.deletePrevSearch());
    expect(store.getActions()).toEqual(expectedAction);
  });
});
