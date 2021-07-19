import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Tabs } from 'antd';
import { injectIntl } from 'react-intl';
import styles from './styles.module.less';
import { FormattedMessage } from 'react-intl';
import { SanitizeHTML } from '../SanitizeHTML/SanitizeHTML';
import CustomCard from '../Common/CustomCard.js';
import { enUSDescriptionPrivacyAndLegal } from '../../translation/en-US/Common/DescriptionPrivacyAndLegal';
import { enDescriptionPrivacyAndLegal } from '../../translation/en/Common/DescriptionPrivacyAndLegal';
import { bgDescriptionPrivacyAndLegal } from '../../translation/bg-BG/Common/DescriptionPrivacyAndLegal';
import { ukDescriptionPrivacyAndLegal } from '../../translation/uk-UA/Common/DescriptionPrivacyAndLegal';
import { localeSet } from '../../redux/locale.action';
import { connect } from 'react-redux';
import analyticId from '../../utils/AnalyticsAndAbTests.tsx';

const { TabPane } = Tabs;

class PrivacyAndLegalPage extends Component {
  state = {
    current: '2'
  };
  componentDidMount () {
    if (window.location.search.includes('?lang=')) {
      const lan = window.location.search.includes('?lang=') ? window.location.search.substring(6, 11) : (localStorage.getItem('language') || 'en');

      this.props.dispatch(localeSet(lan));
      localStorage.setItem('language', lan);
    }
    analyticId.firebaseAnalyticsLog('About_PrivacyAndLegal');
  }
  render () {
    const { intl: { locale } } = this.props;

    let description = '';

    if (locale === 'en-us') {
      description = enUSDescriptionPrivacyAndLegal;
    } else if (locale === 'uk-ua') {
      description = ukDescriptionPrivacyAndLegal;
    } else if (locale === 'en') {
      description = enDescriptionPrivacyAndLegal;
    } else {
      description = bgDescriptionPrivacyAndLegal;
    }

    return (
      <div className={styles.TermsOffUse}>
        <div className={styles.title}>
          <FormattedMessage id='PrivacyAndLegal.title' tagName='h1'/>
        </div>
        <div className="AboutCustomCard">
          <Tabs defaultActiveKey="2">
            <TabPane
              tab={
                <span>
                  <NavLink to="/about">
                    <FormattedMessage id='About.menuitem1' tagName='span'/>
                  </NavLink>
                </span>
              }
              key="1"
            >
            </TabPane>
            <TabPane
              tab={
                <span className="tabActive">
                  <NavLink to="/about/privacyAndLegal">
                    <FormattedMessage id='About.menuitem2' tagName='span'/>
                  </NavLink>
                </span>
              }
              key="2"
            >
            </TabPane>
          </Tabs>
          <CustomCard>
            <SanitizeHTML html={description} />
          </CustomCard>
        </div>
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

export default connect(mapDispatchToProps)(injectIntl(PrivacyAndLegalPage));
