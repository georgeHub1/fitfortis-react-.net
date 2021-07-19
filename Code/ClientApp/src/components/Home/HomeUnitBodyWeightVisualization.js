import React, { PureComponent } from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { getMetricDataById } from '../../redux/metricsMetricData.reducer';
import { getMetricById } from '../../redux/metricsMetric.reducer';
import { getMetricsDateRange } from  '../../redux/metricsDateRange.reducer';
import { createGetMetricDataByChartIdSelector } from '../../redux/metricsMetricData.selector';
import { connect } from 'react-redux';
import CustomCard from '../Common/CustomCard.js';
import ChartAreaSmall from '../Common/ChartAreaSmall.js';
import _ from 'lodash';
import analyticId from '../../utils/AnalyticsAndAbTests.tsx';

export class HomeUnitBodyWeightVisualization extends PureComponent {
  static propTypes = {
    metricsDateRange: PropTypes.object.isRequired,
    renderChart: PropTypes.array.isRequired,
    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
  };
  constructor (props) {
    super(props);
    this.state = {
      chartData: this.props.renderChart
    };
  }
  componentDidMount () {
    this.getMetricData();
  }
  componentDidUpdate (prevProps) {
    if (prevProps.renderChart !== this.props.renderChart) {
      this.getMetricData();
    }
  }
  getChartDATA () {
    const { chartDATA } = this.props;

    return [chartDATA];
  }

  getMetricData () {
    const { renderChart } = this.props;
    const metricData =  _.orderBy(renderChart, ['dateTime'], ['asc']);

    this.setState({ chartData: metricData });
  }
  render () {
    const {  chartDATA, metricsDateRange, MetricId, renderChart, addEntry, intl: { formatMessage } } = this.props;
    const chartName = chartDATA.name ? chartDATA.name : formatMessage({ id: 'HomeUnitBodyWeightVisualization.bodyWeightTitle' });

    return (
      <CustomCard
        title={<h1 style={{ color: chartDATA.stroke || chartDATA.defaultStroke}}>{chartName}</h1>}
      >
            <ChartAreaSmall
              data={renderChart}
              metricsInfo={[chartDATA]}
              metricsDateRange={metricsDateRange}
              style={{ marginRight: -8 }}
              metricKey={MetricId}
              HomeSmallChart={true}
            />
        <Button
          type="primary"
          style={{ backgroundColor: chartDATA.stroke || chartDATA.defaultStroke, borderColor: chartDATA.stroke || chartDATA.defaultStroke }}
          className="weight_form_button"
          onClick={() => {
            addEntry(MetricId);
            analyticId.firebaseAnalyticsLog('Home_UnitBodyWeight_ClickToAddValue');
          }}
        >
          <span><FormattedMessage id="HomeUnitBodyWeightVisualization.Add" /></span>
        </Button>
      </CustomCard>
    );
  }
}


const mapStateToProps = () => {
  const getMetricDataByChartId = createGetMetricDataByChartIdSelector();

  return (state, props) => {
    const chartId = props.data ? props.data.chartId : null;

    let data  = null;

    let chartPoint = null;

    if (chartId) {
      data = getMetricDataByChartId(state, chartId);
      data.chart.data.forEach(el => {
        if (el.metricId === props.data.metircId) {
          chartPoint = el;
        }
      });
    }
    const getmetricData = getMetricDataById(state, props.MetricId) ? getMetricDataById(state, props.MetricId) : [];
    const metricsDateRangeData = getMetricsDateRange(state);
    const metrics = getMetricById(state, props.MetricId) ? getMetricById(state, props.MetricId) : [];

    return {
      chartName: chartId ? data.chart.chart.name : null,
      metricsDateRange: chartId ? data.metricsDateRange : metricsDateRangeData,
      chartDATA: chartId ? chartPoint : metrics,
      renderChart: getmetricData
    };
  };
};

export default connect(mapStateToProps)(injectIntl(HomeUnitBodyWeightVisualization));
