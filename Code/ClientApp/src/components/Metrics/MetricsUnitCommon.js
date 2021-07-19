import { Button } from 'antd';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Menu } from 'antd';
import ChartArea from '../Common/ChartArea';
import CustomCard from '../Common/CustomCard.js';
import MetricsChartTable from './MetricsChartTable';
import MetricsNewEntry from './MetricsNewEntry';
import MetricsNewMetric from '../../containers/Metrics/MetricsNewMetric';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import ReactLoading from 'react-loading';

import {
  dayMSec,
  weekMSec,
  monthMSec,
  yearMSec,
  DAY_KEY,
  WEEK_KEY,
  MONTH_KEY,
  YEAR_KEY,
  MAX_KEY,
  CUSTOM_KEY,
  DEFAULT_STROKE
} from '../../constants/metrics.js';
import { formatDate } from '../../utils/common.js';

import styles from './styles.module.less';
import { bindActionCreators } from 'redux';
import { updateCartNameAsync } from '../../redux/metricsChart.action';
import Switch, { chartViewType } from '../../components/Common/Switch';
import { createNewEntryAsync, deleteMetricDataBulkAsync, upsertMetricDataAsync, updateEntryAsync } from '../../redux/metricsMetric.action';
import { setMetricsDateRange } from '../../redux/metricsDateRange.action';
import { createGetMetricDataByChartIdSelector } from '../../redux/metricsMetricData.selector';
import { MetricsChartDataProps } from '../../containers/Metrics/metrics.chart.propTypes';
import MetricsChartEditName from '../../containers/Metrics/MetricsChartEditName';
import { getMinDatOfMetricDataSelector } from '../../redux/metricsMetricData.reducer';
class MetricsUnitCommon extends PureComponent {
  displayName = MetricsUnitCommon.name;
  static propTypes = {
    chartDATA: PropTypes.arrayOf(MetricsChartDataProps).isRequired,
    metricsDateRange: PropTypes.object.isRequired,
    renderChart: PropTypes.array.isRequired,
    chartName: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    tooltipDetailsTimeline: PropTypes.object.isRequired,
    mouseEventForTooltip: PropTypes.func.isRequired,
    chartId: PropTypes.string.isRequired,
    isEmptyChart: PropTypes.bool.isRequired,
    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired }),
    maxDate: PropTypes.number.isRequired,
    upsertEntity: PropTypes.func.isRequired,
    deleteMetricDataBulk: PropTypes.func.isRequired,
    extremePointMap: PropTypes.object.isRequired,
    isMobileView: PropTypes.bool.isRequired
  };
  constructor (props) {
    super(props);
    this.state = {
      newEntryOpen: false,
      newMetricOpen: false,
      showInput: false,
      value: '',
      isSavingName: false,
      viewType: chartViewType.chartView,
      isBusy: false
    };
    const { intl: { formatMessage } } = props;

    this.names = {
      date: formatMessage({ id: 'Documents.date' })
    };
  }

  onViewChange = value => this.setState({ viewType: value });

  dateRange = key => {
    const currentTime = new Date().getTime();
    const { maxDate } = this.props;

    if (key === DAY_KEY)
      return { from: currentTime - dayMSec, to: currentTime, key };
    if (key === WEEK_KEY)
      return { from: currentTime - weekMSec, to: currentTime, key };
    if (key === MONTH_KEY)
      return { from: currentTime - monthMSec, to: currentTime, key };
    if (key === YEAR_KEY)
      return { from: currentTime - yearMSec, to: currentTime, key };
    if (key === `${MAX_KEY}_1` || key === `${MAX_KEY}_2`)
      return { from: maxDate, to: currentTime, key };
  };

  _cachedLabelIndexes = {
    from: 0,
    to: 0,
    renderChart: [],
    result: []
  }
  get labelsIndexes () {
    const {
      metricsDateRange: { from, to },
      renderChart
    } = this.props;

    if (this._cachedLabelIndexes.from !== from
      || this._cachedLabelIndexes.to !== to
      || this._cachedLabelIndexes.renderChart !== renderChart
    ) {
      const realData = renderChart;
      const lastMetricsData = [];
      const maxMetrics = [];
      const minMetrics = [];
      const { chartDATA } = this.props;

      for (let j = 0; j < chartDATA.length; j++) {
        const lastPointOfMetric = realData.reduce(
          (acc, el, i) => {
            const key = `value${j === 0 ? '' : j}`;
            const hiddenValue = this.getCurrValue(el, 'hidden', j);

            return el.dateTime >= from
              && el.dateTime <= to
              && el[key]
              && el.dateTime > acc.dateTime
              && !hiddenValue
              ? {
                isValAnnot: true,
                value: el[key],
                index: `val${i}${j}`,
                dateTime: el.dateTime,
                topPosition: true,
                last: true,
                min: false,
                max: false,
                code: chartDATA[j].code
              }
              : acc;
          },
          { value: 0, index: null, dateTime: from }
        );
        const maxMetric = realData.reduce(
          (acc, el, i) => {
            const key = `value${j === 0 ? '' : j}`;
            const hiddenValue = this.getCurrValue(el, 'hidden', j);

            return el.dateTime >= from
              && el.dateTime <= to
              && el[key]
              && acc.value <= el[key]
              && !hiddenValue
              ? {
                isValAnnot: true,
                value: el[key],
                index: `val${i}${j}`,
                topPosition: true,
                last: lastPointOfMetric.dateTime === el.dateTime,
                min: false,
                max: true,
                code: chartDATA[j].code
              }
              : acc;
          },
          { value: 0, index: null }
        );

        const minMetrics1 = realData.map((curr, i) => {
          const key = `value${j === 0 ? '' : j}`;
          const hiddenValue = this.getCurrValue(curr, 'hidden', j);

          return {
            dateTime: curr.dateTime,
            isValAnnot: true,
            value: curr[key],
            index: `val${i}${j}`,
            minVal: true,
            last: lastPointOfMetric.dateTime === curr.dateTime,
            min: true,
            max: false,
            code: chartDATA[j].code,
            hiddenValue
          };
        });

        const minMetric = minMetrics1.filter(curr => curr.dateTime >= from && curr.dateTime <= to && !curr.hiddenValue && (curr.value !== null && curr.value !== undefined))
          .reduce(
            (acc, curr, i) => {
              return ((acc.value === null || acc.value === undefined) || (curr.value < acc.value))
                ? curr
                : acc;
            },
            { value: null, index: null }
          );

        lastMetricsData.push(lastPointOfMetric);
        maxMetrics.push(maxMetric);
        minMetrics.push(minMetric);
      }
      this._cachedLabelIndexes = {
        from,
        to,
        renderChart,
        result: [...lastMetricsData, ...maxMetrics, ...minMetrics]
      };
    }
    return this._cachedLabelIndexes.result;
  }
  getCurrValue = (el, name, i) => {
    const key = `${name}${i === 0 ? '' : i}`;

    return el[key];
  };
  getCurrKey = (el, name, i) => {
    return `${name}${i === 0 ? '' : i}`;
  };
  _cachedLineLabalsIndexes = {
    metricsDateRange: {
      from: 0,
      to: 0
    },
    renderChart: [],
    chartDATA: [],
    labels: {
      goalsIndexes: [],
      rangeMaxIndexes: [],
      rangeMinIndexes: []
    }
  }
  get lineLabelsIndexes () {
    const {
      metricsDateRange: { from, to },
      chartDATA,
      renderChart
    } = this.props;

    if (from !== this._cachedLineLabalsIndexes.metricsDateRange.from
      || to !== this._cachedLineLabalsIndexes.metricsDateRange.to
      || renderChart !== this._cachedLineLabalsIndexes.renderChart
      || chartDATA !== this._cachedLineLabalsIndexes.chartDATA
    ) {
      const realData = renderChart;
      const goalsIndexes = [];
      const rangeMaxIndexes = [];
      const rangeMinIndexes = [];

      chartDATA.map((info, i) => {
        return realData
          .map((el, index) => {
            const dateTime = this.getCurrValue(el, 'dateTime', 0);
            const value = this.getCurrValue(el, 'value', i);
            const goal = this.getCurrValue(el, 'goal', i);
            const rangeMax = this.getCurrValue(el, 'rangeMax', i);
            const rangeMin = this.getCurrValue(el, 'rangeMin', i);

            const valueKey = this.getCurrKey(el, 'value', i);
            const goalKey = this.getCurrKey(el, 'goal', i);
            const rangeMaxKey = this.getCurrKey(el, 'rangeMax', i);
            const rangeMinKey = this.getCurrKey(el, 'rangeMin', i);

            if (dateTime >= from && dateTime <= to) {
              if (goal !== null && goal !== undefined) {
                if (!goalsIndexes.length) {
                  goalsIndexes.push({
                    index: `${goalKey}${index}${i}`,
                    [valueKey]: goal,
                    topPosition: value < goal
                  });
                } else if (
                  goalsIndexes[goalsIndexes.length - 1][valueKey] === goal
                ) {
                  goalsIndexes[goalsIndexes.length - 1]
                    = goalsIndexes[goalsIndexes.length - 1];
                } else {
                  goalsIndexes.push({
                    index: `${goalKey}${index}${i}`,
                    [valueKey]: goal,
                    topPosition: value < goal
                  });
                }
              }
              if (rangeMax !== null && rangeMax !== undefined) {
                if (!rangeMaxIndexes.length) {
                  rangeMaxIndexes.push({
                    index: `${rangeMaxKey}${index}${i}`,
                    [valueKey]: rangeMax,
                    topPosition: value < rangeMax
                  });
                } else if (
                  rangeMaxIndexes[rangeMaxIndexes.length - 1][valueKey] === rangeMax
                ) {
                  rangeMaxIndexes[rangeMaxIndexes.length - 1]
                    = rangeMaxIndexes[rangeMaxIndexes.length - 1];
                } else {
                  rangeMaxIndexes.push({
                    index: `${rangeMaxKey}${index}${i}`,
                    [valueKey]: rangeMax,
                    topPosition: value < rangeMax
                  });
                }
              }

              if (rangeMin !== null && rangeMin !== undefined) {
                if (!rangeMinIndexes.length) {
                  rangeMinIndexes.push({
                    index: `${rangeMinKey}${index}${i}`,
                    [valueKey]: rangeMin,
                    topPosition: value < rangeMin
                  });
                } else if (
                  rangeMinIndexes[rangeMinIndexes.length - 1][valueKey] === rangeMin
                ) {
                  rangeMinIndexes[rangeMinIndexes.length - 1]
                    = rangeMinIndexes[rangeMinIndexes.length - 1];
                } else {
                  rangeMinIndexes.push({
                    index: `${rangeMinKey}${index}${i}`,
                    [valueKey]: rangeMin,
                    topPosition: value < rangeMin
                  });
                }
              }
            }
            return el;
          });
      });

      this._cachedLineLabalsIndexes = {
        metricsDateRange: {
          from,
          to
        },
        renderChart,
        chartDATA,
        labels: {
          goalsIndexes,
          rangeMaxIndexes,
          rangeMinIndexes
        }
      };
    }

    return this._cachedLineLabalsIndexes.labels;
  }
  _cachedAdditionalLabalsIndexes = {
    metricsDateRange: {
      from: 0,
      to: 0
    },
    renderChart: [],
    chartDATA: [],
    lablesMap: {}
  }
  get lineAdditionalLabelsIndexes () {
    const {
      metricsDateRange: { from, to },
      renderChart,
      chartDATA
    } = this.props;

    if (from !== this._cachedAdditionalLabalsIndexes.metricsDateRange.from
      || to !== this._cachedAdditionalLabalsIndexes.metricsDateRange.to
      || renderChart !== this._cachedAdditionalLabalsIndexes.renderChart
      || chartDATA !== this._cachedAdditionalLabalsIndexes.chartDATA
    ) {
      const realData = renderChart;
      const additionalGoalKey = 'AdditionalGoal';
      const additionalRangeMaxKey = 'AdditionalRangeMax';
      const additionalRangeMinKey = 'AdditionalRangeMin';
      const dateRange = realData.filter(x => ((x.dateTime === from) || (x.dateTime === to)));

      if (dateRange.length !== 2)
        return {};

      const firstPoint = dateRange[0];
      const lastPoint = dateRange[1];
      const lablesMap = {};
      const setValueIfExist = (firstPoint, lastPoint, position, key, index, map, stroke) => {
        const leftAdditionalPoint = this.getCurrValue(firstPoint, `${position}${key}`, index);
        const rightAdditionalPoint = this.getCurrValue(lastPoint, `${position}${key}`, index);

        if (leftAdditionalPoint != null && leftAdditionalPoint !== undefined && leftAdditionalPoint === rightAdditionalPoint) {
          map[this.getCurrKey(firstPoint, `${position}${key}`, index)] = {
            value: leftAdditionalPoint
          };
          map[this.getCurrKey(firstPoint, `${position}${key}`, index)].stroke = stroke;
        }
      };

      chartDATA.forEach((metric, index) => {
        if (this.getCurrValue(dateRange[0], `goal`, index))
          return;

        setValueIfExist(firstPoint, lastPoint, 'left', additionalGoalKey, index, lablesMap, metric.stroke || DEFAULT_STROKE);
        setValueIfExist(firstPoint, lastPoint, 'right', additionalGoalKey, index, lablesMap, metric.stroke || DEFAULT_STROKE);
        setValueIfExist(firstPoint, lastPoint, 'left', additionalRangeMaxKey, index, lablesMap, metric.stroke || DEFAULT_STROKE);
        setValueIfExist(firstPoint, lastPoint, 'right', additionalRangeMaxKey, index, lablesMap, metric.stroke || DEFAULT_STROKE);
        setValueIfExist(firstPoint, lastPoint, 'left', additionalRangeMinKey, index, lablesMap, metric.stroke || DEFAULT_STROKE);
        setValueIfExist(firstPoint, lastPoint, 'right', additionalRangeMinKey, index, lablesMap, metric.stroke || DEFAULT_STROKE);
      });

      this._cachedAdditionalLabalsIndexes = {
        metricsDateRange: { from, to },
        renderChart,
        chartDATA,
        lablesMap
      };
    }

    return this._cachedAdditionalLabalsIndexes.lablesMap;
  }
  handleSubmit = e => {
    e.preventDefault();
    if (this.state.isSavingName)
      return;

    const value = this.state.value;

    if (value !== this.props.chartName) {
      const { updateName, chartId } = this.props;

      this.setState(
        state => ({ isSavingName: true }),
        () => updateName(value, chartId).then(() => { this.setState({ showInput: !this.state.showInput, isSavingName: false }); })
      );
    }
    else {
      this.setState({ showInput: !this.state.showInput });
    }
  };
  handleEditUndo = () => this.setState({ showInput: !this.state.showInput });
  handleChange = e => this.setState({ value: e.target.value });
  sortByName = arr => arr.sort((a, b) => a.name.localeCompare(b.name));
  setOpenNewMetric = () => {
    this.setState(state => ({ ...state, newMetricOpen: !state.newMetricOpen }));
  }
  setOpenNewEntry = () => {
    this.setState(state => ({ ...state, newEntryOpen: !state.newEntryOpen }));
  };

  emptyChart = chartId => <div key={chartId} className={styles.chartContainer}>
    <CustomCard
      title={
        <div className={styles.headerNoSelected}><FormattedMessage id="MetricsUnitCommon.noSelected" /></div>
      }
    >
      <div className={styles.addOne}><FormattedMessage id="MetricsUnitCommon.pleaseAddOne" />!</div>
      <Button
        onClick={this.setOpenNewMetric}
        style={{ width: 190, marginRight: 8 }}
        type="primary"
        aria-label="add new metric"
        className={styles.btn}
      >
        <FormattedMessage id="MetricsUnitCommon.addNewMetricBtn" />
      </Button>
    </CustomCard>
  </div>

  getTabletMetricData = () => {
    const { metricsDateRange, chartDATA } = this.props;

    const filteredData = chartDATA.map(x => ({
      ...x,
      metricData: x.metricData.filter(x => x.dateTime >= metricsDateRange.from && x.dateTime <= metricsDateRange.to)
    }));

    return filteredData;
  }
  onUpsertEntity = (value, completed) => {
    const { upsertEntity } = this.props;

    this.setState(
      { isBusy: true },
      () => { upsertEntity(value).then(() => this.setState({ isBusy: false }, () => completed())); }
    );
  }
  changeChartName () {
    const { intl: { formatMessage }, chartDetail } = this.props;

    chartDetail.data.forEach(el => {
      if (el.defaultMetric.id === '00000000-0000-0000-0000-000000000004') {
        el.defaultMetric.name =  formatMessage({id: 'MetricsUnitCommon.diastolic'});
      } else  if (el.defaultMetric.id === '00000000-0000-0000-0000-000000000005') {
        el.defaultMetric.name =  formatMessage({id: 'MetricsUnitCommon.systolic'});
      }
      return el;
    });

    const chartname = chartDetail.data.map(x => x.defaultMetric.name)
    .sort()
    .reduce((acc, curr, index) => acc + curr + ((index + 1) === chartDetail.data.length ? '' : '/'), '');

    return chartname;
  }

  renderChartHeaderDesktop = () => {
    const {
      chartId,
      updateName
    } = this.props;

    return <div>
      <MetricsChartEditName
        chartName={this.changeChartName()}
        updateName={updateName}
        chartId={chartId}
      />
      {this.renderDateRanges()}
    </div>;
  }
  renderDateRanges = () => {
    const {
      setMetricsDateRange,
      metricsDateRange
    } = this.props;
    const dateFrom = formatDate(new Date(metricsDateRange.from));
    const dateTo = formatDate(new Date(metricsDateRange.to));

    return <Menu
      className={styles.menu}
      onSelect={({ key }) => setMetricsDateRange(this.dateRange(key))}
      mode="horizontal"
      style={{ backgroundColor: 'transparent' }}
      selectedKeys={[metricsDateRange.key]}
    >
      <Menu.Item className={styles.menuItem} key={DAY_KEY}>
        <FormattedMessage id="MetricsMetric.dayBtn" />
      </Menu.Item>
      <Menu.Item className={styles.menuItem} key={WEEK_KEY}>
        <FormattedMessage id="MetricsMetric.weekBtn" />
      </Menu.Item>
      <Menu.Item className={styles.menuItem} key={MONTH_KEY}>
        <FormattedMessage id="MetricsMetric.monthBtn" />
      </Menu.Item>
      <Menu.Item className={styles.menuItem} key={YEAR_KEY}>
        <FormattedMessage id="MetricsMetric.yearBtn" />
      </Menu.Item>
      <Menu.Item key={`${MAX_KEY}_1`} className={`${styles.menuItem} desktopViewMenuDash`}>
        <FormattedMessage id="MetricsMetric.maxBtn" />
      </Menu.Item>
      <Menu.Item key={`${MAX_KEY}_2`} className={`${styles.menuItem} mobileViewMenuDash`}>
        <FormattedMessage id="MetricsMetric.maxBtnMobile" />
      </Menu.Item>
      {metricsDateRange.key === CUSTOM_KEY ? (
        <Menu.Item className={styles.menuItem} key={CUSTOM_KEY}>
          {`${dateFrom} - ${dateTo}`}
        </Menu.Item>
      ) : null}
    </Menu>;
  }
  renderChartHeaderMobile = () => {
    const { viewType } = this.state;

    return <div>
      <div className={styles.headerChange}>
        {<React.Fragment>
          <p className={`cardHeaderTitle ${styles.cardHeader}`}>{this.changeChartName()}</p>
        </React.Fragment>}
      </div>
      <div style={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <div style={{ maxWidth: 160 }}>
          {this.renderDateRanges()}
        </div>
        <div style={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <Switch
            value={viewType}
            onChange={this.onViewChange}
          />
          <Button
            type="primary"
            aria-label="add new rest entry"
            className={styles.btn}
            onClick={() => this.setOpenNewEntry()}
          >
            <FormattedMessage id="MetricsMetric.addResEntryBtn" />
          </Button>
        </div>
      </div>
    </div>;
  }
  renderChartHeader = () => {
    const { isMobileView } = this.props;

    return isMobileView ? this.renderChartHeaderMobile() : this.renderChartHeaderDesktop();
  }

  renderExtra = () => {
    const { isMobileView } = this.props;
    const { viewType } = this.state;

    if (isMobileView) {
      return null;
    }

    return (<div className={styles.rightBtnContainer}>
      <Switch
        value={viewType}
        onChange={this.onViewChange}
      />
      <Button
        type="primary"
        aria-label="add entry button"
        className={styles.btn}
        onClick={() => this.setOpenNewEntry()}
      >
        <FormattedMessage id="MetricsMetric.addEntryBtn" />
      </Button>
    </div>);
  }

  chartMetricData () {
    const { intl: { formatMessage }, chartDATA } = this.props;

    chartDATA.forEach(el => {
      if (el.metricId === '00000000-0000-0000-0000-000000000004') {
        el.name =  formatMessage({id: 'MetricsUnitCommon.diastolic'});
      } else  if (el.metricId === '00000000-0000-0000-0000-000000000005') {
        el.name =  formatMessage({id: 'MetricsUnitCommon.systolic'});
      }
      return el;
    });
    return chartDATA;
  }
  render () {
    const {
      setMetricsDateRange,
      metricsDateRange,
      loading,
      chartId,
      chartDATA,
      tooltipDetailsTimeline,
      mouseEventForTooltip,
      renderChart,
      createNewEntry,
      updateEntry,
      isEmptyChart,
      deleteMetricDataBulk,
      extremePointMap,
      isMobileView
    } = this.props;
    const {
      newEntryOpen,
      newMetricOpen,
      viewType
    } = this.state;

    return (<>
      {isEmptyChart ? (this.emptyChart(chartId))
        : (<div className={styles.chartContainer} id={chartId}>
          <CustomCard
            title={this.renderChartHeader()}
            extra={this.renderExtra()}
          >
            {(loading || this.state.isBusy) && (
              <div className={styles.spinnerContainer}>
                <ReactLoading type="spin" color="#fff" />
              </div>
            )}
            {(viewType === chartViewType.chartView) && <ChartArea
              tooltipDetailsTimeline={tooltipDetailsTimeline}
              mouseEventForTooltip={mouseEventForTooltip}
              openNewMetric={this.setOpenNewMetric}
              indexChart={chartId}
              data={renderChart}
              metricsInfo={this.chartMetricData()}
              metricKey={chartId}
              lineLabelsIndexes={this.lineLabelsIndexes}
              lineAdditionalLabelsIndexes={this.lineAdditionalLabelsIndexes}
              labelsIndexes={this.labelsIndexes}
              metricsDateRange={metricsDateRange}
              setMetricsDateRange={setMetricsDateRange}
              backgroundColor="transparent"
              backgroundImage="#ffffff"
              style={{ marginRight: -8 }}
              extremePointMap={extremePointMap}
              isMobileView={isMobileView}

            />
            }
            {(viewType === chartViewType.tableView) && <MetricsChartTable
              chartDATA={this.getTabletMetricData()}
              upsertEntity={this.onUpsertEntity}
              columnsName={this.names}
              deleteMetricDataBulk={deleteMetricDataBulk}
            />
            }
          </CustomCard>
          {newEntryOpen
            && <MetricsNewEntry
              open={newEntryOpen}
              metricsDateRange={metricsDateRange}
              chartDATA={this.sortByName(chartDATA)}
              metricKey={chartId}
              close={this.setOpenNewEntry}
              createNewEntry={createNewEntry}
              updateEntry={updateEntry}
            />
          }
        </div>
        )
      }
      {
        newMetricOpen && (
          <MetricsNewMetric
            open={newMetricOpen}
            close={this.setOpenNewMetric}
            chartId={chartId}
            selectedMetrics={chartDATA}
          />
        )
      }
    </>
    );
  }
}

const mapStateToProps = () => {
  const getMetricDataByChartId = createGetMetricDataByChartIdSelector();

  return (state, props) => {
    const { isChartMetricDataLoaded, chartPoints, chart: { chart, data: chartData }, extremePointMap, metricsDateRange } = getMetricDataByChartId(state, props.chartId);
    const maxDate = getMinDatOfMetricDataSelector(state);

    return {
      chartName: chart.name,
      chartDetail: chart,
      loading: !isChartMetricDataLoaded,
      mouseEventForTooltip: props.mouseEventMetricForTooltip,
      tooltipDetailsTimeline: props.tooltipDetailsTimeline,
      chartDATA: chartData,
      renderChart: chartPoints,
      chartId: chart.id,
      metricsDateRange,
      isEmptyChart: chartData.length === 0,
      maxDate,
      extremePointMap
    };
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  updateName: bindActionCreators(updateCartNameAsync, dispatch),
  createNewEntry: bindActionCreators(createNewEntryAsync, dispatch),
  updateEntry: bindActionCreators(updateEntryAsync, dispatch),
  upsertEntity: bindActionCreators(upsertMetricDataAsync, dispatch),
  setMetricsDateRange: bindActionCreators(setMetricsDateRange, dispatch),
  openNewMetric: props.openNewMetric,
  deleteMetricDataBulk: bindActionCreators(deleteMetricDataBulkAsync, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(MetricsUnitCommon));
