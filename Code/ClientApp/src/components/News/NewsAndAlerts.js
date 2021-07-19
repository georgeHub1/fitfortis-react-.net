import React, { Component } from 'react';
import { Tabs } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import NewsAndAlertsNews from './NewsAndAlertsNews';
import NewsAndAlertsAlerts from './NewsAndAlertsAlerts';
import styles from './styles.module.less';
import { localeSet } from '../../redux/locale.action';
import { connect } from 'react-redux';
import analyticId from '../../utils/AnalyticsAndAbTests.tsx';
const { TabPane } = Tabs;

class NewsAndAlerts extends Component {
  displayName = NewsAndAlerts.name

  componentDidMount () {
    if (window.location.search.includes('?lang=')) {
      const lan = window.location.search.includes('?lang=') ? window.location.search.substring(6, 11) : (localStorage.getItem('language') || 'en');

      this.props.dispatch(localeSet(lan));
      localStorage.setItem('language', lan);
      analyticId.firebaseAnalyticsLog('Alerts');
    }
  }
  render () {
    return (
      <div className="newsAndAlertsPage">
        <h1 className={styles.header}>
          <FormattedMessage id="NewsAndAlerts.header" />
        </h1>
        <Tabs
          defaultActiveKey="1"
          type="card"
          tabBarStyle={{ borderBottom: 'none', overflow: 'hidden' }}
          >
          <TabPane
            tab={
              <span>
                <FormattedMessage id="NewsAndAlerts.news" />
              </span>
            }
            key="1">
            <NewsAndAlertsNews />
          </TabPane>

          <TabPane
            tab={
              <span>
                <FormattedMessage id="NewsAndAlerts.alerts" />
                <span className="count">12</span>
              </span>
            }
            key="2">
            <NewsAndAlertsAlerts />
          </TabPane>
        </Tabs>
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

export default connect(mapDispatchToProps)(injectIntl(NewsAndAlerts));
