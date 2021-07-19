import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Button } from 'antd';
import { withRouter } from 'react-router-dom';
import ReactLoading from 'react-loading';
import MetricsNewChart from './MetricsNewChart';
import MetricsChartTimeline from './MetricsChartTimeline';

import { loadChartBulkAsync } from '../../redux/metricsChart.action';
import { getChartIdsSelector } from '../../redux/metricsChart.selector';
import { getSelectedMetricsId } from '../../redux/metricsChart.reducer';
import MetricsUnitCommon from '../../components/Metrics/MetricsUnitCommon';
import MetricsUnitStressLevel from '../../components/Metrics/MetricsUnitStressLevel';
import styles from './styles.module.less';
import { bindActionCreators } from 'redux';

import PropTypes from 'prop-types';
import { TIMELINE_METRIC_ID } from '../../constants/metrics';
import { loadMetricsAsync } from '../../redux/metricsMetric.action';
import { localeSet } from '../../redux/locale.action';
import analyticId from '../../utils/AnalyticsAndAbTests.tsx';
const MOBILE_WIDTH = 768;

function isMobile () {
  return window.innerWidth < MOBILE_WIDTH;
}

class Metrics extends Component {
  displayName = Metrics.name;
  static propTypes = {
    dataLoaded: PropTypes.bool.isRequired,
    chartIds: PropTypes.array.isRequired,
    loadChartBulk: PropTypes.func.isRequired,
    loadMetrics: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {
      isLoading: false,
      tooltipDetailsMetric: {},
      tooltipDetailsTimeline: {},
      addingChartFormOpen: false,
      activeTab: '1',
      isMobileView: window.innerWidth < MOBILE_WIDTH,
      chartIds: [],
      isDataLoading: true
    };
  }

  updateDimensions = () => {
    this.setState({ isMobileView: isMobile() });
  }
  componentDidMount () {
    if (window.location.search.includes('?lang=')) {
      const lan = window.location.search.includes('?lang=') ? window.location.search.substring(6, 11) : (localStorage.getItem('language') || 'en');

      this.props.onUpdateLanguage(lan);
      localStorage.setItem('language', lan);
    }

    analyticId.firebaseAnalyticsLog('Metrics');
    window.addEventListener('resize', this.updateDimensions);
    this.setState(
      { isLoading: !this.props.dataLoaded },
      () => {
        this.props.loadMetrics()
          .then(() => this.props.loadChartBulk())
          .then(
            () => {
              this.setState(state => ({ ...state, isLoading: false }));
            });
      }
    );
    if (localStorage.getItem('isShowAddNewChart') === 'yes') {
      this.setState(state => ({ ...state, addingChartFormOpen: true, activeTab: '2' }));
      localStorage.setItem('isShowAddNewChart', 'no');
    }
  }
  componentWillUnmount () {
    window.removeEventListener('resize', this.updateDimensions);
    localStorage.removeItem('chartId');
  }
  componentDidUpdate (prevProps) {
    const chartId = localStorage.getItem('chartId');

    if (prevProps.dataLoaded === false && this.props.dataLoaded === true) {
      this.setState({ chartIds: this.props.chartIds, isDataLoading: false }, () => {
        if ((this.state.chartIds || []).find(x => x === chartId)) {
          if (this.refs[chartId]) {
            this.refs[chartId].scrollIntoView({ block: 'start', behavior: 'smooth' });
          }
          localStorage.removeItem('chartId');
        }
      });
    }
  }
  handleAddingNewChartFormClose = () => {
    this.setState(state => ({
      ...state,
      addingChartFormOpen: false,
      activeTab: '1'
    }));
  };
  handleAddNewChart = () => this.setState(state => ({ ...state, addingChartFormOpen: !state.addingChartFormOpen }));

  handleMouseEventMetric = e => this.setState({ tooltipDetailsMetric: e });
  handleMouseEventTimeline = e => this.setState({ tooltipDetailsTimeline: e });
  render () {
    // const chartIds = this.props.chartIds || this.state.chartIds;
    const {
      isLoading,
      addingChartFormOpen,
      tooltipDetailsMetric,
      tooltipDetailsTimeline,
      activeTab,
      isMobileView,
      isDataLoading
    } = this.state;
    const { selectedMetricId } = this.props;

    return (
      <div>
        <div className={styles.MainMetricsHeader}>
          <h1 className={styles.Metricsheader}>
            <FormattedMessage id="Metrics.header" />
          </h1>
          <Button
            aria-label="add new chart"
            onClick={this.handleAddNewChart}
            className={styles.AddNewChartBtn}
          >
            <FormattedMessage id="Metrics.addNewChart" />
          </Button>
        </div>
        {(isLoading || isDataLoading) ? <div style={{ position: 'relative' }}>
          <div className={styles.spinnerContainer}>
            <ReactLoading type="spin" color="#fff" />
          </div>
        </div>
          : <Fragment>
            <MetricsChartTimeline
              chartId={TIMELINE_METRIC_ID}
              isMobileView={isMobileView}
              mouseEventForTooltip={this.handleMouseEventTimeline}
              tooltipDetailsMetric={tooltipDetailsMetric}
            />
            {selectedMetricId.map(el => {
              if (el.metircId && el.metircId === '00000000-0000-0000-0000-000000000024') {
                return (
                  <div key={el.chartId}>
                      <div ref={el.chartId} className="metricsChartSection">
                        <MetricsUnitStressLevel
                          metricId={el.metircId}
                          chartId={el.chartId}
                          isMobileView={isMobileView}
                          tooltipDetailsTimeline={tooltipDetailsTimeline}
                          mouseEventMetricForTooltip={this.handleMouseEventMetric}
                        />
                      </div>
                  </div>
                );
              }
                return (
                  <div key={el.chartId}>
                      <div ref={el.chartId} className="metricsChartSection">
                        <MetricsUnitCommon
                          metricId={el.metircId}
                          chartId={el.chartId}
                          isMobileView={isMobileView}
                          tooltipDetailsTimeline={tooltipDetailsTimeline}
                          mouseEventMetricForTooltip={this.handleMouseEventMetric}
                        />
                      </div>
                  </div>
                );
            })}
            {addingChartFormOpen && (
              <MetricsNewChart
                activeTab={activeTab}
                open={addingChartFormOpen}
                close={this.handleAddingNewChartFormClose}
              />
            )}
          </Fragment>
        }
      </div>
    );
  }
}


const mapStateToProps = state => {
  const chartIds = getChartIdsSelector(state);
  const selectedMetricId = getSelectedMetricsId(state);

  return {
    chartIds,
    selectedMetricId,
    dataLoaded: state.metricsChart.dataLoaded
  };
};
const mapDispatchToProps = dispatch => ({
  loadChartBulk: bindActionCreators(loadChartBulkAsync, dispatch),
  loadMetrics: bindActionCreators(loadMetricsAsync, dispatch),
  onUpdateLanguage (...args) {
    dispatch(localeSet(...args));
    return Promise.resolve();
  }
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Metrics));
