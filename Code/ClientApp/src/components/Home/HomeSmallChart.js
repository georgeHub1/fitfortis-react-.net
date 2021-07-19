import React, { PureComponent } from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { getMetricDataById } from '../../redux/metricsMetricData.reducer';
import { getMetricById } from '../../redux/metricsMetric.reducer';
import { getMetricsDateRange } from  '../../redux/metricsDateRange.reducer';
import { connect } from 'react-redux';
import CustomCard from '../Common/CustomCard.js';
import ChartAreaSmall from '../Common/ChartAreaSmall.js';
import ChartAreaBarSmall from '../Common/ChartAreaBarSmall.js';
import moment from 'moment';
import _ from 'lodash';
export class HomeSmallChart extends PureComponent {
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
    const { intl: { formatMessage }, chartDATA } = this.props;

    if (chartDATA.id === '00000000-0000-0000-0000-000000000010') {
      chartDATA.units = formatMessage({id: 'HomeChart.PulseLang'});
      chartDATA.defaultStroke = 'red';
    }
    return [chartDATA];
  }

  getDays () {
		const { metricsDateRange } = this.props;

		const dateStart = moment(metricsDateRange.from);
		const dateEnd = moment(metricsDateRange.to);
		const timeValues = [];

		// eslint-disable-next-line
		while (dateEnd >= dateStart) {
			timeValues.push({dateTime: dateStart.format('YYYY-MM-DD')});
			dateStart.add(1, 'days');
		}
		return timeValues;
	}

	getHours () {
    const { metricsDateRange } = this.props;

    const dateStart = moment(metricsDateRange.from);
    const dateEnd = moment(metricsDateRange.to);
    const timeValues = [];

    // eslint-disable-next-line
    while (dateEnd >= dateStart) {
      timeValues.push({dateTime: dateStart.format('YYYY-MM-DD HH:mm')});
      dateStart.add(1, 'hour');
    }
    return timeValues;
	}
	getMetrixDateKey () {
		const { renderChart, metricsDateRange } = this.props;

		if (metricsDateRange.key === 'DAY_KEY') {
			const getDays = this.getHours();
			const dataArray = renderChart;

			dataArray.map(item => {
				item.dateTime = moment(item.dateTime).format('YYYY-MM-DD HH:mm');
				return item;
			});
			const uniqueResult = dataArray.filter(obj => {
				return getDays.some(obj2 => {
						return moment(obj.dateTime).format('YYYY-MM-DD HH') === moment(obj2.dateTime).format('YYYY-MM-DD HH');
				});
			});

			return uniqueResult;
		}
		const getDays = this.getDays();
		const dataArray = renderChart;

		dataArray.map(item => {
			item.dateTime = moment(item.dateTime).format('YYYY-MM-DD');
			return item;
		});

		const uniqueResult = dataArray.filter(obj => {
			return getDays.some(obj2 => {
					return obj.dateTime === obj2.dateTime;
			});
		});

		return uniqueResult;
  }

  getMetricData () {
    let { renderChart } = this.props;

    if (this.isStressChart()) {
      renderChart = this.getMetrixDateKey();
    }
    const metricData =  _.orderBy(renderChart, ['dateTime'], ['asc']);

    this.setState({ chartData: metricData });
  }
  isStressChart = () => {
    const { MetricId } = this.props;

    return MetricId === '00000000-0000-0000-0000-000000000024';
  }
  gradientOffset = () => {
    const { chartData } = this.state;
    const dataMax = Math.max(...chartData.map(i => i.value));
    const dataMin = Math.min(...chartData.map(i => i.value));

    if (dataMax <= 0) {
      return 0;
    }
    else if (dataMin >= 0) {
      return 1;
    }
    return dataMax / (dataMax - dataMin);
  }
  render () {
    const {  chartDATA, metricsDateRange, MetricId, addEntry, intl: { formatMessage } } = this.props;

    const chartName = chartDATA ? chartDATA.name : formatMessage({ id: 'HomeSmallChart.chartIsEmpty' });

    return (
      <CustomCard
        title={<h1>{chartName}</h1>}
      >
        {this.isStressChart()
          ? <ChartAreaBarSmall
              data={this.state.chartData}
              metricsInfo={this.getChartDATA()}
              metricsDateRange={metricsDateRange}
              metricKey={MetricId}
            />
          : <ChartAreaSmall
              offset={this.isStressChart}
              off={this.gradientOffset}
              data={this.state.chartData}
              metricsInfo={this.getChartDATA()}
              metricsDateRange={metricsDateRange}
              style={{ marginRight: -8 }}
              metricKey={MetricId}
              HomeSmallChart={true}
            />
        }
        <Button
          type="primary"
          className="weight_form_button"
          onClick={() => addEntry(MetricId)}
        >
          <span><FormattedMessage id="HomeChart.Add" /></span>
        </Button>
      </CustomCard>
    );
  }
}


const mapStateToProps = () => {
  return (state, props) => {
    const getmetricData = getMetricDataById(state, props.MetricId) ? getMetricDataById(state, props.MetricId) : [];
    const metricsDateRangeData = getMetricsDateRange(state);
    const metrics = getMetricById(state, props.MetricId) ? getMetricById(state, props.MetricId) : [];

    return {
      metricsDateRange: metricsDateRangeData,
      chartDATA: metrics,
      renderChart: getmetricData
    };
  };
};

export default connect(mapStateToProps)(injectIntl(HomeSmallChart));
