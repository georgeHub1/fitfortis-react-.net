import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Icon } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { withRouter } from 'react-router';
import ReactLoading from 'react-loading';
import CustomInputTooltip from '../Common/CustomInputTooltip';
import SisuLanguageSelector from './SisuLanguageSelector';
import styles from './styles.module.less';
import analyticId from '../../utils/AnalyticsAndAbTests.tsx';


class SisuSignIn extends Component {
  displayName = SisuSignIn.name;
  constructor (props) {
    super(props);
    const { formatMessage } = props.intl;

    this.state = {
      showEmailError: false,
      showDivEmailError: false,
      showPasswordError: false,
      emailTooltip: formatMessage({ id: 'SisuSignIn.emptyInput' }),
      pswdTooltip: formatMessage({ id: 'SisuSignIn.emptyInput' }),
      defaultIcon: 'eye-invisible',
      placementType: 'right'
    };
  }

  componentDidMount () {
    analyticId.firebaseAnalyticsLog('Sisu_SignIn');
  }
  componentDidUpdate ({ auth: { error } }) {
    const { formatMessage } = this.props.intl;

    if (error) {
      error.map(el => analyticId.firebaseAnalyticsLog('Sisu_SignIn_ClickSignIn_Error', {error: el.message}));
    }
    if (this.props.auth.error && error !== this.props.auth.error) {
      const findIndex = this.props.auth.error.findIndex(x => x.code === 'PERMISSION_DENIED');

      if (findIndex > -1) {
        this.setState({
          emailTooltip: formatMessage({ id: 'SisuSignIn.permissionDenied' }),
          showEmailError: true,
          placementType: 'bottom'
        });
      } else {
        this.setState({
          emailTooltip: this.props.auth.error.map(el => el.message).join(),
          showEmailError: true
        });
      }
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const {
      intl: { formatMessage, locale },
      form,
      loginUser,
      history
    } = this.props;

    form.validateFields((err, { email, password }) => {
      if (err) {
        analyticId.firebaseAnalyticsLog('Sisu_SignIn_ClickSignIn_Error', {error: err});
        if (err.email && err.email.errors) {
          this.setState({
            showEmailError: true,
            emailTooltip:
              err.email.errors[0].message === 'email is required'
                ? formatMessage({ id: 'SisuSignIn.emptyInput' })
                : formatMessage({ id: 'SisuSignIn.invalidEmail' })
          });
        } else {
          this.setState({ showEmailError: false });
        }
        if (err.password && err.password.errors) {
          this.setState({
            showPasswordError: true,
            pswdTooltip:
              err.password.errors[0].message === 'password is required'
                ? formatMessage({ id: 'SisuSignIn.emptyInput' })
                : formatMessage({ id: 'SisuSignIn.invalidPassword' })
          });
        } else {
          this.setState({ showPasswordError: false });
        }
        return;
      }
      analyticId.firebaseAnalyticsLog('Sisu_SignIn_ClickSignIn', {});
      loginUser(email, password, history.push, locale);
      this.setState({ showEmailError: false, showPasswordError: false });
    });
  };
  handleInputChange = e => {
    e.preventDefault();
    this.setState({ showEmailError: false, showPasswordError: false, showDivEmailError: false, placementType: 'right' });
  };
  handleClickPassword = e => {
    e.preventDefault();
    this.setState({
      defaultIcon: this.state.defaultIcon === 'eye' ? 'eye-invisible' : 'eye'
    });
  };

  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  render () {
    const {
      form: { getFieldDecorator, getFieldsError, getFieldValue },
      auth: { loading }
    } = this.props;
    const {
      emailTooltip,
      pswdTooltip,
      showPasswordError,
      showEmailError,
      defaultIcon,
      placementType
    } = this.state;
    const textEmail = <span>{emailTooltip}</span>;
    const textPswd = <span>{pswdTooltip}</span>;

    return (
      <div className={styles.signIn}>
        <div className={styles.formWrapper}>
          <p className={styles.message}>
            <FormattedMessage id="SisuSignIn.welcome" />
          </p>
          {loading ? (
            <div className={styles.spinnerContainer}>
              <ReactLoading type="spin" color="#fff" />
            </div>
          ) : null}
          <div className={styles.formHeader}>
            <Link to="/signIn" className={[styles.formHeaderLink, styles.formHeaderLinkActive].join(' ')}>
              <FormattedMessage id="SisuSignIn.buttonSignIn" />
            </Link>
            <Link to="/signUp" className={styles.formHeaderLink}>
              <FormattedMessage id="SisuSignIn.buttonCreateAccount" />
            </Link>
          </div>
          <Form
            onSubmit={this.handleSubmit}
            className="login-form"
            hideRequiredMark={true}
          >
            <div className={styles.formBox}>
              <Form.Item
                style={{ position: 'relative' }}
                label={<FormattedMessage id="SisuSignIn.labelEmail" />}
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
                    type="text"
                    autoComplete="username"
                    name="username"
                    onChange={this.handleInputChange}
                    suffix={
                      <CustomInputTooltip err={showEmailError} text={textEmail} placement={placementType} />
                    }
                  />
                )}
              </Form.Item>
              <Form.Item
                label={<FormattedMessage id="SisuSignIn.labelPassword" />}
                validateStatus={showPasswordError ? 'error' : 'success'}
                style={{ marginBottom: '24px !important' }}
              >
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '', min: 8 }]
                })(
                  <Input
                    autoComplete="current-password"
                    name="password"
                    className="tooltip"
                    suffix={
                      <React.Fragment>
                        <Icon
                          onClick={this.handleClickPassword}
                          type={defaultIcon}
                        />
                        <CustomInputTooltip err={showPasswordError} text={textPswd} />
                      </React.Fragment>
                    }
                    onChange={this.handleInputChange}
                    type={defaultIcon === 'eye' ? 'text' : 'password'}
                  />
                )}
              </Form.Item>
              <div className={styles.forgotPasswordBlock}>
                <Link className={styles.loginFormForgot} to="/forgotPassword">
                  <FormattedMessage id="SisuSignIn.forgotPassword" />
                </Link>
              </div>
            </div>
            <div className={styles.btnBlock}>
              <Button
                type="primary"
                htmlType="submit"
                className={styles.loginFormButton}
                disabled={this.hasErrors(getFieldsError()) || !getFieldValue('password') || !getFieldValue('email')}
              >
                <FormattedMessage id="SisuSignIn.buttonSignIn" />
              </Button>
            </div>
          </Form>
          <SisuLanguageSelector />
          <div className={styles.termsofuselink}>
            <Link className={styles.toslink} to='/about'>
              <FormattedMessage id='SisuSignIn.termsOfUse' tagName='span'/>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

const WrappedSisuSignIn = Form.create({ name: 'signIn' })(SisuSignIn);

export default withRouter(injectIntl(WrappedSisuSignIn));
