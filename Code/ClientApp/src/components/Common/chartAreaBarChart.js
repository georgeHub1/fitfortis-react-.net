import React, { Component, PureComponent } from 'react';
import {
	ResponsiveContainer,
	XAxis,
	YAxis,
	Bar,
	ComposedChart
} from 'recharts';
import styles from './styles.module.less';
import moment from 'moment';
import _ from 'lodash';

class CustomizedAxisTick extends PureComponent {
	render () {
		const {
			x, y, payload, startDate, endDate
		} = this.props;

		let xValue = 0;

		if (startDate.date === payload.value) {
			xValue = 20;
		}
		if (endDate.date === payload.value) {
			xValue = 0;
		}
		return (
			<g transform={`translate(${x},${y})`}>
				{(startDate.date === payload.value || endDate.date === payload.value) ? <text x={xValue} y={0} dy={4} style={{ fontSize: 8, fontWeight: 400, height: 15}} textAnchor="end" fill="#666" >{moment(payload.value).format('D MMM')}</text> : '' }
			</g>
		);
	}
  }

class ChartAreaBar extends Component {
	displayName = ChartAreaBar.name;
	constructor (props) {
		super(props);
		this.state = {
			chartData: []
		};
	}
	componentDidCatch () {
		const {data} = this.props;

		this.dayformatDataSet(data);
	}
	componentDidUpdate (prevProps) {
		if (prevProps.data !== this.props.data) {
			this.dayformatDataSet(this.props.data);
		}
	}
	getDays (startDate, endDate) {
		const dateStart = moment(startDate);
		const dateEnd = moment(endDate);
		const timeValues = [];

		// eslint-disable-next-line
		while (dateStart >= dateEnd) {
			timeValues.push({date: dateEnd.format('YYYY-MM-DD')});
			dateEnd.add(1, 'days');
		}
		return timeValues;
	}

	dayformatDataSet (data) {
		if (data && data.length) {
			const startDate = new Date();
			const endDate = new Date(startDate);

			endDate.setDate(endDate.getDate() - 14);

			const getDates = this.getDays(startDate, endDate);
			const dataArray = data;

			dataArray.filter(item => {
				item.date = moment(item.date).format('YYYY-MM-DD');
				return item;
			});

			const uniqueResultOne = getDates.filter(obj => {
				return !dataArray.some(obj2 => {
					return obj.date === obj2.date;
				});
			});

			const uniqueResultTwo = dataArray.filter(obj => {
				return getDates.some(obj2 => {
					return obj.date === obj2.date;
				});
			});

			let result = uniqueResultOne.concat(uniqueResultTwo);

			const unique = result
			.map(e => e.date)
			.map((e, i, final) => final.indexOf(e) === i && i)
			.filter(obj => result[obj])
			.map(e => result[e]);

			result = _.orderBy(unique, ['date'], ['asc']);
			this.setState({chartData: result});
			this.props.totalCases(result);
		} else {
			this.setState({chartData: []});
			this.props.totalCases([]);
		}
	}
	render () {
		const {
			backgroundColor,
			backgroundImage,
			metricKey
		} = this.props;

		const { chartData } = this.state;

		return (
			<div
				style={{
					backgroundColor,
					backgroundImage
				}}
				className={styles.WrapResponsiveContainer}
			>
				<ResponsiveContainer
					id={`ChartAreaContainer__${metricKey}`}
					width="100%"
					height={117}
				>
					<ComposedChart data={chartData}
                        margin={{top: 3, right: 20, left: 25, bottom: 5}}>
					<XAxis
						axisLine={false}
						dataKey={`date`}
						interval={0}
						allowDataOverflow={true}
						tickLine={false}
						tick={<CustomizedAxisTick startDate={chartData[0]} endDate={chartData[chartData.length - 1]} />}
					/>
                    <YAxis hide/>
                    <Bar dataKey="death" stackId="a" fill="#595959" />
                    <Bar dataKey="recovered" stackId="a" fill="#68BE68" />
                    <Bar dataKey="active" stackId="a" fill="#E54E4C" />
                    <Bar dataKey="hospitalizedCurrently" stackId="a" fill="#F2A5A5" />
                    </ComposedChart>
				</ResponsiveContainer>
			</div>
		);
	}
}

export default ChartAreaBar;
