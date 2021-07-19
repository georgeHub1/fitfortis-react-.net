import React, { Component } from 'react';
import { Form, Input, Button, message } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import CustomInputTooltip from '../Common/CustomInputTooltip';
import ReactLoading from 'react-loading';
import SisuLanguageSelector from './SisuLanguageSelector';
import auth from '../../backendServices/auth';
import styles from './styles.module.less';
import analyticId from '../../utils/AnalyticsAndAbTests.tsx';


class SisuForgotPassword extends Component {
  constructor (props) {
    super(props);
    const { formatMessage } = props.intl;

    this.state = {
      showEmailError: false,
      emailTooltip: formatMessage({ id: 'SisuForgotPassword.emptyInput' }),
      hideForm: false,
      email: '',
      isLoading: false
    };
  }
  displayName = SisuForgotPassword.name;
  componentDidMount () {
    analyticId.firebaseAnalyticsLog('Sisu_ForgotPassword');
  }
  handleSubmit = e => {
    e.preventDefault();
    const { formatMessage } = this.props.intl;

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        if (err.email && err.email.errors) {
          this.setState({
            showEmailError: true,
            emailTooltip:
              err.email.errors[0].message === 'email is required'
                ? formatMessage({ id: 'SisuForgotPassword.emptyInput' })
                : formatMessage({ id: 'SisuForgotPassword.invalidEmail' })
          });
        } else {
          this.setState({ showEmailError: false });
        }
        return;
      }
      this.setState({ isLoading: true });
      auth
        .forgotPassword(this.props.form.getFieldsValue())
        .then(() => {
          this.setState({
            showEmailError: false,
            hideForm: true,
            email: fieldsValue.email,
            isLoading: false
          });
        })
        .catch(err => {
          this.setState({ isLoading: false });
          err.errors.map(el => message.error(el.message, 5));
        });
      });
  };
  handleInputChange = e => {
    e.preventDefault();
    this.setState({ showEmailError: false });
  };

  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  render () {
    const { getFieldDecorator, getFieldsError, getFieldValue } = this.props.form;
    const {
      hideForm,
      email,
      emailTooltip,
      showEmailError,
      isLoading
    } = this.state;
    const textEmail = <span>{emailTooltip}</span>;

    return (
      <div className={styles.signIn}>
        {isLoading ? (
          <div className={styles.spinnerContainer}>
            <ReactLoading type="spin" color="#fff" />
          </div>
        ) : null}
        <div className={styles.formWrapper}>
          <p className={styles.message} style={{ marginBottom: 24 }}>
            {!hideForm ? (
              <FormattedMessage id="SisuForgotPassword.header" />
            ) : (
              <FormattedMessage id="SisuForgotPassword.headerCheckEmail" />
            )}
          </p>
          <p className={styles.messageInfo}>
            {!hideForm ? (
              <FormattedMessage id="SisuForgotPassword.forgotInfo" />
            ) : (
              <div>
                <FormattedMessage id="SisuForgotPassword.infoMsg" /> {email}.
                <p/>
                <FormattedMessage id="SisuForgotPassword.checkJunk" />
              </div>
            )}
          </p>
          {hideForm && (
            <React.Fragment>
              <div className={styles.btnBlock}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className={styles.forgotFormBtn}
                >
                  <Link to="/signIn">
                    <FormattedMessage id="SisuForgotPassword.goToSignIn" />
                  </Link>
                </Button>
              </div>
            </React.Fragment>
          )}
          {!hideForm && (
            <Form
              onSubmit={this.handleSubmit}
              className="forgot-form"
              hideRequiredMark={true}
            >
              <Form.Item
                label={<FormattedMessage id="SisuForgotPassword.labelEmail" />}
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
                    suffix={
                      <CustomInputTooltip
                        err={showEmailError}
                        text={textEmail}
                      />
                    }
                    autoComplete="off"
                  />
                )}
              </Form.Item>
              <div className={styles.btnBlock}>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={this.hasErrors(getFieldsError()) || !getFieldValue('email')}
                  className={styles.loginFormButton}
                >
                  <FormattedMessage id="SisuForgotPassword.sendEmail" />
                </Button>
              </div>
            </Form>
          )}
          <SisuLanguageSelector />
        </div>
      </div>
    );
  }
}

const WrappedSisuForgotPassword = Form.create({ name: 'forgotPswd' })(
  SisuForgotPassword
);

export default injectIntl(WrappedSisuForgotPassword);
