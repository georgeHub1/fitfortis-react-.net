import React, { Component } from 'react';
import HomeUnitBodyWeightVisualization from './HomeUnitBodyWeightVisualization';
import HomeUnitBodyWeightEntry from './HomeUnitBodyWeightEntry';
import { createHomeNewEntryAsync } from '../../redux/metricsMetric.action';
import { loadMetricDataAsync, addBackEntry } from '../../redux/metricsMetric.action';
import { getChartIds } from '../../redux/metricsChart.reducer';
import { getSelectedMetricsId } from '../../redux/metricsChart.reducer';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import moment from 'moment';

class HomeUnitBodyWeitght extends Component {
    static propTypes = {
        intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
      };
    constructor (props) {
        super(props);
        this.state = {
            bodyWeightValue: '',
            bodyWeightChart: false,
            bodyWeightLoading: false
          };
    }
    handleChangeBodyWeight = value => {
        this.setState({ bodyWeightValue: value });
    }
    handleNewWiedghtMetric = () => {
        if (this.state.bodyWeightValue) {
          const { createNewEntry } = this.props;

          this.setState({bodyWeightLoading: true});
          createNewEntry({
            Date: `${moment.utc(new Date().getTime()).format()}`,
            Value: this.state.bodyWeightValue,
            MetricId: '00000000-0000-0000-0000-000000000015',
            comment: ''
          }
          ).then(() => {
            this.props.loadMetricDataAsync('00000000-0000-0000-0000-000000000015').then(() => {
              this.setState({ bodyWeightValue: '', bodyWeightLoading: false, bodyWeightChart: true});
            });
          });
        }
    }
    addEntry = value => {
        this.props.addBackEntry(value);
    }
    render ()  {
        const { Metric, MetricData, data } = this.props;
        const { bodyWeightValue } = this.state;

        return (
            <div className="weight_units_row">
                {!(Metric.bodyWeightChart && MetricData.loading)
                ? <HomeUnitBodyWeightEntry
                    data={data}
                    handleNewWiedghtMetric={this.handleNewWiedghtMetric}
                    bodyWeightLoading={this.state.bodyWeightLoading}
                    bodyWeightValue={bodyWeightValue}
                    handleChange={this.handleChangeBodyWeight}
                    />
                : <div className="weight_units_col">
                    <div className="weight_initial_state">
                      <HomeUnitBodyWeightVisualization
                          MetricId='00000000-0000-0000-0000-000000000015'
                          data={data}
                          addEntry={this.addEntry}
                        />
                    </div>
                </div>
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
  const selectedMetricId = getSelectedMetricsId(state);

  let data = null;

  selectedMetricId.forEach(el => {
    if (el.metircId === '00000000-0000-0000-0000-000000000015') {
      data = el;
    }
  });

    return {
      selectedCharts: getChartIds(state),
      data,
      account: state.profile.account,
      Metric: state.metricsMetric,
      MetricData: state.metricsMetricData
    };
  };

  const mapDispatchToProps = dispatch => ({
    createNewEntry: bindActionCreators(createHomeNewEntryAsync, dispatch),
    addBackEntry: bindActionCreators(addBackEntry, dispatch),
    loadMetricDataAsync: bindActionCreators(loadMetricDataAsync, dispatch)
  });

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(HomeUnitBodyWeitght));
