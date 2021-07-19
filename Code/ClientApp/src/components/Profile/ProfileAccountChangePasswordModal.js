import React from 'react';
import { Modal, Icon, Form, Input, Button } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import CustomInputTooltip from '../Common/CustomInputTooltip';
import styles from './styles.module.less';


class ProfileAccountChangePasswordModal extends React.Component {
  constructor (props) {
    super(props);
    const { formatMessage } = props;

    this.state = {
      defaultIconPass: 'eye-invisible',
      defaultIconOldPass: 'eye-invisible',
      defaultIconConf: 'eye-invisible',

      showOldPwdError: false,
      showNewPwdError: false,
      showNewConfirmError: false,

      oldPwdTooltip: formatMessage({ id: 'ProfileAccountChangePasswordModal.emptyInput' }),
      newPwdTooltip: formatMessage({ id: 'ProfileAccountChangePasswordModal.emptyInput' }),
      newConfTooltip: formatMessage({ id: 'ProfileAccountChangePasswordModal.emptyInput' })
    };
  }
  handleSubmit = () => {
    const { form, handleOkChangeModal } = this.props;

    form.validateFields((err, { oldPwd, newPwd }) => {
      if (err) {
        this.validatePwd(err, 'oldPwd', 'oldPwdTooltip', 'showOldPwdError');
        this.validatePwd(err, 'newPwd', 'newPwdTooltip', 'showNewPwdError');
        this.validatePwd(err, 'newConfPwd', 'newConfTooltip', 'showNewConfirmError');

        return;
      }
      handleOkChangeModal({
        oldPassword: oldPwd,
        newPassword: newPwd
      });

      this.closeTooltip();
    });
  };
  validatePwd = (err, key, tooltipKey, showKey) => {
    const { formatMessage } = this.props;

    if (err[key] && err[key].errors) {
      let message = formatMessage({ id: 'ProfileAccountChangePasswordModal.invalidPassword' });

      if (
        key === 'newConfPwd'
        && err[key].errors[0].message
          !== 'newConfPwd must be at least 8 characters'
      ) {
        message = err[key].errors[0].message;
      }
      this.setState({
        [showKey]: true,
        [tooltipKey]:
          err[key].errors[0].message === `${key} is required`
            ? formatMessage({ id: 'ProfileAccountChangePasswordModal.emptyInput' })
            : message
      });
    } else {
      this.setState({ [showKey]: false });
    }
  };
  handleClickPassword = (icon, label) => {
    this.setState({
      [label]: icon === 'eye' ? 'eye-invisible' : 'eye'
    });
  };
  closeTooltip = () => {
    this.setState({
      showOldPwdError: false,
      showNewPwdError: false,
      showNewConfirmError: false
    });
  };
  compareToFirstPassword = (rule, value, callback) => {
    const { formatMessage, form } = this.props;

    if (value && value !== form.getFieldValue('newPwd')) {
      this.setState({
        newConfTooltip: formatMessage({
          id: 'ProfileAccountChangePasswordModal.invalidConfirmPassword'
        })
      });
      callback(formatMessage({
        id: 'ProfileAccountChangePasswordModal.invalidConfirmPassword'
      }));
    } else {
      callback();
    }
  };
  handleInputChange = e => {
    e.preventDefault();
    this.closeTooltip();
  };
  onCancel = () => {
    const { handleCancel } = this.props;

    this.closeTooltip();
    handleCancel();
  };
  render () {
    const {
      visible,
      formatMessage,
      form: { getFieldDecorator }
    } = this.props;

    const {
      defaultIconPass,
      defaultIconConf,
      defaultIconOldPass,

      showOldPwdError,
      showNewPwdError,
      showNewConfirmError,

      oldPwdTooltip,
      newPwdTooltip,
      newConfTooltip
    } = this.state;

    return (
      <Modal
        closable={false}
        className="wrapperModalChangePwd wrapperModal"
        title= {formatMessage({ id: 'ProfileAccountChangePasswordModal.header' })}
        centered
        visible={visible}
        footer={null}
      >
        <Form
          className={`${styles.form} change-pwd-form `}
          onSubmit={this.handleSubmit}
          hideRequiredMark={true}
        >
          <div>
            <Form.Item
              label={<FormattedMessage id="ProfileAccountChangePasswordModal.oldPasswordLabel" />}
              style={{ marginBottom: '24px !important' }}
              validateStatus={showOldPwdError ? 'error' : 'success'}
            >
              {getFieldDecorator('oldPwd', {
                rules: [{ required: true, message: '', min: 8 }]
              })(
                <Input
                  onChange={this.handleInputChange}
                  suffix={
                    <React.Fragment>
                      <Icon
                        onClick={e =>
                          this.handleClickPassword(
                            defaultIconOldPass,
                            'defaultIconOldPass'
                          )
                        }
                        type={defaultIconOldPass}
                      />
                      <CustomInputTooltip
                        err={showOldPwdError}
                        text={oldPwdTooltip}
                      />
                    </React.Fragment>
                  }
                  autoComplete="current-password"
                  type={defaultIconOldPass === 'eye' ? 'text' : 'password'}
                />
              )}
            </Form.Item>
            <Form.Item
              label={<FormattedMessage id="ProfileAccountChangePasswordModal.newPasswordLabel" />}
              style={{ marginBottom: '24px !important' }}
              validateStatus={showNewPwdError ? 'error' : 'success'}
            >
              {getFieldDecorator('newPwd', {
                rules: [{ required: true, message: '', min: 8 }]
              })(
                <Input
                  onChange={this.handleInputChange}
                  suffix={
                    <React.Fragment>
                      <Icon
                        onClick={e =>
                          this.handleClickPassword(
                            defaultIconPass,
                            'defaultIconPass'
                          )
                        }
                        type={defaultIconPass}
                      />
                      <CustomInputTooltip
                        err={showNewPwdError}
                        text={newPwdTooltip}
                      />
                    </React.Fragment>
                  }
                  autoComplete="current-password"
                  type={defaultIconPass === 'eye' ? 'text' : 'password'}
                />
              )}
            </Form.Item>
            <Form.Item
              label={
                <FormattedMessage id="ProfileAccountChangePasswordModal.confirmNewPasswordLabel" />
              }
              style={{ marginBottom: '24px !important' }}
              validateStatus={showNewConfirmError ? 'error' : 'success'}
            >
              {getFieldDecorator('newConfPwd', {
                rules: [
                  { required: true, message: '', min: 8 },
                  {
                    validator: this.compareToFirstPassword
                  }
                ]
              })(
                <Input
                  onChange={this.handleInputChange}
                  suffix={
                    <React.Fragment>
                      <Icon
                        onClick={e =>
                          this.handleClickPassword(
                            defaultIconConf,
                            'defaultIconConf'
                          )
                        }
                        type={defaultIconConf}
                      />
                      <CustomInputTooltip
                        err={showNewConfirmError}
                        text={newConfTooltip}
                      />
                    </React.Fragment>
                  }
                  autoComplete="new-password"
                  type={defaultIconConf === 'eye' ? 'text' : 'password'}
                />
              )}
            </Form.Item>
          </div>
          <div className="ant-modal-footer">
            <Button onClick={this.onCancel} className="ant-btn">
              <span><FormattedMessage id="ProfileAccountChangePasswordModal.cancel" /></span>
            </Button>
            <Button htmlType="submit" className="ant-btn ant-btn-primary">
              <span><FormattedMessage id="ProfileAccountChangePasswordModal.change" /></span>
            </Button>
          </div>
        </Form>
      </Modal>
    );
  }
}

ProfileAccountChangePasswordModal.propTypes = {
  visible: PropTypes.bool,
  handleCancel: PropTypes.func,
  handleOkChangeModal: PropTypes.func
};
ProfileAccountChangePasswordModal.defaultProps = {
  visible: false,
  handleCancel: () => true,
  handleOkChangeModal: () => true
};
const WrappedProfileAccountChangePasswordModal = Form.create({ name: 'changeAccount' })(
  ProfileAccountChangePasswordModal
);

export default WrappedProfileAccountChangePasswordModal;
