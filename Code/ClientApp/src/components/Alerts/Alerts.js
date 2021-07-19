import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Alert } from 'antd';
import styles from './styles.module.less';
import { alertList } from './const';
import { localeSet } from '../../redux/locale.action';
import { connect } from 'react-redux';
import analyticId from '../../utils/AnalyticsAndAbTests.tsx';

class Alerts extends Component {
  displayName = Alerts.name

  constructor (props) {
    super(props);
    this.state = {
      list: alertList
    };
  }

  componentDidMount () {
    if (window.location.search.includes('?lang=')) {
      const lan = window.location.search.includes('?lang=') ? window.location.search.substring(6, 11) : (localStorage.getItem('language') || 'en');

      this.props.dispatch(localeSet(lan));
      localStorage.setItem('language', lan);
    }
    analyticId.firebaseAnalyticsLog('Alerts');
  }

  getClassName = type => {
    if (type === 'red') {
      return styles.redAlert;
    } else if (type === 'blue') {
      return styles.blueAlert;
    }
    return '';
  }

  removeItem = index => {
    const { list } = this.state;

    list.splice(index, 1);
    this.setState({ ...this.state, list});
  }

  render () {
    return (
      <div>
        <h1 className={styles.header}>
          <FormattedMessage id="Alerts.header" />
        </h1>
        <Alert
          message={<FormattedMessage id='Alerts.underConstruction' />}
          description={<FormattedMessage id='Alerts.description' />}
          type="info"
        />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  onUpdateLanguage (args) {
    dispatch(localeSet(args));
    return Promise.resolve();
  }
});

export default connect(mapDispatchToProps)(injectIntl(Alerts));
