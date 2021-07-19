import React from 'react';
import { Icon } from 'antd';

import styles from './styles.module.less';

const TriggerBtn = ({ onClick, collapsed }) => {
  return (
    <div className={ `${collapsed ? styles.rotateContainer : '' } ${styles.triggerContainer}` }>
      <button onClick={ onClick } className={ styles.triggerBtn }>
        <Icon type="left" />
      </button>
    </div>
  );
};

export default TriggerBtn;
