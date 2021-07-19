import { Button, Icon, Input } from 'antd';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import React, { PureComponent, Fragment } from 'react';

import styles from '../../components/Metrics/styles.module.less';

class MetricsChartEditName extends PureComponent {
  displayName = MetricsChartEditName.name;
  static propTypes = {
    chartName: PropTypes.string.isRequired,
    chartId: PropTypes.string.isRequired,
    updateName: PropTypes.func.isRequired,
    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
  };
  constructor (props) {
    super(props);
    this.state = {
      showInput: false,
      value: '',
      isSavingName: false
    };
  }
  handleSubmit = e => {
    e.preventDefault();

    if (this.state.isSavingName)
      return;

    const value = this.state.value;

    if (value !== this.props.chartName) {
      const { updateName, chartId } = this.props;

      this.setState(
        state => ({ isSavingName: true }),
        () => updateName(value, chartId).then(() => { this.setState({ showInput: !this.state.showInput, isSavingName: false }); })
      );
    }
    else {
      this.setState({ showInput: !this.state.showInput });
    }
  };
  handleEditUndo = () => this.setState({ showInput: !this.state.showInput });
  handleChange = e => this.setState({ value: e.target.value });

  render () {
    const {
      chartName,
      intl: { formatMessage }
    } = this.props;
    const {
      showInput
    } = this.state;

    return (<div className={styles.headerChange}>
      {showInput ? (
        <Fragment>
          <Input
            onChange={this.handleChange}
            defaultValue={chartName}
            placeholder={formatMessage({
              id: 'MetricsChart.nameOfChart'
            })}
          />
          <Button
            className={styles.btnControls}
            onClick={() => this.handleEditUndo()}
          >
            <Icon type="undo" />
          </Button>
          <Button
            onClick={this.handleSubmit}
            className={styles.btnControls}
            htmlType="submit"
            disabled={this.state.value === ''}
          >
            <Icon type="save" />
          </Button>
        </Fragment>
      ) : (
          <React.Fragment>
            <p className={`cardHeaderTitle ${styles.cardHeader}`}>{chartName}</p>
            {<Button
              className={styles.btnControls}
              onClick={() => this.handleEditUndo()}
            >
              <Icon type="edit" />
            </Button>
            }
          </React.Fragment>
        )}
    </div>);
  }
}

export default injectIntl(MetricsChartEditName);
