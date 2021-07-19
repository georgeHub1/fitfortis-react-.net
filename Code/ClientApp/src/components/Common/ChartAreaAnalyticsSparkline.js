import PropTypes from 'prop-types';
import { Statistic } from 'antd';
import React, { PureComponent } from 'react';
import styles from './styles.module.less';
import withChartAnnotation from '../../hocs/withChartAnnotation.js';
import {
	Area,
	ResponsiveContainer,
	ComposedChart,
	XAxis,
	YAxis,
	linearGradient,
	defs,
	stop,
	Line,
	Dot
} from 'recharts';
import Tooltip from './Tooltip.js';

class ChartAreaAnalyticsSparkline extends PureComponent {
	static propTypes = {
		data: PropTypes.array.isRequired,
		metricKey: PropTypes.string.isRequired
	};
	state = {
		metricValue: this.props.latestValue,
		coordinate: null,
		activeLabel: null,
		customActive: false
	}

	renderTooltip (e) {
		if (e.payload.length > 0 && e.payload[0].payload.value) {
			this.setState({ metricValue: (e.payload[0].payload.value) });
		}
		return '';
	}
	onMouseMove = data => {
		if (data.isTooltipActive) {
			const { activeLabel, activeCoordinate } = data;

			this.setState({ customActive: true, coordinate: activeCoordinate, activeLabel });
		} else {
			this.setState({ customActive: false, coordinate: null, activeLabel: null });
		}
	}

	render () {
		const {
			data,
			metricKey,
			metricName,
			metricsDateRange
		} = this.props;
		const { metricValue, coordinate, activeLabel, customActive } = this.state;

		data.sort((a, b) => a.dateTime - b.dateTime);

		return (
			<div className={styles.chartItem} >
				<Statistic title={metricName} value={metricValue} />
				<div className={styles.chartContainer}>
					<ResponsiveContainer
						id={`ChartAreaContainer__${metricKey}`}
						width="100%"
						height={93}
						margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
					>
						<ComposedChart
							data={data}
							onMouseMove={this.onMouseMove}
							margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
						>
							<defs>
								<linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor="#8884d8" stopOpacity={1}/>
									<stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
								</linearGradient>
							</defs>
							<Tooltip
								customActive={customActive}
								customPayload={[]}
								customCoordinate={activeLabel ? coordinate : {}}
								customLabel={activeLabel ? activeLabel : 0}
								renderTooltipContent={e => this.renderTooltip(e)}
								labelFormatter={name => new Date(name).toLocaleString()}
								style={{ backgroundColor: '#ccc' }}
								arrayInfo={data}
								dateXVAlue={true}
							/>
							<XAxis
								key={`XAxis${1}`}
								xAxisId={`XAxis${1}`}
								allowDataOverflow={true}
								dataKey={`dateTime`}
								domain={[metricsDateRange.from, metricsDateRange.to + 2]}
								type="number"
								hide
							/>
							<YAxis
								key={`YAxis${data[0].analyticId}`}
								allowDataOverflow={true}
								type="number"
								domain={['auto', 'auto']}
								yAxisId={`YAxis${data[0].analyticId}`}
								hide
							/>
							<Line
								xAxisId={`XAxis${1}`}
								yAxisId={`YAxis${data[0].analyticId}`}
								name={''}
								unit={''}
								dot={false}
								key={`rightAdditionalMetric`}
								type="stepAfter"
								stroke="#d3d3d3"
								legendType="none"
								dataKey={`rightAdditionalMetric`}
								activeDot={false}
								connectNulls={true}
								style={{ strokeWidth: '2px' }}
								isAnimationActive={true}
							/>
							<Line
								xAxisId={`XAxis${1}`}
								yAxisId={`YAxis${data[0].analyticId}`}
								name={''}
								unit={''}
								dot={false}
								key={`leftAdditionalMetric`}
								type="stepAfter"
								stroke="#d3d3d3"
								legendType="none"
								dataKey={`leftAdditionalMetric`}
								activeDot={false}
								connectNulls={true}
								style={{ strokeWidth: '2px' }}
								isAnimationActive={true}
							/>
							<Area
								isAnimationActive={true}
								connectNulls={true}
								type="monotone"
								xAxisId={`XAxis${1}`}
								yAxisId={`YAxis${data[0].analyticId}`}
								name={''}
								unit={''}
								dataKey={`value`}
								stroke={'#8884d8'}
								strokeWidth={2}
								dot={false}
								fillOpacity={0.2}
								fill={'url(#colorUv)'}
								activeDot={props => {
									if (!props.payload || props.payload.hidden
										|| props.payload.value === null
										|| props.payload.value === undefined)
										return null;
									return (<Dot {...props} stroke={'white'} strokeWidth={2} r={5} />);
								}}
							/>
						</ComposedChart>
					</ResponsiveContainer>
				</div>
			</div>
		);
	}
}

export default withChartAnnotation(ChartAreaAnalyticsSparkline);
