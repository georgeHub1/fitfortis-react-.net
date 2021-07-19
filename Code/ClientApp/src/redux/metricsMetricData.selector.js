import { getChartByChartId } from './metricsChart.reducer';
import { createSelector } from 'reselect';
import { getMetricsDateRange } from './metricsDateRange.reducer';
import { getChartMetricSettingsById } from './metricsChartMetric.selector';
import {
  dayMSec,
  weekMSec,
  monthMSec,
  yearMSec,
  DAY_KEY,
  WEEK_KEY,
  MONTH_KEY,
  YEAR_KEY,
  MAX_KEY
} from '../constants/metrics.js';
import { getMetrics } from './metricsMetric.reducer';
import _ from 'lodash';

const makeChartPointField = (fieldName, dataPointIndex) => {
  return `${fieldName}${dataPointIndex || ''}`;
};

const makeGoalPointField = dataPointIndex => {
  return makeChartPointField('goal', dataPointIndex);
};

const makeMinPointField = dataPointIndex => {
  return makeChartPointField('rangeMin', dataPointIndex);
};

const makeMaxPointField = dataPointIndex => {
  return makeChartPointField('rangeMax', dataPointIndex);
};
const makeValuePointField = dataPointIndex => {
  return makeChartPointField('value', dataPointIndex);
};
const makeHiddenPointField = dataPointIndex => {
  return makeChartPointField('hidden', dataPointIndex);
};
const createAdditionalMetricPoint = (dateTime, position, goal, rangeMin, rangeMax, dataPointIndex, value) => {
  return {
    dateTime,
    [`${position}AdditionalGoal${dataPointIndex || ''}`]: goal,
    [`${position}AdditionalRangeMax${dataPointIndex || ''}`]: rangeMax,
    [`${position}AdditionalRangeMin${dataPointIndex || ''}`]: rangeMin,
    [`${position}AdditionalMetric${dataPointIndex || ''}`]: value
  };
};

const createLeftAdditionalMetricPoint = (dateTime, goal, rangeMin, rangeMax, dataPointIndex, value) => {
  return createAdditionalMetricPoint(dateTime, 'left', goal, rangeMin, rangeMax, dataPointIndex, value);
};
const createRightAdditionalMetricPoint = (dateTime, goal, rangeMin, rangeMax, dataPointIndex, value) => {
  return createAdditionalMetricPoint(dateTime, 'right', goal, rangeMin, rangeMax, dataPointIndex, value);
};
const createLeftAdditionalMetricPoints = (firstPointValue, firstPointDateTime, lastPointValue, lastPointDateTime, goal, rangeMin, rangeMax, dataPointIndex) => {
  return [
    createLeftAdditionalMetricPoint(firstPointDateTime, goal, rangeMin, rangeMax, dataPointIndex, firstPointValue),
    createLeftAdditionalMetricPoint(lastPointDateTime, goal, rangeMin, rangeMax, dataPointIndex, lastPointValue)
  ];
};
const createRightAdditionalMetricPoints = (firstPointValue, firstPointDateTime, lastPointValue, lastPointDateTime, goal, rangeMin, rangeMax, dataPointIndex) => {
  return [
    createRightAdditionalMetricPoint(firstPointDateTime, goal, rangeMin, rangeMax, dataPointIndex, firstPointValue),
    createRightAdditionalMetricPoint(lastPointDateTime, goal, rangeMin, rangeMax, dataPointIndex, lastPointValue)
  ];
};
const createMetricPoint = (dateTime, goal, rangeMin, rangeMax, dataPointIndex, value) => {
  return {
    dateTime,
    [makeGoalPointField(dataPointIndex)]: goal,
    [makeValuePointField(dataPointIndex)]: value,
    [makeMaxPointField(dataPointIndex)]: rangeMax,
    [makeMinPointField(dataPointIndex)]: rangeMin
  };
};

const createHiddenMetricPoint = (dateTime, goal, rangeMin, rangeMax, dataPointIndex, value) => {
  const point = createMetricPoint(dateTime, goal, rangeMin, rangeMax, dataPointIndex, value);

  return { ...point, [makeHiddenPointField(dataPointIndex)]: true };
};
const metricsChartCalculateMiddleValue = (leftPoint, righPoint, middleDateTime) => {
  const x1 = leftPoint.dateTime;
  const x2 = righPoint.dateTime;
  const y1 = leftPoint.value;
  const y2 = righPoint.value;
  const x = middleDateTime;
  const y = Math.abs((y1 - y2) * x + (x1 * y2 - x2 * y1)) / (Math.abs((x2 - x1)));

  return y;
};
const metricsChartMakeAdditionalSettings = (goal, rangeMin, rangeMax) => {
  return { goal, rangeMax, rangeMin };
};

const metricsChartGetAdditionlMetricSettings = (metricSettings, metricInfo) => {
  if (!metricSettings.showGoalLines) {
    return metricsChartMakeAdditionalSettings(null, null, null);
  }
  /* metricType
        1 - withGoal
        2 - withGoalMinMax
        3 - withMaxMinRange
*/
  if (metricInfo.type === 1) {
    return metricsChartMakeAdditionalSettings(metricSettings.goal, null, null);
  }
  if (metricInfo.type === 2) {
    return metricsChartMakeAdditionalSettings(null, metricSettings.defaultGoalMin, metricSettings.defaultGoalMax);
  }
  if (metricInfo.type === 3) {
    return metricsChartMakeAdditionalSettings(null, metricSettings.yMin, metricSettings.yMax);
  }
  return metricsChartMakeAdditionalSettings(null, null, null);
};

const getAdditionalMetricPoints = (chartMetric, metric, metricsDateRange, dataPointIndex) => {
  const { from, to } = metricsDateRange;
  const metricData = metric.metricData.map(x => ({ ...x, goal: null, rangeMin: null, rangeMax: null, dataPointIndex }))
    .filter(x => x.value !== null && x.value !== undefined)
    .sort((a, b) => a.dateTime - b.dateTime);
  const pointsInRange = metricData.filter(point => (from <= point.dateTime && to >= point.dateTime))
    .sort((a, b) => a.dateTime - b.dateTime);

  let points = [];
  const { rangeMin, goal, rangeMax } = metricsChartGetAdditionlMetricSettings(chartMetric, metric);

  //  check all cases
  const leftPointsOutOfRange = metricData.filter(x => from > x.dateTime);
  const rightPointsOutOfRange = metricData.filter(x => to < x.dateTime);
  const leftPointOutOfRange = leftPointsOutOfRange.length > 0 ? leftPointsOutOfRange[leftPointsOutOfRange.length - 1] : null;
  const rightPointOutOfRange = rightPointsOutOfRange.length > 0 ? rightPointsOutOfRange[0] : null;
  const firstPointInRange = pointsInRange.length > 0 ? pointsInRange[0] : null;
  const lastPointInRange = pointsInRange.length > 0 ? pointsInRange[pointsInRange.length - 1] : null;
  const NORMAL = 'NORMAL';
  const HIDDEN = 'HIDDEN';
  const ADDITIONAL = 'ADDITIONAL';

  let leftPointType = ADDITIONAL;

  let rightPointType = ADDITIONAL;

  if (pointsInRange.length) {
    if (firstPointInRange.dateTime === from) {
      leftPointType = NORMAL;
    } else {
      leftPointType = leftPointOutOfRange ? HIDDEN : ADDITIONAL;
    }
    if (lastPointInRange.dateTime === to) {
      rightPointType = NORMAL;
    } else {
      rightPointType = rightPointOutOfRange ? HIDDEN : ADDITIONAL;
    }
  } else if (leftPointOutOfRange && rightPointOutOfRange) {
    leftPointType = HIDDEN;
    rightPointType = HIDDEN;
  }
  else if (leftPointOutOfRange) {
    leftPointType = ADDITIONAL;
    rightPointType = ADDITIONAL;
  }
  else if (rightPointOutOfRange) {
    rightPointType = ADDITIONAL;
    leftPointType = ADDITIONAL;
  }

  if (leftPointType === ADDITIONAL && rightPointType === ADDITIONAL) {
    if (metricData.length === 0) {
      points = points.concat(createLeftAdditionalMetricPoints(null, from, null, to, goal, rangeMin, rangeMax, dataPointIndex));
    }
    else if (pointsInRange.length !== 0) {
      points = points.concat(createLeftAdditionalMetricPoints(firstPointInRange.value, from, firstPointInRange.value, firstPointInRange.dateTime, goal, rangeMin, rangeMax, dataPointIndex));
      points = points.concat(createRightAdditionalMetricPoints(lastPointInRange.value, lastPointInRange.dateTime, lastPointInRange.value, to, goal, rangeMin, rangeMax, dataPointIndex));
      points.push(createMetricPoint(firstPointInRange.dateTime, goal, rangeMin, rangeMax, dataPointIndex, firstPointInRange.value));
      points.push(createMetricPoint(lastPointInRange.dateTime, goal, rangeMin, rangeMax, dataPointIndex, lastPointInRange.value));
    }
    else {
      const point = leftPointOutOfRange || rightPointOutOfRange;

      points = points.concat(createLeftAdditionalMetricPoints(point.value, from, point.value, to, goal, rangeMin, rangeMax, dataPointIndex));
    }
  }
  else if (leftPointType === HIDDEN && rightPointType === HIDDEN) {
    if (pointsInRange.length) {
      const leftPoint = metricsChartCalculateMiddleValue(leftPointOutOfRange, firstPointInRange, from);
      const rightPoint = metricsChartCalculateMiddleValue(lastPointInRange, rightPointOutOfRange, to);

      points.push(createHiddenMetricPoint(to, goal, rangeMin, rangeMax, dataPointIndex, rightPoint));
      points.push(createHiddenMetricPoint(from, goal, rangeMin, rangeMax, dataPointIndex, leftPoint));
    } else {
      const leftPoint = metricsChartCalculateMiddleValue(leftPointOutOfRange, rightPointOutOfRange, from);
      const rightPoint = metricsChartCalculateMiddleValue(leftPointOutOfRange, rightPointOutOfRange, to);

      points.push(createHiddenMetricPoint(from, goal, rangeMin, rangeMax, dataPointIndex, leftPoint));
      points.push(createHiddenMetricPoint(to, goal, rangeMin, rangeMax, dataPointIndex, rightPoint));
    }
  }
  else {
    if (leftPointType === ADDITIONAL) {
      points = points.concat(createLeftAdditionalMetricPoints(firstPointInRange.value, from, firstPointInRange.value, firstPointInRange.dateTime, goal, rangeMin, rangeMax, dataPointIndex));
      points.push(createMetricPoint(firstPointInRange.dateTime, goal, rangeMin, rangeMax, dataPointIndex, null));
    }
    if (rightPointType === ADDITIONAL) {
      points = points.concat(createRightAdditionalMetricPoints(lastPointInRange.value, lastPointInRange.dateTime, lastPointInRange.value, to, goal, rangeMin, rangeMax, dataPointIndex));
      points.push(createMetricPoint(lastPointInRange.dateTime, goal, rangeMin, rangeMax, dataPointIndex, null));
    }
    if (leftPointType === HIDDEN) {
      const leftPoint = metricsChartCalculateMiddleValue(leftPointOutOfRange, firstPointInRange, from);

      points.push(createHiddenMetricPoint(from, goal, rangeMin, rangeMax, dataPointIndex, leftPoint));
    }
    if (leftPointType === NORMAL) {
      points.push(createMetricPoint(from, goal, rangeMin, rangeMax, dataPointIndex, firstPointInRange.value));
    }
    if (rightPointType === HIDDEN) {
      const rightPoint = metricsChartCalculateMiddleValue(lastPointInRange, rightPointOutOfRange, to);

      points.push(createHiddenMetricPoint(to, goal, rangeMin, rangeMax, dataPointIndex, rightPoint));
    }
    if (rightPointType === NORMAL) {
      points.push(createMetricPoint(to, goal, rangeMin, rangeMax, dataPointIndex, lastPointInRange.value));
    }
  }
  return points;
};

const getExtrimsOfGoal = chart => {
  if (!chart.showGoalLines) {
    return {
      yMinGoal: null,
      yMaxGoal: null
    };
  }
  const goals = [chart.goal, chart.yMin, chart.yMax].filter(x => x !== null && x !== undefined);

  if (!goals.length)
    return {
      yMinGoal: null,
      yMaxGoal: null
    };

  return {
    yMinGoal: Math.min(...goals),
    yMaxGoal: Math.max(...goals)
  };
};

export const getActualDateRange = ({ from, to, key }, minDate) => {
  const currentTime = new Date().getTime();

  if (key === DAY_KEY)
    return { from: currentTime - dayMSec, to: currentTime, key };
  if (key === WEEK_KEY)
    return { from: currentTime - weekMSec, to: currentTime, key };
  if (key === MONTH_KEY)
    return { from: currentTime - monthMSec, to: currentTime, key };
  if (key === YEAR_KEY)
    return { from: currentTime - yearMSec, to: currentTime, key };
  if (key === `${MAX_KEY}_1` || key === `${MAX_KEY}_2`)
    return { from, to: currentTime, key };

  return { from, to, key };
};

const getChartNames = chart => {
  if (chart.name)
    return chart.name;
  const metricsCount = chart.data.length;

  return chart.data.map(x => x.defaultMetric.name)
    .sort()
    .reduce((acc, curr, index) => acc + curr + ((index + 1) === metricsCount ? '' : '/'), '');
};

const getChartFullDataSelector = chart => {
  return {
    chart: {
      ...chart,
      name: getChartNames(chart)
    },
    data: chart.data.sort((a, b) => a.defaultMetric.name.toUpperCase() > b.defaultMetric.name.toUpperCase() ? 1 : -1)
      .map((chartData, i) => {
        const chartMetric = chartData.chartMetric;
        const metric = chartData.defaultMetric;

        return {
          ...getChartMetricSettingsById(chartMetric, metric, chartData.metricData, i, chart.id),
          metricData: chartData.metricData
        };
      })
  };
};

export const createGetMetricDataByBarChartIdSelector = () => {
  return createSelector(
    [getChartByChartId, getMetricsDateRange],
    (chartOrigin, persistedmetricsDateRange) => {
      const chart = getChartFullDataSelector(chartOrigin);
        const pointMap = {};
        const metricsDateRange = getActualDateRange(persistedmetricsDateRange);

        chart.data.forEach(data => {
          const dataPointIndex = data.dataPointIndex;
          const dataInRange = data.metricData.filter(x => x.dateTime >= metricsDateRange.from && x.dateTime <= metricsDateRange.to);

          dataInRange.forEach(metricPoint => {
            if (!pointMap[metricPoint.dateTime])
              pointMap[metricPoint.dateTime] = { dateTime: metricPoint.dateTime };
            const field = `value${dataPointIndex === 0 ? '' : dataPointIndex}`;

            if (metricPoint.value === null || metricPoint.value === undefined)
              return;
            pointMap[metricPoint.dateTime][field] = metricPoint.value;
            const fieldDateTime = `dateTime${dataPointIndex === 0 ? '' : dataPointIndex}`;

            if (metricPoint.comment) {
              const commentData = `comment${dataPointIndex === 0 ? '' : dataPointIndex}`;

              pointMap[metricPoint.dateTime][commentData] = metricPoint.comment;
            }
            pointMap[metricPoint.dateTime][fieldDateTime] = metricPoint.dateTime;
          });
        });
        const chartPoints = Object.keys(pointMap).map(x => pointMap[x]).sort((a, b) => a.dateTime - b.dateTime);

        return _.orderBy(chartPoints, ['dateTime'], ['asc']);
    });
};
export const createGetMetricDataByChartIdSelector = () => {
  let cache = {
    prevLastUpdated: null,
    prevMetricsDateRange: null,

    chart: null,
    chartPoints: null,
    isChartMetricDataLoaded: null,
    maxDate: null,
    extremePointMap: null,
    metricsDateRange: null
  };

  return createSelector(
    [getChartByChartId, getMetricsDateRange, getMetrics],
    (chartOrigin, persistedmetricsDateRange, metricMap) => {
      if (cache.prevLastUpdated !== chartOrigin.lastUpdated
        || cache.prevmetricsDateRange !== persistedmetricsDateRange
      ) {
        const chart = getChartFullDataSelector(chartOrigin);
        const pointMap = {};
        const extremePointMap = {};
        const metricsDateRange = getActualDateRange(persistedmetricsDateRange);

        let isChartMetricDataLoaded = true;

        const BloodPressureDia = chart.data.find(x => x.metricId === '00000000-0000-0000-0000-000000000004');
        const BloodPressureSys = chart.data.find(x => x.metricId === '00000000-0000-0000-0000-000000000005');

        let data = [];

        if (BloodPressureDia && BloodPressureSys) {
          data = [{...BloodPressureDia, stroke: '#008000'}, {...BloodPressureSys, stroke: '#ff0000'}];
        }
        const removeData = chart.data.filter(x => !(x.metricId === '00000000-0000-0000-0000-000000000004' || x.metricId === '00000000-0000-0000-0000-000000000005'));

        chart.data = [...data, ...removeData];
        chart.data.forEach(data => {
          const yMins = [];
          const yMaxs = [];
          const dataPointIndex = data.dataPointIndex;
          const additionalPoints = getAdditionalMetricPoints(data, data, metricsDateRange, dataPointIndex);
          const dataInRange = data.metricData.filter(x => x.dateTime >= metricsDateRange.from && x.dateTime <= metricsDateRange.to);

          additionalPoints.forEach(additionalPoint => {
            if (!pointMap[additionalPoint.dateTime])
              pointMap[additionalPoint.dateTime] = { dateTime: additionalPoint.dateTime };

            Object.entries(additionalPoint).forEach(([field, value]) => {
              if (additionalPoint[field] === null || additionalPoint[field] === undefined)
                return;
              pointMap[additionalPoint.dateTime][field] = value;

              if (field.includes('value')) {
                yMins.push(value);
                yMaxs.push(value);
              }
              if (field.includes('Additional')) {
                yMins.push(value);
                yMaxs.push(value);
              }
            });
          });

          const yMin = dataInRange.filter(x => x.value !== null && x.value !== undefined)
            .reduce((acc, curr) => acc.value > curr.value ? curr : acc, dataInRange[0]);
          const yMax = dataInRange.filter(x => x.value !== null && x.value !== undefined)
            .reduce((acc, curr) => acc.value < curr.value ? curr : acc, dataInRange[0]);

          const originYMax = (yMax || {}).value;
          const originYMin = (yMin || {}).value;

          const { yMinGoal, yMaxGoal } = getExtrimsOfGoal(data);

          if (yMin !== null && yMin !== undefined) {
            yMins.push(yMin.value);
          }
          if (yMinGoal !== null && yMinGoal !== undefined) {
            yMins.push(yMinGoal);
          }
          if (yMax !== null && yMax !== undefined) {
            yMaxs.push(yMax.value);
          }
          if (yMaxGoal !== null && yMaxGoal !== undefined) {
            yMaxs.push(yMaxGoal);
          }

          let yMinPoint = Math.min(...yMins);

          let yMaxPoint = Math.max(...yMaxs);

          const diff = yMaxPoint - yMinPoint;
          const domainHeight = (diff * 25) / 224;

          yMinPoint = yMinPoint === yMaxPoint ? 'auto' : (yMinPoint - domainHeight);
          yMaxPoint = yMinPoint === yMaxPoint ? 'auto' : (yMaxPoint + domainHeight);
          extremePointMap[data.code] = {
            yMin: yMinPoint,
            yMax: yMaxPoint,
            originYMax,
            originYMin
          };

          dataInRange.forEach(metricPoint => {
            if (!pointMap[metricPoint.dateTime])
              pointMap[metricPoint.dateTime] = { dateTime: metricPoint.dateTime };
            const field = `value${dataPointIndex === 0 ? '' : dataPointIndex}`;

            if (metricPoint.value === null || metricPoint.value === undefined)
              return;
            pointMap[metricPoint.dateTime][field] = metricPoint.value;
            const fieldDateTime = `dateTime${dataPointIndex === 0 ? '' : dataPointIndex}`;

            if (metricPoint.comment) {
              const commentData = `comment${dataPointIndex === 0 ? '' : dataPointIndex}`;

              pointMap[metricPoint.dateTime][commentData] = metricPoint.comment;
            }
            pointMap[metricPoint.dateTime][fieldDateTime] = metricPoint.dateTime;
          });

          if (metricMap[data.metricId].entityStatus !== 'loaded')
            isChartMetricDataLoaded = false;
        });

        const chartPoints = Object.keys(pointMap).map(x => pointMap[x]).sort((a, b) => a.dateTime - b.dateTime);

        cache = {
          prevLastUpdated: chartOrigin.lastUpdated,
          prevMetricsDateRange: persistedmetricsDateRange,
          chart,
          chartPoints,
          isChartMetricDataLoaded,
          extremePointMap,
          metricsDateRange
        };
      }
      else if (chartOrigin !== cache.chart) {
        cache = {
          ...cache,
          chart: {
            ...cache.chart,
            chart: {
              ...cache.chart.chart,
              name: getChartNames(chartOrigin)
            }
          }
        };
      }

      return cache;
    });
};
