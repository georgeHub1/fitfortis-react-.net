import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import styles from './styles.module.less';

export const chartViewType = {
  tableView: 'table_view',
  chartView: 'chart_View'
};

export default class Switch extends PureComponent {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func
  };
  static defaultProps = {
    value: chartViewType.chartView
  }

  onToggle = () => {
    const { value } = this.props;

    if (value === chartViewType.chartView) {
      this.props.onChange(chartViewType.tableView);
    }
    else {
      this.props.onChange(chartViewType.chartView);
    }
  }

  render () {
    const checked  = this.props.value === chartViewType.tableView;

    return (
      <div
        onClick={this.onToggle}
        className={`responsiveswitcherContainer ${styles.switcherContainer}`}>
        <span
          className={styles.pointer}
          style={{ left: checked ? 24 : 0 }} />
        <Icon
          type="line-chart"
          className={styles.icon}
          style={{
            left: '5px',
            color: checked ? '#75838B' : '#2C3134'
          }} />
        <Icon
          type="table"
          className={styles.icon}
          style={{
            left: '29px',
            color: checked ? '#2C3134' : '#75838B'
          }} />
      </div>
    );
  }
}
