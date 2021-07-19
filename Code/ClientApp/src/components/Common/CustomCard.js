import React from 'react';
import { Card } from 'antd';

import styles from './styles.module.less';

const CustomCard = ({ title, extra, children, style = {} }) => {
  return (
    <Card
      style={{
        // backdropFilter: 'blur(116.886px)',
        background: 'rgba(255, 255, 255, 0.8)',
        ...style
      }}
      headStyle={{
        color: '#003459',
        borderBottom: 'none'
      }}
      className={`${styles.cardContainer} customCardContainer`}
      title={title}
      extra={extra}
    >
      {children}
    </Card>
  );
};

export default CustomCard;
