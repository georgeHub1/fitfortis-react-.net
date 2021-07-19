import React, { Component } from 'react';
import { connect } from 'react-redux';

import { loginUser } from '../../redux/auth.action';
import { localeSet } from '../../redux/locale.action';

import styles from './styles.module.less';

class SisuContainer extends Component {
  componentDidMount () {
    if (window.location.search.includes('?lang=')) {
      const lan = window.location.search.includes('?lang=') ? window.location.search.substring(6, 11) : (localStorage.getItem('language') || 'en');

      this.props.onUpdateLanguage(lan);
      localStorage.setItem('language', lan);
    }
  }
  render () {
    const { children, auth, loginUser } = this.props;
    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, {auth, loginUser})
    );

    return (
      <div className={`${styles.sisuContainer} sisuWrapper`}>
        <section className={styles.sisuContainerInner}>
          {childrenWithProps}
        </section>
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => ({ auth });

const mapDispatchToProps = dispatch => ({
  loginUser (...args) {
    return dispatch(loginUser(...args));
  },
  onUpdateLanguage (args) {
    dispatch(localeSet(args));
    return Promise.resolve();
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SisuContainer);
