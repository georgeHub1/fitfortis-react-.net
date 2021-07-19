import { TIMELINE_METRIC_ID, DEFAULT_GUID } from '../constants/metrics';

export const deleteMetricPointsBulk = (payload, metricDataEntities) => {
  const metricData = payload;
  const result = {};

  if (!metricData.length)
    return result;

  const newTime = new Date(metricData[0].dateTime);

  newTime.setSeconds(0, 0);
  metricData.forEach(x => {
    result[x.metricId] = metricDataEntities[x.metricId].filter(data => data.id !== x.id);
  });

  return result;
};
export const deleteMetricPointsTimeLineBulk = (payload, metricDataEntities) => {
  const metricData = payload;

  let timeLineMetric = metricDataEntities[TIMELINE_METRIC_ID];

  if (!metricData.length)
    return timeLineMetric;

  const newTime = new Date(metricData[0].dateTime);

  newTime.setSeconds(0, 0);

  const timeLineMetricData = timeLineMetric.find(x => {
    const time = new Date(x.dateTime);

    time.setSeconds(0, 0);

    return time.getTime() === newTime.getTime();
  });

  if (!timeLineMetricData.doctorVisits && !timeLineMetricData.labResults && (timeLineMetricData.measurements === metricData.length)) {
    timeLineMetric = timeLineMetric.filter(x => x.dateTime !== timeLineMetricData.dateTime);
  }
  else {
    const newData = {
      ...timeLineMetricData,
      measurements: timeLineMetricData.measurements - metricData.length
    };

    timeLineMetric = timeLineMetric.filter(x => x.dateTime !== timeLineMetricData.dateTime).concat([newData]);
  }

  return { [TIMELINE_METRIC_ID]: timeLineMetric };
};
export const upsertMetricPoints = ({ old, new: newData }, metricDataEntities) => {
  const needToDelete = old.filter(x => x.id);
  const result = {};

  needToDelete.forEach(x => {
    result[x.metricId] = metricDataEntities[x.metricId].filter(y => y.id !== x.id);
  });
  newData.forEach(x => {
    const newItem = (newData || []).find(y => y.metricId === x.metricId);
    const items = newItem ? [newItem] : [];

    result[x.metricId] = (result[x.metricId] || metricDataEntities[x.metricId] || []).concat(items);
  });
  return result;
};
export const upsertTimeLineMetricPoints = ({ old, new: newData }, metricDataEntities) => {
  let timeLineMetric = metricDataEntities[TIMELINE_METRIC_ID];

  if (old.filter(x => x.id).length > 0) {
    const firstValid = old.find(x => x.id && x.metricId);
    const dateTime = metricDataEntities[firstValid.metricId].find(x => x.id === firstValid.id).dateTime;
    const data = timeLineMetric.find(x => x.dateTime === dateTime);
    const timelineData = {
      ...data,
      measurements: data.measurements - (old.filter(x => x.id).length)
    };

    timeLineMetric = timeLineMetric.filter(x => x.dateTime !== dateTime).concat([timelineData]);
  }

  if (newData.length > 0) {
    const dateTime1 = newData[0].dateTime;
    const data1 = timeLineMetric.find(x => x.dateTime === dateTime1);
    const timelineData = data1 ? {
      ...data1,
      measurements: newData.length
    }
      : {
        dateTime: dateTime1,
        id: DEFAULT_GUID,
        measurements: newData.length
      };

    timeLineMetric = timeLineMetric.filter(x => x.dateTime !== dateTime1).concat([timelineData]);
  }

  return { [TIMELINE_METRIC_ID]: timeLineMetric };
};
export const setMetricPoints = (payload, metricEntities) => {
  const data = payload;
  const metricData = metricEntities[data.metricId];

  let timeLineMetricData = metricEntities[TIMELINE_METRIC_ID];

  let result = {};

  if (data.metricId !== TIMELINE_METRIC_ID) {
    const metricDataExist = metricData.find(x => x.id === data.id);

    if (!metricDataExist) {
      const timelineData = timeLineMetricData.find(x => x.dateTime === data.dateTime) || {
        dateTime: data.dateTime,
        measurements: 0
      };

      timeLineMetricData = timeLineMetricData.filter(x => x.dateTime !== timelineData.dateTime).concat([{ ...timelineData, measurements: timelineData.measurements + 1 }]);
    }

    result = {
      ...metricEntities,
      [data.metricId]: metricData.filter(x => x.id !== data.id).concat([data]),
      [TIMELINE_METRIC_ID]: timeLineMetricData
    };
  }
  else {
    const currentMetricData = metricData.find(x => x.dateTime === data.dateTime) || {
      dateTime: data.dateTime,
      measurements: 0
    };

    timeLineMetricData = timeLineMetricData.filter(x => x.dateTime !== currentMetricData.dateTime).concat([{ ...data, measurements: currentMetricData.measurements }]);

    result = {
      ...metricEntities,
      [TIMELINE_METRIC_ID]: timeLineMetricData
    };
  }

  return result;
};
