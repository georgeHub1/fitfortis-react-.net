import { TIMELINE_METRIC_ID, TIMELINE_METRIC_NAME } from '../constants/metrics';
import { createSelector } from 'reselect';
import { getChartIds } from './metricsChart.reducer';

export const getChartIdsSelector = createSelector(
  [getChartIds],
  chartIds => chartIds.filter(id => id !== TIMELINE_METRIC_ID)
);

const convertTimeLineMetricData = metricData => {
  const allEvents = [];

  metricData.forEach(el => {
    const timeEvents = [];

    if (el.measurements)
      timeEvents.push({
        dateTime: el.dateTime,
        value: el.measurements,
        measurements: el.measurements,
        level: timeEvents.length + 0.5
      });

    if (el.doctorVisits)
      timeEvents.push({
        dateTime: el.dateTime,
        value: el.doctorVisits,
        comment: el.doctorVisitComments,
        doctorVisits: el.doctorVisits,
        level: timeEvents.length + 0.5
      });

    if (el.labResults)
      timeEvents.push({
        dateTime: el.dateTime,
        value: el.labResults,
        labResults: el.labResults,
        comment: el.labResultsComments,
        level: timeEvents.length + 0.5
      });

    allEvents.push(...timeEvents);
  });
  const labResults = allEvents.filter(el => el.labResults);
  const measurements = allEvents.filter(el => el.measurements);
  const doctorVisits = allEvents.filter(el => el.doctorVisits);

  return {
    labResults,
    doctorVisits,
    measurements,
    metricData
  };
};
const getTimeLineMetric = state => state.metricsMetric.byId[TIMELINE_METRIC_ID];
const getTimeLineMetricData = state => state.metricsMetricData.byId[TIMELINE_METRIC_ID];

const getChartTimeLineData = (metric = {}, points = []) => {
  const isTimeLineDataLoaded = metric.entityStatus === 'loaded';
  const metricData = (points || []).sort((a, b) =>
    a.dateTime < b.dateTime ? -1 : a.dateTime > b.dateTime ? 1 : 0 // eslint-disable-line
  );

  const result = {
    id: TIMELINE_METRIC_ID,
    name: TIMELINE_METRIC_NAME,
    isTimeLineDataLoaded,
    metricData: convertTimeLineMetricData(metricData),
    timelineData: metricData
  };

  return result;
};

export const getChartTimeLineDataSelector = createSelector(
  [getTimeLineMetric, getTimeLineMetricData],
  getChartTimeLineData
);

export const getMaxDateFortimeLineSelector = createSelector(
  [getTimeLineMetric, getTimeLineMetricData],
  (meric = {}) => {
    const maxDate = (meric.metricData || []).reduce((acc, el) => {
      if (!acc) return el.dateTime;
      return acc < el.dateTime ? acc : el.dateTime;
    }, 0);

    return maxDate;
  }
);

