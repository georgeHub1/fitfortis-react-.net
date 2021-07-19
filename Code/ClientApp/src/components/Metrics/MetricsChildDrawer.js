import React, { Component } from 'react';
import { Button, InputNumber, Select, Icon, Switch } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import styles from './styles.module.less';
import { colors, DEFAULT_STROKE } from '../../constants/metrics';
import PropTypes from 'prop-types';

const Option = Select.Option;

class MetricsChildDrawer extends Component {
  displayName = MetricsChildDrawer.name;

  static propTypes = {
    showGoalLines: PropTypes.bool.isRequired,
    annotateLastEntry: PropTypes.bool.isRequired,
    annotateMaxEntry: PropTypes.bool.isRequired,
    annotateMinEntry: PropTypes.bool.isRequired,
    stroke: PropTypes.string.isRequired,
    isUpdating: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    changeProperties: PropTypes.func.isRequired,
    type: PropTypes.number.isRequired,
    yMin:  PropTypes.number,
    yMax:  PropTypes.number,
    goal: PropTypes.number,
    defaultGoalMin: PropTypes.number,
    defaultGoalMax: PropTypes.number,
    isGoalValueEditable: PropTypes.bool,
    metricId: PropTypes.string
  }
  constructor (props) {
    super(props);
    this.state = {
      showGoalLines: this.props.showGoalLines,
      annotateLastEntry: this.props.annotateLastEntry,
      annotateMaxEntry: this.props.annotateMaxEntry,
      annotateMinEntry: this.props.annotateMinEntry,
      stroke: this.props.stroke || DEFAULT_STROKE,
      yMin:  this.props.yMin,
      yMax:  this.props.yMax,
      goal: this.props.goal,
      GoalMin: this.props.defaultGoalMin,
      GoalMax: this.props.defaultGoalMax
    };
  }

  handleColor = color => {
    this.setState({ stroke: color });
  };

  handleApply = () => {
    const changedValues = Object.keys(this.state)
      .filter(key => this.state[key] !== this.props[key])
      .length;

    if (changedValues === 0) {
      return this.props.close();
    }

    this.props.changeProperties(this.state);
  };

  handleGoal = e => this.setState({ goal: e });

  handleGoalMin = e => this.setState({ GoalMin: e });

  handleGoalMax = e => this.setState({ GoalMax: e });

  handleMinRange = e => this.setState({ yMin: e });

  handleMaxRange = e => this.setState({ yMax: e });
  onChangeSwitch = (value, formatKey, key) => {
    this.setState(state => ({
      ...state,
      [key]: value
    }));
  };

  getToogle = state => {
    return [
      {
        toggle: state.showGoalLines,
        formatKey: 'toggleGL',
        key: 'showGoalLines'
      },
      {
        toggle: state.annotateLastEntry,
        formatKey: 'toggleLast',
        key: 'annotateLastEntry'
      },
      {
        toggle: state.annotateMaxEntry,
        formatKey: 'toggleMax',
        key: 'annotateMaxEntry'
      },
      {
        toggle: state.annotateMinEntry,
        formatKey: 'toggleMin',
        key: 'annotateMinEntry'
      }
    ];
  }

  render () {
    const {
      stroke,
      yMin,
      yMax,
      goal,
      GoalMin,
      GoalMax
     } = this.state;
    const { close, isUpdating, units, type : metricType, intl: { formatMessage } } = this.props;
    const toggles = this.getToogle(this.state);

    return (
      <div>
       <div className="color_mertic_setting">
        <div className={styles.itemSetting}>
          <p className={styles.nameOfSetting}>
            <FormattedMessage id="MetricsChildDrawer.color" />
          </p>
          <Select
            className="colorPickerSelect"
            style={{ background: stroke, width: 200, borderRadius: 14 }}
            defaultValue={stroke}
            dropdownClassName="colorPickerDropdown"
            onChange={this.handleColor}
          >
            {colors.map(color => (
              <Option
                style={{ background: color, color: '#fff' }}
                key={color}
                value={color}
              >
                {stroke === color && <Icon type="check" />}
              </Option>
            ))}
          </Select>
        </div>
        {(metricType === 1) && (
          <div>
            <div className={styles.itemSetting}>
              <p className={styles.nameOfSetting}>
                <FormattedMessage id="MetricsChildDrawer.goal" /> ({units})
              </p>
              <InputNumber
                className={styles.InputNumber}
                placeholder={formatMessage({
                  id: 'MetricsChildDrawer.goalPlaceholder'
                })}
                value={goal}
                onChange={this.handleGoal}
              />
            </div>
          </div>
        )}
        {(metricType === 2) && (
          <div>
            {
              <div className={styles.itemSetting}>
                <p className={styles.nameOfSetting}>
                  <FormattedMessage id="MetricsChildDrawer.goalMax" /> ({units})
                </p>
                <InputNumber
                  className={styles.InputNumber}
                  placeholder={formatMessage({
                    id: 'MetricsChildDrawer.goalPlaceholder'
                  })}
                  value={GoalMax}
                  onChange={this.handleGoalMax}
                />
              </div>
            }
            {
              <div className={styles.itemSetting}>
                <p className={styles.nameOfSetting}>
                  <FormattedMessage id="MetricsChildDrawer.goalMin" /> ({units})
                </p>
                <InputNumber
                  className={styles.InputNumber}
                  placeholder={formatMessage({
                    id: 'MetricsChildDrawer.goalPlaceholder'
                  })}
                  value={GoalMin}
                  onChange={this.handleGoalMin}
                />
              </div>
            }
          </div>
        )}

        {(metricType === 3) && (
          <div>
            <div className={styles.itemSetting}>
              <p className={styles.nameOfSetting}>
                <FormattedMessage id="MetricsChildDrawer.rangeMax" /> ({units})
              </p>
              <InputNumber
                className={styles.InputNumber}
                placeholder={formatMessage({
                  id: 'MetricsChildDrawer.rangePlaceholder'
                })}
                value={yMax}
                onChange={this.handleMaxRange}
              />
            </div>

            <div className={styles.itemSetting}>
              <p className={styles.nameOfSetting}>
                <FormattedMessage id="MetricsChildDrawer.rangeMin" /> ({units})
              </p>
              <InputNumber
                className={styles.InputNumber}
                placeholder={formatMessage({
                  id: 'MetricsChildDrawer.rangePlaceholder'
                })}
                value={yMin}
                onChange={this.handleMinRange}
              />
            </div>
          </div>
        )}
        {toggles.map((el, i) => (
          <div key={el.formatKey} className={styles.itemSetting}>
            <p className={styles.nameOfSetting}>
              <FormattedMessage id={`MetricsChildDrawer.${el.formatKey}`} />
            </p>
            <Switch
              checked={el.toggle}
              onChange={value => this.onChangeSwitch(value, el.formatKey, el.key)}
            />
          </div>
        ))}

      </div >
        <div className={styles.btnBlock}>
          <Button aria-label="close button" onClick={close} >
            <FormattedMessage id="MetricsChildDrawer.close" />
          </Button>
          <Button
            type="primary"
            aria-label="apply button"
            onClick={this.handleApply}
          >
            {isUpdating ? <Icon type="loading" />
              : <FormattedMessage id="MetricsChildDrawer.apply" />
            }
          </Button>
        </div>
        </div>
    );
  }
}

export default injectIntl(MetricsChildDrawer);
