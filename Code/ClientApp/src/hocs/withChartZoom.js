import React, { Component } from 'react';

import { CUSTOM_KEY } from '../constants/metrics.js';

const withChartZoom = WrappedComponent => {
  class WithChartZoom extends Component {
    constructor (props) {
      super(props);
      this.state = {
        refAreaLeft: null,
        refAreaRight: null
      };
    }

    zoom = () => {
      const { setMetricsDateRange } = this.props;
      const { refAreaLeft, refAreaRight } = this.state;

      if (refAreaRight && refAreaRight !== refAreaLeft) {
        if (refAreaRight > refAreaLeft) {
          this.setState({ refAreaLeft: null, refAreaRight: null }, () => setMetricsDateRange({ from: refAreaLeft, to: refAreaRight, key: CUSTOM_KEY }));
        } else {
          this.setState({ refAreaLeft: null, refAreaRight: null }, () => setMetricsDateRange({ from: refAreaRight, to: refAreaLeft, key: CUSTOM_KEY }));
        }
      } else {
        this.setState({ refAreaLeft: null, refAreaRight: null });
      }
    }

    isEmptyPoint = (points, dateTime) => {
      const point = points.find(x => x.dateTime === dateTime);

      if (!point)
        return false;

      let countValue = 0;

      Object.entries(point).forEach(
        ([field, value]) => {
          if (field.includes('AdditionalMetric')) {
            const date = new Date(point.dateTime);
            const today = new Date();

            date.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            if (today.getTime() === date.getTime()) {
              countValue++;
            }
          }
          if (field.includes('value') && value !== null && value !== undefined)
            countValue++;
          if (field.includes('hidden') && value)
            countValue--;
        });

      return countValue <= 0;
    }

    onMouseDown = e => {
      if (!e)
        return;

      const activeLabel = e.activeLabel;

      if (this.isEmptyPoint(this.props.data, activeLabel))
        return;

      this.setState({ refAreaLeft: e.activeLabel });
    }
    onMouseMove = e => {
      if (this.isEmptyPoint(this.props.data, e.activeLabel))
        return;

      this.state.refAreaLeft && this.setState({ refAreaRight: e.activeLabel });
    }
    onMouseLeave = e => {
      this.setState({ refAreaLeft: null, refAreaRight: null });
    }

    render () {
      return (
        <WrappedComponent
          {...this.props}
          refAreaLeft={this.state.refAreaLeft}
          refAreaRight={this.state.refAreaRight}
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}
          onMouseUp={this.zoom}
          onMouseLeave={this.onMouseLeave} />
      );
    }
  }

  return WithChartZoom;
};

export default withChartZoom;
