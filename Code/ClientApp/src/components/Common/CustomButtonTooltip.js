import React from 'react';
import {Button, Icon, Tooltip } from 'antd';
import styles from './styles.module.less';


const CustomButtonTooltip = ({textTooltip, iconComponentButton, positionTooltip, keyButton, valueButton, handleClick, buttonActived}) => {
  return (
    <Tooltip placement={positionTooltip} title={textTooltip}>
      <Button
        className = {buttonActived === true ? styles.customButtonTooltipActivated : ''}
        onClick={() => handleClick(keyButton, valueButton)}
      >
        <Icon style={{ fontSize: '20px', margin:0, display: 'inline-block', lineHeight: 0}} component={iconComponentButton}/>
      </Button>
    </Tooltip>
  );
};

export default CustomButtonTooltip;
