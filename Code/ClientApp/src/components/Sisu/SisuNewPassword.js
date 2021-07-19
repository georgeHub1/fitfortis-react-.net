import React, { Component } from 'react';
import { Form, Input, Button, Icon, message } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import ReactLoading from 'react-loading';
import SisuLanguageSelector from './SisuLanguageSelector';
import CustomInputTooltip from '../Common/CustomInputTooltip';
import auth from '../../backendServices/auth';
import styles from './styles.module.less';
import analyticId from '../../utils/AnalyticsAndAbTests.tsx';


class SisuNewPassword extends Component {
  constructor (props) {
    super(props);
    const { formatMessage } = props.intl;

    this.state = {
      showConfirmError: false,
      showPasswordError: false,
      confirmTooltip: formatMessage({ id: 'SisuNewPassword.emptyInput' }),
      pswdTooltip: formatMessage({ id: 'SisuNewPassword.emptyInput' }),
      hideForm: false,
      defaultIcon1: 'eye-invisible',
      defaultIcon2: 'eye-invisible',
      isLoading: false
    };
  }
  displayName = SisuNewPassword.name;

  componentDidMount () {
    analyticId.firebaseAnalyticsLog('Sisu_NewPassword');
  }
  compareToFirstPassword = (rule, value, callback) => {
    const { formatMessage } = this.props.intl;
    const form = this.props.form;

    if (value && value !== form.getFieldValue('password')) {
      this.setState({
        confirmTooltip: formatMessage({
          id: 'SisuNewPassword.invalidConfirmPassword'
        })
      });
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };
  handleSubmit = e => {
    e.preventDefault();
    const {
      intl: { formatMessage },
      form
    } = this.props;

    form.validateFields((err, { password }) => {
      if (err) {
        if (err.password && err.password.errors) {
          this.setState({
            showPasswordError: true,
            pswdTooltip:
              err.password.errors[0].message === 'password is required'
                ? formatMessage({ id: 'SisuNewPassword.emptyInput' })
                : formatMessage({ id: 'SisuNewPassword.invalidPassword' })
          });
        } else {
          this.setState({ showPasswordError: false });
        }
        if (err.confirm && err.confirm.errors) {
          this.setState({
            showConfirmError: true,
            confirmTooltip:
              err.confirm.errors[0].message === 'confirm is required'
                ? formatMessage({ id: 'SisuNewPassword.emptyInput' })
                : formatMessage({ id: 'SisuNewPassword.invalidConfirmPassword' })
          });
        } else {
          this.setState({ showConfirmError: false });
        }
        return;
      }
      this.setState({ isLoading: true });
      const pathName = this.props.location.pathname;
      const body = {
        userId: pathName.slice(pathName.length - 36),
        token: pathName.slice(13, pathName.length - 37),
        newPassword: password
      };

      auth
        .resetPassword(body)
        .then(() => {
          this.setState({
            showConfirmError: false,
            showPasswordError: false,
            hideForm: true,
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
    this.setState({ showConfirmError: false, showPasswordError: false });
  };
  handleClickPassword = icon => {
    this.setState({
      [icon]: this.state[icon] === 'eye' ? 'eye-invisible' : 'eye'
    });
  };
  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  render () {
    const {
      form: { getFieldDecorator, getFieldsError, getFieldValue },
      auth: { loading },
      intl: { formatMessage }
    } = this.props;
    const {
      showConfirmError,
      showPasswordError,
      hideForm,
      confirmTooltip,
      pswdTooltip,
      defaultIcon1,
      defaultIcon2,
      isLoading
    } = this.state;
    const confirmText = <span>{confirmTooltip}</span>;
    const textPswd = <span>{pswdTooltip}</span>;

    return (
      <div className={styles.signIn}>
        {isLoading ? (
          <div className={styles.spinnerContainer}>
            <ReactLoading type="spin" color="#fff" />
          </div>
        ) : null}
        <div className={styles.formWrapper}>
          <p className={styles.message}>
            {!hideForm ? (
              <FormattedMessage id="SisuNewPassword.headerNewPassword" />
            ) : (
              <FormattedMessage id="SisuNewPassword.passwordUpdated" />
            )}
          </p>
          {hideForm && (
            <React.Fragment>
              <p
                className={styles.messageInfo}
                dangerouslySetInnerHTML={{
                  __html: formatMessage({
                    id: 'SisuNewPassword.updateInfoMessage'
                  })
                }}
              />
              <div className={styles.btnBlock}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className={styles.forgotFormBtn}
                >
                  <Link to="/signIn">
                    <FormattedMessage id="SisuNewPassword.goToSignIn" />
                  </Link>
                </Button>
              </div>
            </React.Fragment>
          )}
          {!hideForm && (
            <Form
              onSubmit={this.handleSubmit}
              className="change-form"
              hideRequiredMark={true}
            >
              {loading ? (
                <div className={styles.spinnerContainer}>
                  <ReactLoading type="spin" color="#fff" />
                </div>
              ) : null}
              <Form.Item
                label={
                  <FormattedMessage id="SisuNewPassword.labelNewPassword" />
                }
                validateStatus={showPasswordError ? 'error' : 'success'}
              >
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '', min: 8 }]
                })(
                  <Input
                    suffix={
                      <React.Fragment>
                        <Icon
                          onClick={() =>
                            this.handleClickPassword('defaultIcon1')
                          }
                          type={defaultIcon1}
                        />
                        <CustomInputTooltip
                          err={showPasswordError}
                          text={textPswd}
                        />
                      </React.Fragment>
                    }
                    onChange={this.handleInputChange}
                    autoComplete="off"
                    type={defaultIcon1 === 'eye' ? 'text' : 'password'}
                  />
                )}
              </Form.Item>
              <Form.Item
                label={
                  <FormattedMessage id="SisuNewPassword.labelConfirmPassword" />
                }
                validateStatus={showConfirmError ? 'error' : 'success'}
              >
                {getFieldDecorator('confirm', {
                  rules: [
                    { required: true, message: '', min: 8 },
                    {
                      validator: this.compareToFirstPassword
                    }
                  ]
                })(
                  <Input
                    suffix={
                      <React.Fragment>
                        <Icon
                          onClick={() =>
                            this.handleClickPassword('defaultIcon2')
                          }
                          type={defaultIcon2}
                        />
                        <CustomInputTooltip
                          err={showConfirmError}
                          text={confirmText}
                        />
                      </React.Fragment>
                    }
                    onChange={this.handleInputChange}
                    autoComplete="off"
                    type={defaultIcon2 === 'eye' ? 'text' : 'password'}
                  />
                )}
              </Form.Item>
              <div className={styles.btnBlock}>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={!this.hasErrors(getFieldsError()) || !getFieldValue('password') || !getFieldValue('confirm')}
                  className={styles.forgotFormBtn}
                >
                  <FormattedMessage id="SisuNewPassword.resetBtn" />
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

const WrappedSisuNewPassword = Form.create({ name: 'changePswdForm' })(
  SisuNewPassword
);

export default withRouter(injectIntl(WrappedSisuNewPassword));
