
import { createSelector } from 'reselect';
import { TIMELINE_METRIC_ID, DEFAULT_STROKE } from '../constants/metrics';
import { getMetrics } from './metricsMetric.reducer';
import { getUsedMetricsByChartId, getUsedMetrics } from './metricsChart.reducer';

export const getAvailableMetricsSelector = createSelector(
  [getUsedMetrics, getMetrics],
  (usedMetrics, metricsMap) => {
    const metrics = Object.values(metricsMap || {});
    const selectedMetricIdSet = {};

    usedMetrics.forEach(metric => {
      selectedMetricIdSet[metric.id] = metric.id;
    });
    const BloodPressureDia = metrics.find(x => x.code === 'BP-dia');
    const BloodPressureSys = metrics.find(x => x.code === 'BP-sys');
    const BloodPressure = {
      ...BloodPressureSys,
      name: BloodPressureSys.name.substring(0, BloodPressureSys.name.indexOf('(')),
      code: 'BP-Pressure',
      data: [{ ...BloodPressureDia}, {...BloodPressureSys}]
    };
    const availableMetrics = metrics.filter(x => !selectedMetricIdSet[x.id]);
    const BloodPressureMetrics = availableMetrics.filter(x => x.code === 'BP-dia' || x.code === 'BP-sys');

    if (BloodPressureMetrics.length  > 0) {
      availableMetrics.push(BloodPressure);
    }
    const finalData = availableMetrics.filter(x => !(x.code === 'BP-dia' || x.code === 'BP-sys'));
    const result = finalData.filter(x => x.id !== TIMELINE_METRIC_ID);

    return result;
  });

const getGoal = (metric, metricData, goal) => {
  if (metric.type === 1) {
    if (goal !== null && goal !== undefined)
      return goal;
    if (metricData.length === 1)
      return metricData[0].value;
  }
  return null;
};
const getMinRangeGoal = (metric, metricData, yMin) => {
    if (yMin !== null && yMin !== undefined && !isNaN(parseFloat(yMin)))
      return parseFloat(yMin);

    if (metric.defaultYMin && !isNaN(parseFloat(metric.defaultYMin))) {
      return parseFloat(metric.defaultYMin);
    }

    if (metricData.length === 0)
      return null;

    const minPoint = metricData.reduce((acc, curr) => acc.value > curr.value ? curr : acc, metricData[0]);

    if (metric.defaultYMin) {
      if (!isNaN(parseFloat(metric.defaultYMin))) {
        return parseFloat(metric.defaultYMin);
      }
      if ((metric.defaultYMin).indexOf('dataMin') >= 0 && (metric.defaultYMin).indexOf('-') >= 0) {
        const tokens = metric.defaultYMin.split('-');

        return minPoint.value - parseFloat(tokens[1]);
      }
      if ((metric.defaultYMin).indexOf('dataMin') >= 0 && (metric.defaultYMin).indexOf('+') >= 0) {
        const tokens = metric.defaultYMin.split('+');

        return minPoint.value + parseFloat(tokens[1]);
      }
    }

    return minPoint.value;
};
const getMaxRangeGoal = (metric, metricData, yMax) => {
    if (yMax !== null && yMax !== undefined && !isNaN(parseFloat(yMax)))
      return parseFloat(yMax);

    if (metric.defaultYMax && !isNaN(parseFloat(metric.defaultYMax))) {
      return parseFloat(metric.defaultYMax);
    }

    if (metricData.length === 0)
      return null;

    const maxPoint = metricData.reduce((acc, curr) => acc.value < curr.value ? curr : acc, metricData[0]);

    if (metric.defaultYMax) {
      if (!isNaN(parseFloat(metric.defaultYMax))) {
        return parseFloat(metric.defaultYMax);
      }
      if ((metric.defaultYMax).indexOf('dataMax') >= 0 && (metric.defaultYMax).indexOf('-') >= 0) {
        const tokens = metric.defaultYMax.split('-');

        return maxPoint.value - parseFloat(tokens[1]);
      }
      if ((metric.defaultYMax).indexOf('dataMax') >= 0 && (metric.defaultYMax).indexOf('+') >= 0) {
        const tokens = metric.defaultYMax.split('+');

        return maxPoint.value + parseFloat(tokens[1]);
      }
    }

    return maxPoint.value;
};

export const getChartMetricSettingsById = (chartMetric, metric, metricData, dataPointIndex, chartId) => {
  const stroke = chartMetric.stroke || metric.defaultStroke || DEFAULT_STROKE;

  return {
    stroke,
    code: chartMetric.id,
    chartMetricId: chartMetric.id,
    showGoalLines: chartMetric.showGoalLines,
    annotateLastEntry: chartMetric.annotateLastEntry,
    annotateMaxEntry: chartMetric.annotateMaxEntry,
    annotateMinEntry: chartMetric.annotateMinEntry,
    goal: getGoal(metric, metricData, chartMetric.goal),
    yMin: getMinRangeGoal(metric, metricData, chartMetric.yMin),
    yMax: getMaxRangeGoal(metric, metricData, chartMetric.yMax),
    defaultGoalMin: chartMetric.goalMin || metric.defaultGoalMin,
    defaultGoalMax: chartMetric.goalMax || metric.defaultGoalMax,

    type: metric.type,
    metricId: metric.id,
    name: metric.name,
    defaultStroke: metric.defaultStroke || DEFAULT_STROKE,
    units: metric.units,
    description: metric.description,
    entityStatus: metric.entityStatus,
    defaultYMax: metric.defaultYMax,
    defaultYMin: metric.defaultYMin,

    encyclopediaId: metric.encyclopediaId,

    chartId,
    dataPointIndex,
    metricData
  };
};
export const getAvailableMetricForChart = (state, chartId) => {
  const metrics = Object.values(getMetrics(state) || {});
  const selectedMetricIds = getUsedMetricsByChartId(state, chartId)
    .map(metric => metric.id);

  const availableMetrics = metrics
    .filter(x => x.id !== TIMELINE_METRIC_ID)
    .filter(x => selectedMetricIds.indexOf(x.id) < 0);

    const BloodPressureDia = metrics.find(x => x.code === 'BP-dia');
    const BloodPressureSys = metrics.find(x => x.code === 'BP-sys');
    const BloodPressure = {
      ...BloodPressureSys,
      name: BloodPressureSys.name.substring(0, BloodPressureSys.name.indexOf('(')),
      code: 'BP-Pressure',
      data: [{ ...BloodPressureDia}, {...BloodPressureSys}]
    };
    const BloodPressureMetrics = availableMetrics.filter(x => x.code === 'BP-dia' || x.code === 'BP-sys');

    if (BloodPressureMetrics.length  > 0) {
      availableMetrics.push(BloodPressure);
    }
    const finalData = availableMetrics.filter(x => !(x.code === 'BP-dia' || x.code === 'BP-sys'));

  return finalData;
};

export const getChartDataForTimeLine = state => {
  const usedMetrics = {};
  const colorsByMetricId = {};

  Object.values(state.metricsChart.byId)
    .forEach(chart => {
      chart.data
        .filter(x => x.chartMetric.stroke)
        .forEach(x => {
          colorsByMetricId[x.chartMetric.metricId] = (x.chartMetric.stroke !== x.defaultMetric.defaultStroke) ? x.chartMetric.stroke : x.defaultMetric.defaultStroke;
        });
    });

  Object.values(state.metricsChart.byId)
    .forEach(chart => {
      chart.data
        .forEach(chartMetricData => {
          if (!usedMetrics[chartMetricData.chartMetric.metricId] && chartMetricData.chartMetric.metricId !== TIMELINE_METRIC_ID) {
            usedMetrics[chartMetricData.chartMetric.metricId] = {
              metricInfo: {
                ...state.metricsMetric.byId[chartMetricData.chartMetric.metricId],
                stroke: colorsByMetricId[chartMetricData.chartMetric.metricId],
                defaultStroke: colorsByMetricId[chartMetricData.chartMetric.metricId]
              },
              metricData: state.metricsMetricData.byId[chartMetricData.chartMetric.metricId]
            };
          }
        });
    });

  return Object.values(usedMetrics);
};
