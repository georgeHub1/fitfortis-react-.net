import React, { Component } from 'react';
import CustomCard from '../Common/CustomCard.js';
import styles from './styles.module.less';
import { injectIntl, addLocaleData, IntlProvider } from 'react-intl';
import { notification, Icon, Dropdown, Menu, Button } from 'antd';
import { ReactComponent as share } from '../../img/share.svg';
import { ReactComponent as print } from '../../img/print.svg';
import ReactLoading from 'react-loading';
import { setActiveItem } from '../../redux/item.action';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchNewsFeedItemDetails } from '../../redux/adminTool.action';
import { SanitizeHTML } from '../../components/SanitizeHTML/SanitizeHTML';
import moment from 'moment';
import bgBG from 'react-intl/locale-data/bg';
import enUS from 'react-intl/locale-data/en';
import ukUA from 'react-intl/locale-data/uk';
import en from 'react-intl/locale-data/en';
import { flattenMessages } from '../../utils/translation';
import messages from '../../translation';
import { localeSet } from '../../redux/locale.action';
import SignUpPrompt from '../Common/SignUpPrompt';
import analyticId from '../../utils/AnalyticsAndAbTests.tsx';
addLocaleData([...bgBG, ...enUS, ...ukUA, ...en]);

const locale = window.location.search.includes('?lang=') ? window.location.search.substring(6, 11) : (localStorage.getItem('language') || 'en');

let intlProvider = new IntlProvider({ locale, messages: flattenMessages(messages[locale]) });

class HomeNewsEntry extends Component {
  componentWillMount () {
    const pathSnippets = window.location.pathname
      .split('/')
      .filter(i => i);

    analyticId.firebaseAnalyticsLog('Home_NewsfeedEntry', {newsFeedEntryId: pathSnippets[1]});
    this.fetchNewsFeedDetails(pathSnippets[1]);
    fetch(`/newsfeed/${pathSnippets[1]}`);
  }

  fetchNewsFeedDetails = id => {
    const { account } = this.props;
    const lan = window.location.search.includes('?lang=') ? window.location.search.substring(6, 11) : (localStorage.getItem('language') || 'en');

    if (window.location.search.includes('?lang=')) {
      this.props.onUpdateLanguage(lan);
      localStorage.setItem('language', lan);
    }

    this.props.fetchNewsFeedItemDetails(id, account.id, lan);
  }

  componentWillUnmount () {
    intlProvider = new IntlProvider({ locale: (localStorage.getItem('language') || 'en'), messages: flattenMessages(messages[(localStorage.getItem('language') || 'en')]) });
    this.props.setActiveItem(null);
  }
  isDisable = () => {
    const { auth } = this.props;

    return !auth.loggenIn;
  }

  shareFacebook = (url = window.location.href) => {
    analyticId.firebaseAnalyticsLog('Home_NewsfeedEntry_ClickShare', {shareTo: 'shareToFacebook'});
    return window.open(
      `http://facebook.com/sharer.php?s=100&p[url]=${url}`,
      'fbshare',
      'height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0'
      );
  };
  shareEmail = (url = window.location.href) => {
    analyticId.firebaseAnalyticsLog('Home_NewsfeedEntry_ClickShare', {shareTo: 'shareViaEmail'});
    return window.open(
      `${'mailto:?cc=&subject=Share a link&body='}${url}`,
      '_self'
      );
  };

  getURLForShare () {
    const lan = window.location.search.includes('?lang=') ? window.location.search.substring(6, 11) : (localStorage.getItem('language') || 'en');

    return `${window.location.origin}${window.location.pathname}?lang=${lan}`;
  }

  copyToClipboard = () => {
    const cpLink = this.getURLForShare();

    const textField = document.createElement('textarea');

    textField.innerText = cpLink;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
  };
  render () {
    const {
      adminTool: { isFetching, newsFeed }
    } = this.props;
    const { formatMessage } = (window.location.search.includes('?lang=')) ? intlProvider.getChildContext().intl : this.props.intl;
    const openNotification = () => {
      notification.success({
        message: formatMessage({ id: 'HomeNews.copied' })
      });
    };
    const menu = (
      <Menu className="dropDownShareMenu">
        <Menu.Item onClick={() => this.shareFacebook(this.getURLForShare())}>
          <div className={styles.menuItemBlock}>
            <Icon type="facebook" style={{ marginRight: 10 }} />
            <span>{formatMessage({ id: 'HomeNews.shareToFacebook' })}</span>
          </div>
        </Menu.Item>
        <Menu.Item onClick={() => this.shareEmail(this.getURLForShare())}>
          <div className={styles.menuItemBlock}>
            <Icon type="mail" style={{ marginRight: 10 }} />
            <span>{formatMessage({ id: 'HomeNews.shareToEmail' })}</span>
          </div>
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            analyticId.firebaseAnalyticsLog('Home_NewsfeedEntry_ClickShare', {shareTo: 'copyLink'});
            openNotification();
            this.copyToClipboard();
          }}
        >
          <div className={styles.menuItemBlock}>
          <Icon type="paper-clip" style={{ marginRight: 10 }} />
          <span>{formatMessage({ id: 'HomeNews.copyLink' })}</span>
          </div>
        </Menu.Item>
      </Menu>
    );

    if (isFetching) {
      return <ReactLoading className="react-loading-center" type="spin" color="#335889"  />;
    }
    return newsFeed
    ? (
      <div className={`${styles.containerHomeNewsEntry}`}>
        <div className={styles.HomeNewsEntryHeader} >
          {
              !(newsFeed.pictureUrl) && <h1 className={styles.headerTopTitle}>
              {newsFeed.title}
            </h1>
          }
          <div className={styles.navigation} >
            <div className={styles.sharePrintBlock}>
              <Dropdown
                overlay={menu}
                trigger={['click']}
                placement="bottomCenter"
              >
                <Button aria-label="HomeNewsShare" type="primary">
                <Icon component={share} />
                  {formatMessage({ id: 'HomeNews.share' })}
                </Button>
              </Dropdown>
              <Button type="primary" aria-label="HomeNewsPrint" onClick={() => {
                  window.print();
                  analyticId.firebaseAnalyticsLog('Home_NewsfeedEntry_ClickPrint', {});
                }}
              >
                <Icon component={print} />
                {formatMessage({ id: 'HomeNews.print' })}
              </Button>
            </div>
          </div>
        </div>
        {this.isDisable() ? <SignUpPrompt /> : ''}
        <div className={styles.navigation}>
          <CustomCard>
            <div className={styles.SingleNewspicture}>
            {
              newsFeed.pictureUrl && <img
                alt="example"
                src={newsFeed.pictureUrl}
              />
            }
            {
              newsFeed.pictureUrl && <h1 className={styles.header}>
              <mark>{newsFeed.title}</mark>
            </h1>
            }
            </div>
            <div className={styles.SingleNewsContent}>
              <p className={styles.date}>{moment(newsFeed.date).format('YYYY/MM/DD hh:mm A')}</p>
              <div className={styles.blockWithImagesOfSick}>
                <SanitizeHTML html={newsFeed.description} />
              </div>
            </div>
          </CustomCard>
        </div>
      </div>
    )
    : '';
  }
}

const mapStateToProps = (({ adminTool, auth, profile: { account } }) => ({ adminTool, account, auth }));


const mapDispatchToProps = dispatch => ({
  setActiveItem: bindActionCreators(setActiveItem, dispatch),
  fetchNewsFeedItemDetails: bindActionCreators(fetchNewsFeedItemDetails, dispatch),
  onUpdateLanguage: bindActionCreators(localeSet, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(HomeNewsEntry));
