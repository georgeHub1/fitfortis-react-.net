import React, { Component } from 'react';
import { Divider } from 'antd';
import CustomButtonTooltip from '../Common/CustomButtonTooltip';
import { ReactComponent as FlagBgBg } from '../../img/languages/bg-BG.svg';
import { ReactComponent as FlagEnUs } from '../../img/languages/en-US.svg';
import { ReactComponent as FlagEnIn } from '../../img/languages/en-INTERNATIONAL.svg';
import { ReactComponent as FlagUkUa } from '../../img/languages/uk-UK.svg';
import styles from './styles.module.less';


class AdminToolsNewsfeedLanguageSelector extends Component {
  handleClick = (keyButton, valueButton) => {
    this.props.onLanguageChange(valueButton);
  }

  render () {
    return (
      <div className = {styles.selectLanguageBlock}>
        <CustomButtonTooltip
          textTooltip = "English (International)"
          iconComponentButton ={FlagEnIn}
          positionTooltip ="bottom"
          keyButton = "language"
          valueButton = "en"
          handleClick={this.handleClick}
          buttonActived = {this.props.language === 'en'}
        />
        <Divider type="vertical" className = "languageDivider"/>
        <CustomButtonTooltip
          textTooltip = "Български (bg-BG)"
          iconComponentButton ={FlagBgBg}
          positionTooltip ="bottom"
          keyButton = "language"
          valueButton = "bg-bg"
          handleClick={this.handleClick}
          buttonActived = {this.props.language === 'bg-bg'}
        />
        <CustomButtonTooltip
          textTooltip = "English (en-US)"
          iconComponentButton ={FlagEnUs}
          positionTooltip ="bottom"
          keyButton = "language"
          valueButton = "en-us"
          handleClick={this.handleClick}
          buttonActived = {this.props.language === 'en-us'}
        />
        <CustomButtonTooltip
          textTooltip = "Українська (uk-UA)"
          iconComponentButton ={FlagUkUa}
          positionTooltip ="bottom"
          keyButton = "language"
          valueButton = "uk-ua"
          handleClick={this.handleClick}
          buttonActived = {this.props.language === 'uk-ua'}
        />
        {/* Add more languages here */}
      </div>
    );
  }
}

export default AdminToolsNewsfeedLanguageSelector;
