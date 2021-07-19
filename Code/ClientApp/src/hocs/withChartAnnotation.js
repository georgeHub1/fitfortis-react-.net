/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import * as R from 'ramda';

const withChartAnnotation = WrappedComponent => {
  class WithChartAnnotation extends Component {
    constructor (...args) {
      super(...args);

      this.state = {
        annotations: {}
      };
      this.annotations = {};
    }

    getSnapshotBeforeUpdate (prevProps) {
      const shouldAnimate = !R.equals(prevProps.data, this.props.data);

      return shouldAnimate;
    }

    getCoords = (prevX, prevY, indentY, indentX, minLabel) => {
      const containerWidth = document.getElementById(`ChartAreaContainer__${this.props.metricKey}`).offsetWidth;
      const allPossiblePlaces = minLabel
        ? [
          [prevX, prevY + (indentY * 2)], [prevX + indentX, prevY + (indentY * 2)], [prevX - indentX, prevY + (indentY * 2)]
        ]
        : [
          [prevX, prevY - indentY], [prevX + indentX, prevY - indentY], [prevX - indentX, prevY - indentY]
        ];

      const possiblePlaces = R.filter(possiblePlace => {
        return possiblePlace[0] >= 20 && possiblePlace[1] && possiblePlace[1] >= 15 && possiblePlace[1] <= 240 && possiblePlace[0] <= (containerWidth - indentX);
      },
        allPossiblePlaces);


      if (!possiblePlaces || !possiblePlaces.length) {
        return [prevX, prevY];
      }

      return possiblePlaces[0];
    }

    componentDidUpdate ({ metricsDateRange }, prevState, shouldAnimate) {
      if (prevState.animate !== shouldAnimate) {
        this.setState({ animate: shouldAnimate });
      }
      if (metricsDateRange.from !== this.props.metricsDateRange.from
        || metricsDateRange.to !== this.props.metricsDateRange.to)
        this.setState({ annotations: {} });
    }

    getLabelsProps = ({ x, y, withLine, index, key = 'val', value, labelsIndexes, unit, stroke, changePos = false, i }) => {
      const labelIndex = labelsIndexes.findIndex(el => el.index === `${key}${index}${i}`);

      let label = {};

      if (!value) return null;
      if (labelsIndexes[0])
        label = labelsIndexes[labelIndex] || {};

      const val = `${value} ${unit}`;
      const MIN_LABEL_INDEX = 2;
      const VAL_FONT_SIZE = 12;
      const VAL_FONT_WEIGHT = 400;
      const VAL_LABEL_MARGIN = 10;
      const GOAL_FONT_SIZE = 8;
      const GOAL_FONT_WEIGHT = 100;
      const GOAL_LABEL_MARGIN = label.topPosition ? 1 : changePos ? 5 : -15; // eslint-disable-line
      const VAL_LETTER_WIDTH = 3;
      const GOAL_LETTER_WIDTH = 1.5;
      const INDENT_X = val.length * (withLine ? VAL_LETTER_WIDTH : GOAL_LETTER_WIDTH);
      const containerWidth = document.getElementById(`ChartAreaContainer__${this.props.metricKey}`).offsetWidth;

      let GOAL_X = x + (2 * val.length);

      let LINE_Y2 = y;

      if (GOAL_X >= containerWidth - INDENT_X)
        GOAL_X = x;

      if (labelIndex > -1
        && (!this.annotations[`${key}${index}`]
          || this.annotations[`${key}${index}`].startCoords[0] !== x
          || this.annotations[`${key}${index}`].startCoords[1] !== y)) {
        const coords = this.getCoords(label.isValAnnot ? x : GOAL_X, y, withLine ? VAL_LABEL_MARGIN : GOAL_LABEL_MARGIN, INDENT_X, label.minVal);

        this.annotations = {
          ...this.annotations,
          [`${key}${index}`]: {
            startCoords: [x, y],
            coords,
            val
          }
        };
      }
      if (labelIndex > -1 && this.annotations[`${key}${index}`].coords)
        LINE_Y2 = (labelIndex === MIN_LABEL_INDEX ? this.annotations[`${key}${index}`].coords[1] - 15 : this.annotations[`${key}${index}`].coords[1]);

      return <g key={`${key} ${index}`}>
        <text
          style={{
            userSelect: 'none',
            msUserSelect: 'none',
            MozUserSelect: 'none',
            WebkitUserSelect: 'none',
            fontWeight: withLine ? VAL_FONT_WEIGHT : GOAL_FONT_WEIGHT
          }}
          x={labelIndex > -1 && this.annotations[`${key}${index}`].coords ? this.annotations[`${key}${index}`].coords[0] : x}
          y={labelIndex > -1 && this.annotations[`${key}${index}`].coords ? this.annotations[`${key}${index}`].coords[1] : y}
          stroke={stroke}
          dy={-4}
          fontSize={withLine ? VAL_FONT_SIZE : GOAL_FONT_SIZE}
          textAnchor="middle">{labelIndex > -1 ? this.annotations[`${key}${index}`].val : ''}
        </text>
        {
          withLine
            ? <line
              strokeWidth={1}
              stroke='#dedede'
              x1={labelIndex > -1 && this.annotations[`${key}${index}`].coords ? this.annotations[`${key}${index}`].startCoords[0] : x}
              y1={labelIndex > -1 && this.annotations[`${key}${index}`].coords ? this.annotations[`${key}${index}`].startCoords[1] : y}
              x2={labelIndex > -1 && this.annotations[`${key}${index}`].coords ? this.annotations[`${key}${index}`].coords[0] : x}
              y2={LINE_Y2} />
            : null
        }
        {
          withLine && label.last
            ? <g>
              <circle
                r="5"
                fill={stroke}
                strokeWidth="2"
                stroke="white"
                cx={x}
                cy={y} />
            </g>
            : null
        }
      </g>;
      }

    getAdditinalLabelsProps = params => {
       const { x, y, withLine, index, key = 'val', value, labelValue, unit} = params;

       if (!labelValue || x === 5)
          return null;

      const labelIndex = 0;

      const label = {};

      if (!value) return null;

      const val = `${value} ${unit}`;
      const MIN_LABEL_INDEX = 2;
      const VAL_FONT_SIZE = 12;
      const VAL_FONT_WEIGHT = 400;
      const VAL_LABEL_MARGIN = 10;
      const GOAL_FONT_SIZE = 8;
      const GOAL_FONT_WEIGHT = 100;
      const GOAL_LABEL_MARGIN = 1  // eslint-disable-line
      const VAL_LETTER_WIDTH = 3;
      const GOAL_LETTER_WIDTH = 1.5;
      const INDENT_X = val.length * (withLine ? VAL_LETTER_WIDTH : GOAL_LETTER_WIDTH);
      const containerWidth = document.getElementById(`ChartAreaContainer__${this.props.metricKey}`).offsetWidth;

      let GOAL_X = x + (2 * val.length);

      let LINE_Y2 = y;

      if (GOAL_X >= containerWidth - INDENT_X)
        GOAL_X = x;

      if (labelIndex > -1
        && (!this.annotations[`${key}${index}`]
          || this.annotations[`${key}${index}`].startCoords[0] !== x
          || this.annotations[`${key}${index}`].startCoords[1] !== y)) {
        const coords = this.getCoords(label.isValAnnot ? x : GOAL_X, y, withLine ? VAL_LABEL_MARGIN : GOAL_LABEL_MARGIN, INDENT_X, label.minVal);

        this.annotations = {
          ...this.annotations,
          [`${key}${index}`]: {
            startCoords: [x, y],
            coords,
            val
          }
        };
      }
      if (labelIndex > -1 && this.annotations[`${key}${index}`].coords)
        LINE_Y2 = (labelIndex === MIN_LABEL_INDEX ? this.annotations[`${key}${index}`].coords[1] - 15 : this.annotations[`${key}${index}`].coords[1]);

      return <g key={`${key} ${index}`}>
        <text
          style={{
            userSelect: 'none',
            msUserSelect: 'none',
            MozUserSelect: 'none',
            WebkitUserSelect: 'none',
            fontWeight: withLine ? VAL_FONT_WEIGHT : GOAL_FONT_WEIGHT
          }}
          x={labelIndex > -1 && this.annotations[`${key}${index}`].coords ? this.annotations[`${key}${index}`].coords[0] : x}
          y={labelIndex > -1 && this.annotations[`${key}${index}`].coords ? this.annotations[`${key}${index}`].coords[1] : y}
          stroke={labelValue.stroke}
          dy={-4}
          fontSize={withLine ? VAL_FONT_SIZE : GOAL_FONT_SIZE}
          textAnchor="middle">{labelIndex > -1 ? val : ''}
        </text>
        {
          withLine
            ? <line
              strokeWidth={1}
              stroke='#dedede'
              x1={labelIndex > -1 && this.annotations[`${key}${index}`].coords ? this.annotations[`${key}${index}`].startCoords[0] : x}
              y1={labelIndex > -1 && this.annotations[`${key}${index}`].coords ? this.annotations[`${key}${index}`].startCoords[1] : y}
              x2={labelIndex > -1 && this.annotations[`${key}${index}`].coords ? this.annotations[`${key}${index}`].coords[0] : x}
              y2={LINE_Y2} />
            : null
        }
        {
          withLine && label.last
            ? <g>
              <circle
                r="5"
                fill={labelValue.stroke}
                strokeWidth="2"
                stroke="white"
                cx={x}
                cy={y} />
            </g>
            : null
        }
      </g>;
    }
    getLabelsEmojiProps = ({ x, y, withLine, emoji, index, key = 'val', value, smallChart, labelsIndexes, fill, changePos = false, i }) => {
      const labelIndex = labelsIndexes.findIndex(el => el.index === `${key}${index}${i}`);

      let label = {};

      if (labelsIndexes[0])
        label = labelsIndexes[labelIndex] || {};

      const val = `${value}`;
      const MIN_LABEL_INDEX = 2;
      const VAL_LABEL_MARGIN = 10;
      const GOAL_LABEL_MARGIN = label.topPosition ? 1 : changePos ? 5 : -15; // eslint-disable-line
      const VAL_LETTER_WIDTH = 3;
      const GOAL_LETTER_WIDTH = 1.5;
      const INDENT_X = val.length * (withLine ? VAL_LETTER_WIDTH : GOAL_LETTER_WIDTH);
      const containerWidth = document.getElementById(`ChartAreaContainer__${this.props.metricKey}`).offsetWidth;

      let GOAL_X = x + (2 * val.length);

      let LINE_Y2 = y;

      if (GOAL_X >= containerWidth - INDENT_X)
        GOAL_X = x;

      if (labelIndex > -1
        && (!this.annotations[`${key}${index}`]
          || this.annotations[`${key}${index}`].startCoords[0] !== x
          || this.annotations[`${key}${index}`].startCoords[1] !== y)) {
        const coords = this.getCoords(label.isValAnnot ? x : GOAL_X, y, withLine ? VAL_LABEL_MARGIN : GOAL_LABEL_MARGIN, INDENT_X, label.minVal);

        this.annotations = {
          ...this.annotations,
          [`${key}${index}`]: {
            startCoords: [x, y],
            coords,
            val
          }
        };
      }
      if (labelIndex > -1 && this.annotations[`${key}${index}`].coords)
        LINE_Y2 = (labelIndex === MIN_LABEL_INDEX ? this.annotations[`${key}${index}`].coords[1] - 15 : this.annotations[`${key}${index}`].coords[1]);
      const x1 = smallChart ? 3 : 9;

      return <g key={`${key} ${index}`}>
        {
          withLine && label.last
              ? <line
              strokeWidth={1}
              stroke={fill}
              x1={labelIndex > -1 && this.annotations[`${key}${index}`].coords ? this.annotations[`${key}${index}`].startCoords[0] + x1 : x + x1}
              y1={labelsIndexes[0].value >= 0 ? smallChart ? y - 5 : y - 8 : smallChart ? y + 5 : y + 8}
              // y1={labelIndex > -1 && this.annotations[`${key}${index}`].coords ? this.annotations[`${key}${index}`].startCoords[1] : y - 8}
              x2={labelIndex > -1 && this.annotations[`${key}${index}`].coords ? this.annotations[`${key}${index}`].coords[0] + x1 : x + x1}
              y2={LINE_Y2 + 10} />
            : null
        }
        {
          withLine && label.last
            ? <g transform={`translate(${x},${labelsIndexes[0].value >= 0 ? smallChart ? y - 20 : y - 30 : y - 20 })`}>
            <image xlinkHref={emoji} x={smallChart ? -2 : -1} y={labelsIndexes[0].value >= 0 ? smallChart ? 1 : -7 : 26} height={smallChart ? 13 : 30} width={smallChart ? 13 : 30} fill={fill} />
          </g>
            : null
        }
      </g>;
      }

    render () {
      return (
        <WrappedComponent
          {...this.props}
          animate={this.state.animate}
              getLabelsProps={this.getLabelsProps}
          annotations={this.state.annotations}
          getLabelsEmojiProps={this.getLabelsEmojiProps}
          getAdditinalLabelsProps={this.getAdditinalLabelsProps} />
      );
    }
  }

  return WithChartAnnotation;
};

export default withChartAnnotation;
