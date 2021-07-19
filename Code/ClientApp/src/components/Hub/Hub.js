import React, { Component } from 'react';
import { NavLink, withRouter, Link } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import TriggerBtn from './TriggerBtn.js';
import AvatarFemale from '../../img/avatar_Female.svg';
import AvatarMale from '../../img/avatar_Male.svg';
import { ReactComponent as Home } from '../../img/home.svg';
import { ReactComponent as News } from '../../img/news.svg';
import { ReactComponent as Devices } from '../../img/devices.svg';
import { ReactComponent as Metrics } from '../../img/metrics.svg';
import { ReactComponent as Documents } from '../../img/documents.svg';
import { ReactComponent as Encyclopedia } from '../../img/encyclopedia.svg';
import { ReactComponent as SymptomChecker } from '../../img/symptomChecker.svg';
import { ReactComponent as AdminTools } from '../../img/adminTools.svg';
import styles from './styles.module.less';
import { getActivePathName } from './util';

const { Sider, Content, Header, Footer } = Layout;


class Hub extends Component {
  displayName = Hub.name
  constructor (props) {
    super(props);
    this.state = {
      collapsed: false,
      open: false,
      isMobileView: (window.innerWidth <= 767)
    };
  }

  componentWillMount () {
    window.addEventListener('resize', this.resizeEvent);
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.resizeEvent);
  }

  resizeEvent = e => {
    if (window.innerWidth > 767) {
      this.setState({
        ...this.state,
        isMobileView: false
      });
    } else {
      this.setState({
        ...this.state,
        isMobileView: true
      });
    }
  }

  onCollapse = () => {
    this.setState({ collapsed: !this.state.collapsed });
    this.setState({ open: !this.state.open });
  }

  getActiveClass = () => {
    if (window.location.pathname.includes('newsfeed') || window.location.pathname === '/') {
      return styles.activeLink;
    }
    return '';
  }

  isDisable = () => {
    const { auth } = this.props;

    return !auth.loggenIn;
  }

  isBackButtonRequired = () => {
    const { location } = this.props.history;

    if (location.pathname.includes('/encyclopedia/')) {
      return true;
    }
    if (location.pathname.includes('/newsfeed/')) {
      return true;
    }
    if (location.pathname.includes('/encyclopediaMedicine/')) {
      return true;
    }
    return false;
  }

  goBack = () => {
    const { history } = this.props;

    history.goBack();
  }

  render () {
    const { collapsed, isMobileView, open } = this.state;
    const { auth, account, genderIdentity, avatar, item, userRole } = this.props;
    const defaultAvatar = genderIdentity === 'Female' ? AvatarFemale : AvatarMale;

    return (
      <Layout className={styles.layout_main}>
        {
          !isMobileView
           ? <Sider
          collapsible
          width={ 280 }
          breakpoint='lg'
          trigger={ null }
          collapsedWidth={ 115 }
          className={styles.sidebar_class}
          onCollapse={this.onCollapse}
          collapsed={collapsed} >
          <div className={ styles.menuContainer } style={{ width: '100%' }} >
            <TriggerBtn collapsed={ collapsed } onClick={ this.onCollapse } />
            <div className={ `logo ${styles.logo}` }>
              { collapsed
                ? <FormattedMessage id='Hub.headerMinimized' />
                : <FormattedMessage id='Hub.header' />
              }
            </div>
            <Menu
              selectable={ false }
              className={ styles.menu }
              mode="inline" >
              <Menu.Item className={ styles.navItem } style={{ width: '100%' }}>
                <NavLink
                  activeClassName={ styles.activeLink }
                  className={`${styles.linkClass} ${this.isDisable() ? 'withoutLogin' : ''}`} to="/profile">
                  {
                    auth.loggenIn
                    ? <React.Fragment>

                      <img className={ `${ styles.avatar } anticon` } src={avatar ? avatar :  defaultAvatar } alt='avatar' />
                      <span>{account.firstName}</span>
                    </React.Fragment>
                    : <React.Fragment>
                      <Icon style={{ fontSize: '34px', height: '34px', margin: '16px 21px' }} type="login" />
                      <FormattedMessage id='Hub.signIn' tagName='span'/>
                    </React.Fragment>
                  }
                </NavLink>
              </Menu.Item>
              <Menu.Item className={ styles.navItem } style={{ width: '100%' }}>
                <NavLink
                  exact
                  className={`${styles.linkClass} ${this.getActiveClass()}`}
                  to="/"
                  >
                  <Icon style={{ fontSize: '34px', height: '34px', margin: '16px 21px' }} component={ Home } />
                  <FormattedMessage id='Hub.home' tagName='span'/>
                </NavLink>
              </Menu.Item>
              <Menu.Item className={ styles.navItem } style={{ width: '100%' }}>
                <NavLink
                  activeClassName={ styles.activeLink }
                  className={`${styles.linkClass} ${this.isDisable() ? 'withoutLogin' : ''}`}
                  to="/metrics">
                  <Icon style={{ fontSize: '34px', height: '34px', margin: '16px 21px' }} component={ Metrics } />
                  <FormattedMessage id='Hub.metrics' tagName='span'/>
                </NavLink>
              </Menu.Item>
              <Menu.Item className={ styles.navItem } style={{ width: '100%' }}>
                <NavLink
                  activeClassName={ styles.activeLink }
                  className={`${styles.linkClass} ${this.isDisable() ? 'withoutLogin' : ''}`}
                  to="/alerts">
                  <Icon style={{ fontSize: '34px', height: '34px', margin: '16px 21px' }} component={ News }  />
                  <FormattedMessage id='Hub.alerts' tagName='span'/>
                </NavLink>
              </Menu.Item>
              {
                <Menu.Item className={ styles.navItem } style={{ width: '100%' }}>
                  <NavLink
                    activeClassName={ styles.activeLink }
                    className={`${styles.linkClass} ${this.isDisable() ? 'withoutLogin' : ''}`}
                    to="/documents">
                    <Icon style={{ fontSize: '34px', height: '34px', margin: '16px 21px' }} component={ Documents }  />
                    <FormattedMessage id='Hub.documents' tagName='span'/>
                  </NavLink>
                </Menu.Item>
              }
              {
                userRole.toLowerCase() !== 'user'
                && <Menu.Item className={ styles.navItem } style={{ width: '100%' }}>
                  <NavLink
                    disabled={this.isDisable()}
                    activeClassName={ styles.activeLink }
                    className={ styles.linkClass } to="/devices">
                    <Icon style={{ fontSize: '34px', height: '34px', margin: '16px 21px' }} component={ Devices }  />
                    <FormattedMessage id='Hub.devices' tagName='span'/>
                  </NavLink>
                </Menu.Item>
              }
              <Menu.Item className={ styles.navItem } style={{ width: '100%' }}>
                <NavLink
                  activeClassName={ styles.activeLink }
                  className={window.location.pathname.includes('encyclopediaMedicine') ? `${styles.linkClass} ${styles.activeLink}` : styles.linkClass }
                  to="/encyclopedia">
                  <Icon style={{ fontSize: '34px', height: '34px', margin: '16px 21px' }} component={ Encyclopedia }  />
                  <FormattedMessage id='Hub.encyclopedia' tagName='span'/>
                </NavLink>
              </Menu.Item>
              {
                userRole.toLowerCase() !== 'user'
                && <Menu.Item className={ styles.navItem } style={{ width: '100%' }}>
                  <NavLink
                    disabled={this.isDisable()}
                    activeClassName={ styles.activeLink }
                    className={ styles.linkClass } to="/symptomChecker">
                    <Icon style={{ fontSize: '34px', height: '34px', margin: '16px 21px' }} component={ SymptomChecker }  />
                    <FormattedMessage id='Hub.symptomChecker' tagName='span'/>
                  </NavLink>
                </Menu.Item>
              }
              {
                userRole.toLowerCase() !== 'user'
                ? <Menu.Item className={ styles.navItem } style={{ width: '100%' }}>
                  <NavLink
                    disabled={this.isDisable()}
                    activeClassName={ styles.activeLink }
                    className={ styles.linkClass } to="/adminTools">
                    <Icon style={{ fontSize: '34px', height: '34px', margin: '16px 21px' }} component={ AdminTools } />
                    <FormattedMessage id='Hub.adminTools' tagName='span'/>
                  </NavLink>
                </Menu.Item>
                : ''
              }
            </Menu>
          </div>
          <div className={styles.termsofuselink + (open ? ' open' : '')}>
            <Link className={styles.toslink} to='/about'>
              <FormattedMessage id='Hub.termsofuse' tagName='span'/>
            </Link>
          </div>
        </Sider>
        : <HeaderComponent
          location={this.props.location}
          account={account}
          defaultAvatar={defaultAvatar}
          avatar={avatar}
          isBackButton={this.isBackButtonRequired()}
          goBack={this.goBack}
          item={item}
          isDisable={this.isDisable()}
        />
      }
        <Layout
          id="main_container"
          breakpoint='md'
          className={`main_layout_main_inner ${styles.layout_main_inner}`}
        >
          <Content className={ `${styles.contentContainer} ${styles.responsivecontentContainer}` }>
            {this.props.children}
          </Content>
        </Layout>
        {
          !isMobileView
          ? ''
          : <FooterComponent getActiveClass={this.getActiveClass} userRole={userRole} isDisable={this.isDisable()}/>
        }
      </Layout>
    );
  }
}

const HeaderTitle = ({ item }) => {
  return (item ? <h1 className={styles.mobileViewHeaderTitle}>{item.title}</h1> : '');
};


const HeaderComponent = ({ item, location, account, defaultAvatar, avatar, isBackButton, goBack, isDisable }) => {
  return (
    <Header className="responsiveHeader" theme={'light'} >
      <div className="innerResponsiveHeader">
        <React.Fragment>
          <NavLink
            aria-label="profile tab"
            activeClassName={ styles.activeLink }
            className={`${styles.linkClass}`}
            to="/profile">
             <img className={ `${ styles.avatar } anticon` } src={avatar ? avatar :  defaultAvatar } alt='avatar' />
           </NavLink>
        </React.Fragment>
        {
          isBackButton
          ? <HeaderTitle item={item} />
          : <FormattedMessage id={getActivePathName(location.pathname)} tagName='h1'/>
         }
        <React.Fragment>
          <NavLink
            aria-label="alerts tab"
            activeClassName={ styles.activeLink }
            className={`${styles.linkClass}`}
            to="/alerts">
            <Icon style={{ fontSize: '30px', height: '30px' }} component={ News }  />
          </NavLink>
        </React.Fragment>
      </div>
    </Header>
  );
};

const FooterComponent = ({ getActiveClass, userRole, isDisable }) => {
  return (
     <Footer className= {`responsiveFooter ${styles.MainresponsiveFooter}`}>
     <div className="innerResponsiveFooter">
      <NavLink
      aria-label="hmoe tab"
       exact
       activeClassName={ styles.activeLink }
       className={`${styles.linkClass} ${getActiveClass()}` }
       to="/">
        <Icon component={ Home } />
      </NavLink>
       <NavLink
       aria-label="metrics tab"
        activeClassName={ styles.activeLink }
        className={`${styles.linkClass}`}
        to="/metrics">
        <Icon component={ Metrics } />
      </NavLink>
      {
        <NavLink
        aria-label="documents tab"
          activeClassName={ styles.activeLink }
          className={`${styles.linkClass}`}
          to="/documents">
          <Icon component={ Documents }  />
        </NavLink>
      }
      {
        userRole.toLowerCase() !== 'user'
        && <NavLink
          aria-label="devices tab"
          activeClassName={ styles.activeLink }
          className={ styles.linkClass } to="/devices">
          <Icon component={ Devices }  />
        </NavLink>
      }
      <NavLink
        aria-label="encyclopedia tab"
        activeClassName={ styles.activeLink }
        className={window.location.pathname.includes('encyclopediaMedicine') ? `${styles.linkClass} ${styles.activeLink}` : styles.linkClass }
        to="/encyclopedia">
        <Icon component={ Encyclopedia }  />
      </NavLink>
      {
        userRole.toLowerCase() !== 'user'
        && <NavLink
          aria-label="symptomChecker tab"
          activeClassName={ styles.activeLink }
          className={ styles.linkClass } to="/symptomChecker">
          <Icon component={ SymptomChecker }  />
        </NavLink>
      }
      </div>
     </Footer>
  );
};

const mapStateToProps = ({ auth, item, profile: { account, userRole, basicInformation: { genderIdentity }, avatar } }) => ({ auth, account, genderIdentity, avatar, item, userRole });

export default connect(
  mapStateToProps
)(withRouter(Hub));
