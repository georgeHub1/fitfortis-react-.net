import React, { Component } from 'react';
import {
	ResponsiveContainer,
	XAxis,
	YAxis,
	Cell,
	Bar,
	BarChart
} from 'recharts';
import { isNumOrStr } from '../../utils/chart';
import * as R from 'ramda';
import Tooltip from './Tooltip.js';
import classNames from 'classnames';
import emoji1Active from '../../img/emoji/emoji1_active.png';
import emoji2Active from '../../img/emoji/emoji2_active.png';
import emoji3Active from '../../img/emoji/emoji3_active.png';
import emoji4Active from '../../img/emoji/emoji4_active.png';
import emoji5Active from '../../img/emoji/emoji5_active.png';
import withChartAnnotation from '../../hocs/withChartAnnotation.js';
import withChartZoom from '../../hocs/withChartZoom.js';
import styles from './styles.module.less';
const defaultFormatter = value =>
  Array.isArray(value) && isNumOrStr(value[0]) && isNumOrStr(value[1])
    ? value.join(' ~ ')
    : value;

class MetricsUnitStressLevelVisualization extends Component {
	displayName = MetricsUnitStressLevelVisualization.name;

	get labelsIndexes () {
		const { data } = this.props;

		return [{
			isValAnnot: true,
      value: data.length > 1 ? data[data.length - 1].value : '',
      emoji: data.length > 0 ? this.getEmoji(data[data.length - 1].value) : null,
			index: `val${data.length - 1}${0}`,
			dateTime: data.length > 1 ? data[data.length - 1].dateTime : null,
			topPosition: true,
			last: true
		}];
	}
	renderTooltipContent = ({
    payload,
    separator,
    formatter,
    itemStyle,
    itemSorter,
    wrapperClassName,
    arrayInfo
  }) => {
    if (payload && payload.length) {
      const updatedTooltipContent = payload.filter(
        el => {
          if (el.dataKey !== 'value')
            return false;

          let hasValue = false;

          arrayInfo.forEach((metric, ind) => {
            if (
              (el.payload[`value${ind === 0 ? '' : ind}`] === null)
              || (el.payload[`value${ind === 0 ? '' : ind}`] === undefined)
              || (el.payload[`hidden${ind === 0 ? '' : ind}`])
            ) {
              return;
            }
            hasValue = true;
          });

          return hasValue;
        }
      );

      if (updatedTooltipContent && updatedTooltipContent.length) {
        const finalStyle = {
          borderRadius: '12px',
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 25px 0 rgba(0, 0, 0, 0.1)'
        };
        const listStyle = { padding: '8px 12px', margin: 0 };
        const wrapperCN = classNames(
          'recharts-default-tooltip',
          wrapperClassName
        );
        const items = updatedTooltipContent.sort(itemSorter).map((entry, i) => {
          const finalItemStyle = {
            display: 'block',
            paddingTop: 2,
            paddingBottom: 2,
            paddingLeft: 0,
            margin: 0,
            color: entry.color || '#000',
            ...itemStyle
          };

          const finalFormatter
            = entry.formatter || formatter || defaultFormatter;

          let { name, value } = entry;

          if (finalFormatter) {
            const formatted = finalFormatter(value, name, entry, i);

            if (Array.isArray(formatted)) {
              [value, name] = formatted;
            } else {
              value = formatted;
            }
          }
          return (
            /* eslint-disable jsx-a11y/alt-text */
            <React.Fragment key={`tooltip-item-${i}-${name}$`}>

              {arrayInfo.map((el, ind) => {
                const value = `value${ind === 0 ? '' : ind}`;
                const comment = `comment${ind === 0 ? '' : ind}`;
                const currentNumber = payload[0].payload[value];
                const currentComment = payload[0].payload[comment];

                if ((currentNumber === null) || (currentNumber === undefined))
                  return null;

                return (
                  <ul
                    key={`tooltip-item-${ind}-${el.metricId}${i}`}
                    style={finalItemStyle}
                  >
                    <li
                      className="recharts-tooltip-item"
                      style={finalItemStyle}
                    >
                      <span
                        className={`recharts-tooltip-item-name ${
                          styles.metricName
                          }`}
                      >{`${el.name}: `}</span>
                      <span
                        style={{
                          color: el.stroke
                        }}
                        className={`recharts-tooltip-item-value ${
                          styles.metricVal
                          }`}
                      >
                        {/* {`${currentNumber} ${el.units}`} */}
                        <img src={this.getEmoji(currentNumber)} style={{ height: '20px', width:'20px' }} />
                      </span>
                    </li>
                    <li
                      className="recharts-tooltip-item"
                      style={finalItemStyle}
                    >
                      <span>{currentComment}</span>
                    </li>
                  </ul>
                );
              })}
            </React.Fragment>
          );
        });

        return (
          <div className={wrapperCN} style={finalStyle}>
            <ul className="recharts-tooltip-item-list" style={listStyle}>
              {items}
            </ul>
          </div>
        );
      }
    }

    return null;
  };
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
    } return '';
  }

  getLabelsEmojiProps = ({ x, y, withLine, index, emoji, key = 'val', labelsIndexes, i, fill }) => {
    const labelIndex = labelsIndexes.findIndex(el => el.index === `${key}${index}${i}`);

    let label = {};

    if (labelsIndexes[0])
      label = labelsIndexes[labelIndex] || {};

    return <g key={`${key} ${index}`}>
      {	withLine ? <line strokeWidth={1} stroke='#dedede' x1={x} y1={y} x2={x} y2={y} /> : null }
      { withLine && label.last
          ? <g transform={`translate(${x},${y - 20})`}>
            <image xlinkHref={emoji} x={3} y={labelsIndexes[0].value >= 0 ? 2 : 22} height={15} width={15} fill={fill} />
          </g>
          : null
      }
    </g>;
  };
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
      metricsDateRange,
      metricsInfo,
      onMouseMove,
      getLabelsEmojiProps,
      mouseEventForTooltip,
      tooltipDetailsTimeline,
      labelsIndexes,
			isMobileView
    } = this.props;

		const activeTooltip = tooltipDetailsTimeline
      ? !R.isEmpty(tooltipDetailsTimeline)
      : false;
    const activeLabel = data.find(
      el => el.dateTime === tooltipDetailsTimeline.dateTime
    );
    const tooltipData = metricsInfo
      .map((el, i) => {
        const value = `value${i === 0 ? '' : i}`;

        return {
          ...el,
          data: [{ value: activeLabel ? activeLabel[value] : '' }]
        };
      })
      .filter(x => x.data[0].value !== null && x.data[0].value !== undefined && x.data[0].value !== '');

		return (
			<div
				style={{
					backgroundColor,
					backgroundImage,
					borderRadius: '0px',
					padding: '0px'
				}}
			>
				<ResponsiveContainer
					id={`ChartAreaContainer__${metricKey}`}
					width={isMobileView ? '100%' : '97%'}
					margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          height={240}
				>
					<BarChart
            data={data}
            onMouseMove={e => {
              onMouseMove(e);
              mouseEventForTooltip(e);
            }}
						margin={{
							top: data.length > 0 && data[data.length - 1].value === 200 ? 40 : 20, right: 20, left: 0, bottom: data.length > 0 && data[data.length - 1].value === -200 ? 40 : 20
						}}
					>
						<XAxis domain={[metricsDateRange.from, metricsDateRange.to + 2]} hide dataKey={`dateTime`}/>
						<YAxis domain={['auto', 'auto']} hide/>
						<Tooltip
              customActive={activeTooltip}
              customPayload={tooltipData}
              cursor={false}
              customCoordinate={
                activeTooltip ? tooltipDetailsTimeline.coordinate : {}
              }
              customLabel={activeTooltip ? tooltipDetailsTimeline.dateTime : 0}
              renderTooltipContent={this.renderTooltipContent}
              labelFormatter={name => new Date(name).toLocaleString()}
              style={{ backgroundColor: '#ccc' }}
              arrayInfo={metricsInfo}
              unitMetricsBar={true}
            />
            {metricsInfo.map((el, i) =>
            <Bar
              key={`BarValue${el.code}${i}`}
              dataKey={`value${i === 0 ? '' : i}`}
              name={el.name}
              fill={el.stroke}
              minPointSize={5}
              label={props => {
                return getLabelsEmojiProps({
                  ...props,
                  withLine: true,
                  emoji: data.length > 0 ? this.getEmoji(data[data.length - 1].value) : null,
                  value: data.length > 0 ? data[data.length - 1].value : null,
									unit: '',
                  labelsIndexes,
                  i
                });
              }}
            >
              {
                data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={this.getColor(entry.value)}/>
                ))
              }
            </Bar>)}
					</BarChart>
				</ResponsiveContainer>
			</div>
		);
	}
}

export default withChartAnnotation(withChartZoom(MetricsUnitStressLevelVisualization));
