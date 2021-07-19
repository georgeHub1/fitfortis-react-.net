import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ReactLoading from 'react-loading';

import { confirmAccount } from '../../redux/auth.action.js';

import { getQueryVariable } from '../../utils/common.js';

import styles from './styles.module.less';
import analyticId from '../../utils/AnalyticsAndAbTests.tsx';

class ConfirmationPage extends React.Component {
  componentDidMount () {
    analyticId.firebaseAnalyticsLog('Sisu_CreateAccount_ConfirmYourEmail');
    const { location, history, confirmAccount } = this.props;

    if (location.search) {
      const token = getQueryVariable('token', location.search);
      const userId = getQueryVariable('userId', location.search);

      return confirmAccount(token, userId, history);
    }
    history.push('/');
  }
  render () {
    return (
      <div className={styles.spinnerContainer}>
        <ReactLoading type="spin" color="#fff" />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  confirmAccount: (...args) => {
    return dispatch(confirmAccount(...args));
  }
});

export default connect(null, mapDispatchToProps)(withRouter(ConfirmationPage));
