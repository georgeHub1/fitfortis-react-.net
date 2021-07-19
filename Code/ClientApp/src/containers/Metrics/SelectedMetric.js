import { bindActionCreators } from 'redux';
import { Button, Tooltip, Icon, Drawer } from 'antd';
import { connect } from 'react-redux';
import { DEFAULT_STROKE } from '../../constants/metrics';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { updateChartMetricPropertiesAsync, deleteSelectedMetricAsync } from '../../redux/metricsChartMetric.action';
import MetricsChildDrawer from '../../components/Metrics/MetricsChildDrawer';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from '../../components/Metrics/styles.module.less';
import { MetricsChartDataProps } from './metrics.chart.propTypes';
import { SanitizeHTML } from '../../components/SanitizeHTML/SanitizeHTML';
const COUNT_OF_ENCICLOPEDIA_DESCRIPTION = 180;

class SelectedMetric extends Component {
  static propTypes = {
    chartMetric: MetricsChartDataProps,
    deleteSelectedMetric: PropTypes.func.isRequired,
    changeProperties: PropTypes.func.isRequired,
    chartId: PropTypes.string.isRequired
  };
  constructor (props) {
    super(props);

    this.state = {
      openChildDrawer: false,
      isUpdatingMetric: false,
      isRemovingMetric: false
    };
  }

  handleOpenChildDrawer = () => {
    this.setState(state => ({ ...state, openChildDrawer: !state.openChildDrawer}));
  }

  onDeleteSelectedMetric = item => {
    if (this.state.isRemovingMetric)
      return;

    this.setState(
      state => ({ ...state, isRemovingMetric: true}),
      () => { this.props.deleteSelectedMetric(item.chartId, item.chartMetricId); }
    );
  }
  onChangeProperties = properties => {
    // It is only one way to update chartMetric, should be refactored to model in the near future

    this.setState(
      state => ({ ...state, isUpdatingMetric: true }),
      () => {
        this.props.changeProperties(this.props.chartMetric.chartMetricId, properties, this.props.chartId)
          .then(() => this.setState(state => ({ ...state, isUpdatingMetric: false, openChildDrawer: false })));
      }
    );
  }

  render () {
    const {
      openChildDrawer,
      isRemovingMetric,
      isUpdatingMetric
    } = this.state;

    const {
      chartMetric
    } = this.props;
    const item = chartMetric;

    return (<React.Fragment>
      <div className={styles.selectedItem}>
        <div className={`nameRemovemetricInfoBlock ${styles.metricInfoBlock}`}>
          <div
            className={`${styles.LeftSide} ${
              styles.LeftSideNewMetric
              }`}
          >
            <div className={styles.icon}>
              <div
                style={{
                  background: item.stroke || item.defaultStroke || DEFAULT_STROKE
                }}
              />
            </div>
            <div className={styles.nameOfMetric}>{item.name}</div>
            <div className={styles.tooltipBlock}>
              <Tooltip
                title={props => {
                  const link = '/encyclopedia'.concat((item.encyclopediaId) ? `/${item.encyclopediaId}` : '');
                  const description = ((item.description || '').length > COUNT_OF_ENCICLOPEDIA_DESCRIPTION)
                    ? (`${(item.description || '').substr(0, COUNT_OF_ENCICLOPEDIA_DESCRIPTION)}`.concat('...'))
                    : item.description;

                  return (
                    <div>
                      <span className="metrics-ant-tooltip-inner">
                        <SanitizeHTML html={description} />
                      </span>
                      <p style={{ textAlign: 'right' }}>
                        <Link to={link} style={{ color: '#fff', textDecoration: 'underline' }}>
                          <FormattedMessage id="SymptomCheckerSideBar.readMore" />
                        </Link>
                      </p>
                    </div>
                  );
                }}
                placement="right">
                <Button type="primary" className={styles.tooltipBtn}>
                  ?
            </Button>
              </Tooltip>
            </div>
          </div>
          <div className={styles.RightSide}>
          {item.metricId !== '00000000-0000-0000-0000-000000000004' && item.metricId !== '00000000-0000-0000-0000-000000000005'
          && <Button
              type="primary"
              onClick={() => this.onDeleteSelectedMetric(item)}
              className={styles.RightSideBtn}
            >
              {
                isRemovingMetric ? <Icon type="loading" />
                  : <FormattedMessage id="NewMetric.deleteBtn" />
              }

            </Button>
            }
            <Button
              type="primary"
              onClick={() =>
                this.handleOpenChildDrawer(item.chartMetricId)
              }
              className={styles.RightSideBtn}
            >
              <Icon type="setting" />
            </Button>
          </div>
        </div>
      </div>
      <Drawer
        className="metricSetting"
        title={
          <div className={styles.header}>
            <FormattedMessage id="NewMetric.metricSettings" /> —{' '}
            {item.name}
          </div>
        }
        placement="right"
        closable={false}
        onClose={() => this.handleOpenChildDrawer('')}
        visible={openChildDrawer}
      >
        {openChildDrawer && (
          <MetricsChildDrawer
            showGoalLines={item.showGoalLines}
            annotateLastEntry={item.annotateLastEntry}
            annotateMaxEntry={item.annotateMaxEntry}
            annotateMinEntry={item.annotateMinEntry}
            isUpdating={isUpdatingMetric}
            changeProperties={this.onChangeProperties}
            stroke={item.stroke || item.defaultStroke || DEFAULT_STROKE}
            goal={item.goal}
            yMin={item.yMin}
            yMax={item.yMax}
            type={item.type || 1}
            units={chartMetric.units}
            close={() => this.handleOpenChildDrawer('')}
            defaultGoalMin={item.defaultGoalMin}
            defaultGoalMax={item.defaultGoalMax}
          />
        )}
      </Drawer>
    </React.Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  changeProperties: bindActionCreators(updateChartMetricPropertiesAsync, dispatch),
  deleteSelectedMetric: bindActionCreators(deleteSelectedMetricAsync, dispatch)
});

export default connect(null, mapDispatchToProps)(injectIntl(SelectedMetric));
