import metricsService from '../backendServices/metrics';
import { getMetricById } from './metricsMetric.reducer';
import { loadMetricDataAsync } from './metricsMetric.action';
import { loadChartBulkAsync } from './metricsChart.action';

export const ADD_CHART_METRIC = 'ADD_CHART_METRIC';
export const UPDATE_CHART_METRIC = 'UPDATE_CHART_METRIC';
export const DELETE_METRIC_FROM_CHART = 'DELETE_METRIC_FROM_CHART';

export const addChartMetric = payload => ({
  type: ADD_CHART_METRIC,
  payload
});

export const updateChartMetric = payload => ({
  type: UPDATE_CHART_METRIC,
  payload
});

export const deleteMetricFromChart = payload => ({
  type: DELETE_METRIC_FROM_CHART,
  payload
});

export const updateChartMetricPropertiesAsync = (chartMetricId, chartMetricProperties, chartId) =>
  dispatch => {
    return metricsService.updateChartMetric(chartMetricId, chartMetricProperties)
      .then(data => dispatch(updateChartMetric({ ...data, chartMetric: data, chartId })));
  };

export const updateChartMetricDataPropertiesAsync = (metricId, chartMetricProperties, chartId) =>
  dispatch => {
    return metricsService.updateChartMetricData(metricId, chartMetricProperties)
    .then(() => dispatch(loadChartBulkAsync()));
  };

export const addMetricToChartAsync = (chartId, metricId, data) => (dispatch, getState) => {
  if (data.code === 'BP-Pressure') {
    const MetricIds = [];

    for (const i in data.data) {
      MetricIds.push(data.data[i].id);
    }

    const metrics = {
      keys: MetricIds
    };

    return metricsService.addMetricToChartBulk(chartId, metrics)
      .then(data => {
        dispatch(loadChartBulkAsync());
      })
      .catch(err => err);
  }
  return metricsService.addMetricToChart(chartId, metricId)
    .then(data => {
      const state = getState();
      const metricData = state.metricsMetricData.byId[metricId] || [];
      const metric = getMetricById(state, metricId);

      dispatch(addChartMetric({ metricData, chartId, metric, chartMetric: data }));
      if (metric.entityStatus !== 'loaded') {
        dispatch(loadMetricDataAsync(metricId));
      }
    })
    .catch(err => err);
};

export const deleteSelectedMetricAsync = (chartId, chartMetricId) => {
  return dispatch => {
    return metricsService.deleteMetricFromChart(chartMetricId)
      .then(() => {
        return dispatch(deleteMetricFromChart({ chartId, chartMetricId }));
      })
      .catch(err => err);
  };
};
