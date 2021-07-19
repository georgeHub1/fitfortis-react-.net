import configureStore from 'redux-mock-store';
import * as actions from '../../src/redux/metricsMetric.action';

const middlewares = [];
const mockStore = configureStore(middlewares);

const store = mockStore();

describe('should dispatch action', () => {
  beforeEach(() => {
    store.clearActions();
  });

  it('action LOAD_METRICS_REQUEST', () => {
    const action = { type: actions.LOAD_METRICS_REQUEST };
    const expectedAction = [action];

    store.dispatch(actions.loadMetricsRequest());
    expect(store.getActions()).toEqual(expectedAction);
  });

  it('action LOAD_METRICS_SUCCESS', () => {
    const action = { type: actions.LOAD_METRICS_SUCCESS };
    const expectedAction = [action];

    store.dispatch(actions.loadMetricsSuccess());
    expect(store.getActions()).toEqual(expectedAction);
  });
  it('action LOAD_METRICS_FAILURE', () => {
    const action = { type: actions.LOAD_METRICS_FAILURE };
    const expectedAction = [action];

    store.dispatch(actions.loadMetricsFailure());
    expect(store.getActions()).toEqual(expectedAction);
  });
  it('action METRIC_DATA_SUCCESS', () => {
    const action = { type: actions.METRIC_DATA_SUCCESS };
    const expectedAction = [action];

    store.dispatch(actions.metricDataSuccess());
    expect(store.getActions()).toEqual(expectedAction);
  });
  it('action DELETE_METRIC_DATA_BULK', () => {
    const action = { type: actions.DELETE_METRIC_DATA_BULK };
    const expectedAction = [action];

    store.dispatch(actions.deleteMetricDataBulk());
    expect(store.getActions()).toEqual(expectedAction);
  });
  it('action UPSERT_METRIC_DATA', () => {
    const action = { type: actions.UPSERT_METRIC_DATA };
    const expectedAction = [action];

    store.dispatch(actions.upsertMetricData());
    expect(store.getActions()).toEqual(expectedAction);
  });
});
