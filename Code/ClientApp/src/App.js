import React, { Component, Fragment } from 'react';
import { IntlProvider, addLocaleData } from 'react-intl';
import bgBG from 'react-intl/locale-data/bg';
import enUS from 'react-intl/locale-data/en';
import ukUA from 'react-intl/locale-data/uk';
import en from 'react-intl/locale-data/en';
import { connect } from 'react-redux';
import Router from './containers/routers';
import { flattenMessages } from './utils/translation';
import messages from './translation';
import 'antd/dist/antd.less';
import './App.less';
import { fetchAccountMe } from './redux/auth.action';
import { localeSet } from './redux/locale.action';
import { localeLanguages } from './constants/locale';
import analyticId from './utils/AnalyticsAndAbTests.tsx';
import { ConfigProvider } from 'antd';

import antdEnUS from './translation/en-US/Antd';
import antdBgBG from './translation/bg-BG/Antd';
import antdUkUA from './translation/uk-UA/Antd';
import antdEn from './translation/en/Antd';
import 'moment/locale/uk';
import 'moment/locale/bg';
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
addLocaleData([...bgBG, ...enUS, ...ukUA, ...en]);

class App extends Component {
  displayName = App.name

  constructor (props) {
    super(props);
    const token = localStorage.getItem('session');

    this.state = {
      needAdditionalLoading: !(token === null || token === undefined) || false
    };
  }

  componentDidMount () {
    const token = localStorage.getItem('session');

    localStorage.setItem('userType', '');
    analyticId.checkIsUserType();
    analyticId.initializeAnalytics();
    analyticId.initializeAbTests();
    if (token) {
      this.props.dispatch(fetchAccountMe(JSON.parse(token).value))
        .then(() => this.setState({ needAdditionalLoading: false }));

      if (localStorage.language) {
        this.props.dispatch(localeSet(localStorage.language));
      }
    } else  {
      analyticId.firebaseAnalyticUserId('');
    }
  }
  render () {
    if (this.state.needAdditionalLoading) {
      return null;
    }
    const { language } = this.props;

    let locale = antdEn;

    if (language === localeLanguages.Ukraine.code)
      locale = antdUkUA;
    else if (language === localeLanguages.Bulgaria.code)
      locale = antdBgBG;
    else if (language === localeLanguages.Usa.code)
      locale = antdEnUS;
    return (
      <IntlProvider
        textComponent={Fragment}
        defaultLocale="en"
        locale={language}
        messages={flattenMessages(messages[language])} >
        <ConfigProvider locale={locale}>
          <Router />
        </ConfigProvider>
      </IntlProvider >
    );
  }
}

const mapStateToProps = state => {
  return {
    language: state.locale.language
  };
};

export default connect(mapStateToProps)(App);
