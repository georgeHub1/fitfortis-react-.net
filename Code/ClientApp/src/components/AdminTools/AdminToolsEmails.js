import React from 'react';
import { Alert } from 'antd';
import { FormattedMessage } from 'react-intl';
import { sorting } from './const';
import styles from './styles.module.less';

const AdminToolsEmails = ({activeEmail, adminUserList}) => {
  const Emails = ({activeEmail}) => {
    return sorting(adminUserList).map(data => (
      <span className={`${styles.email_list} ${(activeEmail === data.email) ? styles.active : ''}` } key={data.email}>{data.email}</span>
    ));
  };

  return (
    <div className={styles.adminToolEmail}>
      <Alert
        type="error"
        message={<FormattedMessage id='AdminToolsEmails.adminAccounts' />}
        description={<Emails activeEmail={activeEmail}/>}
      />
    </div>
  );
};

export default AdminToolsEmails;
