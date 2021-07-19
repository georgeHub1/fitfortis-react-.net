import { FormattedMessage, injectIntl } from 'react-intl';
import { Input, Button, Drawer, Select, Icon } from 'antd';
import DatePicker from '../Common/DatePicker';
import moment from 'moment';
import ChartAreaSmall from '../Common/ChartAreaSmall';
import ChartAreaBarSmall  from '../Common/ChartAreaBarSmall';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import styles from './styles.module.less';
import { DEFAULT_STROKE } from '../../constants/metrics';
import { MetricsChartDataProps } from '../../containers/Metrics/metrics.chart.propTypes';
import emoji1 from '../../img/emoji/emoji1.png';
import emoji2 from '../../img/emoji/emoji2.png';
import emoji3 from '../../img/emoji/emoji3.png';
import emoji4 from '../../img/emoji/emoji4.png';
import emoji5 from '../../img/emoji/emoji5.png';
import emoji1Active from '../../img/emoji/emoji1_active.png';
import emoji2Active from '../../img/emoji/emoji2_active.png';
import emoji3Active from '../../img/emoji/emoji3_active.png';
import emoji4Active from '../../img/emoji/emoji4_active.png';
import emoji5Active from '../../img/emoji/emoji5_active.png';

const { Option } = Select;
const pattern = new RegExp(/^(-{0,1})(\d{1,})(\.\d{0,})*$/);

export class MetricsNewEntry extends PureComponent {
  static propTypes = {
    chartDATA: PropTypes.arrayOf(MetricsChartDataProps),
    close: PropTypes.func.isRequired,
    createNewEntry: PropTypes.func.isRequired,
    updateEntry: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
  };
  constructor (props) {
    super(props);
    this.state = {
      newEntry: this.newEntry,
      newValue: '',
      autoFocusValue: true,
      loading: false,
      selectedMetric: this.getMetricsList()[0],
      dateTime: new Date().getTime(),
      maxHeight: window.innerHeight
    };
  }
  get newEntry () {
    return {
      value: '',
      annotation: '',
      dateTime: new Date().getTime()
    };
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
  onDateChange = dateTime => {
    this.setState(state => ({
      newEntry: {...this.state.newEntry, dateTime }
    }));
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
  handleAddClick = () => {
    const {
      close,
      createNewEntry,
      updateEntry
    } = this.props;
    const {
      newEntry,
      newValue,
      selectedMetric
    } = this.state;

    this.setState({ loading: true });
    const newTime = new Date(newEntry.dateTime);

    newTime.setSeconds(0, 0);
    const existedEntryData = selectedMetric.metricData.find(x => {
      const time = new Date(x.dateTime);

      time.setSeconds(0, 0);
      return time.getTime() === newTime.getTime();
    });

    if (existedEntryData) {
      if (selectedMetric.metricId === '00000000-0000-0000-0000-000000000005' || selectedMetric.metricId === '00000000-0000-0000-0000-000000000004') {
        updateEntry(existedEntryData.id, {
          Date: `${moment.utc(newEntry.dateTime).format()}`,
          Value: newEntry.value,
          MetricId: selectedMetric.data[0].metricId
        }).then(() => updateEntry(existedEntryData.id, {
          Date: `${moment.utc(newEntry.dateTime).format()}`,
          Value: newValue,
          MetricId: selectedMetric.data[1].metricId
        }).then(() => { close(); }));
      } else {
        updateEntry(existedEntryData.id, {
          Date: `${moment.utc(newEntry.dateTime).format()}`,
          Value: newValue,
          MetricId: selectedMetric.metricId,
          comment: newEntry.annotation
        }).then(() => { close(); });
      }
    }
    else if (selectedMetric.metricId === '00000000-0000-0000-0000-000000000005' || selectedMetric.metricId === '00000000-0000-0000-0000-000000000004') {
      createNewEntry({
        Date: `${moment.utc(newEntry.dateTime).format()}`,
        Value: newEntry.value,
        MetricId: selectedMetric.data[0].metricId,
        comment: newEntry.annotation
      }
      ).then(() => createNewEntry({
        Date: `${moment.utc(newEntry.dateTime).format()}`,
        Value: newValue,
        MetricId: selectedMetric.data[1].metricId,
        comment: newEntry.annotation
      }
      ).then(() => { close(); }));
    } else {
      createNewEntry({
        Date: `${moment.utc(newEntry.dateTime).format()}`,
        Value: newEntry.value,
        MetricId: selectedMetric.metricId,
        comment: newEntry.annotation
      }
      ).then(() => { close(); });
    }
  };
  handleChange = value => {
    // const { chartDATA } = this.props;
    this.setState({ selectedMetric: this.getMetricsList().find(el => el.metricId === value) });
  };
  getMetricsList () {
    const { chartDATA } = this.props;
    const BloodPressureDia = chartDATA.find(x => x.metricId === '00000000-0000-0000-0000-000000000004');
    const BloodPressureSys = chartDATA.find(x => x.metricId === '00000000-0000-0000-0000-000000000005');

    let BloodPressureData = null;

    let removeData = chartDATA;

    if (BloodPressureDia && BloodPressureSys) {
      BloodPressureData = {
        ...BloodPressureSys,
        name: 'Blood pressure',
        data: [{...BloodPressureDia}, {...BloodPressureSys}]
      };
      removeData = chartDATA.filter(x => !(x.metricId === '00000000-0000-0000-0000-000000000004' || x.metricId === '00000000-0000-0000-0000-000000000005'));
    }
    const finalData = [...removeData];

    if (BloodPressureData) {
      finalData.push(BloodPressureData);
    }
    return finalData;
  }

  sortByName = arr => arr.sort((a, b) => a.name.localeCompare(b.name));
  render () {
    const {
      open,
      close,
      // chartDATA,
      intl: { formatMessage }
    } = this.props;
    const {
      selectedMetric,
      // autoFocusValue,
      maxHeight
    } = this.state;

    const isEmpty = !selectedMetric || false;
    const data = (selectedMetric || { metricData: [] }).metricData;
    const defaultValue = selectedMetric.name;

    const option = (el, i) => (
      <Option value={el.metricId} key={`${el.name}-${i}`}>
        <div className={styles.icon}>
          <div style={{ background: el.stroke || el.defaultStroke || DEFAULT_STROKE }} />
        </div>
        <span>{el.name}</span>
      </Option>
    );

    return (
      <Drawer
        className="metricsNewEntryDrawer"
        title={
          <div className={styles.header}>
            <FormattedMessage id="MetricsNewEntry.header" />
          </div>
        }
        closable={false}
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
                {this.getMetricsList().map((el, i) => option(el, i))}
              </Select>
            </div>
            {(!isEmpty) && (
              selectedMetric.metricId === '00000000-0000-0000-0000-000000000024'
              ? <ChartAreaBarSmall
                  data={[...data, this.state.newEntry]
                  .filter(el => el.value !== '')
                  .sort((a, b) => a.dateTime - b.dateTime)}
                  metricsInfo={[!isEmpty
                    ? selectedMetric
                    : this.getMetricsList().length > 0 && this.getMetricsList()[0]]}
                  metricsDateRange={this.props.metricsDateRange}
                  metricKey={selectedMetric.metricId}
                  newEntryChart={true}
                />
              : <ChartAreaSmall
                  data={[...data, this.state.newEntry]
                    .filter(el => el.value)
                    .sort((a, b) => a.dateTime - b.dateTime)}
                  metricsInfo={[!isEmpty
                          ? selectedMetric
                          : this.getMetricsList().length > 0 && this.getMetricsList()[0]]}
                  metricsDateRange={this.props.metricsDateRange}
                  style={{ marginRight: -8 }}
                  newEntryChart={true}
              />
            )}
          </div>
          {selectedMetric.metricId === '00000000-0000-0000-0000-000000000005' && <Input
              value={this.state.newValue}
              onChange={e => this.setState({ newValue: e.target.value })}
              className={styles.metricsValue}
              suffix={<span className={styles.suffix}>
                  {!isEmpty
                    ? selectedMetric.units
                    : this.getMetricsList().length > 0 && this.getMetricsList()[0].units}
                </span>
              }
            />
          }
          {selectedMetric.metricId === '00000000-0000-0000-0000-000000000005' && <div>{selectedMetric.data ? selectedMetric.data[1].name : ''}</div>}
          {selectedMetric.metricId === '00000000-0000-0000-0000-000000000024'
            ? <div className="weight_initial_state">
                <div className="stress_buttons">
                  <Button aria-label="emoji 1" onClick={() => this.setValue(-200, 'value')} className={this.state.newEntry.value === -200 ? 'stress_button five active' : 'stress_button five'}>
                    <img alt="emoji" src={emoji5} />
                    <img alt="emoji" src={emoji5Active} className="active" />
                  </Button>
                  <Button aria-label="emoji 2" onClick={() => this.setValue(-100, 'value')} className={this.state.newEntry.value === -100 ? 'stress_button four active' : 'stress_button four'}>
                    <img alt="emoji" src={emoji4} />
                    <img alt="emoji" src={emoji4Active} className="active" />
                  </Button>
                  <Button aria-label="emoji 3" onClick={() => this.setValue(0, 'value')} className={this.state.newEntry.value === 0 ? 'stress_button three active' : 'stress_button three'}>
                    <img alt="emoji" src={emoji3} />
                    <img alt="emoji" src={emoji3Active} className="active" />
                  </Button>
                  <Button aria-label="emoji 4" onClick={() => this.setValue(100, 'value')} className={this.state.newEntry.value === 100 ? 'stress_button two active' : 'stress_button two'}>
                    <img alt="emoji" src={emoji2} />
                    <img alt="emoji" src={emoji2Active} className="active" />
                  </Button>
                  <Button aria-label="emoji 5" onClick={() => this.setValue(200, 'value')} className={this.state.newEntry.value === 200 ? 'stress_button one active' : 'stress_button one'}>
                    <img alt="emoji" src={emoji1} />
                    <img alt="emoji" src={emoji1Active} className="active" />
                  </Button>
                </div>
            </div>
            : <Input
              value={this.state.newEntry.value}
              onChange={e => this.setValue(e.target.value, 'value')}
              className={styles.metricsValue}
              suffix={<span className={styles.suffix}>
                  {!isEmpty
                    ? selectedMetric.units
                    : this.getMetricsList().length > 0 && this.getMetricsList()[0].units}
                </span>
              }
            />
          }
          {selectedMetric.metricId === '00000000-0000-0000-0000-000000000005' && <div>{selectedMetric.data ? selectedMetric.data[0].name : ''}</div>}
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
              aria-label="cancel button"
              onClick={() => {
                this.setState(item => ({
                  ...item,
                  newEntry: this.newEntry,
                  autoFocusValue: true
                }));
                close();
              }}
            >
              <FormattedMessage id="MetricsNewEntry.cancelBtn" />
            </Button>
            <Button
              type="primary"
              aria-label="add button"
              onClick={() => this.handleAddClick()}
              disabled={!pattern.test(this.state.newEntry.value) || (selectedMetric.metricId === '00000000-0000-0000-0000-000000000005' ? !pattern.test(this.state.newValue) : '')}
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

export default (injectIntl(MetricsNewEntry));

