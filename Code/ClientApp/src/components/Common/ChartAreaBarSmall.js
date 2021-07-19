import React, { Component } from 'react';
import {
	ResponsiveContainer,
	XAxis,
	YAxis,
	Cell,
	Bar,
	BarChart
} from 'recharts';
import emoji1Active from '../../img/emoji/emoji1_active.png';
import emoji2Active from '../../img/emoji/emoji2_active.png';
import emoji3Active from '../../img/emoji/emoji3_active.png';
import emoji4Active from '../../img/emoji/emoji4_active.png';
import emoji5Active from '../../img/emoji/emoji5_active.png';
import withChartAnnotation from '../../hocs/withChartAnnotation.js';
import styles from './styles.module.less';
import _ from 'lodash';

class ChartAreaBarSmall extends Component {
	displayName = ChartAreaBarSmall.name;

	get labelsIndexes () {
		let { data } = this.props;

     data =  _.orderBy(data, ['dateTime'], ['asc']);

		return [{
			isValAnnot: true,
			value: data.length > 1 ? data[data.length - 1].value : '',
			index: `val${data.length - 1}${0}`,
			dateTime: data.length > 1 ? data[data.length - 1].dateTime : null,
			topPosition: true,
			last: true
		}];
  }
  getEmoji (value) {
	if (value === 0) {
		return emoji3Active;
	} else if (value === 200) {
		return emoji1Active;
	} else if (value === 100) {
		return emoji2Active;
	} else if (value === -200) {
		return emoji5Active;
	} else if (value === -100) {
		return emoji4Active;
	}
  }
	getLabelsEmojiProps = ({ x, y, withLine, index, width, emoji, key = 'val', labelsIndexes, i, fill }) => {
		const labelIndex = labelsIndexes.findIndex(el => el.index === `${key}${index}${i}`);

		let label = {};

		if (labelsIndexes[0])
			label = labelsIndexes[labelIndex] || {};

		return <g key={`${key} ${index}`}>
			{	withLine ? <line strokeWidth={1} stroke='#dedede' x1={x} y1={y} x2={x} y2={y} /> : null }
			{ withLine && label.last
				? <g transform={`translate(${x},${y - 20})`} >
					<image xlinkHref={emoji} x={-3} y={labelsIndexes[0].value >= 0 ? 2 : 22} height={15} width={15} fill={fill} />
				</g>
				: null
			}
		</g>;
	}

	getColor (value) {
		if (value === 0) {
			return '#000000';
		} else if (value === 200) {
			return '#07B707';
		} else if (value === 100) {
			return '#68BE68';
		} else if (value === -200) {
			return '#E54D4C';
		} else if (value === -100) {
			return '#E5934C';
		} return '#1f77b4';
	}
	render () {
		const {
			data,
			backgroundColor,
			backgroundImage,
			metricKey,
			getLabelsEmojiProps,
			newEntryChart,
			metricsDateRange
		} = this.props;

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
					height={newEntryChart ? 120 : 70}
				>
					<BarChart
						data={data}
						margin={{
							top: !newEntryChart && data.length > 0 && data[data.length - 1].value === 200 ? 20 : 5, right: 10, left: 0, bottom: !newEntryChart && data.length > 0 && data[data.length - 1].value === -200 ? 20 : 5
						}}
					>
						<XAxis domain={[metricsDateRange.from, metricsDateRange.to + 2]} hide/>
						<YAxis domain={['auto', 'auto']} hide/>
						<Bar
							dataKey="value"
							fill="#8884d8"
							minPointSize={5}
							label={props => !newEntryChart
								? getLabelsEmojiProps({
									...props,
									withLine: true,
									value: data.length > 0 ? data[data.length - 1].value : null,
									unit: '',
									emoji: data.length > 0 ? this.getEmoji(data[data.length - 1].value) : null,
									labelsIndexes: this.labelsIndexes,
									smallChart: true,
									i: 0
								}) : ''
							}
						>
							{
								data.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={this.getColor(entry.value)}/>
								))
							}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</div>
		);
	}
}

export default withChartAnnotation(ChartAreaBarSmall);
