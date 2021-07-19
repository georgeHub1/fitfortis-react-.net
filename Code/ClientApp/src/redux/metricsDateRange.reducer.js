import { SET_METRICS_DATE_RANGE } from '../constants/actions';
import { yearMSec, YEAR_KEY } from '../constants/metrics.js';
const to = new Date().getTime();
const from = new Date().setHours(0, 0, 0, 0) - yearMSec;

export const defaultMetricsDateRange = { from, to, key: YEAR_KEY };
export default {
  [SET_METRICS_DATE_RANGE]: (state = defaultMetricsDateRange, { payload }) => payload
};

export const getMetricsDateRange = state => state.metricsDateRange;
