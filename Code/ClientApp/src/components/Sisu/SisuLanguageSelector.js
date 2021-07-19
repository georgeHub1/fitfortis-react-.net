import React, { Component } from 'react';
import { Divider } from 'antd';
import CustomButtonTooltip from '../Common/CustomButtonTooltip';
import { ReactComponent as FlagBgBg } from '../../img/languages/bg-BG.svg';
import { ReactComponent as FlagEnUs } from '../../img/languages/en-US.svg';
import { ReactComponent as FlagEnIn } from '../../img/languages/en-INTERNATIONAL.svg';
import { ReactComponent as FlagUkUa } from '../../img/languages/uk-UK.svg';
import styles from './styles.module.less';
import { setLocale } from '../../redux/locale.action';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';


class SisuLanguageSelector extends Component {
  constructor (props) {
    super(props);
    this.state = {
        language: localStorage.getItem('language') || 'en',
        isUkShow: false
    };
  }

  componentDidMount () {
    const { setLocale } = this.props;
    const lan = window.location.search.includes('?lang=') ? window.location.search.substring(6, 11) : (localStorage.getItem('language') || 'en');

    if (window.location.search.includes('?lang=')) {
      this.setState({
        language: lan
      });
      setLocale(this.state.language);
    }
    setLocale(this.state.language);
  }

  handleClick = (keyButton, valueButton) => {
    const { setLocale } = this.props;

    if (keyButton === 'language') {
      setLocale(valueButton);
      this.setState({
        [keyButton]: valueButton
      });
    }
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
          buttonActived = {this.state.language === 'en'}
        />
        <Divider type="vertical" className = "languageDivider"/>
        <CustomButtonTooltip
          textTooltip = "Български (bg-BG)"
          iconComponentButton ={FlagBgBg}
          positionTooltip ="bottom"
          keyButton = "language"
          valueButton = "bg-bg"
          handleClick={this.handleClick}
          buttonActived = {this.state.language === 'bg-bg'}
        />
        <CustomButtonTooltip
          textTooltip = "English (en-US)"
          iconComponentButton ={FlagEnUs}
          positionTooltip ="bottom"
          keyButton = "language"
          valueButton = "en-us"
          handleClick={this.handleClick}
          buttonActived = {this.state.language === 'en-us'}
        />
        {
          this.state.isUkShow
          && <CustomButtonTooltip
            textTooltip = "Українська (uk-UA)"
            iconComponentButton ={FlagUkUa}
            positionTooltip ="bottom"
            keyButton = "language"
            valueButton = "uk-ua"
            handleClick={this.handleClick}
            buttonActived = {this.state.language === 'uk-ua'}
          />
        }
        {/* Add more languages here */}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    language: state.locale.language
  };
};

export default injectIntl(
  connect(
    mapStateToProps,
    { setLocale }
  )(SisuLanguageSelector)
);
