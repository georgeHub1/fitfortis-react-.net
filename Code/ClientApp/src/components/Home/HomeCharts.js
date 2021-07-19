import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { getChartIds } from '../../redux/metricsChart.reducer';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { loadChartBulkAsync } from '../../redux/metricsChart.action';
import { loadMetricsAsync, loadMetricDataAsync, addBackEntry } from '../../redux/metricsMetric.action';
import auth from '../../backendServices/auth';
import { createHomeNewEntryAsync } from '../../redux/metricsMetric.action';
import HomeUnitBodyWeitght from './HomeUnitBodyWeight';
import HomeUnitStressLevel from './HomeUnitStressLevel';
import HomeUnitPulse from './HomeUnitPulse';
import HomeUnitCovid from './HomeUnitCovid-19';

export class HomeCharts extends Component {
  static propTypes = {
    selectedCharts: PropTypes.array.isRequired,
    loadMetrics: PropTypes.func.isRequired,
    loadChartBulk: PropTypes.func.isRequired,
    loadMetricDataAsync: PropTypes.func.isRequired,
    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
  };
  displayName = HomeCharts.name;
  componentDidMount () {
    const { account } = this.props;

    if (auth.isAuthenticated() && account && account.id) {
      this.props.loadMetrics().then(() => {
        this.props.loadChartBulk();
      });
    }
  }

  componentWillReceiveProps (nextProps) {
    if (auth.isAuthenticated() && this.props.account.id !== nextProps.account.id) {
      setTimeout(() => {
        this.props.loadMetrics().then(() => {
          this.props.loadChartBulk();
        });
      }, 1000);
    }
  }

  render () {
    return (
      <>
        <div className="MainhomeRight" ref={'mainHome'}>
          {auth.isAuthenticated()
          && <div className="homeRight">
              <div className="weight_units">
                <HomeUnitCovid />
              </div>
              <div className="weight_units">
                <HomeUnitBodyWeitght />
              </div>
              <div className="weight_units">
                <HomeUnitStressLevel />
              </div>
              <div className="weight_units">
                <HomeUnitPulse />
              </div>
            </div>
          }
        </div>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedCharts: getChartIds(state),
    account: state.profile.account,
    Metric: state.metricsMetric,
    MetricData: state.metricsMetricData
  };
};

const mapDispatchToProps = dispatch => ({
  createNewEntry: bindActionCreators(createHomeNewEntryAsync, dispatch),
  loadChartBulk: bindActionCreators(loadChartBulkAsync, dispatch),
  loadMetrics: bindActionCreators(loadMetricsAsync, dispatch),
  addBackEntry: bindActionCreators(addBackEntry, dispatch),
  loadMetricDataAsync: bindActionCreators(loadMetricDataAsync, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(HomeCharts));
