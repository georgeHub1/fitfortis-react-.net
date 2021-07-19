import React, { Component } from 'react';
import NewMetric from '../../components/Metrics/NewMetric';

import { connect } from 'react-redux';
import { getAvailableMetricForChart } from '../../redux/metricsChartMetric.selector';
import PropTypes from 'prop-types';
import { MetricsChartDataProps } from './metrics.chart.propTypes';
import { addMetricToChartAsync } from '../../redux/metricsChartMetric.action';

class MetricsNewMetric extends Component {
  static propTypes = {
    availableMetrics: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      })
    ).isRequired,
    selectedMetrics: PropTypes.arrayOf(MetricsChartDataProps).isRequired,
    open: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    chartId: PropTypes.string.isRequired
  };
  constructor (props) {
    super(props);
    this.state = {
      isSearch: false,
      value: ''
    };
  }

  handleSearch = e => {
    e.preventDefault();
    const value = e.target.value;

    this.setState(state => ({
      ...state,
      value
    }));
  };

  searchFilter = (value, availableMetrics) => {
    if (!value) return [...availableMetrics].sort((a, b) => a.name.localeCompare(b.name));

    return availableMetrics
      .filter(item => {
        const lc = item.name.toLowerCase();
        const filter = value.toLowerCase();

        return lc.includes(filter);
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  };
  sortByName = arr => arr.sort((a, b) => a.name.localeCompare(b.name));
  render () {
    const { value } = this.state;
    const {
      open,
      close,
      selectedMetrics,
      chartId,
      addMetricToChart
    } = this.props;

    const availableMetrics = this.searchFilter(value, this.props.availableMetrics);
    const countAvailable = this.props.availableMetrics.length;

    return (
      <NewMetric
        availableMetrics={availableMetrics}
        value={value}
        isOpen={open}
        onClose={close}
        handleSearch={this.handleSearch}
        selectedMetrics={this.sortByName(selectedMetrics)}
        countAvailable={countAvailable}
        chartId={chartId}
        addMetricToChart={addMetricToChart}
      />
    );
  }
}

const mapStateToProps = (state, props) => {
  const availableMetrics = getAvailableMetricForChart(state, props.chartId);

  return {
    selectedMetrics: props.selectedMetrics,
    availableMetrics,
    chartId: props.chartId,
    close: props.close,
    open: props.open
  };
};
const mapDispatchToProps = (dispatch, props) => ({
  addMetricToChart: metric => { return dispatch(addMetricToChartAsync(props.chartId, metric.id, metric)); }
});

export default connect(mapStateToProps, mapDispatchToProps)(MetricsNewMetric);
