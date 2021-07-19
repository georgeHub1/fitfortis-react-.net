import configureStore from 'redux-mock-store';
import * as actions from '../../src/redux/metricsDateRange.action';
import { SET_METRICS_DATE_RANGE } from '../../src/constants/actions';

const middlewares = [];
const mockStore = configureStore(middlewares);

const store = mockStore();


describe('should dispatch action', () => {
  beforeEach(() => {
    store.clearActions();
  });

  it(' action SET_METRICS_DATE_RANGE', () => {
    const action = { type: SET_METRICS_DATE_RANGE, payload: 'test' };
    const expectedAction = [action];

    store.dispatch(actions.setMetricsDateRange('test'));
    expect(store.getActions()).toEqual(expectedAction);
  });
});
