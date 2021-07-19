import * as React from 'react';
import { Button, Icon, Input, Drawer } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import styles from './styles.module.less';
import SelectedMetric from '../../containers/Metrics/SelectedMetric';
import PropTypes from 'prop-types';
import AvailableMetric from './AvailableMetric';
import { MetricsChartDataProps } from '../../containers/Metrics/metrics.chart.propTypes';

class NewMetric extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired
    }).isRequired,
    selectedMetrics: PropTypes.arrayOf(MetricsChartDataProps).isRequired,
    availableMetrics: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired
      })
    ).isRequired,
    handleSearch: PropTypes.func.isRequired,
    countAvailable: PropTypes.number.isRequired,
    chartId: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    addMetricToChart: PropTypes.func.isRequired
  };

  isUnitMetircs = metric => {
    return !metric.canBeDisplayedWithOther;
  }
  render () {
    const {
      isOpen: open,
      onClose: close,
      intl: { formatMessage },
      selectedMetrics,
      availableMetrics,
      value,
      handleSearch,
      countAvailable,
      chartId,
      addMetricToChart
    } = this.props;

    return (
      <Drawer
        className="drawerComponentSymptomChecker"
        title={
          <div className={styles.header}>
            {<FormattedMessage id="NewMetric.header" />}
          </div>
        }
        placement="right"
        closable={false}
        onClose={close}
        visible={open}
      >
        <div className={`maincardWrapperNewMetric ${styles.cardWrapperNewMetric}`}>
          <div className={styles.selectedBlock}>
            <div className={`mainselectedBlock ${styles.selectedMetrics}`}>
              {selectedMetrics.length > 0 ? (
                selectedMetrics.map(item => <SelectedMetric
                   key={item.chartMetricId}
                    chartMetricId={item.chartMetricId}
                  chartId={chartId}
                     chartMetric={item} />)
              ) : (
                  <div>
                    <FormattedMessage id="NewMetric.chooseOne" />
                  </div>
                )}
            </div>
          </div>
          <div className={styles.availableBlock}>
            <div className={styles.searchBlock}>
              <Input
                value={value}
                onChange={handleSearch}
                className={styles.searchInput}
                prefix={<Icon type="search" className={styles.iconSearch} />}
                placeholder={formatMessage({ id: 'NewMetric.searchPlaceholder' })}
              />
            </div>
            {countAvailable === 1 ? (
              <div className={styles.quantityAvailable}>
                {countAvailable}
                &nbsp;
                <FormattedMessage id="NewMetric.availableMetric" />
              </div>
            ) : (
                <div className={styles.quantityAvailable}>
                  {countAvailable}
                  &nbsp;
                <FormattedMessage id="NewMetric.availableMetrics" />
                </div>
              )}
            <div className={styles.availableItems}>
              {availableMetrics.map(item => <AvailableMetric
                key={item.id}
                metricId={item.id}
                chartId={chartId}
                searchValue={value}
                metric={item}
                isHideUintMetric={this.isUnitMetircs(item)}
                onAdd={addMetricToChart}
              />)}
            </div>
          </div>
        </div>
        <div className={`Metrics_bottom_btn ${styles.btnBlock}`}>
          <Button onClick={close}>
            <FormattedMessage id="NewMetric.closeBtn" />
          </Button>
        </div>
      </Drawer>
    );
  }
}
export default injectIntl(NewMetric);
