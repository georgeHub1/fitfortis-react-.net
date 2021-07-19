import api from './';
import { API_URL } from './../constants/api';
const defaultUserId = '00000000-0000-0000-0000-000000000001';

const getMetricDataInDataRange = (uId, metricId, dateFrom = null, dateTo = null) => {
  let url = `${API_URL}/metricdata/user/${uId}/metric/${metricId}`;

  if (dateFrom && dateTo)
    url += `?dateFrom=${dateFrom}&dateTo=${dateTo}`;

  return api
    .get(url)
    .then(data =>
      data.items.map(el => {
        el.dateTime = new Date(el.date).setMilliseconds(0);
        delete el.date;
        return el;
      })
    );
};

const getMetricData = (uId = defaultUserId, metricId) => getMetricDataInDataRange(uId, metricId);

const loadMetrics = languageCode => api.get(`${API_URL}/metric/search/lang/${languageCode}`).then(data => data.items).catch(err => err);

const loadMetricsDetails = languageCode => api.get(`${API_URL}/metric/details/lang/${languageCode}`).then(data => data.items).catch(err => err);

const loadCharts = userId => api.get(`${API_URL}/chart/user/${userId || defaultUserId}`).then(data => data.items).catch(err => err);

const loadChartsBulk = (userId, language) => api.get(`${API_URL}/chart/user/${userId || defaultUserId}/bulk/lang/${language}`).then(data => data.items).catch(err => err);

const createNewChartWithMetric = body => api.post(`${API_URL}/chart/metric`, {}, { data: body }).then(data => data.item);

const addMetricToChart = (chartId, metricId) => api.post(`${API_URL}/chartmetric/chart/${chartId}/metric/${metricId}`, {}, {}).then(data => data.item);

const addMetricToChartBulk = (chartId, data) => api.post(`${API_URL}/chartmetric/chart/${chartId}/metric`, {}, {data}).then(data => data.item);

const updateChartMetric = (chartMetricId, properties) => api.put(`${API_URL}/chartmetric/${chartMetricId}`, {}, { data: properties }).then(data => data.item);

const updateChartMetricData = (metricId, properties) => api.put(`${API_URL}/metricdata/${metricId}`, {}, { data: properties }).then(data => data.item);

const deleteMetricFromChart = chartMetricId => api.delete(`${API_URL}/chartmetric/${chartMetricId}`, {}, {}).then(data => data.item);

const removeChart = chartId => api.delete(`${API_URL}/chart/${chartId}`, {}, {}).then(data => data.item);

const updateChart = (chartId, body) => api.put(`${API_URL}/chart/${chartId}`, {}, { data: body }).then(data => data.item).catch(err => err);

const createcombineMetrics = data => api.post(`${API_URL}/chart/metric/bulk`, {}, {data}).then(data => data.item).catch(err => err);

const covidCitySearchList = () => fetch('https://api.covidtracking.com/v1/states/info.json').then(res => res.json()).then(data => data).catch(e => e);

const getCovidMetricsData = state => fetch(`https://api.covidtracking.com/v1/states/${state}/daily.json`).then(response => response.json().then(data => data).catch(err => err));

const getAllContryData = () => fetch('https://api.covid19api.com/countries').then(response => response.json()).then(res => res).catch(err => err);

const getCountryData = (coutryName, from, to) => fetch(`https://api.covid19api.com/total/country/${coutryName}?from=${from}&to=${to}`).then(response => response.json()).then(res => res).catch(err => err);

const summaryData = () => fetch('https://api.covid19api.com/summary').then(response => response.json()).then(res => res).catch(err => err);

const getGlobadata = () => fetch('https://covidapi.info/api/v1/global/count').then(response => response.json()).then(res => res).catch(err => err);

const getUSData = coutryName => fetch(`https://api.covid19api.com/total/dayone/country/${coutryName}`).then(response => response.json()).then(res => res).catch(err => err);

const createNewEntryV2 = body => api.post(`${API_URL}/metricdata`, {}, { data: body }).then(data => {
  data.item.dateTime = new Date(data.item.date);
  data.item.dateTime.setMilliseconds(0);
  data.item.dateTime = data.item.dateTime.getTime();
  delete data.item.date;
  return data.item;
});
const updateEntry = (id, body) => api.put(`${API_URL}/metricdata/${id}`, {}, { data: body }).then(data => {
  data.item.dateTime = new Date(data.item.date);
  data.item.dateTime.setMilliseconds(0);
  data.item.dateTime = data.item.dateTime.getTime();
  delete data.item.date;
  return data.item;
});
const deleteMetricDataBulk = body => api.delete(`${API_URL}/metricdata/bulk`, {}, { data: body }).then(data => {
  return data.items.map(x => {
    const dateTime = new Date(x.date);

    dateTime.setMilliseconds(0);
    return {
      ...x,
      dateTime: dateTime.getTime(),
      date: undefined
    };
  });
});
const upsertMetricData = (userId, body) => api.put(`${API_URL}/metricdata/user/${userId}`, {}, { data: body }).then(data => {
  return data.items.map(x => {
    const dateTime = new Date(x.date);

    dateTime.setMilliseconds(0);
    return {
      ...x,
      dateTime: dateTime.getTime(),
      date: undefined
    };
  });
});

export default {
  getMetricData,
  getCovidMetricsData,
  createNewChartWithMetric,
  removeChart,
  updateChart,
  loadCharts,
  loadMetrics,
  loadChartsBulk,
  addMetricToChart,
  addMetricToChartBulk,
  getMetricDataInDataRange,
  updateChartMetric,
  updateChartMetricData,
  createcombineMetrics,
  deleteMetricFromChart,
  updateEntry,
  createNewEntryV2,
  loadMetricsDetails,
  deleteMetricDataBulk,
  covidCitySearchList,
  summaryData,
  getGlobadata,
  getUSData,
  getAllContryData,
  getCountryData,
  upsertMetricData
};
