import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Input, Drawer, Tabs } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import styles from '../../components/Metrics/styles.module.less';

import SmallChart from './SmallChart';

import { getAvailableMetricsSelector } from '../../redux/metricsChartMetric.selector';
import AvailableMetric from '../../components/Metrics/AvailableMetric';
import { getChartIdsSelector } from '../../redux/metricsChart.selector';
import { createChartAsync } from '../../redux/metricsChart.action';

const { TabPane } = Tabs;

class MetricsNewChart extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    selectedCharts: PropTypes.array.isRequired,
    availableMetrics: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      }).isRequired
    ).isRequired,
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired
    }).isRequired,
    addNewChart: PropTypes.func.isRequired,
    activeTab: PropTypes.string.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {
      value: '',
      activeTab: props.activeTab
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
    if (!value) return availableMetrics
      .sort((a, b) => a.name.localeCompare(b.name));

    return availableMetrics
      .filter(item => {
        const lc = item.name.toLowerCase();
        const filter = value.toLowerCase();

        return lc.includes(filter);
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  clearData = () => {
    this.setState({
      value: '',
      activeTab: '1'
    });
  };

  onChangeTab = key => this.setState({ activeTab: key, value: '' });
  render () {
    const { value, activeTab } = this.state;
    const {
      open,
      close,
      selectedCharts,
      intl: { formatMessage },
      addNewChart
    } = this.props;

    const availableMetrics = this.searchFilter(value, this.props.availableMetrics);
    const countAvailable = this.props.availableMetrics.length;

    const existingChartTitle = `${selectedCharts.length} ${selectedCharts.length === 1 ? (formatMessage({ id: 'MetricsNewChart.selectedChart' }) || 'MetricsNewChart.selectedChart')
      : (formatMessage({ id: 'MetricsNewChart.selectedCharts' }) || 'MetricsNewChart.selectedCharts')} `;

    return (
      <Drawer className="drawerComponentSymptomChecker metricsNewChartDrawer"
        title={
          < div className={styles.header} >
            <FormattedMessage id="Metrics.addNewChart" />
          </div>
        }
        placement="right"
        closable={false}
        onClose={() => {
          close();
          this.clearData();
        }}
        visible={open}
      >
        <div className={`maincardWrapperNewMetric ${styles.cardWrapperNewMetric}`}>
          <div className='metricsTabs'>
            <Tabs
              onChange={this.onChangeTab}
              type="card"
              activeKey={activeTab}
              tabBarStyle={{ borderBottom: 'none', overflow: 'hidden' }}
            >
              <TabPane
                tab={existingChartTitle}
                key="1"
              >
                <div className={styles.selectedBlock}>
                  <div className={styles.selectedMetrics}>
                    {
                      selectedCharts.length > 0 ? (
                        selectedCharts.map((chartId, i) => (
                          <SmallChart chartId={chartId} key={chartId} />
                        )
                        )) : (
                          <div>
                            <p className={styles.paragraphInfo}>
                              <FormattedMessage id="MetricsNewChart.chooseOne" />
                            </p>
                          </div>
                        )}
                  </div>
                </div>
              </TabPane>
              <TabPane
                tab={formatMessage({ id: 'MetricsNewChart.findNewChart' })}
                key="2"
                style={{ padding: '0 0px' }}
              >
                <div className={styles.availableBlock}>
                  <div className={styles.searchBlock}>
                    <Input
                      value={value}
                      onChange={this.handleSearch}
                      className={styles.searchInput}
                      prefix={
                        <Icon type="search" className={styles.iconSearch} />
                      }
                      placeholder={formatMessage({ id: 'NewMetric.searchPlaceholder' })}
                    />
                  </div>
                  {
                    countAvailable === 1 ? (
                      <div className={styles.quantityAvailable} >
                        {countAvailable}
                        &nbsp;
                      <FormattedMessage id="NewMetric.availableMetric" />
                      </div>
                    ) : (
                        <div className={styles.quantityAvailable} >
                          {countAvailable}
                          &nbsp;
                        <FormattedMessage id="NewMetric.availableMetrics" />
                        </div>
                      )
                  }
                  <div className={styles.availableItemsChart}>
                    {
                      availableMetrics.map(item => (
                        <AvailableMetric
                          metricId={item.id}
                          key={item.id}
                          searchValue={value}
                          metric={item}
                          onAdd={addNewChart}
                        />
                      ))}
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </div>
          <div className={styles.btnBlock} >
            <Button
              onClick={
                () => {
                  close();
                  this.clearData();
                }
              }
            >
              <FormattedMessage id="NewMetric.closeBtn" />
            </Button>
          </div>
        </div>
      </Drawer>
    );
  }
}

const mapStateToProps = (state, props) => {
  const selectedCharts = getChartIdsSelector(state);
  const availableMetrics = getAvailableMetricsSelector(state);

  return {
    availableMetrics,
    selectedCharts,
    close: props.close,
    intl: props.intl,
    open: props.open
  };
};

const mapDispatchToProps = dispatch => ({
  addNewChart: metric => { return dispatch(createChartAsync(metric)); }
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(MetricsNewChart));
