import React from 'react';
import styles from './styles.module.less';
import { Button } from 'antd';
import { FormattedMessage } from 'react-intl';
import analyticId from '../../utils/AnalyticsAndAbTests.tsx';

const SignUpPrompt = () => {
  const [userType, setuserType] = React.useState('');
  const intervalId = setInterval(() => {
    const type =  analyticId.abTest_isCreateAccountInRed();

    if (type !== undefined) {
      clearInterval(intervalId);
      setuserType(type);
    }
  }, 100);
  const color = userType ? 'red' : '#335889';

  return (
    <div className={styles.CommonAlertMsg}>
      <div className={styles.title}>
        <span><FormattedMessage id="SignUpPrompt.title" /></span>
      </div>
      <div className={styles.descriptionContent}>
        <span><FormattedMessage id="SignUpPrompt.descriptionContent" /></span>
      </div>
      <Button
        className={styles.CommonAlertButton}
        style= {{ background: color, borderColor: color }}
        onClick={() => {
          analyticId.firebaseAnalyticsLog('Home_ClickCreateAccount', {});
        }}
      >
        <a href="/signUp">
          <FormattedMessage id="SignUpPrompt.createAccount"/>
        </a>
      </Button>
    </div>
  );
};

export default SignUpPrompt;
