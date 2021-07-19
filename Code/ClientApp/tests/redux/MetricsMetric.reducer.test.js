import metricsMetric from '../../src/redux/metricsMetric.reducer.js';
import * as actions from '../../src/redux/metricsMetric.action';
import { createReducer } from '../../src/utils/common';
import { TIMELINE_METRIC_ID } from '../../src/constants/metrics.js';

const defaultState = {
  loading: false,
  error: null,
  byId: {}
}

describe('metricsMetric', () => {
  it('should be metric loading', () => {
    const action = actions.loadMetricsRequest()
    const expectedState = {
      byId: {},
      loading: true,
      error: null
    };

    expect(createReducer(metricsMetric)(defaultState, action)).toEqual(
      expectedState
    );
  });
  it('should load metric success', () => {
    const action = actions.loadMetricsSuccess([{
      code: 'ALT, SGPT, GPT',
      units: 'kg',
      defaultYMin: '20',
      defaultYMax: '60',
      defaultBackgroundColor: '#7136CE07',
      defaultBackgroundImage: 'linear-gradient(#7136CE77, #7136CE07)',
      defaultAreaFillOpacity: '0.2',
      defaultStroke: '#7136CE',
      id: TIMELINE_METRIC_ID
    }]);
    const expectedState = {
      byId: {
        [TIMELINE_METRIC_ID]: {
          id: TIMELINE_METRIC_ID,
          code: 'ALT, SGPT, GPT',
          units: 'kg',
          defaultYMin: '20',
          defaultYMax: '60',
          defaultBackgroundColor: '#7136CE07',
          defaultBackgroundImage: 'linear-gradient(#7136CE77, #7136CE07)',
          defaultAreaFillOpacity: '0.2',
          defaultStroke: '#7136CE',
          metricData: []
        }
      },
      error: null,
      loading: false
    };

    expect(createReducer(metricsMetric)(defaultState, action)).toEqual(
      expectedState
    );
  });
  it('should load metric failure', () => {
    const action = actions.loadMetricsFailure('failed');
    const expectedState = {
      byId: {},
      loading: false,
      error: 'failed'
    };

    expect(createReducer(metricsMetric)(defaultState, action)).toEqual(
      expectedState
    );
  });
});
