import metricsService from '../backendServices/metrics';
import { getUserId, getUserLanguage } from './auth.selector';
import { TIMELINE_METRIC_ID, DEFAULT_STROKE } from '../constants/metrics';
import { setMetricPoints, deleteMetricPointsBulk, deleteMetricPointsTimeLineBulk, upsertMetricPoints, upsertTimeLineMetricPoints } from './metricsMetricData.reducer.utils';

export const LOAD_METRICS_REQUEST = 'LOAD_METRICS_REQUEST';
export const LOAD_METRICS_SUCCESS = 'LOAD_METRICS_SUCCESS';
export const LOAD_METRICS_FAILURE = 'LOAD_METRICS_FAILURE';
export const METRIC_DATA_FAILURE = 'METRIC_DATA_FAILURE';
export const METRIC_DATA_SUCCESS = 'METRIC_DATA_SUCCESS';
export const NEW_METRIC_ADD_SUCCESS = 'NEW_METRIC_ADD_SUCCESS';
export const DELETE_METRIC_DATA_BULK = 'DELETE_METRIC_DATA_BULK';
export const UPSERT_METRIC_DATA = 'UPSERT_METRIC_DATA';
export const UPDATE_METRIC_DATA = 'UPDATE_METRIC_DATA';
export const ADD_TO_BACK_DATA = 'ADD_TO_BACK_DATA';

export const updateMetricData = payload => ({
  type: UPDATE_METRIC_DATA,
  payload
});

export const metricDataSuccess = payload => ({
  type: METRIC_DATA_SUCCESS,
  payload
});

export const metricDataFailure = error => ({
  type: METRIC_DATA_FAILURE,
  error
});

export const deleteMetricDataBulk = payload => ({
  type: DELETE_METRIC_DATA_BULK,
  payload
});
export const upsertMetricData = payload => ({
  type: UPSERT_METRIC_DATA,
  payload
});

export const loadMetricsRequest = () => ({
  type: LOAD_METRICS_REQUEST
});

export const loadMetricsSuccess = payload => ({
  type: LOAD_METRICS_SUCCESS,
  payload
});

export const loadMetricsFailure = error => ({
  type: LOAD_METRICS_FAILURE,
  error
});

export const addMetricSuccess = payload => ({
  type: NEW_METRIC_ADD_SUCCESS,
  payload
});

export const addBackEntry = payload => ({
  type: ADD_TO_BACK_DATA,
  payload
});

export const loadMetricsAsync = () => (dispatch, getState) => {
  dispatch(loadMetricsRequest());
  const state =  getState();
  const language = getUserLanguage(state);

  return metricsService.loadMetricsDetails(language)
    .then(metricsDetails => {
      const metrics = (metricsDetails || []).map(x => ({
        ...x.metric,
        ...x.encyclopediaShortInfo,
        encyclopediaId: (x.encyclopediaShortInfo || {}).id,
        id: x.metric.id,
        description: (x.encyclopediaShortInfo || {}).shortDescription || '',
        units: x.metric.units || '',
        name: ((x.encyclopediaShortInfo || {}).title || ''),
        defaultStroke: x.metric.defaultStroke || DEFAULT_STROKE
      }));

      dispatch(loadMetricsSuccess(metrics));
    })
    .catch(err =>
      dispatch(loadMetricsFailure(err))
    );
};

export const loadTimeLineMetricDataAsync = () => async (dispatch, getState) => {
  const state = getState();
  const userId = getUserId(state);

  try {
    const metricData = await metricsService.getMetricData(userId, TIMELINE_METRIC_ID);

    dispatch(metricDataSuccess({ metricId: TIMELINE_METRIC_ID, metricData }));
    return Promise.resolve();
  }
  catch (err) {
    dispatch(metricDataFailure(err));
    return Promise.resolve();
  }
};


export const loadMetricDataAsync = metricId => async (dispatch, getState) => {
  const userId = getUserId(getState());

  let metricData = null;

  try {
    metricData = await metricsService.getMetricData(userId, metricId);
  }
  catch (err) {
    dispatch(metricDataFailure(err));
  }
  dispatch(metricDataSuccess({ metricId, metricData }));
};

export const createNewEntryAsync = entryData => (dispatch, getState) => {
  const userId = getUserId(getState());
  const body = { ...entryData, userId };
  const state = getState();

  return metricsService.createNewEntryV2(body).then(data => {
    const metricData = setMetricPoints(data, state.metricsMetricData.byId);

    dispatch(updateMetricData(metricData));
  });
};
export const createHomeNewEntryAsync = entryData => (dispatch, getState) => {
  const userId = getUserId(getState());
  const body = { ...entryData, userId };

  return metricsService.createNewEntryV2(body).then(data => {
    let metric = null;

    if (data.metricId === '00000000-0000-0000-0000-000000000015') {
      metric = 'bodyWeightChart';
    } else if (data.metricId === '00000000-0000-0000-0000-000000000024') {
      metric = 'streeLavel';
    } else {
      metric = 'Pulse';
    }
    dispatch(addMetricSuccess({data, metric}));
  });
};

export const updateEntryAsync = (id, entryData) => (dispatch, getState) => {
  const userId = getUserId(getState());
  const body = { ...entryData, userId };
  const state = getState();

  return metricsService.updateEntry(id, body).then(data => {
    const metricData = setMetricPoints(data, state.metricsMetricData.byId);

    dispatch(updateMetricData(metricData));
  });
};
export const deleteMetricDataBulkAsync = ids => (dispatch, getState) => {
  const state = getState();
  const userId = getUserId(state);
  const body = {
    metricDataIds: ids,
    userId
  };

  return metricsService.deleteMetricDataBulk(body).then(data => {
    dispatch(deleteMetricDataBulk(data));
    const timeLineMetricData = deleteMetricPointsTimeLineBulk(data, state.metricsMetricData.byId);
    const metricData = deleteMetricPointsBulk(data, state.metricsMetricData.byId);

    dispatch(updateMetricData({ ...timeLineMetricData, ...metricData }));
  });
};
export const upsertMetricDataAsync = value => (dispatch, getState) => {
  const state = getState();
  const userId = getUserId(state);
  const body = {
    metricData: value
  };

  return metricsService.upsertMetricData(userId, body)
    .then(data => {
      dispatch(upsertMetricData({ old: value, new: data }));

      const timeLineMetricData = upsertTimeLineMetricPoints({ old: value, new: data }, state.metricsMetricData.byId);
      const metricData = upsertMetricPoints({ old: value, new: data }, state.metricsMetricData.byId);

      dispatch(updateMetricData({ ...timeLineMetricData, ...metricData }));
    });
};
