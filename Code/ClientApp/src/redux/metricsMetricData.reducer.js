import {
  METRIC_DATA_FAILURE,
  METRIC_DATA_SUCCESS,
  UPDATE_METRIC_DATA
} from './metricsMetric.action';
import { LOAD_CHARTS_BULK_SUCCESS } from './metricsChart.action';
import { createSelector } from 'reselect';

const getInitialState = () => ({
  loading: false,
  error: null,
  byId: {}
});

export default {
  [METRIC_DATA_SUCCESS]: (state = getInitialState(), action) => {
    const { metricId, metricData } = action.payload;

    return {
      ...state,
      loading: true,
      byId: {
        ...state.byId,
        [metricId]: metricData
      }
    };
  },
  [METRIC_DATA_FAILURE]: (state = getInitialState(), action) => ({
    ...state,
    loading: false,
    error: action.error
  }),
  [UPDATE_METRIC_DATA]: (state = getInitialState(), action) => {
    const metricDataEntities = action.payload;

    return {
      ...state,
      byId: {
        ...state.byId,
        ...metricDataEntities
      }
    };
  },
  [LOAD_CHARTS_BULK_SUCCESS]: (state = getInitialState(), action) => {
    const { metricPointsEntities } = action.payload;

    return {
      ...state,
      byId: { ...state.byId, ...metricPointsEntities }
    };
  }
};

export const getMetricDataById = (state, metricId) => state.metricsMetricData.byId[metricId];
export const defaultMetricsMetricData = getInitialState();
export const getMetricData = state => state.metricsMetricData.byId;

const getMinDatOfMetricData = matricDataMap => {
  const points = Object.values(matricDataMap);

  const minDate = points.reduce((prev, curr) => prev.concat(curr), [])
    .reduce((acc, el) => {
      if (!acc) return el.dateTime;
      return acc < el.dateTime ? acc : el.dateTime;
    }, 0);

  return minDate;
};

export const getMinDatOfMetricDataSelector = createSelector(getMetricData, getMinDatOfMetricData);
