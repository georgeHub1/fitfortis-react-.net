import React, { PureComponent, Fragment } from 'react';
import {
  Area,
  ComposedChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  ReferenceArea,
  Legend,
  Dot
} from 'recharts';
import Tooltip from './Tooltip.js';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import withChartZoom from '../../hocs/withChartZoom.js';
import withChartAnnotation from '../../hocs/withChartAnnotation.js';
import { isNumOrStr } from '../../utils/chart';
import * as R from 'ramda';
import styles from './styles.module.less';
import moment from 'moment';
import _ from 'lodash';
import { injectIntl } from 'react-intl';
const defaultFormatter = value =>
  Array.isArray(value) && isNumOrStr(value[0]) && isNumOrStr(value[1])
    ? value.join(' ~ ')
    : value;

const dataKeys = [
  'leftAdditionalGoal',
  'rightAdditionalGoal',
  'leftAdditionalMetric',
  'rightAdditionalMetric',
  'leftAdditionalRangeMax',
  'leftAdditionalRangeMin',
  'rightAdditionalRangeMax',
  'rightAdditionalRangeMin'
];
const coordY1 = 240; // equal to height of chart (end of chart)
const coordY2 = 0; // starting point from the top


const CustomizedAxisTick = ({ x, y, stroke, payload, metricsDateRange, formatMessage }) => {
  let date = null;

  let dx = null;

  let dayView = null;

  let fontWeight = 600;

  const isMobile = window.innerWidth < 1280;

  if (metricsDateRange.key === 'DAY_KEY') {
    /* eslint-disable no-nested-ternary */
    // dx = isMobile ? -8 : moment(payload.value).format('h') === '1' ? -15 : -35;
    dx = (-40 / 1920) * window.innerWidth;

    if (isMobile) {
      dayView = moment(payload.value).format('h');
      date = moment(metricsDateRange.from).format('YYYY-MM-DD HH:mm') === payload.value ? null :  moment(payload.value).format('h') === '12' && moment(metricsDateRange.from).format() ? moment(payload.value).format('a') : null;
    } else if (moment(metricsDateRange.from).format('YYYY-MM-DD HH:mm') === payload.value) {
      date = null;
    } else {
      // eslint-disable-next-line no-lonely-if
      if (moment(payload.value).format('h') === '1') {
        date = moment(payload.value).format('a') === 'am' ? `(${formatMessage({id: 'MetricsChart.AM'})})1` : `(${formatMessage({id: 'MetricsChart.PM'})})1`;
      } else {
        date = moment(payload.value).format('h');
      }
      // date = moment(payload.value).format('h') === '1' ? moment(payload.value).format('(a) h') : moment(payload.value).format('h');
    }
  } else if (metricsDateRange.key === 'WEEK_KEY') {
    // dx = isMobile ? -30 : -60;
    dx = (-90 / 1920) * window.innerWidth;

    if (moment(metricsDateRange.from).format('YYYY-MM-DD') === payload.value) {
      date = null;
    } else {
      date = isMobile ? moment(payload.value).format('DD') : moment(payload.value).format('ddd (D, MMM)');
      if (isMobile) dx = (-70 / 1920) * window.innerWidth;
      if (window.innerWidth < 768) dx = (-140 / 1920) * window.innerWidth;
    }
  } else if (isMobile) {
    dx = -22;
    if (moment(metricsDateRange.from).format('YYYY-MM-DD') === payload.value) {
      date = null;
    } else {
      date = moment(payload.value).format('dd') === 'Su' ? moment(payload.value).format('DD') : null;
    }
  } else {
    if (!isMobile && (moment(payload.value).day() === 6 || moment(payload.value).day() === 0)) {
      fontWeight = 800;
    }
    dx = -27;
    date = moment(metricsDateRange.from).format('YYYY-MM-DD') === payload.value ? null : moment(payload.value).format('DD');
  }

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={14} y={0} dy={14} dx={dx} textAnchor="middle" fill="#666" style={{ fontSize: 14, fontWeight: `${fontWeight}`, height: 21}}>
          {dayView && date && <tspan textAnchor="middle" x="0">{dayView}</tspan>}
          {dayView && date && <tspan textAnchor="middle" x="0" dy="10" dx={dx}>{date}</tspan>}
          {!dayView && date ? date : null}
      </text>
    </g>
  );
};


class ChartArea extends PureComponent {
  displayName = ChartArea.name;
  static propTypes = {
    metricsDateRange: PropTypes.object,
    extremePointMap: PropTypes.object.isRequired,
    isMobileView:PropTypes.bool.isRequired,
    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
  };
  static defaultProps = {
    metricsDateRange: { from: 0, to: 0, key: 0 }
  };

  constructor (props) {
    super(props);
    this.state = {
      chartArray: [],
      yAxisValues: []
    };
  }

  // This is a reusable area chart component.
  // The data is passed as an array of {dateTime, value} objects.
  // You can also pass various other props to modify look.
  renderCusomizedLegend = ({ payload }) => {
    const fitlered = payload.filter(entry => entry.type !== 'none');

    return (
      <Fragment>
        {fitlered.sort((a, b) => a.value.localeCompare(b.value)).map((entry, i) => {
          const { type, value, color: borderColor } = entry;

          return type !== 'none' ? (
            <div
              key={`overlay-${value}-${i}`}
              onClick={() => { this.props.openNewMetric(); }}
              className={styles.legendContainer}
            >
              <span
                style={{ borderColor, backgroundColor: borderColor }}
                className={styles.legendIcon}
              />
              <span className={styles.legendLabel}>{value}</span>
            </div>
          ) : null;
        })}
      </Fragment>
    );
  };

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
                      >{`${currentNumber} ${el.units}`}</span>
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

  getUrlLinearGradient = (el, isGray, position) => {
    const cond = window.location.href;

    if (isGray) {
      if (position === 'left') {
        return `url(${cond}#leftGradientGray__${el.code})`;
      }
      if (position === 'right') {
        return `url(${cond}#rightGradientGray__${el.code})`;
      }
    }
    if (el.metricId === '00000000-0000-0000-0000-000000000004' || el.metricId === '00000000-0000-0000-0000-000000000005') {
      return `url(${cond}colorGradient__${'#ffffff'})`;
    }
    return `url(${cond}#colorGradient__${el.code})`;
  };
  createNewKeys = metricsInfo => {
    const keys = [];

    metricsInfo.map((metric, i) =>
      [...dataKeys].forEach(el => {
        const newE = {
          key: `${el}${i === 0 ? '' : i}`,
          showGoalLines: metric.hasOwnProperty(
            'showGoalLines'
            )
          ? metric.showGoalLines
          : true,
          metricId: metric.metricId,
          name: metric.name,
          units: metric.units,
          code: metric.code
        };

        keys.push(newE);
      })
    );
    return keys;
  };

  filterLabelsIndexes = (labels, metricInfo) => {
    const annotateMinEntry = metricInfo.hasOwnProperty('annotateMinEntry') ? metricInfo.annotateMinEntry : true;
    const annotateMaxEntry = metricInfo.hasOwnProperty('annotateMaxEntry') ? metricInfo.annotateMaxEntry : true;
    const annotateLastEntry = metricInfo.hasOwnProperty('annotateLastEntry') ? metricInfo.annotateLastEntry : true;
    const minArr = [...labels].filter(el => el.min && annotateMinEntry && metricInfo.code === el.code);
    const maxArr = [...labels].filter(el => el.max && annotateMaxEntry && metricInfo.code === el.code);
    const lastArr = [...labels].filter(el => el.last && annotateLastEntry && metricInfo.code === el.code);

    return [...maxArr, ...lastArr, ...minArr];
  }
  getMinMaxForChartMetric = code => {
    const { extremePointMap } = this.props;
    const { yMin, yMax } = extremePointMap[code];

    return [yMin, yMax];
  }
  isBloodPressureChartAvailable = data => {
    // console.log("data", data);
    const BloodPressureMetrics = data.filter(x => x.metricId === '00000000-0000-0000-0000-000000000004' || x.metricId === '00000000-0000-0000-0000-000000000005');

    return BloodPressureMetrics.length > 0;
  }

  componentWillMount () {
    const { metricsDateRange } = this.props;

    if (metricsDateRange.key === 'MONTH_KEY') {
      // this.setState({ chartArray: [] });
      this.getMetrixDateKey('days');
    } else if (metricsDateRange.key === 'WEEK_KEY') {
      // this.setState({ chartArray: [] });
      this.getMetrixDateKey('days');
    } else if (metricsDateRange.key === 'DAY_KEY') {
      // this.setState({ chartArray: [] });
      this.getMetrixHourKey();
    }
    this.setState({ yAxisValues: this.getYAxisDomainRange() });
  }

  componentDidUpdate (prevProps) {
    const { metricsDateRange } = this.props;

    if (prevProps.data !== this.props.data) {
      this.setState({ chartArray: [] });
    }
    if ((prevProps.metricsDateRange.key === 'MONTH_KEY') && (metricsDateRange.key === 'MONTH_KEY')) {
      // this.setState({ chartArray: [] });
      this.getMetrixDateKey('days');
    } else if ((prevProps.metricsDateRange.key === 'WEEK_KEY') && (metricsDateRange.key === 'WEEK_KEY')) {
      // this.setState({ chartArray: [] });
      this.getMetrixDateKey('days');
    } else if ((prevProps.metricsDateRange.key === 'DAY_KEY') && (metricsDateRange.key === 'DAY_KEY')) {
      // this.setState({ chartArray: [] });
      this.getMetrixHourKey();
    } else if (this.state.chartArray.length > 0) {
      this.setState({ chartArray: [] });
    }
  }

  getMetrixDateKey (key) {
    const { metricsInfo, data } = this.props;

    if (this.isBloodPressureChartAvailable(metricsInfo)) {
      const getDays = this.getDays(key);
      const dataArray = data;

      dataArray.map(item => {
        item.dateTime = moment(item.dateTime).format('YYYY-MM-DD');
        return item;
      });

      const uniqueResultOne = getDays.filter(obj => {
          return !dataArray.some(obj2 => {
              return obj.dateTime === obj2.dateTime;
          });
      });

      const uniqueResultTwo = dataArray.filter(obj => {
          return getDays.some(obj2 => {
              return obj.dateTime === obj2.dateTime;
          });
      });

      let result = uniqueResultOne.concat(uniqueResultTwo);

      const unique = result
     .map(e => e.dateTime)
     .map((e, i, final) => final.indexOf(e) === i && i)
     .filter(obj => result[obj])
     .map(e => result[e]);

      result = _.orderBy(unique, ['dateTime'], ['asc']);

      if (this.state.chartArray.length === 0) {
        this.setState({ chartArray: result });
      }
    }
  }

  getMetrixHourKey () {
    const { metricsInfo, data } = this.props;

    if (this.isBloodPressureChartAvailable(metricsInfo)) {
      const getDays = this.getHours();
      const dataArray = data;

      dataArray.map(item => {
        item.dateTime = moment(item.dateTime).format('YYYY-MM-DD HH:mm');
        return item;
      });

      const uniqueResultOne = getDays.filter(obj => {
          return !dataArray.some(obj2 => {
              return moment(obj.dateTime).format('HH') === moment(obj2.dateTime).format('HH');
          });
      });

      const uniqueResultTwo = dataArray.filter(obj => {
          return getDays.some(obj2 => {
              return moment(obj.dateTime).format('HH') === moment(obj2.dateTime).format('HH');
          });
      });

      let result = uniqueResultOne.concat(uniqueResultTwo);

      const unique = result
      .map(e => moment(e.dateTime).format('YYYY-MM-DD HH'))
      .map((e, i, final) => final.indexOf(e) === i && i)
      .filter(obj => result[obj])
      .map(e => result[e]);

      result = _.orderBy(unique, ['dateTime'], ['asc']);

      if (this.state.chartArray.length === 0) {
        this.setState({ chartArray: result });
      }
    }
  }

  getDays (key) {
    const { data } = this.props;

    const dateStart = moment(data[0].dateTime);
    const dateEnd = moment(data[data.length - 1].dateTime);
    const timeValues = [];

    // eslint-disable-next-line
    while (dateEnd >= dateStart) {
      timeValues.push({dateTime: dateStart.format('YYYY-MM-DD')});
      dateStart.add(1, key);
    }
    return timeValues;
  }

  getHours () {
    const { data } = this.props;

    const dateStart = moment(data[0].dateTime);
    const dateEnd = moment(data[data.length - 1].dateTime);
    const timeValues = [];

    // eslint-disable-next-line
    while (dateEnd >= dateStart) {
      timeValues.push({dateTime: dateStart.format('YYYY-MM-DD HH:mm')});
      dateStart.add(1, 'hour');
    }
    return timeValues;
  }

  getYAxisDomainRange () {
    const { metricsInfo } = this.props;

    if (this.isBloodPressureChartAvailable(metricsInfo)) {
      let yMin;

      let yMax;

      metricsInfo.map((item, index) => {
        if (index === 0) {
          yMin = Math.round(item.yMin);
        } else if (yMin > item.yMin) {
          yMin = Math.round(item.yMin);
        }

        if (index === 0) {
          yMax = Math.round(item.yMax);
        } else if (yMax < item.yMax) {
          yMax = Math.round(item.yMax);
        }

        if (yMax < item.defaultGoalMax) {
           yMax = Math.round(item.defaultGoalMax);
        }
        return item;
      });

      yMin -= 10;
      yMax += 10;
      const yAxisValues = [yMin];

      // eslint-disable-next-line
      while (yMax >= yMin) {
        yAxisValues.push(yMin);
        yMin += 20;
      }

      return yAxisValues;
    }
  }

  render () {
    const {
      data,
      animate,
      onMouseUp,
      metricKey,
      refAreaLeft,
      onMouseMove,
      onMouseDown,
      refAreaRight,
      getLabelsProps,
      labelsIndexes,
      backgroundColor,
      backgroundImage,
      lineLabelsIndexes,
      lineAdditionalLabelsIndexes,
      metricsDateRange,
      metricsInfo,
      mouseEventForTooltip,
      tooltipDetailsTimeline,
      getAdditinalLabelsProps,
      onMouseLeave,
      hideLegend,
      intl: { formatMessage },
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

    const keys = this.createNewKeys(metricsInfo);
    const isNotEmptyTooltipData
      = !R.isEmpty(tooltipDetailsTimeline) && tooltipDetailsTimeline.coordinate;

    const coordX = isNotEmptyTooltipData
      ? tooltipDetailsTimeline.coordinate.x
      : -10; // position of vertical line on the chart

    const { yAxisValues } = this.state;

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
          height={240}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <ComposedChart
            data={this.state.chartArray.length > 0 ? this.state.chartArray : data}
            onMouseUp={onMouseUp}
            onMouseDown={onMouseDown}
            onMouseMove={e => {
              onMouseMove(e);
              mouseEventForTooltip(e);
            }}
            onMouseLeave={() => {
              onMouseLeave();
              mouseEventForTooltip({});
            }
            }
          >
            {isNotEmptyTooltipData && (
              <line
                x={tooltipDetailsTimeline.dateTime}
                stroke="#ccc"
                fill="none"
                fillOpacity="1"
                strokeWidth="1"
                x1={coordX}
                y1={coordY1}
                x2={coordX}
                y2={coordY2}
                className={'recharts-reference-line-line'}
                style={{ strokeDasharray: '7, 4', strokeWidth: '1.2' }}
              />
            )}
            {metricsInfo.map((el, i) => (
              <defs key={`${el.name}${i}`}>
                <linearGradient
                  id={`colorGradient__${el.code}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={el.stroke} stopOpacity={1} />
                  <stop offset="95%" stopColor={el.stroke} stopOpacity={0} />
                </linearGradient>
              </defs>
            ))}
            { (this.state.chartArray.length > 0)
              && <XAxis
                key={`XAxisel.code`}
                xAxisId={`XAxisel.code`}
                dataKey={`dateTime`}
                interval={0}
                allowDataOverflow={true}
                // scale="point"
                tick={<CustomizedAxisTick metricsDateRange={metricsDateRange} formatMessage={formatMessage}/>}
              />
            }
            { (this.state.chartArray.length === 0)
              && <XAxis
                key={`XAxisel.code`}
                xAxisId={`XAxisel.code`}
                allowDataOverflow={true}
                dataKey={`dateTime`}
                style={{stroke: '#ffffff'}}
                domain={[metricsDateRange.from, metricsDateRange.to]}
                type="number"
                hide
              />
            }
            { !this.isBloodPressureChartAvailable(metricsInfo)
              && <YAxis
                key={`YAxisref`}
                allowDataOverflow={true}
                type="number"
                domain={[0, 1]}
                yAxisId={`YAxisRef`}
                hide
              />
            }
            {!this.isBloodPressureChartAvailable(metricsInfo)
              && metricsInfo.map((el, i) => (
                <YAxis
                  key={`YAxis${el.code}`}
                  allowDataOverflow={true}
                  type="number"
                  domain={this.getMinMaxForChartMetric(el.code)}
                  yAxisId={`YAxis${el.code}`}
                  hide
                />
              ))
            }
            { this.isBloodPressureChartAvailable(metricsInfo)
              && <YAxis
                key={`YAxis.code`}
                allowDataOverflow={true}
                type="number"
                tick={{fontSize: 14, fontWeight: 600}}
                domain={['dataMin - 10', 'dataMax + 10']}
                ticks={yAxisValues}
                yAxisId={`YAxis.code`}
                // hide
              />
            }
            <Tooltip
              customActive={activeTooltip}
              customPayload={tooltipData}
              customCoordinate={
                activeTooltip ? tooltipDetailsTimeline.coordinate : {}
              }
              customLabel={activeTooltip ? tooltipDetailsTimeline.dateTime : 0}
              renderTooltipContent={this.renderTooltipContent}
              labelFormatter={name => new Date(name).toLocaleString()}
              style={{ backgroundColor: '#ccc' }}
              arrayInfo={metricsInfo}
            />
            {!(isMobileView || hideLegend) && <Legend
              align="right"
              layout="vertical"
              verticalAlign="bottom"
              wrapperStyle={{
                right: '-3%',
                width: '130px'
              }}
              content={this.renderCusomizedLegend}
            />}

            {keys.map((dataKey, i) => {
              if (
                dataKey.key.includes('rightAdditionalMetric')
                || dataKey.key.includes('leftAdditionalMetric')
              ) {
                return (
                  <Line
                    xAxisId={`XAxisel.code`}
                    yAxisId={this.isBloodPressureChartAvailable(metricsInfo) ? `YAxis.code` : `YAxis${dataKey.code}`}
                    name={dataKey.name}
                    unit={dataKey.units}
                    dot={false}
                    key={dataKey.key}
                    type="stepAfter"
                    stroke="#d3d3d3"
                    legendType="none"
                    dataKey={dataKey.key}
                    activeDot={false}
                    connectNulls={true}
                    style={{ strokeWidth: '2px' }}
                    isAnimationActive={animate}
                  />
                );
              }
              if (dataKey.showGoalLines) {
                return (
                  <Line
                    yAxisId={this.isBloodPressureChartAvailable(metricsInfo) ? `YAxis.code` : `YAxis${dataKey.code}`}
                    xAxisId={`XAxisel.code`}
                    name={dataKey.name}
                    unit={dataKey.units}
                    dot={false}
                    key={dataKey.key}
                    type="stepAfter"
                    stroke="#d3d3d3"
                    legendType="none"
                    dataKey={dataKey.key}
                    label={props => dataKey.metricId !== '00000000-0000-0000-0000-000000000004' && dataKey.metricId !== '00000000-0000-0000-0000-000000000005'
                      ? getAdditinalLabelsProps({
                        ...props,
                        unit: dataKey.units,
                        stroke: '#75838b',
                        key: dataKey.key,
                        labelValue: lineAdditionalLabelsIndexes[dataKey.key],
                        i
                      }) : ''
                    }
                    activeDot={false}
                    connectNulls={true}
                    style={{ strokeDasharray: '3px 3px', strokeWidth: '2px' }}
                    isAnimationActive={animate}
                  />
                );
              }
              return null;
            })}
            {metricsInfo.map((el, i) => {
              if (
                el.hasOwnProperty('showGoalLines')
                  ? el.showGoalLines
                  : true
              ) {
                return (
                  <Line
                    key={`LineGoal${el.code}${i}`}
                    connectNulls={true}
                    yAxisId={this.isBloodPressureChartAvailable(metricsInfo) ? `YAxis.code` : `YAxis${el.code}`}
                    xAxisId={`XAxisel.code`}
                    type="stepAfter"
                    legendType="none"
                    isAnimationActive={animate}
                    label={props =>
                      getLabelsProps({
                        ...props,
                        unit: el.units,
                        stroke: el.stroke,
                        key: `goal${i === 0 ? '' : i}`,
                        labelsIndexes: lineLabelsIndexes.goalsIndexes,
                        i
                      })
                    }
                    dot={false}
                    name="Goal"
                    unit={el.units}
                    dataKey={`goal${i === 0 ? '' : i}`}
                    stroke={el.stroke}
                    activeDot={false}
                    style={{ strokeDasharray: '3px 3px', strokeWidth: '2px' }}
                  />
                );
              }
              return null;
            })}

            {metricsInfo.map((el, i) => {
              if (
                el.hasOwnProperty('showGoalLines')
                  ? el.showGoalLines
                  : true
              ) {
                return (
                  <Line
                    key={`LineMin${el.code}${i}`}
                    yAxisId={this.isBloodPressureChartAvailable(metricsInfo) ? `YAxis.code` : `YAxis${el.code}`}
                    xAxisId={`XAxisel.code`}
                    type="stepAfter"
                    dataKey={`rangeMin${i === 0 ? '' : i}`}
                    connectNulls={true}
                    legendType="none"
                    isAnimationActive={animate}
                    label={props => el.metricId !== '00000000-0000-0000-0000-000000000004' && el.metricId !== '00000000-0000-0000-0000-000000000005'
                    ? getLabelsProps({
                        ...props,
                        unit: el.units,
                        stroke: el.stroke,
                        key: `rangeMin${i === 0 ? '' : i}`,
                        labelsIndexes: lineLabelsIndexes.rangeMinIndexes,
                        changePos: metricsInfo.length > 1,
                        i
                      }) : ''
                    }
                    name="Range (min)"
                    unit={el.units}
                    stroke={el.stroke}
                    style={{ strokeDasharray: '2px 4px', strokeWidth: '2px' }}
                    dot={false}
                    activeDot={false}
                  />
                );
              }
              return null;
            })}
            {metricsInfo.map((el, i) => {
              if (
                el.hasOwnProperty('showGoalLines')
                  ? el.showGoalLines
                  : true
              ) {
                return (
                  <Line
                    key={`LineMax${el.code}${i}`}
                    yAxisId={this.isBloodPressureChartAvailable(metricsInfo) ? `YAxis.code` : `YAxis${el.code}`}
                    xAxisId={`XAxisel.code`}
                    connectNulls={true}
                    type="stepAfter"
                    dataKey={`rangeMax${i === 0 ? '' : i}`}
                    label={props =>
                      el.metricId !== '00000000-0000-0000-0000-000000000004' && el.metricId !== '00000000-0000-0000-0000-000000000005'
                      ? getLabelsProps({
                        ...props,
                        unit: el.units,
                        stroke: el.stroke,
                        key: `rangeMax${i === 0 ? '' : i}`,
                        labelsIndexes: lineLabelsIndexes.rangeMaxIndexes,
                        i
                      }) : ''
                    }
                    name="Range (max)"
                    isAnimationActive={animate}
                    unit={el.units}
                    stroke={el.stroke}
                    legendType="none"
                    style={{ strokeDasharray: '2px 4px', strokeWidth: '2px' }}
                    dot={false}
                    activeDot={false}
                  />
                );
              }
              return null;
            })}
            {metricsInfo.map((el, i) => (
              <Area
                key={`LineValue${el.code}${i}`}
                isAnimationActive={animate}
                connectNulls={true}
                type="monotone"
                yAxisId={this.isBloodPressureChartAvailable(metricsInfo) ? `YAxis.code` : `YAxis${el.code}`}
                xAxisId={`XAxisel.code`}
                name={el.name}
                unit={el.units}
                dataKey={`value${i === 0 ? '' : i}`}
                stroke={el.stroke}
                strokeWidth={2}
                dot={false}
                label={props =>
                  el.metricId !== '00000000-0000-0000-0000-000000000004' && el.metricId !== '00000000-0000-0000-0000-000000000005'
                  ? getLabelsProps({
                    ...props,
                    withLine: true,
                    unit: el.units,
                    stroke: el.stroke,
                    labelsIndexes: this.filterLabelsIndexes(labelsIndexes, el),
                    i
                  }) : ''
                }
                fillOpacity={el.areaFillOpacity}
                fill={this.getUrlLinearGradient(el, false)}
                activeDot={props => {
                  if (!props.payload || props.payload[`hidden${i === 0 ? '' : i}`]
                    || props.payload[`value${i === 0 ? '' : i}`] === null
                    || props.payload[`value${i === 0 ? '' : i}`] === undefined)
                    return false;

                  return (<Dot {...props} stroke={'white'} strokeWidth={2} r={5} />);
                }}
              />
            ))}

            {(refAreaLeft && refAreaRight) ? (
              <ReferenceArea
                yAxisId={this.isBloodPressureChartAvailable(metricsInfo) ? `YAxis.code` : `YAxis${metricsInfo[0].code}`}
                xAxisId={`XAxisel.code`}
                x1={refAreaLeft}
                x2={refAreaRight}
                strokeOpacity={0.3}
                fillOpacity={0.4}
                fill={'#000000'}
              />
            ) : null}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default withChartAnnotation(withChartZoom(injectIntl(ChartArea)));
