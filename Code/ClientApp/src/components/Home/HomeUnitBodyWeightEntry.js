import React, { Component } from 'react';
import { Button, Input, Icon } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { getMetricById } from '../../redux/metricsMetric.reducer';
import { createGetMetricDataByChartIdSelector } from '../../redux/metricsMetricData.selector';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import analyticId from '../../utils/AnalyticsAndAbTests.tsx';

const pattern = new RegExp(/^(-{0,1})(\d{1,})(\.\d{0,})*$/);

class HomeUnitBodyWeightEntry extends Component {
	static propTypes = {
		handleNewWiedghtMetric: PropTypes.func.isRequired,
		intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
	};
	render () {
		const {
			intl: { formatMessage },
			handleNewWiedghtMetric,
			bodyWeightValue,
			handleChange,
			chartDATA,
			bodyWeightLoading
		} = this.props;

		return (
			<div className="weight_units_col">
				<div className="weight_initial_state">
					<h4 style={{ color: chartDATA.stroke || chartDATA.defaultStroke}}><FormattedMessage id="HomeUnitBodyWeightEntry.bodyWeightTitle" /></h4>
					<div className="weight_form">
						<Input style={{ color: chartDATA.stroke || chartDATA.defaultStroke}} type="number" onChange={e => handleChange(e.target.value)} suffix={formatMessage({ id: 'HomeUnitBodyWeightEntry.BodyWeightLang' })} value={bodyWeightValue} />
						<Button
							type="primary"
							style={{ backgroundColor: chartDATA.stroke || chartDATA.defaultStroke, borderColor: chartDATA.stroke || chartDATA.defaultStroke }}
							onClick={() => {
								handleNewWiedghtMetric();
								analyticId.firebaseAnalyticsLog('Home_UnitBodyWeight_ClickSave', {valueBodyWeight: bodyWeightValue});
							}}
							className="weight_form_button"
							disabled={!pattern.test(bodyWeightValue) ? !pattern.test(bodyWeightValue) : ''}
						>
							{
								bodyWeightLoading
									? <Icon type="loading" />
									: <span><FormattedMessage id="HomeUnitBodyWeightEntry.Save" /></span>
							}
						</Button>
					</div>
				</div>
			</div>
		);
	}
}
const mapStateToProps	 = () => {
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
		const metrics = getMetricById(state, props.MetricId) ? getMetricById(state, props.MetricId) : [];

		return {
			chartDATA: chartId ? chartPoint : metrics
		};
	};
};

export default connect(mapStateToProps)(injectIntl(HomeUnitBodyWeightEntry));
