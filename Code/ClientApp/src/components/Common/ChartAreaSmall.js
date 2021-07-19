import React, { Component } from 'react';
import {
  Area,
  ComposedChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Dot,
  Line
} from 'recharts';

import Tooltip from './Tooltip.js';
import PropTypes from 'prop-types';

import withChartAnnotation from '../../hocs/withChartAnnotation.js';

import styles from './styles.module.less';
import { isNumOrStr } from '../../utils/chart';
import classNames from 'classnames';
import _ from 'lodash';

const defaultFormatter = value =>
  Array.isArray(value) && isNumOrStr(value[0]) && isNumOrStr(value[1])
    ? value.join(' ~ ')
    : value;

class ChartAreaSmall extends Component {
  displayName = ChartAreaSmall.name;
  static propTypes = {
    metricsDateRange: PropTypes.object
  };
  static defaultProps = {
    metricsDateRange: { from: 0, to: 0, key: 0 }
  };
  constructor (props) {
    super(props);
    this.state = {
      isMobileView: (window.innerWidth <= 767)
    };
  }

  getUrlLinearGradient = (code, newEntryChart) => {
    const cond = window.location.href;

    if (newEntryChart) {
      return `url(${cond}colorGradient__${'#ffffff'})`;
    }
    return `url(${cond}#colorGradient__${code}1)`;
  };

  componentWillMount () {
    window.addEventListener('resize', this.resizeEvent);
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.resizeEvent);
  }

  resizeEvent = e => {
    if (window.innerWidth > 767) {
      this.setState({
        ...this.state,
        isMobileView: false
      });
    } else {
      this.setState({
        ...this.state,
        isMobileView: true
      });
    }
  }
  get labelsIndexes () {
		let { data } = this.props;

     data =  _.orderBy(data, ['dateTime'], ['asc']);

		return [{
			isValAnnot: true,
			value: data.length > 1 ? data[data.length - 1].value : '',
			index: `val${data.length - 1}${0}`,
			dateTime: data.length > 1 ? data[data.length - 1].dateTime : null,
			topPosition: true,
			last: true,
			code: data.length > 1 ? data[data.length - 1].id : ''
		}];
  }

  renderTooltipContent = ({
    payload,
    separator,
    formatter,
    itemStyle,
    itemSorter,
    wrapperClassName,
    offsetValue,
    arrayInfo
  }) => {
    if (payload && payload.length) {
      //  check if need to render tooltip - if model (payload) with dataKey value{index} has value
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
            paddingTop: 4,
            paddingBottom: 4,
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
            <React.Fragment key={`tooltip-item-${i}-${name}$`}>
              {arrayInfo.map((el, ind) => {
                const value = `value${ind === 0 ? '' : ind}`;
                const currentNumber = offsetValue ? payload[0].payload[value] + 350 : payload[0].payload[value];

                if ((currentNumber === null) || (currentNumber === undefined))
                  return null;

                return (
                  <li
                    className="recharts-tooltip-item"
                    key={`tooltip-item-${ind}-${el.name}${i}`}
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
                    >{`${currentNumber} ${el.units}`}</span>
                  </li>
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
  getMetricData () {
    let { data } = this.props;

    if (this.props.HomeSmallChart) {
      data.sort((a, b) => a.dateTime - b.dateTime);
      if (data.length > 0) {
        const data1 = data[0];
        // const data2 = data[data.length - 1];

        data.push({
          dateTime: data1.dateTime,
          value: data1.value,
          metricId: data1.metricId,
          id: data1.id,
          userId: data1.userId,
          leftAdditionalMetric: data1.value
        });
        data.push({
          dateTime: data1.dateTime - 31536000000,
          metricId: data1.metricId,
          id: data1.id,
          userId: data1.userId,
          leftAdditionalMetric: data1.value
        });
        data =  _.orderBy(data, ['dateTime'], ['asc']);
      }
    }
    return data;
  }
  getMinMaxForChartMetric = code => {
    const { extremePointMap, newEntryChart, HomeSmallChart} = this.props;

    if (newEntryChart) {
      return ['auto', 'auto'];
    }
    if (HomeSmallChart) {
      return ['auto', 'auto'];
    }
    const { yMin, yMax } = extremePointMap[code];

    return [yMin, yMax];
}
  render () {
    const {
      animate,
      backgroundColor,
      HomeSmallChart,
      backgroundImage,
      metricsInfo,
      getLabelsProps,
      metricKey,
      newEntryChart,
      metricsDateRange
    } = this.props;
    const data = this.getMetricData();

    return (
      /* eslint-disable no-nested-ternary */
      <div
        style={{
          backgroundColor,
          backgroundImage
        }}
        className={styles.WrapResponsiveContainer}
      >
        <ResponsiveContainer
          id={HomeSmallChart ? `ChartAreaContainer__${metricKey}` : `ChartAreaContainer__ChartAreaSmall`}
          width="100%"
          height={HomeSmallChart ? 70 : 120}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <ComposedChart
            data={data}
            syncId={'2'}
            margin={{ top: 20, right: 25, left: 5, bottom: 0 }}
          >
            {metricsInfo.map((el, i) => (
              <defs key={`${el.name}${i}`}>
                <linearGradient
                  id={`colorGradient__${el.code}1`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset={'5%'} stopColor={el.stroke || el.defaultStroke} stopOpacity={1} />
                  <stop offset={'95%'} stopColor={el.stroke || el.defaultStroke} stopOpacity={0} />
                </linearGradient>
              </defs>
            ))}
            {!HomeSmallChart
            && <Tooltip
              smallChart={true}
              renderTooltipContent={this.renderTooltipContent}
              labelFormatter={name => new Date(name).toLocaleString()}
              style={{ backgroundColor: '#ccc' }}
              arrayInfo={metricsInfo}
            />
            }
            <XAxis
              key={`XAxis${1}`}
              xAxisId={`XAxis${1}`}
              allowDataOverflow={true}
              dataKey={`dateTime`}
              domain={[metricsDateRange.from, metricsDateRange.to + 2]}
              type="number"
              hide
            />
            {metricsInfo.map((el, i) => (
              <YAxis
                key={`YAxis${el.code}`}
                allowDataOverflow={true}
                type="number"
                domain={this.getMinMaxForChartMetric(el.code)}
                yAxisId={`YAxis${el.code}`}
                hide
              />
            ))}

            {metricsInfo.map((el, i) => (
              <Area
                key={`LineValue${el.code}${i}`}
                isAnimationActive={animate}
                connectNulls={true}
                type="monotone"
                yAxisId={`YAxis${el.code}`}
                xAxisId={`XAxis${1}`}
                name={el.name}
                unit={el.units}
                dataKey={`value${i === 0 ? '' : i}`}
                stroke={el.stroke || el.defaultStroke}
                strokeWidth={2}
                dot={false}
                fillOpacity={el.areaFillOpacity}
                fill={this.getUrlLinearGradient(el.code, newEntryChart, false)}
                activeDot={props => {
                  if (!props.payload || props.payload[`hidden${i === 0 ? '' : i}`]
                    || props.payload[`value${i === 0 ? '' : i}`] === null
                    || props.payload[`value${i === 0 ? '' : i}`] === undefined)
                    return null;
                  return (<Dot {...props} stroke={'white'} strokeWidth={2} r={5} />);
                }}
                label={props => {
                  return HomeSmallChart ? getLabelsProps({
                    ...props,
                    withLine: true,
                    value: HomeSmallChart && data.length > 0 ? data[data.length - 1].value : null,
                    unit: el.units,
                    stroke: el.stroke || el.defaultStroke,
                    labelsIndexes: this.labelsIndexes,
                    i
                  }) : '';
                }}
              />
            ))}
            {metricsInfo.map((el, i) =>
              (
                <Line
                  xAxisId={`XAxis${1}`}
                  yAxisId={`YAxis${el.code}`}
                  name={el.name}
                  unit={el.units}
                  dot={false}
                  key={`rightAdditionalMetric${el.code}`}
                  type="stepAfter"
                  stroke="#d3d3d3"
                  legendType="none"
                  dataKey={`rightAdditionalMetric${i === 0 ? '' : i}`}
                  activeDot={false}
                  connectNulls={true}
                  style={{ strokeWidth: '2px' }}
                  isAnimationActive={animate}
                />
              ))
            }
            {metricsInfo.map((el, i) =>
              <Line
                xAxisId={`XAxis${1}`}
                yAxisId={`YAxis${el.code}`}
                name={el.name}
                unit={el.units}
                dot={false}
                key={`leftAdditionalMetric${el.code}`}
                type="stepAfter"
                stroke="#d3d3d3"
                legendType="none"
                dataKey={`leftAdditionalMetric${i === 0 ? '' : i}`}
                activeDot={false}
                connectNulls={true}
                style={{ strokeWidth: '2px' }}
                isAnimationActive={animate}
              />)
            }
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default withChartAnnotation(ChartAreaSmall);
