import React, { PureComponent } from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { getMetricDataById } from '../../redux/metricsMetricData.reducer';
import { getMetricById } from '../../redux/metricsMetric.reducer';
import { getMetricsDateRange } from  '../../redux/metricsDateRange.reducer';
import { connect } from 'react-redux';
import CustomCard from '../Common/CustomCard.js';
// import ChartAreaSmall from '../Common/ChartAreaSmall.js';
import ChartAreaBarSmall from '../Common/ChartAreaBarSmall.js';
import moment from 'moment';
import _ from 'lodash';
import analyticId from '../../utils/AnalyticsAndAbTests.tsx';

export class HomeUnitStressLevelVisualization extends PureComponent {
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

    renderChart = this.getMetrixDateKey();
    const metricData =  _.orderBy(renderChart, ['dateTime'], ['asc']);

    this.setState({ chartData: metricData });
  }
  render () {
    const {  chartDATA, metricsDateRange, MetricId, addEntry, intl: { formatMessage } } = this.props;

    const chartName = chartDATA.name ? chartDATA.name : formatMessage({ id: 'HomeUnitStressLevelVisualization.StressLevel' });

    return (
      <CustomCard
        title={<h1>{chartName}</h1>}
      >
        <ChartAreaBarSmall
					data={this.state.chartData}
					metricsInfo={this.getChartDATA()}
					metricsDateRange={metricsDateRange}
					metricKey={MetricId}
        />
        <Button
          type="primary"
          className="weight_form_button"
          onClick={() => {
            addEntry(MetricId);
            analyticId.firebaseAnalyticsLog('Home_UnitPsychologicalStress_ClickToAddValue');
          }}
        >
          <span><FormattedMessage id="HomeUnitStressLevelVisualization.Add" /></span>
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

export default connect(mapStateToProps)(injectIntl(HomeUnitStressLevelVisualization));
