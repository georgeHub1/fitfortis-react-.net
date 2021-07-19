import React, { Component, lazy, Suspense } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import styles from './styles.module.less';
// import HomeNews from './HomeNews';
// import HomeCharts from './HomeCharts';
import { connect } from 'react-redux';
import SignUpPrompt from '../Common/SignUpPrompt';
import { localeSet } from '../../redux/locale.action';

import analyticId from '../../utils/AnalyticsAndAbTests.tsx';
const HomeNews = lazy(() => import('./HomeNews'));
const HomeCharts = lazy(() => import('./HomeCharts'));
const renderLoader = () => <p></p>;

class Home extends Component {
  displayName = Home.name

  componentDidMount () {
    window.scrollTop = 0;
    if (window.location.search.includes('?lang=')) {
      const lan = window.location.search.includes('?lang=') ? window.location.search.substring(6, 11) : (localStorage.getItem('language') || 'en');

      this.props.dispatch(localeSet(lan));
      localStorage.setItem('language', lan);
    }
    analyticId.firebaseAnalyticsLog('Home');
  }

  isDisable = () => {
    const { auth } = this.props;

    return !auth.loggenIn;
  }
  handleAddNewChart = () => localStorage.setItem('isShowAddNewChart', 'yes');

  render () {
    const { auth } = this.props;

    return (
      <div>
        <h1 className={`${styles.header} HideMobileTitle`}>
          <FormattedMessage id="Home.header" />
        </h1>
        {this.isDisable() ? <SignUpPrompt /> : ''}
        <div className={auth.loggenIn ? 'mainHomeSection' : 'mainHomeSection notLogin'}>
          <Suspense fallback={renderLoader()}>
            <HomeCharts />
          <div className="MainhomeLeft">
            <div className={styles.homeLeft}>
              <HomeNews history={this.props.history}/>
            </div>
          </div>
          </Suspense>
        </div>
      </div>
    );
  }
}
const mapStateToProps = ({ auth }) => ({ auth });

export default connect(mapStateToProps)(injectIntl(Home));
