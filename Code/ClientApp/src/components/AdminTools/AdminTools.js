import React, { Component } from 'react';
import { Tabs } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import ReactLoading from 'react-loading';
import styles from './styles.module.less';
import CustomCard from '../Common/CustomCard.js';
import AdminToolsEmails from './AdminToolsEmails';
import AdminToolsNewsfeedList from './AdminToolsNewsfeedList';
import AdminToolsAnalytics from './AdminToolsAnalytics';
import { fetchAdminUserListing } from '../../redux/adminTool.action';
import { connect } from 'react-redux';
import { localeSet } from '../../redux/locale.action';
import analyticId from '../../utils/AnalyticsAndAbTests.tsx';


let resizeEvent;

class AdminTools extends Component {
  displayName = AdminTools.name;

  constructor (props) {
    super(props);
    this.formSectionRef = React.createRef();
    this.state = {
      activeTab: 'newsfeed',
      adminUserList: []
    };
  }

  componentDidMount () {
    if (window.location.search.includes('?lang=')) {
      const lan = window.location.search.includes('?lang=') ? window.location.search.substring(6, 11) : (localStorage.getItem('language') || 'en');

      this.props.onUpdateLanguage(lan);
      localStorage.setItem('language', lan);
    }
    if (this.props.userRole === 'user') {
      this.props.history.push('/');
    } else {
      resizeEvent = window.addEventListener('resize', () => {
        const { screenWidth } = this.state;

        if (Math.abs(screenWidth - window.innerWidth) > 100) {
          this.setState({...this.state});
        }
      });
      this.props.fetchAdminUserListing();
    }
    analyticId.firebaseAnalyticsLog('AdminTools_Newsfeed');
  }

  componentWillUnmount () {
    if (resizeEvent) {
      resizeEvent.unsubscribe();
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.adminTool.isAdminUserListLoaded && nextProps.adminTool.isAdminUserListLoaded) {
      this.setState({...this.state, adminUserList: nextProps.adminTool.adminUserList});
    }
  }

  onChangeTab = activeTab => {
    this.setState({ activeTab });
  };

  render () {
    const { adminUserList, activeTab } = this.state;
    const {
      intl: { formatMessage },
      adminTool: { isAdminUserListFetching },
      account: { email }
    } = this.props;

    return (
      <div className="profilePage">
        <h1 className={styles.header}>
          <FormattedMessage id='AdminTools.header' />
        </h1>
        {
          (!isAdminUserListFetching)
          ? <AdminToolsEmails activeEmail={email} adminUserList={adminUserList}/>
          : <ReactLoading className="react-loading-center" type="spin" color="#335889"  />
        }
        <section className="tabsection">
          <Tabs
            onChange={ this.onChangeTab }
            type="card"
            activeKey={ activeTab }
            tabBarStyle={{ borderBottom: 'none', overflow: 'hidden' }}
          >
            <Tabs.TabPane
              className="ProfileSettings"
              tab={formatMessage({
                id: 'AdminTools.newsfeed'
              })}
              key={ 'newsfeed' }
            >
              <CustomCard
                style={{ borderTopWidth: 0, borderTopRightRadius: 0 }}
              >
                <AdminToolsNewsfeedList />
              </CustomCard>
            </Tabs.TabPane>

            <Tabs.TabPane
              className="ProfileBasicInformation"
              tab={formatMessage({
                id: 'AdminTools.analytics'
              })}
              key={ 'analytics' }
            >
              <CustomCard>
                <AdminToolsAnalytics />
              </CustomCard>
            </Tabs.TabPane>
          </Tabs>
        </section>
      </div>
    );
  }
}

const mapStateToProps = (({ adminTool, profile: { account, userRole } }) => ({ userRole, adminTool, account }));

const mapDispatchToProps = dispatch => ({
  fetchAdminUserListing (...args) {
    return dispatch(fetchAdminUserListing(...args));
  },
  onUpdateLanguage (args) {
    dispatch(localeSet(args));
    return Promise.resolve();
  }
});

const WrappedAdminTools = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  AdminTools
);

export default injectIntl(WrappedAdminTools);
