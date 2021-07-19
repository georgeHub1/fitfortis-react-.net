import React, { Component } from 'react';
import { Button, Tooltip, Icon } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import styles from './styles.module.less';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { SanitizeHTML } from '../SanitizeHTML/SanitizeHTML';
const COUNT_OF_ENCICLOPEDIA_DESCRIPTION = 180;

class AvailableMetric extends Component {
  static propTypes = {
    metric: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }),
    onAdd: PropTypes.func.isRequired,
    searchValue: PropTypes.string.isRequired
  };

  constructor (props) {
    super(props);
    this.state = { isAddingMetric: false };
  }

  getHighlightedText = (higlight, text) => {
    const parts = text.split(new RegExp(`(${(higlight || '').toString()})`, 'gi'));

    return (
      <span key={text}>
        {parts.map((part, i) => (
          <span
            key={i}
            style={
              higlight !== '' && part.toLowerCase().indexOf(higlight.toLowerCase()) !== -1
                ? { fontWeight: 'bold', backgroundColor: '#FCABF9' }
                : {}
            }
          >
            {part}
          </span>
        ))}
      </span>
    );
  };

  onAdd = item => {
    if (this.state.isAddingMetric)
      return;

    this.setState(
      state => ({ isAddingMetric: true }),
      () => { this.props.onAdd(item); }// .catch(err => this.setState({isAddingMetric:false })); }
    );
  }

  render () {
    const { metric: item, searchValue, isHideUintMetric } = this.props;
    const { isAddingMetric } = this.state;

    return (<div>
      {!isHideUintMetric
        && <div className={styles.availableItem} key={`metric-${item.name}`}>
        <div className={styles.metricInfoBlock}>
          <div className={styles.leftSideAvailable}>
            <div>{this.getHighlightedText(searchValue, item.name)}</div>
            <Tooltip
              title={props => {
                const link = '/encyclopedia'.concat((item.encyclopediaId) ? `/${item.encyclopediaId}` : '');
                const description =   ((item.description || '').length > COUNT_OF_ENCICLOPEDIA_DESCRIPTION)
                ? (`${(item.description || '').substr(0, COUNT_OF_ENCICLOPEDIA_DESCRIPTION)}`.concat('...'))
                : item.description;

                return (
                  <div>
                  <span className="metrics-ant-tooltip-inner">
                    <SanitizeHTML html={description} />
                  </span>
                  <p style={{textAlign:'right'}}>
                    <Link to={link} style={{color:'#fff', textDecoration: 'underline'}}>
                        <FormattedMessage id="SymptomCheckerSideBar.readMore" />
                    </Link>
                  </p>
                  </div>
              );
              }}
              placement="right">
              <Button type="primary" className={styles.tooltipBtn}>
                ?
              </Button>
            </Tooltip>
          </div>
          <Button
            onClick={() => {
              this.onAdd(item);
            }}
            type="primary"
            className={styles.addBtn}
          >
            {
              isAddingMetric ? <Icon type="loading" />
                : <FormattedMessage id="NewMetric.addBtn" />
            }
          </Button>
        </div>
      </div >
      }
    </div>
    );
  }
}

export default injectIntl(AvailableMetric);
