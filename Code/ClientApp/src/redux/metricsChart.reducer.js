import {
  LOAD_CHARTS_BULK_FAILURE,
  LOAD_CHARTS_BULK_SUCCESS,
  LOAD_CHARTS_BULK_REQUEST,
  CREATE_CHART,
  REMOVE_CHART_SUCCESS,
  UPDATE_CHART,
  LOAD_COVID_SEARCH_DATA_SUCCESS,
  LOAD_COVID_SEARCH_DATA_REQUEST,
  LOAD_COVID_SEARCH_DATA_FAILURE,
  GET_COVID_CHART_DATA_REQUEST,
  GET_COVID_CHART_DATA_SUCCESS,
  GET_COVID_CHART_DATA_FAILURE,
  GET_SUMMARY_DATA_REQUEST,
  GET_SUMMARY_DATA_SUCCESS,
  GET_SUMMARY_DATA_FAILURE,
  LOAD_SUCCESS_BULK_METRICS,
  GET_GLOBAL_DATA_REQUEST,
  GET_GLOBAL_DATA_SUCCESS,
  GET_GLOBAL_DATA_FAILURE
} from './metricsChart.action.js';
import { ADD_CHART_METRIC, DELETE_METRIC_FROM_CHART, UPDATE_CHART_METRIC } from './metricsChartMetric.action.js';
import { METRIC_DATA_SUCCESS, UPDATE_METRIC_DATA, LOAD_METRICS_SUCCESS } from './metricsMetric.action.js';

const getInitialState = () => ({
  byId: {},
  ids: [],
  loading: false,
  searchLoading: false,
  searchData: [],
  covidData: [],
  covidLoading: false,
  summaryDataLoading: false,
  summaryData: [],
  globalData: [],
  globalLoading: false,
  error: null,
  dataLoaded: false
});

export const defaultCharts = getInitialState();
export default {

  [LOAD_CHARTS_BULK_REQUEST]: (state = defaultCharts) => ({
    ...state,
    error: null,
    loading: true,
    dataLoaded: false
  }),
  [GET_COVID_CHART_DATA_REQUEST]: (state = defaultCharts) => ({
    ...state,
    covidData: [],
    covidLoading: true
  }),
  [GET_COVID_CHART_DATA_SUCCESS]: (state = defaultCharts, action) => ({
    ...state,
    covidLoading: false,
    covidData: action.payload
  }),
  [GET_COVID_CHART_DATA_FAILURE]: (state = defaultCharts, action) => ({
    ...state,
    covidLoading: false,
    covidData: action.error
  }),
  [GET_SUMMARY_DATA_REQUEST]:(state = defaultCharts) => ({
    ...state,
    summaryDataLoading: true
  }),
  [GET_SUMMARY_DATA_SUCCESS]: (state = defaultCharts, action) => ({
    ...state,
    summaryDataLoading: false,
    summaryData: action.payload
  }),
  [GET_SUMMARY_DATA_FAILURE]: (state = defaultCharts, action) => ({
    ...state,
    summaryDataLoading: false,
    err: action.error
  }),
  [GET_GLOBAL_DATA_REQUEST]: (state = defaultCharts, action) => ({
    ...state,
    globalLoading: true
  }),
  [GET_GLOBAL_DATA_SUCCESS]: (state = defaultCharts, action) => ({
    ...state,
    globalLoading: false,
    globalData: action.payload
  }),
  [GET_GLOBAL_DATA_FAILURE]: (state = defaultCharts, action) => ({
    ...state,
    globalLoading: false,
    err: action.error
  }),
  [LOAD_CHARTS_BULK_SUCCESS]: (state = defaultCharts, action) => {
    const data = {};
    const dataV2 = {};
    const { charts, chartList } = action.payload;
    const ids = [];
    const lastUpdated = new Date().getTime();

    (charts || []).forEach(chart => {
      data[chart.id] = chart;
      ids.push(chart.id);
    });

    (chartList || []).forEach(chart => {
      dataV2[chart.chart.id] = {
        id: chart.chart.id,
        name: chart.chart.name,
        lastUpdated,
        userId: chart.chart.userId,
        data: chart.chartMetricDetails.map(x => ({
          ...x,
          defaultMetric: {
            ...x.defaultMetric,
            name: x.name,
            description: x.description
          }
        }))
      };

      ids.push(chart.chart.id);
    });

    return {
      ...state,
      loading: false,
      byId: {
        ...state.byId,
        ...dataV2
      },
      ids: [...state.ids, ...ids].filter((value, index, self) => self.indexOf(value) === index),
      error: null,
      dataLoaded: true
    };
  },
  [LOAD_CHARTS_BULK_FAILURE]: (state = defaultCharts, action) => ({
    ...state,
    loading: false,
    error: action.error,
    dataLoaded: false
  }),

  [LOAD_COVID_SEARCH_DATA_REQUEST]: (state = defaultCharts, action) => ({
    ...state,
    searchLoading: true,
    searchData: []
  }),
  [LOAD_COVID_SEARCH_DATA_SUCCESS]: (state = defaultCharts, action) => ({
    ...state,
    searchLoading: false,
    searchData: action.payload
  }),
  [LOAD_COVID_SEARCH_DATA_FAILURE]: (state = defaultCharts, action) => ({
    ...state,
    error: action.err
  }),
  [LOAD_SUCCESS_BULK_METRICS]: (state = defaultCharts, action) => {
    // console.log('action.payload', action.payload);
    const { chart, metricData } = action.payload;

      const lastUpdated = new Date().getTime();
      const chartV2 = {
        id: chart.id,
        lastUpdated,
        dispalyName: chart.name,
        name: chart.name,
        userId: chart.userId,
        data: metricData
      };

      // console.log('chartV2', chartV2);
      return {
        ...state,
        byId: {
          ...state.byId,
          [chartV2.id]: chartV2
        },
        ids: state.ids.concat(chartV2.id)
      };
  },
  [CREATE_CHART]: (state = defaultCharts, action) => {
    const { chart, metric, metricData, chartMetric } = action.payload;
    const lastUpdated = new Date().getTime();
    const chartV2 = {
      id: chart.id,
      lastUpdated,
      dispalyName: chart.name,
      name: chart.name,
      userId: chart.userId,
      data: [
        {
          chartMetric,
          defaultMetric: metric,
          metricData
        }
      ]
    };

    return {
      ...state,
      byId: {
        ...state.byId,
        [chartV2.id]: chartV2
      },
      ids: state.ids.concat(chartV2.id)
    };
  },
  [ADD_CHART_METRIC]: (state = defaultCharts, action) => {
    const { metricData, chartId, metric, chartMetric } = action.payload;
    const lastUpdated = new Date().getTime();

    const oldChart = state.byId[chartId];
    const chartV2 = {
      ...oldChart,
      lastUpdated,
      data: oldChart.data.concat([{
        chartMetric,
        defaultMetric: metric,
        metricData
      }])
    };

    return {
      ...state,
      byId: {
        ...state.byId,
        [chartId]: chartV2
      }
    };
  },
  [DELETE_METRIC_FROM_CHART]: (state = defaultCharts, action) => {
    const { chartMetricId, chartId } = action.payload;
    const lastUpdated = new Date().getTime();
    const oldChart = state.byId[chartId];
    const modifiedChart = {
      ...oldChart,
      lastUpdated,
      data: oldChart.data.filter(x => x.chartMetric.id !== chartMetricId)
    };

    return {
      ...state,
      byId: {
        ...state.byId,
        [modifiedChart.id]: modifiedChart
      }
    };
  },
  [REMOVE_CHART_SUCCESS]: (state = defaultCharts, action) => {
    const dataV2 = { ...state.byId };
    const ids = state.ids.filter(x => x !== action.payload);

    delete dataV2[action.payload];
    return {
      ...state,
      byId: dataV2,
      ids
    };
  },

  [UPDATE_CHART]: (state = defaultCharts, action) => {
    const { id, name } = action.payload;

    return {
      ...state,
      byId: {
        ...state.byId, [id]: { ...state.byId[id], name }
      }
    };
  },
  [UPDATE_CHART_METRIC]: (state = defaultCharts, action) => {
    const { chartMetric, chartId } = action.payload;
    const lastUpdated = new Date().getTime();
    const chart = state.byId[chartId];

    let modifiedChartMetric = chart.data.find(x => x.chartMetric.id === chartMetric.id);

    modifiedChartMetric = {
      ...modifiedChartMetric,
      chartMetric
    };

    return {
      ...state,
      byId: {
        ...state.byId,
        [chartId]: {
          ...chart,
          lastUpdated,
          data: chart.data.filter(x => x.chartMetric.id !== chartMetric.id).concat(modifiedChartMetric)
        }
      }
    };
  },
  [METRIC_DATA_SUCCESS]: (state = defaultCharts, action) => {
    const { metricId, metricData } = action.payload;
    const lastUpdated = new Date().getTime();
    const charts = {};

    Object.values(state.byId)
      .forEach(x => {
        const modifiedMetric = x.data.find(metric => metric.defaultMetric.id === metricId);

        if (!modifiedMetric)
          return;

        charts[x.id] = {
          ...x,
          lastUpdated,
          data: x.data.filter(metric => metric.defaultMetric.id !== metricId).concat({
            ...modifiedMetric,
            metricData
          })
        };
      });

    return {
      ...state,
      byId: {
        ...state.byId,
        ...charts
      }
    };
  },
  [UPDATE_METRIC_DATA]: (state = defaultCharts, action) => {
    const metricDataEntities = action.payload;
    const lastUpdated = new Date().getTime();
    const charts = {};
    const modifiedCharts = {};
    const chartList = Object.values(state.byId);

    Object.keys(metricDataEntities).forEach(metricId => {
      chartList.forEach(
        chart => {
          if (chart.data.find(chartData => chartData.defaultMetric.id === metricId)) {
            modifiedCharts[chart.id] = chart;
          }
        });
    });

    Object.values(modifiedCharts)
      .forEach(chart => {
        const updatedChartData = chart.data.map(chartData => {
          return {
            ...chartData,
            metricData: metricDataEntities[chartData.defaultMetric.id] || chartData.metricData
          };
        });

        charts[chart.id] = {
          ...chart,
          data: updatedChartData,
          lastUpdated
        };
      });

    return {
      ...state,
      byId: {
        ...state.byId,
        ...charts
      }
    };
  },
  [LOAD_METRICS_SUCCESS]: (state = defaultCharts, action) => {
    const metrics = {};

    action.payload.forEach(item => {
      metrics[item.id] = item;
    });

    const lastUpdated = new Date().getTime();
    const charts = {};

    Object.values(state.byId)
      .forEach(x => {
        charts[x.id] = {
          ...x,
          lastUpdated,
          data: x.data.map(metric => ({
            ...metric,
            defaultMetric: metrics[metric.defaultMetric.id]
          }))
        };
      });

    return {
      ...state,
      byId: {
        ...state.byId,
        ...charts
      }
    };
  }
};
export const getChartIds = state => state.metricsChart.ids;
export const getChartByChartId = (state, chartId) => state.metricsChart.byId[chartId];

export const getSelectedMetricsId = state => {
  const chartId = state.metricsChart.ids;

  const selectMetricId = chartId.map(el => {
    return getChartByChartId(state, el);
  });


  const selectedID = selectMetricId.map(el => { return { metircId: el.data.length > 0 ? el.data[0].defaultMetric.id : '', chartId: el.id}; });

  return selectedID;
};
export const getChartMetricIdsByChartId = (state, chartId) => {
  return getChartByChartId(state, chartId).data.map(x => x.chartMetric.id);
};

export const getChartMetricsByChartId = (state, chartId) => {
  return getChartByChartId(state, chartId).data.map(x => x.chartMetric);
};
export const getUsedMetricsByChartId = (state, chartId) => {
  return getChartByChartId(state, chartId).data.map(x => x.defaultMetric);
};
export const getUsedMetrics = state => {
  const charts = Object.values(state.metricsChart.byId);

  return charts.map(x => x.data)
    .reduce((acc, curr) => acc.concat(curr), [])
    .map(x => x.defaultMetric)
    .reduce((acc, curr) => acc.concat(curr), []);
};
