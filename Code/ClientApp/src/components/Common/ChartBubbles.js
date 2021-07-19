import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  ResponsiveContainer,
  ReferenceArea,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
  Legend,
  ReferenceLine
} from 'recharts';

import Tooltip from './Tooltip.js';
import classNames from 'classnames';

import { CUSTOM_KEY } from '../../constants/metrics.js';

import styles from './styles.module.less';
import { getPotentialPoint } from '../../utils/chart.js';

export class ChartBubbles extends PureComponent {
  displayName = ChartBubbles.name;

  static propTypes = {
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    metricsDateRange: PropTypes.object,
    height: PropTypes.number,
    yAxisDataKey: PropTypes.string,
    legendProps: PropTypes.object,
    scatterProps: PropTypes.array,
    availableDateTimes: PropTypes.array,
    tooltipDetails: PropTypes.object
  };
  static defaultProps = {
    width: '100%',
    height: 140,
    yAxisDataKey: 'value',
    legendProps: {},
    scatterProps: [],
    metricsDateRange: {},
    tooltipDetails: {}
  };

  constructor (props) {
    super(props);
    this.state = { refAreaLeft: null, refAreaRight: null };
  }
  // This is a reusable bubble chart component.
  // The data is passed as an array of {dateTime, value} objects.
  // You can also pass various other props to modify look.
  get defaultDomainSize () {
    // CUSTOMIZATION: The 1st number (e.g. 4) determines the size of the filler gray gots in the TIMELINE chart.
    return this.props.scatterProps[0]
      && this.props.scatterProps[0].data.length < 100
      ? 4
      : 1;
  }

  renderTooltipContent = ({
    payload,
    separator,
    formatter,
    itemStyle,
    itemSorter,
    labelClassName,
    labelFormatter,
    translateX,
    wrapperClassName
  }) => {
    const { scatterProps, labResultsTitle, doctorVisitsTitle, measurementsTitle } = this.props;

    if (payload && payload.length) {
      const data = [
        ...scatterProps[1].data.map(el => {
          el.name = labResultsTitle;
          el.color = '#7EA5DA';

          return el;
        }),
        ...scatterProps[2].data.map(el => {
          el.name = doctorVisitsTitle;
          el.color = '#5880B6';

          return el;
        }),
        ...scatterProps[3].data.map(el => {
          el.name = measurementsTitle;
          el.color = '#335889';

          return el;
        })
      ];
      const contentVal = data.filter(
        el => el.dateTime === payload[0].payload.dateTime
      );
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

      const items = contentVal.map((el, i) => {
        const finalItemStyle = {
          display: 'block',
          paddingTop: 2,
          paddingBottom: 2,
          paddingLeft: 0,
          margin: 0,
          color: el.color || '#000',
          ...itemStyle
        };

        return (
          <ul
            key={`tooltip-item-${i}`}
            style={finalItemStyle}
          >
            <li
              className="recharts-tooltip-item"
              style={finalItemStyle}
            >
              <span
                className={`recharts-tooltip-item-name ${styles.metricName}`}
              >{`${el.name}: `}</span>
              <span
                style={{ color: el.color }}
                className={`recharts-tooltip-item-value ${styles.metricVal}`}
              >
                {el.value}
              </span>
            </li>
            <li
              className="recharts-tooltip-item"
              style={finalItemStyle}
            >
              <span>
                {el.comment}
              </span>
            </li>
          </ul>
        );
      });

      return (
        <div>
          <div className={wrapperCN} style={finalStyle}>
            <ul className="recharts-tooltip-item-list" style={listStyle}>
              {items}
            </ul>
          </div>
        </div>
      );
    }

    return null;
  };

  zoom = () => {
    const { setMetricsDateRange } = this.props;
    const refAreaLeft = this.state.refAreaLeft;
    const refAreaRight = this.state.refAreaRight;

    if (refAreaLeft && refAreaRight && refAreaLeft !== refAreaRight) {
      if (refAreaRight > refAreaLeft) {
        this.setState(
          { refAreaLeft: null, refAreaRight: null },
          () => {
            setMetricsDateRange({
              from: refAreaLeft,
              to: refAreaRight,
              key: CUSTOM_KEY
            });
          });
      } else {
        this.setState(
          { refAreaLeft: null, refAreaRight: null }
          ,
          () => {
            setMetricsDateRange({
              from: refAreaRight,
              to: refAreaLeft,
              key: CUSTOM_KEY
            }
            );
          }
        );
      }
    } else {
      this.setState({ refAreaLeft: null, refAreaRight: null });
    }
  };
  get tooltipData () {
    const { scatterProps, tooltipDetails } = this.props;
    const data = [...scatterProps]
      .filter(el => el.name)
      .map(el => {
        const newObj = {
          data: el.data.filter(
            i => i.dateTime === tooltipDetails.activeLabel
            ),
          name: el.name
        };

        if (newObj.data.length) return newObj;
        return null;
      })
      .filter(Boolean);

    return data;
  }
  onMouseMove = e => {
    if (!this.state.refAreaLeft || !e)
      return;
    const rightPoint = getPotentialPoint(this.props.availableDateTimes, e.xValue.getTime());

    this.setState({ refAreaRight: rightPoint });
  }
  onMouseLeave = () => {
    this.setState({ refAreaLeft: null, refAreaRight: null });
  }
  onMouseDown = e => {
    if (!e || !this.props.availableDateTimes.length)
      return;

    const point = getPotentialPoint(this.props.availableDateTimes, e.xValue.getTime());

    this.setState({ refAreaLeft: point });
  }
  render () {
    const { refAreaLeft, refAreaRight } = this.state;
    const {
      scatterProps,
      width,
      height,
      metricsDateRange,
      yAxisDataKey,
      legendProps,
      backgroundColor,
      backgroundImage,
      stroke,
      tooltipDetails,
      mouseEventForTooltip,
      isMobileView
    } = this.props;

    return (
      <div
        style={{
          marginTop: '20px',
          backgroundColor,
          backgroundImage,
          borderRadius: '0px',
          padding: '0px'
        }}
      >
        <ResponsiveContainer
          width={width}
          height={height}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <ScatterChart
            onMouseDown={this.onMouseDown}
            onMouseMove={this.onMouseMove}
            onMouseUp={this.zoom}
            onMouseLeave={this.onMouseLeave}
          >
            <XAxis
              dataKey="dateTime"
              domain={[metricsDateRange.from, metricsDateRange.to]}
              scale="time"
              type="number"
              hide
            />
            <YAxis dataKey={yAxisDataKey} range={[0, 4]} type="number" hide />
            <ZAxis
              zAxisId={1}
              dataKey="value"
              type="number"
              range={[150, 800]}
              hide
            />
            <ZAxis
              zAxisId={2}
              dataKey="val"
              type="number"
              range={[this.defaultDomainSize, 350]}
              hide
            />
            <Tooltip
              customActive={
                tooltipDetails ? tooltipDetails.isTooltipActive : false
              }
              customPayload={this.tooltipData}
              customCoordinate={
                tooltipDetails ? tooltipDetails.activeCoordinate : {}
              }
              customLabel={tooltipDetails ? tooltipDetails.activeLabel : 0}
              renderTooltipContent={this.renderTooltipContent}
              labelFormatter={name => new Date(name).toLocaleString()}
              style={{ backgroundColor: '#ccc' }}
              stroke={stroke}
              dataLabelsStyles={{ bottom: '-15px' }}
            />
            {!isMobileView && (<Legend {...legendProps} />)}
            <ReferenceLine
              x={tooltipDetails.activeLabel}
              stroke="#ccc"
              style={{ strokeDasharray: '7, 4', strokeWidth: 1.2 }}
            />
            {scatterProps.map((scatterProp, i) => (
              <Scatter
                isAnimationActive
                key={i}
                activeShape={() => <div>text</div>}
                data={scatterProp.data}
                name={scatterProp.name}
                {...scatterProp.additionProps}
                zAxisId={scatterProp.zAxisId}
                fill={scatterProp.fill}
                onMouseMove={e => {
                  const obj = {
                    dateTime: e.dateTime,
                    coordinate: e.tooltipPosition
                  };

                  mouseEventForTooltip(obj);
                }}
                onMouseOver={e => mouseEventForTooltip(e, this.props)}
                onMouseLeave={() => mouseEventForTooltip({})}
              />
            ))}
            {refAreaLeft && refAreaRight ? (
              <ReferenceArea
                x1={refAreaLeft}
                x2={refAreaRight}
                strokeOpacity={0.3}
                fillOpacity={0.4}
                fill={'#000000'}
              />
            ) : null}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
