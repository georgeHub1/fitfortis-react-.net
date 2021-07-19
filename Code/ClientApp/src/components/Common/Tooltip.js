/**
 * @fileOverview Tooltip
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translateStyle } from 'react-smooth';
import * as R from 'ramda';
import classNames from 'classnames';

import { isNumber, isSsr } from '../../utils/chart.js';
import moment from 'moment';
import styles from './styles.module.less';

const CLS_PREFIX = 'recharts-tooltip-wrapper';

const EPS = 1;

const defaultUniqBy = entry => entry.dataKey;
const getUniqPaylod = (option, payload) => {
  if (option === true) {
    return R.uniqBy(payload, defaultUniqBy);
  }

  if (option instanceof Function) {
    return R.uniqBy(payload, option);
  }

  return payload;
};

const propTypes = {
  content: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  viewBox: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number
  }),

  active: PropTypes.bool,
  separator: PropTypes.string,
  formatter: PropTypes.func,
  offset: PropTypes.number,

  itemStyle: PropTypes.object,
  labelStyle: PropTypes.object,
  wrapperStyle: PropTypes.object,
  contentStyle: PropTypes.object,
  cursor: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.element,
    PropTypes.object
  ]),

  coordinate: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  }),
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  }),

  label: PropTypes.any,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.any,
      value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.array
      ]),
      unit: PropTypes.any
    })
  ),
  paylodUniqBy: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),

  isAnimationActive: PropTypes.bool,
  animationDuration: PropTypes.number,
  animationEasing: PropTypes.oneOf([
    'ease',
    'ease-in',
    'ease-out',
    'ease-in-out',
    'linear'
  ]),
  itemSorter: PropTypes.func,
  filterNull: PropTypes.bool,
  useTranslate3d: PropTypes.bool
};

const defaultProps = {
  active: false,
  offset: 10,
  viewBox: { x1: 0, x2: 0, y1: 0, y2: 0 },
  coordinate: { x: 0, y: 0 },
  cursorStyle: {},
  separator: ' : ',
  wrapperStyle: {},
  contentStyle: {},
  itemStyle: {},
  labelStyle: {},
  cursor: true,
  isAnimationActive: !isSsr(),
  animationEasing: 'ease',
  animationDuration: 400,
  itemSorter: () => -1,
  filterNull: true,
  useTranslate3d: false
};

class Tooltip extends Component {
  static displayName = 'Tooltip';

  static propTypes = propTypes;

  static defaultProps = defaultProps;

  state = {
    boxWidth: -1,
    boxHeight: -1
  };

  componentDidMount () {
    this.updateBBox();
  }

  componentDidUpdate () {
    this.updateBBox();
  }

  updateBBox () {
    const { boxWidth, boxHeight } = this.state;

    if (this.wrapperNode && this.wrapperNode.getBoundingClientRect) {
      const box = this.wrapperNode.getBoundingClientRect();

      if (
        Math.abs(box.width - boxWidth) > EPS
        || Math.abs(box.height - boxHeight) > EPS
      ) {
        this.setState({
          boxWidth: box.width,
          boxHeight: box.height
        });
      }
    } else if (boxWidth !== -1 || boxHeight !== -1) {
      this.setState({
        boxWidth: -1,
        boxHeight: -1
      });
    }
    const curveLine = document.getElementsByClassName(
      'recharts-tooltip-cursor'
    );

    [].concat(this._toConsumableArray(curveLine)).map(el => {
      if (el.style) {
        if (this.props.withoutLine) {
          el.style.display = 'none';
        } else {
          el.style['stroke-dasharray'] = '7 4';
        }
      }
      return el;
    });
  }
  _toConsumableArray = arr => {
    if (Array.isArray(arr)) {
      const arr2 = Array(arr.length);

      for (let i = 0; i < arr.length; i++) {
        arr2[i] = arr[i];
      }
      return arr2;
    }
    return Array.from(arr);
  };

  get payload () {
    const { payload } = this.props;

    return payload && payload.length
      ? payload.filter(el => el.dataKey === 'value' || el.name === 'value')
      : [];
  }

  get payloadDate () {
    if (this.payload[0] && !this.props.withoutLine) {
      const fullDate = new Date(this.payload[0].payload.dateTime);

      return `${moment(fullDate).format('MMM D, YYYY')}`;
    }

    return '';
  }
  get customPayloadDate () {
    if (this.props.customLabel) {
      const fullDate = new Date(this.props.customLabel);

      return `${moment(fullDate).format('MMM D, YYYY')}`;
    }

    return '';
  }

  render () {
    const {
      payload,
      dataLabelsStyles,
      isAnimationActive,
      animationDuration,
      animationEasing,
      filterNull,
      paylodUniqBy
    } = this.props;
    const finalPayload = getUniqPaylod(
      paylodUniqBy,
      filterNull && payload && payload.length
        ? payload.filter(entry => !R.isNil(entry.value))
        : payload
    );
    const hasPayload = finalPayload && finalPayload.length;
    const {
      renderTooltipContent,
      viewBox,
      coordinate,
      position,
      active,
      offset,
      wrapperStyle,
      customActive,
      dateXVAlue,
      customCoordinate
    } = this.props;

    const outerStyle = {
      pointerEvents: 'none',
      visibility: active && hasPayload ? 'visible' : 'hidden',
      position: 'absolute',
      top: 0,
      ...wrapperStyle
    };

    const customOuterStyle = {
      ...outerStyle,
      visibility: !active && customActive ? 'visible' : 'hidden'
    };

    let combineOuterStyle
      = customActive && !active ? customOuterStyle : outerStyle;
    const coords = !active && customActive ? customCoordinate : coordinate;

    let translateX;

    let translateY = 0;

    let dateX = 0;

    if (position && isNumber(position.x) && isNumber(position.y)) {
      translateX = position.x;
      dateX = position.x;
      translateY = position.y;
    } else {
      const { boxWidth, boxHeight } = this.state;

      if (boxWidth > 0 && boxHeight > 0 && coords) {
        dateX = position && isNumber(position.x) ? position.x : coords.x;
        translateX
          = position && isNumber(position.x)
            ? position.x
            : Math.max(
                coords.x + boxWidth + offset > viewBox.x + viewBox.width
                  ? coords.x - boxWidth - offset
                  : coords.x + offset,
                viewBox.x
              );
        translateY
          = boxHeight > viewBox.height // eslint-disable-line
            ? viewBox.height - boxHeight
            : coords.y + boxHeight > viewBox.height
            ? coords.y - (coords.y + boxHeight - viewBox.height)
            : coords.y - offset;
      } else {
        outerStyle.visibility = 'hidden';
      }
    }

    if (dateXVAlue) {
      dateX = coords.x;
    }
    combineOuterStyle = {
      ...combineOuterStyle,
      ...translateStyle({
        transform: this.props.useTranslate3d
          ? `translate3d(${translateX}px, ${translateY}px, 0)`
          : `translate(${translateX}px, ${translateY}px)`
      })
    };

    if (
      (isAnimationActive && active)
      || (isAnimationActive && !active && customActive)
    ) {
      combineOuterStyle = {
        ...combineOuterStyle,
        ...translateStyle({
          transition: `transform ${animationDuration}ms ${animationEasing}`
        })
      };
    }
    const cls = classNames(CLS_PREFIX, {
      [`${CLS_PREFIX}-right`]:
        isNumber(translateX)
        && coords
        && isNumber(coords.x)
        && translateX >= coords.x,
      [`${CLS_PREFIX}-left`]:
        isNumber(translateX)
        && coords
        && isNumber(coords.x)
        && translateX < coords.x,
      [`${CLS_PREFIX}-bottom`]:
        isNumber(translateY)
        && coords
        && isNumber(coords.y)
        && translateY >= coords.y,
      [`${CLS_PREFIX}-top`]:
        isNumber(translateY)
        && coords
        && isNumber(coords.y)
        && translateY < coords.y
    });

    return (
      <div>
        {this.props.customActive
        && !active
        && this.props.customPayload.length ? (
          <div
            className={cls}
            style={combineOuterStyle}
            ref={node => {
              this.wrapperNode = node;
            }}
          >
            <div>
              <div
                className={classNames(
                  'recharts-default-tooltip',
                  this.props.wrapperClassName
                )}
                style={{
                  borderRadius: '12px',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 2px 25px 0 rgba(0, 0, 0, 0.1)'
                }}
              >
                <ul
                  className="recharts-tooltip-item-list"
                  style={{ padding: '8px 12px', margin: 0 }}
                >
                  {this.props.customPayload.map(el => (
                    <li
                      key={el.name}
                      className="recharts-tooltip-item"
                      style={{
                        display: 'block',
                        paddingTop: 4,
                        paddingBottom: 4,
                        color: '#000',
                        ...this.props.itemStyle
                      }}
                    >
                      <span
                        className={`recharts-tooltip-item-name ${
                          styles.metricName
                        }`}
                      >{`${el.name}: `}</span>
                      <span
                        style={{color: el.stroke}}
                        className={`recharts-tooltip-item-value ${
                          styles.metricVal
                        }`}
                      >
                        {el.data[0].value} {el.units}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={cls}
            style={combineOuterStyle}
            ref={node => {
              this.wrapperNode = node;
            }}
          >
            {renderTooltipContent({ ...this.props, payload: this.payload })}
          </div>
        )}
        {this.payload[0] || (this.props.customActive && !active) ? (
          <span
            style={{
              left: dateX < 35 ? 5 : dateX - (this.props.smallChart ? 77 : 35),
              ...dataLabelsStyles
            }}
            className={styles.dateLabel}
          >
            {this.props.customActive
            && !active
            && this.props.customPayload.length
              ? this.customPayloadDate
              : this.payloadDate}
          </span>
        ) : null}
      </div>
    );
  }
}

export default Tooltip;
