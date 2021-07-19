import React, { Component } from 'react';
import { Alert } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import styles from './styles.module.less';
import { localeSet } from '../../redux/locale.action';
import analyticId from '../../utils/AnalyticsAndAbTests.tsx';

class Devices extends Component {
  displayName = Devices.name

  constructor (props) {
    super(props);

    if (props.userRole.toLowerCase() === 'user') {
      props.history.push('/');
    }
  }
  componentDidMount () {
    if (window.location.search.includes('?lang=')) {
      const lan = window.location.search.includes('?lang=') ? window.location.search.substring(6, 11) : (localStorage.getItem('language') || 'en');

      this.props.onUpdateLanguage(lan);
      localStorage.setItem('language', lan);
    }
    analyticId.firebaseAnalyticsLog('Devices');
  }

  render () {
    return (
      <div>
        <h1 className={styles.header}>
          <FormattedMessage id="Devices.header" />
        </h1>
        <Alert
          type="warning"
          message={<FormattedMessage id='Devices.underConstruction' />}
          description={<FormattedMessage id='Devices.description' />}
          showIcon
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userRole: state.profile.userRole
  };
};

const mapDispatchToProps = dispatch => ({
  onUpdateLanguage (args) {
    dispatch(localeSet(args));
    return Promise.resolve();
  }
});

const WrappedDevices = connect(
  mapStateToProps,
  mapDispatchToProps,
  null
)(
  Devices
);

export default injectIntl(WrappedDevices);
