import { Button, Icon } from 'antd';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import React, { PureComponent } from 'react';
import styles from '../../components/Metrics/styles.module.less';
import { removeChartAsync } from '../../redux/metricsChart.action';
import { bindActionCreators } from 'redux';
import { createGetMetricDataByChartIdSelector } from '../../redux/metricsMetricData.selector';
import PropTypes from 'prop-types';
import { MetricsChartDataProps } from './metrics.chart.propTypes';
import ChartAreaSmall from '../../components/Common/ChartAreaSmall';
import ReactLoading from 'react-loading';
class SmallChart extends PureComponent {
  static propTypes = {
    chartDATA: PropTypes.arrayOf(MetricsChartDataProps).isRequired,
    metricsDateRange: PropTypes.object.isRequired,
    renderChart: PropTypes.array.isRequired,
    chart: PropTypes.object.isRequired,
    removeChart: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    extremePointMap: PropTypes.object.isRequired
  };
  constructor (props) {
    super(props);
    this.state = {
      isRemoving: false
    };
  }

  removeChart = () => {
    if (this.state.isRemoving)
      return;

    this.setState(
      state => ({ ...state, isRemoving: true }),
      () => this.props.removeChart(this.props.chart)
    );
  };

  render () {
    const { isRemoving } = this.state;
    const {
      metricsDateRange,
      chart,
      loading,
      renderChart,
      chartDATA,
      extremePointMap
    } = this.props;
    const metricsInfo = chartDATA;

    return (<div
      className={styles.selectedItemchart}
    >
      <div className={styles.metricInfoBlock}>
        <div className={styles.LeftSide}>
          <div className={styles.icon} />
          < div className={styles.nameOfMetric} >
            {chart.name}
          </div>
        </div>
        < div className={styles.RightSide} >
          <Button
            type="primary"
            onClick={this.removeChart}
            className={styles.RightSideBtn}
          >
            {
              isRemoving
                ? <Icon type="loading" />
                : <FormattedMessage id="NewMetric.deleteBtn" />
            }
          </Button>
        </div>
      </div>
      < div className={styles.chartItem} >
        {
          chartDATA.length ? (
            <div className={styles.chartContainer}>
              {loading ? (
                <div className={styles.spinnerContainer}>
                  <ReactLoading type="spin" color="#fff" />
                </div>
              ) : null}
              <ChartAreaSmall
                extremePointMap={extremePointMap}
                data={renderChart || []}
                metricsInfo={metricsInfo}
                metricsDateRange={metricsDateRange}
                backgroundColor="#ffffff"
                backgroundImage="#ffffff"
                style={{ marginRight: -8 }}
              />
            </div>
          ) : (
              <div><FormattedMessage id="MetricsNewChart.chartIsEmpty" /></div>
            )}
      </div>
    </div>
    );
  }
}

const mapStateToProps = () => {
  const getMetricDataByChartId = createGetMetricDataByChartIdSelector();

  return (state, props) => {
    const { isChartMetricDataLoaded, chartPoints, chart: { chart, data: chartData }, extremePointMap, metricsDateRange } = getMetricDataByChartId(state, props.chartId);

    return {
      metricsDateRange,
      chartDATA: chartData,
      renderChart: chartPoints,
      chart,
      loading: !isChartMetricDataLoaded,
      extremePointMap
    };
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  removeChart: bindActionCreators(removeChartAsync, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SmallChart);
