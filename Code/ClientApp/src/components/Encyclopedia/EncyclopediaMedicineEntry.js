import React, { Component } from 'react';
import {
  Alert,
  Icon,
  Button,
  notification,
  Menu,
  Dropdown
} from 'antd';
import { connect } from 'react-redux';
import ReactLoading from 'react-loading';
import { injectIntl, addLocaleData, IntlProvider } from 'react-intl';
import CustomCard from '../Common/CustomCard.js';
import styles from './styles.module.less';
import { SanitizeHTML } from '../../components/SanitizeHTML/SanitizeHTML';
import { fetchEncyclopediaMedicineDetail } from '../../redux/encyclopedia.action';
import { ReactComponent as share } from '../../img/share.svg';
import { ReactComponent as print } from '../../img/print.svg';
import { setActiveItem } from '../../redux/item.action';
import bgBG from 'react-intl/locale-data/bg';
import enUS from 'react-intl/locale-data/en';
import ukUA from 'react-intl/locale-data/uk';
import en from 'react-intl/locale-data/en';
import { flattenMessages } from '../../utils/translation';
import messages from '../../translation';
import { localeSet } from '../../redux/locale.action';
// import auth from '../../backendServices/auth';
import SignUpPrompt from '../Common/SignUpPrompt';
import analyticId from '../../utils/AnalyticsAndAbTests.tsx';
addLocaleData([...bgBG, ...enUS, ...ukUA, ...en]);

const locale = window.location.search.includes('?lang=') ? window.location.search.substring(6, 11) : (localStorage.getItem('language') || 'en');

let intlProvider = new IntlProvider({ locale, messages: flattenMessages(messages[locale]) });


class EncyclopediaMedicineEntry extends Component {
  displayName = EncyclopediaMedicineEntry.name;
  intervalID = 0;
  constructor (props) {
    super(props);
    this.state = {
      showAlert: false,
      loading: true,
      fullInfo: {},
      id: 0,
      open: true,
      interval: 0,
      isClicked: false,
      position: 0,
      currentPath: '',
      currentId: '',
      isToggle: false
    };
    this.model3D = React.createRef();
  }
  componentDidMount () {
    const pathSnippets = window.location.pathname
          .split('/')
          .filter(i => i);

    this.setState({
      ...this.state,
      loading: false,
      currentId: pathSnippets[pathSnippets.length - 1]
    });
    analyticId.firebaseAnalyticsLog('Encyclopedia_DrugsMeds_Item', {encyclopediaDrugId: pathSnippets[1]});
    const lan = window.location.search.includes('?lang=') ? window.location.search.substring(6, 11) : (localStorage.getItem('language') || 'en');

    if (window.location.search.includes('?lang=')) {
      this.props.onUpdateLanguage(lan);
      localStorage.setItem('language', lan);
    }
    intlProvider = new IntlProvider({ locale: lan, messages: flattenMessages(messages[lan]) });
    this.props.fetchEncyclopediaMedicineDetail(pathSnippets[pathSnippets.length - 1], lan);
    fetch(`/encyclopediaMedicine/${pathSnippets[1]}?lang=${lan}`);
  }
  componentWillUnmount () {
    intlProvider = new IntlProvider({ locale: (localStorage.getItem('language') || 'en'), messages: flattenMessages(messages[(localStorage.getItem('language') || 'en')]) });
    this.props.setActiveItem(null);
    clearInterval(this.intervalID);
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
  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.location) {
      if (nextProps.location.pathname !== prevState.currentPath) {
        const pathSnippets = nextProps.location.pathname
          .split('/')
          .filter(i => i);

        return {
          currentPath: nextProps.location.pathname,
          currentId: pathSnippets[pathSnippets.length - 1],
          fullInfo: {
            image: 'https://doctorsurgentcare.org/wp-content/uploads/2017/10/Doctors-Urgent-Care-70458-Pneumonia.jpg'
          }
        };
      }
    }

    return null;
  }

  getURLForShare () {
    const lan = window.location.search.includes('?lang=') ? window.location.search.substring(6, 11) : (localStorage.getItem('language') || 'en');

    return `${window.location.origin}${window.location.pathname}?lang=${lan}`;
  }

  shareFacebook = (url = window.location.href) => {
    analyticId.firebaseAnalyticsLog('Encyclopedia_DrugsMeds_Item_ClickShare', {shareTo: 'shareToFacebook'});
    return window.open(
      `http://facebook.com/sharer.php?s=100&p[url]=${url}`,
      'fbshare',
      'height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0'
    );
  };
  shareEmail = (url = window.location.href) => {
    analyticId.firebaseAnalyticsLog('Encyclopedia_DrugsMeds_Item_ClickShare', {shareTo: 'shareViaEmail'});
    return window.open(
      `${'mailto:?cc=&subject=Share a link&body='}${url}`,
      '_self'
    );
  };
  render () {
    const { showAlert, loading } = this.state;

    const { formatMessage } = (window.location.search.includes('?lang=')) ? intlProvider.getChildContext().intl : this.props.intl;

    const { title = '', description = '' } = this.props.encyclopediaMedicine;

    const openNotification = () => {
      notification.success({
        message: formatMessage({ id: 'EncyclopediaMedicineEntry.copied' })
      });
    };
    const menu = (
      <Menu className="dropDownShareMenu">
        <Menu.Item onClick={() => this.shareFacebook(this.getURLForShare())}>
          <div className={styles.menuItemBlock}>
            <Icon type="facebook" style={{ marginRight: 10 }} />
            <span>{formatMessage({ id: 'EncyclopediaMedicineEntry.shareToFacebook' })}</span>
          </div>
        </Menu.Item>
        <Menu.Item onClick={() => this.shareEmail(this.getURLForShare())}>
          <div className={styles.menuItemBlock}>
            <Icon type="mail" style={{ marginRight: 10 }} />
            <span>{formatMessage({ id: 'EncyclopediaMedicineEntry.shareToEmail' })}</span>
          </div>
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            analyticId.firebaseAnalyticsLog('Encyclopedia_DrugsMeds_Item_ClickShare', {shareTo: 'copyLink'});
            openNotification();
            this.copyToClipboard();
          }}
        >
          <div className={styles.menuItemBlock}>
            <Icon type="paper-clip" style={{ marginRight: 10 }} />
            <span>{formatMessage({ id: 'EncyclopediaMedicineEntry.copyLink' })}</span>
          </div>
        </Menu.Item>
      </Menu>
    );

    if (this.props.isMedicineLoading) {
      return (
        <div >
          <ReactLoading className={styles.center} type="spin" color="#335889"  />
        </div>
      );
    }

    return (
      <div className={`${styles.containerEncyclopediaEntry} EncyclopediaMedicineEntry`}>
      <div className={styles.EncyclopediaHeader} >
        <h1 className={styles.header}>
          {title}
        </h1>
        {showAlert && (
          <Alert
            type="error"
            message="Health Alert"
            description="Appendicitis is a life-threatening condition. If you believe you may
            have apendicitis, please contact an emergency room immediately!"
            showIcon
            closable
            style={{ marginBottom: 16 }}
          />
        )}
        <div className={styles.navigation} >
          <div className={styles.sharePrintBlock}>
            <Dropdown
              overlay={menu}
              trigger={['click']}
              placement="bottomCenter"
            >
              <Button type="primary">
                <Icon component={share} />
                {formatMessage({ id: 'EncyclopediaMedicineEntry.share' })}
              </Button>
            </Dropdown>
            <Button type="primary" onClick={() => {
              window.print();
              analyticId.firebaseAnalyticsLog('Encyclopedia_DrugsMeds_Item_ClickPrint', {});
            }}
            >
              <Icon component={print} />
              {formatMessage({ id: 'EncyclopediaMedicineEntry.print' })}
            </Button>
          </div>
        </div>
        </div>
        {!this.props.auth.loggenIn ? <SignUpPrompt /> : ''}
        <div className="EncyclopediaEntryCustomCard">
          <CustomCard
          >
            <div className={styles.blockWithImagesOfSick}>
              <div className={styles.maxWidth}>
                {loading ? (
                  <div className={styles.spinnerContainer}>
                    <ReactLoading type="spin" color="#fff" />
                  </div>
                ) : (
                  ''
                )}
                <SanitizeHTML html={description} />
              </div>
            </div>
          </CustomCard>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (({auth, encyclopedia: { encyclopediaMedicine, isMedicineLoading } }) => ({ auth, encyclopediaMedicine, isMedicineLoading }));

const mapDispatchToProps = dispatch => ({
  fetchEncyclopediaMedicineDetail (...args) {
    return dispatch(fetchEncyclopediaMedicineDetail(...args));
  },
  onUpdateLanguage (args) {
    dispatch(localeSet(args));
    return Promise.resolve();
  },
  setActiveItem (...args) {
    return dispatch(setActiveItem(...args));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(EncyclopediaMedicineEntry));
