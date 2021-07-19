import { createStore, applyMiddleware } from 'redux';

import reducers from './index.reducer';
import middleware from './middleware.store';

import { defaultAuth } from './auth.reducer.js';
import { defaultCharts } from './metricsChart.reducer';
import { defaultMetricsDateRange } from './metricsDateRange.reducer.js';
import { defaultMetricsMetric } from './metricsMetric.reducer.js';
import { defaultMetricsMetricData } from './metricsMetricData.reducer.js';
import { defaultEncyclopedia } from './encyclopedia.reducer.js';
import { defaultProfile } from './profile.reducer.js';
import { defaultSymptomChecker } from './symptomChecker.reducer.js';
import { defaultDocument } from './document.reducer';
import { defaultItem } from './item.reducer.js';
import { defaultAdminTool } from './adminTool.reducer';
const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore);

export const initialState = {
  auth: defaultAuth,
  metricsChart: defaultCharts,
  metricsDateRange: defaultMetricsDateRange,
  metricsMetric: defaultMetricsMetric,
  metricsMetricData: defaultMetricsMetricData,
  encyclopedia: defaultEncyclopedia,
  profile: defaultProfile,
  symptomChecker: defaultSymptomChecker,
  document: defaultDocument,
  item: defaultItem,
  adminTool: defaultAdminTool
};

const createAppStore = createStoreWithMiddleware(
  reducers,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default createAppStore;
