import React, { Component } from 'react';
import { Breadcrumb } from 'antd';
import styles from './styles.module.less';
import { Link } from 'react-router-dom';
import analyticId from '../../utils/AnalyticsAndAbTests.tsx';
export class DocumentsEntry extends Component {
  displayName = DocumentsEntry.name

  componentDidMount () {
    if (window.location.search.includes('?lang=')) {
      const lan = window.location.search.includes('?lang=') ? window.location.search.substring(6, 11) : (localStorage.getItem('language') || 'en');

      this.props.onUpdateLanguage(lan);
      localStorage.setItem('language', lan);
    }
    analyticId.firebaseAnalyticsLog('Documents_ViewDocument');
  }
  render () {
    const { location } = this.props;

    const pathSnippets = location
      ? location.pathname.split('/').filter(i => i)
      : [];

    const breadcrumbItems = pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;

      return (
        <Breadcrumb.Item key={url}>
          <Link to={url} className={styles.navigationBreadCumpLink}>{_}</Link>
        </Breadcrumb.Item>
      );
    });

    return (
      <div>
        <h1 className={`${styles.header} ${styles.mainHeader}`}>
          {pathSnippets[pathSnippets.length - 1]}
        </h1>
        <div className={styles.navigation}>
          <Breadcrumb className={styles.navigationBreadCump}>
            {breadcrumbItems}
          </Breadcrumb>
        </div>
      </div>
    );
  }
}
