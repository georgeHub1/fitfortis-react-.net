import React, { Component } from 'react';
import { createHomeNewEntryAsync } from '../../redux/metricsMetric.action';
import { loadMetricDataAsync, addBackEntry } from '../../redux/metricsMetric.action';
import { getChartIds } from '../../redux/metricsChart.reducer';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import moment from 'moment';
import HomeUnitStressLevelEntry from './HomeUnitStressLevelEntry';
import HomeUnitStressLevelVisualization from './HomeUnitStressLevelVisualization';

class HomeUnitStressLevel extends Component {
	static propTypes = {
		intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
	};
	constructor (props) {
		super(props);
		this.state = {
			bodyWeightValue: '',
			stressLavelLoading: false
		};
	}
	addEntry = value => {
		this.props.addBackEntry(value);
	}
	stressLavel = value => {
		const { createNewEntry } = this.props;

		this.setState({ stressLavelLoading: true });
		createNewEntry({
			Date: `${moment.utc(new Date().getTime()).format()}`,
			Value: value,
			MetricId: '00000000-0000-0000-0000-000000000024',
			comment: ''
		}
		).then(() => {
			this.props.loadMetricDataAsync('00000000-0000-0000-0000-000000000024').then(() => {
				this.setState({ stressLavelLoading: false });
			});
		});
	}
	render () {
		const { Metric, MetricData } = this.props;
		const { stressLavelLoading } = this.state;

		return (
			<div className="weight_units_row">
				{!(Metric.streeLevelChart && MetricData.loading)
					? <HomeUnitStressLevelEntry
						stressLavel={this.stressLavel}
						stressLavelLoading={stressLavelLoading}
					/>
					: <div className="weight_units_col">
						<div className="weight_initial_state">
							<HomeUnitStressLevelVisualization MetricId='00000000-0000-0000-0000-000000000024' addEntry={this.addEntry} />
						</div>
					</div>
				}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		selectedCharts: getChartIds(state),
		account: state.profile.account,
		Metric: state.metricsMetric,
		MetricData: state.metricsMetricData
	};
};

const mapDispatchToProps = dispatch => ({
	createNewEntry: bindActionCreators(createHomeNewEntryAsync, dispatch),
	addBackEntry: bindActionCreators(addBackEntry, dispatch),
	loadMetricDataAsync: bindActionCreators(loadMetricDataAsync, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(HomeUnitStressLevel));
