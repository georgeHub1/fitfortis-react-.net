import React, { Component } from 'react';
import { createHomeNewEntryAsync } from '../../redux/metricsMetric.action';
import { loadMetricDataAsync, addBackEntry } from '../../redux/metricsMetric.action';
import { getChartIds } from '../../redux/metricsChart.reducer';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import moment from 'moment';
import HomeUnitPulseVisualization from './HomeUnitPulseVisualization';
import HomeUnitPulseEntry from './HomeUnitPulseEntry';
import { getSelectedMetricsId } from '../../redux/metricsChart.reducer';

class HomeUnitPulse extends Component {
	static propTypes = {
		intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
	};
	constructor (props) {
		super(props);
		this.state = {
			pulseValue: '',
			PulseChart: false,
			PulseLoading: false
		};
	}
	handleChangePulse = value => {
		this.setState({ pulseValue: value });
	}
	handleNewPulseMetric = () => {
		if (this.state.pulseValue) {
			const { createNewEntry } = this.props;

			this.setState({ PulseLoading: true });
			createNewEntry({
				Date: `${moment.utc(new Date().getTime()).format()}`,
				Value: this.state.pulseValue,
				MetricId: '00000000-0000-0000-0000-000000000010',
				comment: ''
			}
			).then(() => {
				this.props.loadMetricDataAsync('00000000-0000-0000-0000-000000000010').then(() => {
					this.setState({ pulseValue: '', PulseChart: true, PulseLoading: false });
				});
			});
		}
	}
	addEntry = value => {
		this.props.addBackEntry(value);
	}
	render () {
		const { Metric, MetricData, data } = this.props;
		const { pulseValue } = this.state;

		return (
			<div className="weight_units_row">
				{!(Metric.pulseChart && MetricData.loading)
					? <HomeUnitPulseEntry
						data={data}
						handleChange={this.handleChangePulse}
						handleNewPulseMetric={this.handleNewPulseMetric}
						pulseValue={pulseValue}
						PulseLoading={this.state.PulseLoading}
					/>
					: <div className="weight_units_col heartrate_col">
						<div className="weight_initial_state">
							<HomeUnitPulseVisualization MetricId='00000000-0000-0000-0000-000000000010' data={data} addEntry={this.addEntry} />
						</div>
					</div>
				}
			</div>
		);
	}
}

const mapStateToProps = state => {
	const selectedMetricId = getSelectedMetricsId(state);

	let data = null;

	selectedMetricId.forEach(el => {
		if (el.metircId === '00000000-0000-0000-0000-000000000010') {
			data = el;
		}
	});

	return {
		selectedCharts: getChartIds(state),
		account: state.profile.account,
		Metric: state.metricsMetric,
		data,
		MetricData: state.metricsMetricData
	};
};

const mapDispatchToProps = dispatch => ({
	createNewEntry: bindActionCreators(createHomeNewEntryAsync, dispatch),
	addBackEntry: bindActionCreators(addBackEntry, dispatch),
	loadMetricDataAsync: bindActionCreators(loadMetricDataAsync, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(HomeUnitPulse));
