import { getUserId, getUserLanguage } from './auth.selector';
import metricsService from '../backendServices/metrics';
import moment from 'moment';
import _ from 'lodash';
import { loadMetricDataAsync } from './metricsMetric.action';

export const LOAD_CHARTS_BULK_REQUEST = 'LOAD_CHARTS_BULK_REQUEST';
export const LOAD_CHARTS_BULK_SUCCESS = 'LOAD_CHARTS_BULK_SUCCESS';
export const LOAD_CHARTS_BULK_FAILURE = 'LOAD_CHARTS_BULK_FAILURE';
export const CREATE_CHART_REQUEST = 'CREATE_CHART_REQUEST';
export const CREATE_CHART_FAILURE = 'CREATE_CHART_FAILURE';
export const REMOVE_CHART_REQUEST = 'REMOVE_CHART_REQUEST';
export const REMOVE_CHART_SUCCESS = 'REMOVE_CHART_SUCCESS';
export const REMOVE_CHART_FAILURE = 'REMOVE_CHART_FAILURE';
export const CREATE_CHART = 'CREATE_CHART';
export const UPDATE_CHART = 'UPDATE_CHART';
export const LOAD_SUCCESS_BULK_METRICS = 'LOAD_SUCCESS_BULK_METRICS';
export const LOAD_COVID_SEARCH_DATA_REQUEST = 'LOAD_COVID_SEARCH_DATA_REQUEST';
export const LOAD_COVID_SEARCH_DATA_SUCCESS = 'LOAD_COVID_SEARCH_DATA_SUCCESS';
export const LOAD_COVID_SEARCH_DATA_FAILURE = 'LOAD_COVID_SEARCH_DATA_FAILURE';
export const GET_COVID_CHART_DATA_REQUEST = 'GET_COVID_CHART_DATA_REQUEST';
export const GET_COVID_CHART_DATA_SUCCESS = 'GET_COVID_CHART_DATA_SUCCESS';
export const GET_COVID_CHART_DATA_FAILURE = 'GET_COVID_CHART_DATA_FAILURE';
export const GET_SUMMARY_DATA_REQUEST = 'GET_SUMMARY_DATA_REQUEST';
export const GET_SUMMARY_DATA_SUCCESS = 'GET_SUMMARY_DATA_SUCCESS';
export const GET_SUMMARY_DATA_FAILURE = 'GET_SUMMARY_DATA_FAILURE';
export const GET_GLOBAL_DATA_REQUEST = 'GET_GLOBAL_DATA_REQUEST';
export const GET_GLOBAL_DATA_SUCCESS = 'GET_GLOBAL_DATA_SUCCESS';
export const GET_GLOBAL_DATA_FAILURE = 'GET_GLOBAL_DATA_FAILURE';

const loadChartsBulkRequest = () => ({
  type: LOAD_CHARTS_BULK_REQUEST
});

export const loadChartsBulkSuccess = payload => ({
  type: LOAD_CHARTS_BULK_SUCCESS,
  payload
});

export const loadSuccessBulkMetrics = payload => ({
  type: LOAD_SUCCESS_BULK_METRICS,
  payload
});

const loadChartsBulkFailed = err => ({
  type: LOAD_CHARTS_BULK_FAILURE,
  err
});

const createChartRequest = () => ({
  type: CREATE_CHART_REQUEST
});

const createChartFailed = payload => ({
  type: CREATE_CHART_FAILURE,
  payload
});

const removeChartRequest = () => ({
  type: REMOVE_CHART_REQUEST
});

const removeChartSuccess = payload => ({
  type: REMOVE_CHART_SUCCESS,
  payload
});

const removeChartFailed = err => ({
  type: REMOVE_CHART_FAILURE,
  err
});

const createChart = payload => ({
  type: CREATE_CHART,
  payload
});

const updateChart = payload => ({
  type: UPDATE_CHART,
  payload
});

const loadcovidData = () => ({
  type: LOAD_COVID_SEARCH_DATA_REQUEST
});

const loadCovidDataSuccess = payload => ({
  type: LOAD_COVID_SEARCH_DATA_SUCCESS,
  payload
});

const loadCovidDataErr = err => ({
  type: LOAD_COVID_SEARCH_DATA_FAILURE,
  err
});

const getCovidChartDataRequest = () => ({
  type: GET_COVID_CHART_DATA_REQUEST
});

const getCovidChartDataSuccess = payload => ({
  type: GET_COVID_CHART_DATA_SUCCESS,
  payload
});

const getCovidChartDatafailure = error => ({
  type: GET_COVID_CHART_DATA_FAILURE,
  error
});

const getSummaryRequest = () => ({
  type: GET_SUMMARY_DATA_REQUEST
});

const getSummarySuccess = payload => ({
  type: GET_SUMMARY_DATA_SUCCESS,
  payload
});

const getSummaryFailure = error => ({
  type: GET_SUMMARY_DATA_FAILURE,
  error
});

const getGlobalRequest = () => ({
  type: GET_GLOBAL_DATA_REQUEST
});

const getGlobalSuccess = payload => ({
  type: GET_GLOBAL_DATA_SUCCESS,
  payload
});

const getGlobalFailure = error => ({
  type: GET_GLOBAL_DATA_FAILURE,
  error
});

export const loadChartBulkAsync = () => {
  return (dispatch, getState) => {
    const state = getState();

    dispatch(loadChartsBulkRequest());

    const userId = getUserId(state);
    const language = getUserLanguage(state);

    return metricsService.loadChartsBulk(userId, language).then(
      chartsData => {
        const metrics = [];

        let metricData = [];
        const metricPointsEntities = {};

        (chartsData || []).forEach(item => {
          item.chartMetricDetails.forEach(chartdetail => {
            const metricPoints = chartdetail.metricData.map(el => {
              el.dateTime = new Date(el.date).setMilliseconds(0);
              delete el.date;
              return el;
            });

            metricPointsEntities[chartdetail.defaultMetric.id] = metricPoints;

            const metricTemplate = {
              id: chartdetail.defaultMetric.id,
              metricData: metricPoints,
              entityStatus: 'loaded'
            };

            metricData = metricData.concat(metricPoints);
            metrics.push(metricTemplate);
          });
        });
        dispatch(loadChartsBulkSuccess({ metricData, metrics, metricPointsEntities, chartList: chartsData }));
      }
    )
      .catch(err => dispatch(loadChartsBulkFailed(err)));
  };
};

export const removeChartAsync = chart => async (dispatch, getState) => {
  dispatch(removeChartRequest());

  try {
    chart = await metricsService.removeChart(chart.id);

    dispatch(removeChartSuccess(chart.id));
    return Promise.resolve();
  }
  catch (err) {
    dispatch(removeChartFailed(err));
    return Promise.reject(err);
  }
};

export const loadSearchCity = () => async (dispatch, getState) => {
  dispatch(loadcovidData());
  return await metricsService.covidCitySearchList().then(data => {
    dispatch(loadCovidDataSuccess(data));
  }).catch(err => dispatch(loadCovidDataErr(err)));
};

export const getCovidChartData = state => async (dispatch, getState) => {
  dispatch(getCovidChartDataRequest());

  return await metricsService.getCovidMetricsData(state).then(data => {
    if (data) {
      data.forEach(el => {
        const date = el.date.toString();

        el.isState = true;
        el.date = `${date.substring(0, 4)  }-${  date.substring(4, 6)  }-${  date.substring(6)}`;
        el.active = el.positive;
      });
      dispatch(getCovidChartDataSuccess(data));
    }
  }).catch(err => {
    dispatch(getCovidChartDatafailure(err));
  });
};
export const getSummaryData = () => async (dispatch, getState)  => {
  dispatch(getSummaryRequest());
  return await metricsService.summaryData().then(data => {
    if (data.Countries && data.Countries.length) {
      let countriesData = [];
      const globalData = data.Global;

      globalData.Country = 'Global';
      globalData.CountryCode = 'Global';
      countriesData = data.Countries;
      countriesData.push(globalData);
      dispatch(getSummarySuccess(data.Countries));
    }
  }).catch(err => {
    dispatch(getSummaryFailure(err));
  });
};

export const getAllGlobalData = () => async (dispatch, getState)  => {
  dispatch(getGlobalRequest());
  return await metricsService.getGlobadata().then(data => {
    if (data.result) {
      const allData = [];

      const results = data.result;

      for (const el in results) {
        const date = results[el];

        date.active = date.confirmed - date.deaths - date.recovered;
        date.death = date.deaths;
        date.date = el;
        delete date.confirmed;
        allData.push(date);
      }
      dispatch(getGlobalSuccess(allData));
    }
  }).catch(err => {
    dispatch(getGlobalFailure(err));
  });
};

export const getUSAllData = () => async (dispatch, getState) => {
  dispatch(getGlobalRequest());
  const country = 'us';

  return await metricsService.getUSData(country).then(data => {
    if (data) {
      data.forEach(el => {
        el.death = el.Deaths;
        el.date = el.Date;
        el.recovered = el.Recovered;
        el.active = el.Active;
        delete el.Active;
        delete el.Deaths;
        delete el.Date;
        delete el.Recovered;
      });
      dispatch(getGlobalSuccess(data));
    }
  }).catch(err => getGlobalFailure(err));
};
export const getAllCountryData = () => async (dispatch, getState) => {
  dispatch(loadcovidData());
  const countriesList = [];

  return await metricsService.getAllContryData().then(countryData => {
    return metricsService.covidCitySearchList().then(data => {
      if (countryData  && countryData.length) {
        if (data && data.length) {
          data.forEach(el => {
            el.isState = true;
            countriesList.push(el);
          });
        }
        countryData.forEach(el => {
          el.isState = false;
          el.name = el.Country;
          el.state = el.ISO2;
          delete el.Country;
          delete el.ISO2;
          countriesList.push(el);
        });
      }
      const uniqueList = _.uniqBy(countriesList, 'name');

      dispatch(loadCovidDataSuccess(uniqueList));
    });
  }).catch(err => dispatch(loadCovidDataErr(err)));
};
export const getCountryData = coutry => async (dispatch, getState) => {
  dispatch(getCovidChartDataRequest());
  const startDate = new Date();
  const endDate = new Date(startDate);

  endDate.setDate(endDate.getDate() - 14);
  return await metricsService.getCountryData(coutry, moment(endDate).format('YYYY-MM-DD'), moment(startDate).format('YYYY-MM-DD'))
  .then(data => {
    data.forEach(el => {
      el.state = el.CountryCode;
      el.death = el.Deaths;
      el.date = el.Date;
      el.recovered = el.Recovered;
      el.active = el.Active;
      el.isState = false;
      delete el.Deaths;
      delete el.Date;
      delete el.Recovered;
      delete el.CountryCode;
    });
    dispatch(getCovidChartDataSuccess(data));
  }).catch(err => {
    dispatch(getCovidChartDatafailure(err));
  });
};

export const updateCartNameAsync = (newName, chartId) => async (dispatch, getState) => {
  try {
    await metricsService.updateChart(chartId, { name: newName });

    dispatch(updateChart({ id: chartId, name: newName }));
  }
  catch (err) {
    dispatch(updateChart({ id: chartId, name: err }));
  }

  return Promise.resolve();
};

export const createChartAsync = ({ name: metricName, id: metricId, ...data }) => async (dispatch, getState) => {
  dispatch(createChartRequest());
  const state = getState();

  try {
    const userId = getUserId(state);

    if (data.code === 'BP-Pressure') {
      const MetricIds = [];

      for (const i in data.data) {
        MetricIds.push(data.data[i].id);
      }
      const metrics = {
        userId,
        name: metricName,
        MetricIds
      };

      await metricsService.createcombineMetrics(metrics);

      dispatch(loadChartBulkAsync());
    } else {
      const item = await metricsService.createNewChartWithMetric({ userId, name: metricName, metricId });
      const metric = state.metricsMetric.byId[metricId];
      const metricData = state.metricsMetricData.byId[metricId] || [];

      dispatch(createChart({
        chart: item.chart,
        chartMetric: item.chartMetricDetails[0].chartMetric,
        metric,
        metricData
      }));

      if (metric.entityStatus !== 'loaded') {
        dispatch(loadMetricDataAsync(metricId));
      }
    }
  }
  catch (err) {
    dispatch(createChartFailed({ id: metricId, err }));
    return Promise.resolve();
  }
  return Promise.resolve();
};
