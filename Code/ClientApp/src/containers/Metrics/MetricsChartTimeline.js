import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Menu } from 'antd';

import Switch, { chartViewType } from '../../components/Common/Switch';
import { ChartBubbles } from '../../components/Common/ChartBubbles';
import CustomCard from '../../components/Common/CustomCard.js';
import ReactLoading from 'react-loading';
import MetricsNewEntry from './MetricsNewEntryForTimeLine';

import { getMinDatOfMetricDataSelector } from '../../redux/metricsMetricData.reducer';
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
  CUSTOM_KEY
} from '../../constants/metrics.js';
import { formatDate } from '../../utils/common.js';

import styles from '../../components/Metrics/styles.module.less';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadTimeLineMetricDataAsync } from '../../redux/metricsMetric.action';
import { setMetricsDateRange } from '../../redux/metricsDateRange.action';
import { updateEntryAsync, createNewEntryAsync } from '../../redux/metricsMetric.action';
import { getChartTimeLineDataSelector } from '../../redux/metricsChart.selector';
import MetricsChartTimeLineTable from '../../components/Metrics/MetricsChartTimeLineTable';
import { getActualDateRange } from '../../redux/metricsMetricData.selector';

// CUSTOMIZATION: Determines the number of gray filler dots in the TIMELINE chart.
const DEFAULT_DOTS_NUMBER = 30;

class MetricsChartTimeline extends Component {
  static propTypes = {
    chart: PropTypes.shape({
      isTimeLineDataLoaded: PropTypes.bool.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired,
    metricsDateRange: PropTypes.object.isRequired,
    labResults: PropTypes.array.isRequired,
    doctorVisits: PropTypes.array.isRequired,
    measurements: PropTypes.array.isRequired,
    tooltipDetailsMetric: PropTypes.object.isRequired,
    mouseEventForTooltip: PropTypes.func.isRequired,
    loadTimeLineData: PropTypes.func.isRequired,
    setMetricsDateRange: PropTypes.func.isRequired,
    maxDate: PropTypes.number.isRequired,
    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired }),
    metricData: PropTypes.arrayOf(
      PropTypes.shape({
        dateTime: PropTypes.number.isRequired,
        id: PropTypes.string.isRequired,
        measurements: PropTypes.any,
        labResults: PropTypes.any,
        doctorVisits: PropTypes.any
      })
    ),
    isMobileView: PropTypes.bool.isRequired
  };
  displayName = MetricsChartTimeline.name;
  names = {
    labResults: 'Lab results',
    doctorVisits: 'Doctor visits',
    doctorVisitsComments: 'Doctor Visits Comments',
    LabResultsComments: 'Lab Results Comments',
    measurements: 'Measurements'
  }

  constructor (props) {
    super(props);
    const { intl: { formatMessage } } = props;

    this.names = {
      labResults: formatMessage({ id: 'MetricsTimeline.labResults' }),
      doctorVisits: formatMessage({ id: 'MetricsTimeline.doctorVisits' }),
      doctorVisitsComments: formatMessage({id: 'MetricsTimeline.doctorVisitsComments'}),
      LabResultsComments: formatMessage({id: 'MetricsTimeline.LabResultsComments'}),
      measurements: formatMessage({ id: 'MetricsTimeline.measurements' }),
      date: formatMessage({ id: 'Documents.date' })
    };
  }
  state = {
    loading: false,
    newEntryOpen: false,
    showInput: false,
    value: '',
    isSavingName: false,
    viewType: chartViewType.chartView,
    isMobile: window.innerWidth < 768
  };

  onViewChange = value => this.setState({ viewType: value });

  componentDidMount () {
    if (!this.props.chart.isTimeLineDataLoaded) {
      this.setState(
        state => ({ ...state, loading: true }),
        () => {
          this.props.loadTimeLineData().then(() => this.setIsBusy(false));
        }
      );
    }
  }
  handleClick = key => {
    this.setState({ [key]: !this.state[key] });
  };

  _cachedData = {
    labResults: [],
    doctorVisits: [],
    measurements: [],
    metricsDateRange: {
      to: 0, from: 0
    },
    scatter: []
  }

  isTimeLineDataChanged (cachedData, dataFromProps) {
    const { labResults, doctorVisits, measurements, metricsDateRange: { from, to } } = cachedData;

    return labResults !== dataFromProps.labResults
      || doctorVisits !== dataFromProps.doctorVisits
      || measurements !== dataFromProps.measurements
      || from !== dataFromProps.metricsDateRange.from
      || to !== dataFromProps.metricsDateRange.to;
  }
  get scatterProps () {
    if (this.isTimeLineDataChanged(this._cachedData, this.props)) {
      const { labResults, doctorVisits, measurements, metricsDateRange } = this.props;
      const { to, from } = metricsDateRange;
      const combinedData = [...labResults, ...doctorVisits, ...measurements];
      const dateFrom = new Date(from).setHours(0, 0, 0, 0);

      let dateTo = new Date(to).setHours(0, 0, 0, 0);
      const dateInterval = (dateTo - dateFrom) / DEFAULT_DOTS_NUMBER;

      let defaultVal = [];

      for (; dateTo > dateFrom && combinedData.length; dateTo -= dateInterval) {
        defaultVal = [
          ...defaultVal,
          {
            level: 0.5,
            dateTime: dateTo
          },
          {
            level: 1.5,
            dateTime: dateTo
          },
          {
            level: 2.5,
            dateTime: dateTo
          }
        ];
      }

      defaultVal = [
        ...defaultVal,
        {
          level: 0.5,
          dateTime: dateFrom
        },
        {
          level: 1.5,
          dateTime: dateFrom
        },
        {
          level: 2.5,
          dateTime: dateFrom
        }
      ];

      const result = [
        {
          zAxisId: 2,
          data: defaultVal,
          additionProps: { legendType: 'none' },
          fill: '#dedede'
        },
        {
          data: metricsDateRange
            ? labResults.filter(
              el =>
                el.dateTime >= metricsDateRange.from
                && el.dateTime <= metricsDateRange.to
            )
            : labResults,
          zAxisId: 1,
          additionProps: {},
          name: this.names.labResults,
          fill: '#7EA5DA'
        },
        {
          data: metricsDateRange
            ? doctorVisits.filter(
              el =>
                el.dateTime >= metricsDateRange.from
                && el.dateTime <= metricsDateRange.to
            )
            : doctorVisits,
          additionProps: {},
          name: this.names.doctorVisits,
          zAxisId: 1,
          fill: '#5880B6'
        },
        {
          data: metricsDateRange
            ? measurements.filter(
              el =>
                el.dateTime >= metricsDateRange.from
                && el.dateTime <= metricsDateRange.to
            )
            : measurements,
          zAxisId: 1,
          additionProps: {},
          name: this.names.measurements,
          fill: '#335889'
        }
      ];

      this._cachedData = {
        labResults,
        doctorVisits,
        measurements,
        metricsDateRange: {
          to, from
        },
        scatter: result
      };
    }

    return this._cachedData.scatter;
  }

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
  setIsBusy = value => this.setState({ loading: value });
  handleEditUndo = () => this.setState({ showInput: !this.state.showInput });
  handleChange = e => this.setState({ value: e.target.value });

  render () {
    const {
      setMetricsDateRange,
      metricsDateRange,
      metricData,
      updateEntry,
      createNewEntry,
      isMobileView
    } = this.props;

    const { newEntryOpen, loading, viewType, isMobile } = this.state;
    const dateFrom = formatDate(new Date(metricsDateRange.from));
    const dateTo = formatDate(new Date(metricsDateRange.to));
    const filteredData = metricData
      .filter(x => x.dateTime >= metricsDateRange.from && x.dateTime <= metricsDateRange.to)
      .filter(x => x.labResults || x.doctorVisits || x.measurements || x.doctorVisitComments || x.labResultsComments)
      .map(x => ({ ...x, measurements: x.measurements || 0, doctorVisits: x.doctorVisits || 0, doctorVisitComments: x.doctorVisitComments, labResults: x.labResults || 0, labResultsComments: x.labResultsComments }));

    const availableDateTimes = filteredData.map(x => x.dateTime).sort((a, b) => a - b);

    return (
      <div className={styles.chartContainer}>
        <div className="metricsTimeLineChartSection">
          <CustomCard
            title={
              <div className="metricsTimeLineChartSectionLeft">
                <div className={styles.headerChange}>
                  <React.Fragment>
                    <p className={`cardHeaderTitle ${styles.cardHeader}`}><FormattedMessage id="MetricsTimeline.chartName" /></p>
                  </React.Fragment>
                </div>
                <Menu
                  className={styles.menu}
                  onSelect={({ key }) => setMetricsDateRange(this.dateRange(key))}
                  mode="horizontal"
                  style={{ backgroundColor: 'transparent' }}
                  selectedKeys={[metricsDateRange.key]}
                >
                  <Menu.Item key={DAY_KEY} className={styles.menuItem}>
                    <FormattedMessage id="MetricsTimeline.dayBtn" />
                  </Menu.Item>
                  <Menu.Item key={WEEK_KEY} className={styles.menuItem}>
                    <FormattedMessage id="MetricsTimeline.weekBtn" />
                  </Menu.Item>
                  <Menu.Item key={MONTH_KEY} className={styles.menuItem}>
                    <FormattedMessage id="MetricsTimeline.monthBtn" />
                  </Menu.Item>
                  <Menu.Item key={YEAR_KEY} className={styles.menuItem}>
                    <FormattedMessage id="MetricsTimeline.yearBtn" />
                  </Menu.Item>
                  <Menu.Item key={`${MAX_KEY}_1`} className={`${styles.menuItem} desktopViewMenuDash`}>
                    <FormattedMessage id="MetricsTimeline.maxBtn" />
                  </Menu.Item>
                  <Menu.Item key={`${MAX_KEY}_2`} className={`${styles.menuItem} mobileViewMenuDash`}>
                    <FormattedMessage id="MetricsTimeline.maxBtnMobile" />
                  </Menu.Item>
                  {metricsDateRange.key === CUSTOM_KEY ? (
                    <Menu.Item key={CUSTOM_KEY} className={styles.menuItem}>
                      {`${dateFrom} - ${dateTo}`}
                    </Menu.Item>
                  ) : null}
                </Menu>
              </div>
            }
            extra={
              <div className={`metricsTimeLineChartSectionRight ${styles.rightBtnContainer}`}>
                <Switch
                  value={viewType}
                  onChange={this.onViewChange}
                />
                {
                  !isMobile
                    ? (
                      <Button
                        type="primary"
                        className={styles.btn}
                        onClick={() => this.handleClick('newEntryOpen')}
                      >
                        <FormattedMessage id="MetricsTimeline.addEntryBtn" />
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        className={styles.btn}
                        onClick={() => this.handleClick('newEntryOpen')}
                      >
                        <FormattedMessage id="MetricsTimeline.addResEntryBtn" />
                      </Button>
                    )
                }
              </div>
            }
            className="metricsTimeLineChartSection"
          >
            {loading ? (
              <div className={styles.spinnerContainer}>
                <ReactLoading type="spin" color="#fff" />
              </div>
            ) : null}
            {(viewType === chartViewType.chartView) && <ChartBubbles
              width={isMobileView ? '100%' : '97%'}
              height={80}
              yAxisDataKey="level"
              legendProps={{
                layout: 'vertical',
                wrapperStyle: {
                  right: '-3%',
                  width: '130px',
                  fontSize: '13px',
                  color: '#003459',
                  fontWeight: '600'
                },
                align: 'right',
                verticalAlign: 'middle'
              }}
              metricsDateRange={metricsDateRange}
              setMetricsDateRange={setMetricsDateRange}
              scatterProps={this.scatterProps}
              availableDateTimes={availableDateTimes}
              tooltipDetails={this.props.tooltipDetailsMetric}
              mouseEventForTooltip={this.props.mouseEventForTooltip}
              labResultsTitle={this.names.labResults}
              doctorVisitsTitle={this.names.doctorVisits}
              measurementsTitle={this.names.measurements}
              isMobileView={isMobileView}
            />}

            {(viewType === chartViewType.tableView) && <MetricsChartTimeLineTable
              metricData={filteredData}
              columnsName={this.names}
              updating={this.setIsBusy}
              updateEntry={updateEntry}
              createNewEntry={createNewEntry}
            />
            }
          </CustomCard>
          {newEntryOpen
            && <MetricsNewEntry
              open={newEntryOpen}
              close={() => this.handleClick('newEntryOpen')}
            />
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const chart = getChartTimeLineDataSelector(state);
  const metricData = chart.metricData || [];

  // console.log('chart....', metricData, chart);
  const maxDate = getMinDatOfMetricDataSelector(state);

  return {
    chart,
    metricsDateRange: getActualDateRange(state.metricsDateRange, maxDate),
    labResults: metricData.labResults,
    doctorVisits: metricData.doctorVisits,
    measurements: metricData.measurements,
    mouseEventForTooltip: props.mouseEventForTooltip,
    tooltipDetailsMetric: props.tooltipDetailsMetric,
    maxDate,
    metricData: chart.timelineData
  };
};

const mapDispatchToProps = dispatch => ({
  loadTimeLineData: bindActionCreators(loadTimeLineMetricDataAsync, dispatch),
  setMetricsDateRange: bindActionCreators(setMetricsDateRange, dispatch),
  updateEntry: bindActionCreators(updateEntryAsync, dispatch),
  createNewEntry: bindActionCreators(createNewEntryAsync, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(MetricsChartTimeline));
