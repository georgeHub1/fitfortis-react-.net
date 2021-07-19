import React, { Component } from 'react';
import { Input, Button, Drawer, Select, Icon, Divider } from 'antd';
import moment from 'moment';
import { FormattedMessage, injectIntl } from 'react-intl';
import DatePicker from '../../components/Common/DatePicker';
import ChartAreaSmall from '../../components/Common/ChartAreaSmall';
import styles from '../../components/Metrics/styles.module.less';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createNewEntryAsync, updateEntryAsync } from '../../redux/metricsMetric.action';
import { bindActionCreators } from 'redux';
import { TIMELINE_METRIC_ID, DEFAULT_STROKE } from '../../constants/metrics';
import { getChartDataForTimeLine } from '../../redux/metricsChartMetric.selector';
import { getMetricById, getTimeLineMetricData } from '../../redux/metricsMetric.reducer';
import { getMetricsDateRange } from '../../redux/metricsDateRange.reducer';

const { Option } = Select;
const pattern = new RegExp(/^(-{0,1})(\d{1,})(\.\d{0,})*$/);
const timeLineMetrics = {
  labResults: 'labResults',
  doctorVisits: 'doctorVisits'
};

class MetricsNewEntryFromTimeLine extends Component {
  static propTypes = {
    metrics: PropTypes.arrayOf(
      PropTypes.shape({
        metricInfo: PropTypes.object.isRequired,
        metricData: PropTypes.array.isRequired
      })
    ).isRequired,
    timeLineMetric: PropTypes.shape({
      metricInfo: PropTypes.object.isRequired,
      metricData: PropTypes.array.isRequired
    }).isRequired,
    updateEntry: PropTypes.func.isRequired,
    createNewEntry: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired }).isRequired
  };
  constructor (props) {
    super(props);

    const renderSelect = props.metrics.map(el => el.metricInfo).sort(this.sortByName);

    this.state = {
      ...this.state,
      newEntry: this.newEntry,
      selectedMetric: this.getTimeLineSelection(props)[0],
      autoFocusValue: true,
      loading: false,
      showNuberFields: false,
      dateTime: new Date().getTime(),
      metrics: renderSelect,
      maxHeight: window.innerHeight
    };
  }

  get newEntry () {
    return {
      value: 1,
      annotation: '',
      dateTime: new Date().getTime()
    };
  }

  onDateChange = dateTime => {
    this.setState({
      newEntry: {...this.state.newEntry, dateTime }
    });
  };

  setValue = (value, key) => {
    if (
      (value === '' || value !== '-' ? pattern.test(+value) : true)
      && key === 'value'
    ) {
      this.setState({
        newEntry: {...this.state.newEntry, [key]: value },
        autoFocusValue: true
      });
    } else if (key !== 'value') {
      this.setState({
        autoFocusValue: false,
        newEntry: {...this.state.newEntry, [key]: value }
      });
    }
  };

  getTimeLineSelection = ({ intl: { formatMessage } }) => {
    return [
      {
        code: timeLineMetrics.labResults,
        stroke: '#7EA5DA',
        name: formatMessage({ id: 'MetricsTimeline.labResults' }),
        id: timeLineMetrics.labResults
      },
      {
        code: timeLineMetrics.doctorVisits,
        stroke: '#5880B6',
        name: formatMessage({ id: 'MetricsTimeline.doctorVisits' }),
        id: timeLineMetrics.doctorVisits
      }
    ];
  }

  handleAddClick = () => {
    const {
      close,
      updateEntry,
      createNewEntry,
      metrics,
      timeLineMetric
    } = this.props;
    const {
      newEntry,
      selectedMetric
    } = this.state;

    this.setState({ loading: true });

    let entry;
    const newTime = new Date(newEntry.dateTime);

    newTime.setSeconds(0, 0);
    if (!this.isTimeLineMetric(selectedMetric)) {
      const existedEntryData = metrics.find(i => i.metricInfo.id === selectedMetric.id)
        .metricData.find(x => {
          const time = new Date(x.dateTime);

          time.setSeconds(0, 0);
          return time.getTime() === newTime.getTime();
        });

      entry = existedEntryData ? {
        Comment: newEntry.annotation,
        value: newEntry.value,
        date: `${moment.utc(newTime.getTime()).format()}`,
        MetricId: selectedMetric.id,
        id: existedEntryData.id
      } : {
        Comment: newEntry.annotation,
          value: newEntry.value,
          date: `${moment.utc(newTime.getTime()).format()}`,
          MetricId: selectedMetric.id
        };
    }
    else {
      const existedEntryData = timeLineMetric.metricData
        .find(x => {
          const time = new Date(x.dateTime);

          time.setSeconds(0, 0);
          return time.getTime() === newTime.getTime();
        });

      let label = null;

      if (selectedMetric.code === 'doctorVisits') {
        label = 'DoctorVisitComments';
      } else if (selectedMetric.code === 'labResults') {
        label = 'LabResultsComments';
      } else {
        label = 'Comment';
      }
      entry = existedEntryData ? {
        [label]: newEntry.annotation,
        [selectedMetric.id]: newEntry.value,
        date: `${moment.utc(newTime.getTime()).format()}`,
        MetricId: TIMELINE_METRIC_ID,
        id: existedEntryData.id
      }
        : {
          [label]: newEntry.annotation,
          [selectedMetric.id]: newEntry.value,
          date: `${moment.utc(newTime.getTime()).format()}`,
          MetricId: TIMELINE_METRIC_ID
        };
    }

    if (entry.id) {
      updateEntry(entry.id, entry).then(() => { close(); });
    }
    else {
      createNewEntry(entry).then(() => { close(); });
    }
  };
  handleChange = value => {
    if (value !== 'labResults' && value !== 'doctorVisits') {
      const { metrics } = this.props;
      const selectedMetric = metrics.find(el => el.metricInfo.id === value);

      this.setState(state => ({
        ...state,
        showNuberFields: true,
        newEntry: { ...this.newEntry, value : ''},
        selectedMetric: selectedMetric.metricInfo
      }));
    } else {
      this.setState(state => ({ ...state, showNuberFields: false, newEntry: { ...this.newEntry, value: 1 },  selectedMetric: this.getTimeLineSelection(this.props).find(x => x.id === value) }));
    }
  };
  sortByName = (a, b) => a.name.localeCompare(b.name);
  get selectedMetricData () {
    const { metrics } = this.props;
    const { selectedMetric } = this.state;

    if (this.isTimeLineMetric(selectedMetric))
      return [];

    return metrics.find(x => x.metricInfo.id === selectedMetric.id).metricData || [];
  }
  isTimeLineMetric = metric => {
    return this.getTimeLineSelection(this.props).find(x => x.id === metric.id);
  }
  updateDimensions = () => {
    this.setState({ maxHeight: window.innerHeight });
  }
  componentDidMount () {
    window.addEventListener('resize', this.updateDimensions);
  }
  componentWillUnmount () {
    window.removeEventListener('resize', this.updateDimensions);
  }
  render () {
    const {
      open,
      close,
      intl: { formatMessage }
    } = this.props;
    const {
      selectedMetric,
      autoFocusValue,
      showNuberFields,
      maxHeight
    } = this.state;

    const data = this.selectedMetricData;
    const defaultValue = selectedMetric.id;
    const renderSelect = this.state.metrics;
    const option = el => (
      <Option value={el.id} key={el.id}>
        <div className={styles.icon}>
          <div style={{ background: (this.isTimeLineMetric(el) ? el.stroke : el.defaultStroke) || DEFAULT_STROKE }} />
        </div>
        <span>{el.name}</span>
      </Option>
    );

    return (
      <Drawer
        title={
          <div className={styles.header}>
            <FormattedMessage id="MetricsNewEntry.header" />
          </div>
        }
        closable={false}
        className="metricsNewEntryDrawer"
        placement="right"
        onClose={close}

        visible={open}
      >
        <div className={styles.cardWrapperNewEntry}>
          <DatePicker
            dateTime={this.state.dateTime}
            onDateChange={this.onDateChange}
          />
          <div className={styles.blockOfSelects}>
            <div>
              <Select
                className="metricInfo"
                dropdownClassName="metricInfoDropdown"
                defaultValue={defaultValue}
                onChange={this.handleChange}
                dropdownMenuStyle={{ maxHeight }}
              >
                {this.getTimeLineSelection(this.props).map(option)}
                <Option key={'Divider'} value={'Divider'} disabled>
                  <Divider />
                </Option>
                {renderSelect.map(option)}
              </Select>
            </div>
            {!this.isTimeLineMetric(selectedMetric) && (
              <ChartAreaSmall
                data={[...data, this.state.newEntry]
                  .filter(el => el.value)
                  .sort((a, b) => a.dateTime - b.dateTime)}
                metricsInfo={[selectedMetric]}
                metricsDateRange={this.props.metricsDateRange}
                style={{ marginRight: -8 }}
                newEntryChart={true}
              />
            )}
          </div>

          {showNuberFields
           && <Input
              ref={input => autoFocusValue && input && input.focus()}
              autoFocus={autoFocusValue}
              value={this.state.newEntry.value}
              onChange={e => this.setValue(e.target.value, 'value')}
              className={styles.metricsValue}
              suffix={
                <span className={styles.suffix}>
                  {selectedMetric.units}
                </span>
              }
            />
          }
          <div className={styles.commentAreaContainer}>
            <Input.TextArea
              maxLength={120}
              value={this.state.newEntry.annotation}
              onChange={e => this.setValue(e.target.value, 'annotation')}
              placeholder={formatMessage({
                id: 'MetricsNewEntry.commentPlaceholder'
              })}
              className={styles.commentArea}
            />
          </div>

          <div className={styles.btnBlock}>
            <Button
              onClick={() => {
                this.setState({
                  newEntry: this.newEntry,
                  autoFocusValue: true
                });
                close();
              }}
            >
              <FormattedMessage id="MetricsNewEntry.cancelBtn" />
            </Button>
            <Button
              type="primary"
              onClick={() => this.handleAddClick()}
              disabled={!pattern.test(this.state.newEntry.value)}
            >
              {
                this.state.loading
                  ? <Icon type="loading" />
                  : <FormattedMessage id="MetricsNewEntry.addBtn" />
              }
            </Button>
          </div>
        </div>
      </Drawer>
    );
  }
}

const mapStateToProps = (state, props) => {
  const chartData = getChartDataForTimeLine(state);

  return {
    close: props.close,
    intl: props.intl,
    open: props.open,
    metrics: chartData,
    metricsDateRange: getMetricsDateRange(state),
    timeLineMetric: {
      metricInfo: getMetricById(state, TIMELINE_METRIC_ID),
      metricData: getTimeLineMetricData(state)
    }
  };
};

const mapDispatchToProps = dispatch => ({
  createNewEntry: bindActionCreators(createNewEntryAsync, dispatch),
  updateEntry: bindActionCreators(updateEntryAsync, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(MetricsNewEntryFromTimeLine));
