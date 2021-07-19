import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Tabs } from 'antd';
import { injectIntl } from 'react-intl';
import styles from './styles.module.less';
import { FormattedMessage } from 'react-intl';
import { SanitizeHTML } from '../SanitizeHTML/SanitizeHTML';
import CustomCard from '../Common/CustomCard.js';
import { enUSDescriptionAbout } from '../../translation/en-US/Common/DescriptionAbout';
import { enDescriptionAbout } from '../../translation/en/Common/DescriptionAbout';
import { bgDescriptionAbout } from '../../translation/bg-BG/Common/DescriptionAbout';
import { ukDescriptionAbout } from '../../translation/uk-UA/Common/DescriptionAbout';
import { localeSet } from '../../redux/locale.action';
import { connect } from 'react-redux';
import analyticId from '../../utils/AnalyticsAndAbTests.tsx';

const { TabPane } = Tabs;

class AboutPage extends Component {
  state = {
    current: '1'
  };
  componentDidMount () {
    if (window.location.search.includes('?lang=')) {
      const lan = window.location.search.includes('?lang=') ? window.location.search.substring(6, 11) : (localStorage.getItem('language') || 'en');

      this.props.dispatch(localeSet(lan));
      localStorage.setItem('language', lan);
    }
    analyticId.firebaseAnalyticsLog('About_About');
  }

  render () {
    const { intl: { locale } } = this.props;

    let description = '';

    if (locale === 'en-us') {
      description = enUSDescriptionAbout;
    } else if (locale === 'uk-ua') {
      description = ukDescriptionAbout;
    } else if (locale === 'en') {
      description = enDescriptionAbout;
    } else {
      description = bgDescriptionAbout;
    }

    return (
      <div className={styles.TermsOffUse}>
        <div className={styles.title}>
          <FormattedMessage id='About.title' tagName='h1'/>
        </div>
        <div className="AboutCustomCard">
          <Tabs defaultActiveKey="1">
            <TabPane
              tab={
                <span className="tabActive">
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
                <span>
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

export default connect(mapDispatchToProps)(injectIntl(AboutPage));
