import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Icon, message } from 'antd';
import styles from './styles.module.less';
import { FormattedMessage, injectIntl } from 'react-intl';
import CustomInputTooltip from '../Common/CustomInputTooltip';
import auth from '../../backendServices/auth';
import ReactLoading from 'react-loading';
import SisuLanguageSelector from './SisuLanguageSelector';
import analyticId from '../../utils/AnalyticsAndAbTests.tsx';


class SisuCreateAccount extends Component {
  constructor (props) {
    super(props);
    const { formatMessage } = props.intl;

    this.state = {
      isLoading: false,
      showEmailError: false,
      showPasswordError: false,
      showFirstNameError: false,
      showLastNameError: false,
      emailTooltip: formatMessage({ id: 'SisuCreateAccount.emptyInput' }),
      pswdTooltip: formatMessage({ id: 'SisuCreateAccount.emptyInput' }),
      nameTooltip: formatMessage({ id: 'SisuCreateAccount.emptyInput' }),
      hideForm: false,
      defaultIcon: 'eye-invisible',
      toolTipStyle: 'right'
    };
  }

  displayName = SisuCreateAccount.name;
  componentDidMount () {
    analyticId.firebaseAnalyticsLog('Sisu_CreateAccount');
  }
  validateEmail = (err, formatMessage) => {
    if (err.email && err.email.errors) {
      this.setState({
        showEmailError: true,
        emailTooltip:
          err.email.errors[0].message === 'email is required'
            ? formatMessage({ id: 'SisuCreateAccount.emptyInput' })
            : formatMessage({ id: 'SisuCreateAccount.invalidEmail' })
      });
    } else {
      this.setState({ showEmailError: false });
    }
  };
  validatePassword = (err, formatMessage) => {
    if (err.password && err.password.errors) {
      // eslint-disable-next-line
      const errors = err.password.errors.map(function(item) {
        return item.message;
      });

      const index = errors.findIndex(x => x === 'password must be at least 8 characters');

      if (index > -1) {
        errors[index] = formatMessage({ id: 'SisuCreateAccount.invalidPassword' });
      }

      this.setState({
        showPasswordError: true,
        pswdTooltip:
          errors[0] === 'password is required'
            ? formatMessage({ id: 'SisuCreateAccount.emptyInput' })
            : errors.toString().replace(',', '\n'),
        toolTipStyle: errors[0] === 'password is required' ? 'right' : 'bottom'
      });
    } else {
      this.setState({ showPasswordError: false, toolTipStyle: 'right' });
    }
  };
  validateName = err => {
    if (err.firstName && err.firstName.errors) {
      this.setState({ showFirstNameError: true });
    } else {
      this.setState({ showFirstNameError: false });
    }
    if (err.lastName && err.lastName.errors) {
      this.setState({ showLastNameError: true });
    } else {
      this.setState({ showLastNameError: false });
    }
  };
  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }
  handleSubmit = e => {
    e.preventDefault();
    const { formatMessage } = this.props.intl;

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        this.validateEmail(err, formatMessage);
        this.validatePassword(err, formatMessage);
        this.validateName(err);
        analyticId.firebaseAnalyticsLog('Sisu_CreateAccount_ClickCreateAccount_Error', {error: err});
        return;
      }
      this.setState({ isLoading: true });
      const language = localStorage.getItem('language');

      analyticId.firebaseAnalyticsLog('Sisu_CreateAccount_ClickCreateAccount', {});
      auth.registratration(language, this.props.form.getFieldsValue())
        .then(test => {
          this.setState({
            hideForm: true,
            isLoading: false,
            showEmailError: false,
            showPasswordError: false,
            showLastNameError: false,
            showFirstNameError: false
          });
        })
        .catch(err => {
          err.errors.map(el => analyticId.firebaseAnalyticsLog('Sisu_CreateAccount_ClickCreateAccount_Error', {error: el.message}));
          this.setState({ isLoading: false });
          err.errors.map(el => message.error(el.message, 5));
        });
    });
  };
  handleInputChange = e => {
    e.preventDefault();
    this.setState({
      showEmailError: false,
      showFirstNameError: false,
      showLastNameError: false,
      showPasswordError: false,
      toolTipStyle: 'right'
    });
  };
  handleClickPassword = e => {
    e.preventDefault();
    this.setState({
      defaultIcon: this.state.defaultIcon === 'eye' ? 'eye-invisible' : 'eye'
    });
  };

  validatePassword1 = (rule, value, callback) => {
    const { formatMessage } = this.props.intl;
    const oneNumber = new RegExp(/(?=.*\d)/);
    const oneCharacter = new RegExp(/\W/);
    const oneUpperCase = new RegExp(/(?=.*[A-Z])/);
    const oneLowerCase = new RegExp(/(?=.*[a-z])/);

    let errors = '';

    if (!oneNumber.test(value)) {
      errors = errors.length === 0 ? formatMessage({ id: 'SisuCreateAccount.alphanumericError' })
        : `${errors}\n${formatMessage({ id: 'SisuCreateAccount.alphanumericError' })}`;
    }
    if (!oneCharacter.test(value)) {
      errors = errors.length === 0 ? formatMessage({ id: 'SisuCreateAccount.characterError' })
        : `${errors}\n${formatMessage({ id: 'SisuCreateAccount.characterError' })}`;
    }
    if (!oneUpperCase.test(value)) {
      errors = errors.length === 0 ? formatMessage({ id: 'SisuCreateAccount.uppercaseError' })
        : `${errors}\n${formatMessage({ id: 'SisuCreateAccount.uppercaseError' })}`;
    }
    if (!oneLowerCase.test(value)) {
      errors = errors.length === 0 ? formatMessage({ id: 'SisuCreateAccount.lowercaseError' })
        : `${errors}\n${formatMessage({ id: 'SisuCreateAccount.lowercaseError' })}`;
    }
    if (errors.length === 0) {
      callback();
    } else {
      callback(errors);
    }
  };

  render () {
    const { getFieldDecorator, getFieldsError, getFieldValue } = this.props.form;
    const {
      hideForm,
      isLoading,
      emailTooltip,
      pswdTooltip,
      nameTooltip,
      showFirstNameError,
      showLastNameError,
      showEmailError,
      showPasswordError,
      defaultIcon,
      toolTipStyle
    } = this.state;
    const textEmail = <span>{emailTooltip}</span>;
    const textPswd = <span>{pswdTooltip}</span>;
    const textName = <span>{nameTooltip}</span>;

    return (
      <Fragment>
        {
          isLoading
            ? <div className={styles.spinnerContainer}>
              <ReactLoading type="spin" color="#fff" />
            </div>
            : null
        }
        <div className={styles.signIn}>
          <div className={styles.formWrapper}>
            <p className={styles.message}>
              {!hideForm ? (
                <FormattedMessage id="SisuCreateAccount.welcome" />
              ) : (
                <FormattedMessage id="SisuCreateAccount.confirmYourEmailAddress" />
              )}
            </p>
            <div className={styles.formHeader}>
              <Link to="/signIn" className={styles.formHeaderLink}>
                <FormattedMessage id="SisuSignIn.buttonSignIn" />
              </Link>
              <Link to="/signUp" className={[styles.formHeaderLink, styles.formHeaderLinkActive].join(' ')}>
                <FormattedMessage id="SisuSignIn.buttonCreateAccount" />
              </Link>
            </div>
            <div>
              {hideForm ? (
                <div>
                  <p><FormattedMessage id="SisuCreateAccount.pleaseCheckYourInboxOrJunk" /></p>
                  <p><FormattedMessage id="SisuCreateAccount.youNeedToClickTheLink" /></p>
                </div>
              ) : '' }
            </div>
            {hideForm && (
              <div className={styles.btnBlock}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className={styles.forgotFormBtn}
                >
                  <Link to="/signIn">
                    <FormattedMessage id="SisuCreateAccount.goToSignIn" />
                  </Link>
                </Button>
              </div>
            )}
            {!hideForm && (
              <Form
                onSubmit={this.handleSubmit}
                className="signup-form"
                hideRequiredMark={true}
              >
                <div className={styles.formBox}>
                  <Form.Item
                    label={
                      <FormattedMessage id="SisuCreateAccount.labelFirstName" />
                    }
                    validateStatus={showFirstNameError ? 'error' : 'success'}
                  >
                    {getFieldDecorator('firstName', {
                      rules: [{ required: true, message: '' }]
                    })(
                      <Input
                        onChange={this.handleInputChange}
                        suffix={<CustomInputTooltip err={showFirstNameError} text={textName} />}
                        autoComplete="off"
                      />
                    )}
                  </Form.Item>
                  <Form.Item
                    label={
                      <FormattedMessage id="SisuCreateAccount.labelLastName" />
                    }
                    validateStatus={showLastNameError ? 'error' : 'success'}
                  >
                    {getFieldDecorator('lastName', {
                      rules: [{ required: true, message: '' }]
                    })(
                      <Input
                        onChange={this.handleInputChange}
                        suffix={<CustomInputTooltip err={showLastNameError} text={textName} />}
                        autoComplete="off"
                      />
                    )}
                  </Form.Item>
                  <Form.Item
                    label={<FormattedMessage id="SisuCreateAccount.labelEmail" />}
                    validateStatus={showEmailError ? 'error' : 'success'}
                  >
                    {getFieldDecorator('email', {
                      rules: [
                        { required: true, message: '' },
                        {
                          type: 'email',
                          message: ''
                        }
                      ]
                    })(
                      <Input
                        onChange={this.handleInputChange}
                        suffix={<CustomInputTooltip err={showEmailError} text={textEmail} />}
                        autoComplete="off"
                      />
                    )}
                  </Form.Item>
                  <Form.Item
                    label={
                      <FormattedMessage id="SisuCreateAccount.labelPassword" />
                    }
                    validateStatus={showPasswordError ? 'error' : 'success'}
                    style={{ marginBottom: '24px !important' }}
                  >
                    {getFieldDecorator('password', {
                      rules: [{ required: true, message: '', min: 8 }, {validator: this.validatePassword1}]
                    })(
                      <Input
                        suffix={
                          <React.Fragment>
                            <Icon
                              onClick={this.handleClickPassword}
                              type={defaultIcon}
                            />
                            <CustomInputTooltip err={showPasswordError} text={textPswd} placement={toolTipStyle} />
                          </React.Fragment>
                        }
                        onChange={this.handleInputChange}
                        autoComplete="off"
                        type={defaultIcon === 'eye' ? 'text' : 'password'}
                      />
                    )}
                  </Form.Item>
                </div>
                <div className={styles.btnBlock}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className={styles.loginFormButton}
                    disabled={this.hasErrors(getFieldsError()) || !getFieldValue('firstName') || !getFieldValue('lastName') || !getFieldValue('email') || !getFieldValue('password')}
                  >
                    <FormattedMessage id="SisuCreateAccount.createAccount" />
                  </Button>
                </div>
              </Form>
            )}
            <SisuLanguageSelector />
            <div className={styles.termsofuselink}>
              <Link className={styles.toslink} to='/about'>
                <FormattedMessage id='SisuCreateAccount.termsOfUse' tagName='span'/>
              </Link>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const WrappedSisuCreateAccount = Form.create({ name: 'signUp' })(
  SisuCreateAccount
);

export default injectIntl(WrappedSisuCreateAccount);
