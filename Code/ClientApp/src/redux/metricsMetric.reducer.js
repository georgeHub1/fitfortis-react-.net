import {
  LOAD_METRICS_FAILURE,
  LOAD_METRICS_REQUEST,
  LOAD_METRICS_SUCCESS,
  NEW_METRIC_ADD_SUCCESS,
  ADD_TO_BACK_DATA,
  METRIC_DATA_SUCCESS
} from './metricsMetric.action';
import { LOAD_CHARTS_BULK_SUCCESS } from './metricsChart.action';
import { TIMELINE_METRIC_ID } from '../constants/metrics';

const getInitialState = () => ({
  loading: false,
  error: null,
  bodyWeightChart: false,
  streeLevelChart: false,
  chartLoaded: false,
  pulseChart: false,
  byId: {}
});

export default {
  [LOAD_CHARTS_BULK_SUCCESS]: (state = getInitialState(), action) => {
    const { metrics } = action.payload;
    const byId = metrics.reduce((acc, curr) => { acc[curr.id] = { ...state.byId[curr.id], ...curr }; return acc; }, {});

    return {
      ...state,
      error: null,
      loading: false,
      byId: { ...state.byId, ...byId }
    };
  },
  [LOAD_METRICS_REQUEST]: (state = getInitialState()) => ({
    ...state,
    error: null,
    loading: true
  }),
  [LOAD_METRICS_SUCCESS]: (state = getInitialState(), action) => {
    const metrics = {};

    action.payload.forEach(item => {
      metrics[item.id] = state.byId[item.id]
        ? { ...state.byId[item.id], ...item }
        : { ...item, metricData: [] };
    });

    return {
      ...state,
      error: null,
      loading: false,
      byId: { ...state.byId, ...metrics }
    };
  },
  [NEW_METRIC_ADD_SUCCESS]: (state = getInitialState(), action) => {
    if (action.payload.metric === 'bodyWeightChart') {
      state.bodyWeightChart = true;
    } else if (action.payload.metric === 'streeLavel') {
      state.streeLevelChart = true;
    } else if (action.payload.metric === 'Pulse') {
      state.pulseChart = true;
    }
    return {
      ...state
    };
  },
  [LOAD_METRICS_FAILURE]: (state = getInitialState(), action) => ({
    ...state,
    loading: false,
    error: action.error
  }),
  [METRIC_DATA_SUCCESS]: (state = getInitialState(), action) => {
    const { metricId } = action.payload;
    const metric = { ...state.byId[metricId] };

    metric.entityStatus = 'loaded';

    return {
      ...state,
      byId: {
        ...state.byId,
        [metricId]: metric
      }
    };
  },
  [ADD_TO_BACK_DATA]: (state = getInitialState(), action) => {
    if (action.payload === '00000000-0000-0000-0000-000000000015') {
      state.bodyWeightChart = false;
    } else if (action.payload === '00000000-0000-0000-0000-000000000024') {
      state.streeLevelChart = false;
    } else if (action.payload === '00000000-0000-0000-0000-000000000010') {
      state.pulseChart = false;
    }
    return {
      ...state
    };
  }
};
export const defaultMetricsMetric = getInitialState();
export const getMetrics = state => state.metricsMetric.byId;
export const getMetricById = (state, metricId) => state.metricsMetric.byId[metricId];
export const getMetricDataByMetricId = (state, metricId) => (getMetricById(state, metricId) || { metricData: [] }).metricData;
export const getTimeLineMetricData = state => getMetricDataByMetricId(state, TIMELINE_METRIC_ID);
