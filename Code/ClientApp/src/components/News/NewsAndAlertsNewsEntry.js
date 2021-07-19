import React, { Component } from 'react';
import { Breadcrumb } from 'antd';
import styles from './styles.module.less';
import { Link } from 'react-router-dom';

export class NewsAndAlertsNewsEntry extends Component {
  displayName = NewsAndAlertsNewsEntry.name

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
