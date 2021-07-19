import { combineReducers } from 'redux';
import { createReducer } from '../utils/common';

import auth from './auth.reducer';
import metricsDateRange from './metricsDateRange.reducer';
import metricsMetric from './metricsMetric.reducer';
import metricsMetricData from './metricsMetricData.reducer';
import encyclopedia from './encyclopedia.reducer';
import symptomChecker from './symptomChecker.reducer';
import profile from './profile.reducer';
import locale from './locale.reducer';
import metricsCharts from './metricsChart.reducer';
import documentReducer from './document.reducer';
import documentItem from './item.reducer';
import adminTool from './adminTool.reducer';

export default combineReducers({
  auth: createReducer(auth),
  metricsChart: createReducer(metricsCharts),
  metricsDateRange: createReducer(metricsDateRange),
  metricsMetric: createReducer(metricsMetric),
  metricsMetricData: createReducer(metricsMetricData),
  encyclopedia: createReducer(encyclopedia),
  profile: createReducer(profile),
  symptomChecker: createReducer(symptomChecker),
  locale,
  document: createReducer(documentReducer),
  item: createReducer(documentItem),
  adminTool: createReducer(adminTool)
});
