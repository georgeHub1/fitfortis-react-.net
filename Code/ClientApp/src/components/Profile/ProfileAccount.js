import React, { Component } from 'react';
import { Upload, Form, Icon, Input, message, Button, Select, Row, Col } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import ReactLoading from 'react-loading';
import { connect } from 'react-redux';
import ProfileAccountImageCropper from './ProfileAccountImageCropper';
import ProfileAccountChangePasswordModal from './ProfileAccountChangePasswordModal';
import auth from '../../backendServices/auth';
import { ReactComponent as AvatarFemale } from '../../img/avatar_Female.svg';
import { ReactComponent as AvatarMale } from '../../img/avatar_Male.svg';
import { ReactComponent as FlagBgBg } from '../../img/languages/bg-BG.svg';
import { ReactComponent as FlagEnUs } from '../../img/languages/en-US.svg';
import { ReactComponent as FlagEnIn } from '../../img/languages/en-INTERNATIONAL.svg';
import { ReactComponent as FlagUkUa } from '../../img/languages/uk-UK.svg';
import { accountForm,  dateFormat2,  setChangeLanguages } from '../../constants/profile';
import { localeSet } from '../../redux/locale.action';
import CustomCard from '../Common/CustomCard.js';
import styles from './styles.module.less';
import moment from 'moment';
import analyticId from '../../utils/AnalyticsAndAbTests.tsx';

const Dragger = Upload.Dragger;
const { Option } = Select;

class ProfileAccount extends Component {
  displayName = ProfileAccount.name;
  static propTypes = {
    account: PropTypes.object,
    setTabValue: PropTypes.func
  };
  static defaultProps = {
    account: {
      firstName: '',
      lastname: '',
      email: '',
      avatar: ''
    },
    setTabValue: () => true,
    genderIdentity: ''
  };
  constructor (props) {
    super(props);

    this.state = {
      fileList: [
        props.account
          ? {
              url: props.avatar,
              uid: '-1',
              status: 'done'
            }
          : null
      ],
      visible: false,
      defaultIconPass: 'eye-invisible',
      defaultIconConf: 'eye-invisible',
      changePwdModal: false,
      isLoading: false,
      preAvatar:'',
      profileActivityVisible: false
    };
  }

  componentDidMount () {
    analyticId.firebaseAnalyticsLog('Profile_Account');
  }
  updateValues = (key, value) => {
    const { account, setTabValue, onUpdateLanguage } = this.props;

    if (key === 'language') {
      onUpdateLanguage(value);
      setChangeLanguages(value);
    }

    setTabValue({
      account: {
        ...account,
        [key]: value
      }
    });
  };

  getBase64 = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const maxSizeImageMB = 2;
    const limitSize = file.size / 1024 / 1024 < maxSizeImageMB; // converts bytes to megabytes

    if (!limitSize) {
      message.error(`Image must smaller than ${maxSizeImageMB} MB!`); // TODO:
    }
    return isJpgOrPng && limitSize;
  };

  handleChangeUpload = info => {
    const status = info.file.status;
    const last = info.fileList[info.fileList.length - 1];

    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
      this.handlePreview(last);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }

    this.setState({ fileList: [last] });
  };

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await this.getBase64(file.originFileObj);

      this.setState({ preAvatar: file.preview });

      this.setState({ visible: true });
    }
  };
  handleCancel = () => {
    this.setState({ visible: false });
  };
  handleOk = img => {
    const { setTabValue } = this.props;

    setTabValue({
      avatar: img
    });
    this.setState({ visible: false });
  };
  handleOpenModal = () =>
    this.setState({ changePwdModal: !this.state.changePwdModal });
  handleOkChangeModal = data => {
    this.setState({ isLoading: true });
    auth
      .changePassword(data)
      .then(() => {
        this.setState({
          changePwdModal: false,
          isLoading: false
        });
        message.success('Password successfully changed! ', 5);
      })
      .catch(err => {
        this.setState({ isLoading: false });
        err.errors.map(el => message.error(el.message, 5));
      });
  };
  signOut () {
    const { history } = this.props;

    analyticId.firebaseAnalyticUserId('');
    localStorage.clear();
    history.push('/signIn');
    window.location.reload();
  }
  onCustomRequest = file => {
    return new Promise(((resolve, reject) => {
      const ajaxResponseWasFine = true;

      setTimeout(() => {
        if (ajaxResponseWasFine) {
          const reader  = new FileReader();

          reader.addEventListener('load', () => {
            resolve(reader.result);
          }, false);

          if (file) {
            reader.readAsDataURL(file);
          }
        } else {
          reject('error');
        }
      }, 1000);
    }));
  };
  render () {
    const {
      account,
      genderIdentity,
      intl: { formatMessage },
      userRole
    } = this.props;
    const { fileList, visible, changePwdModal, isLoading, profileActivityVisible } = this.state;
    const {  changes,  avatar } = this.props;
    const language  = this.props.account.language || localStorage.getItem('language');

    const keysDate = Object.keys(changes).sort((a, b) => b - a);

    return (
      <Form
        id={accountForm}
        className={`${styles.form} accountForm`}
        onSubmit={this.handleSave}
        hideRequiredMark={true}
      >
        <div className="wrappAccountActivity">
        <CustomCard>
          <div className="cardHeaderProfile">
            <FormattedMessage id="ProfileAccount.account" />
          </div>

          <Row gutter={32}>
              <Col xs={24} md ={10} lg={8}  xl={6}>
            {isLoading ? (
              <div className={styles.spinnerContainer}>
                <ReactLoading type="spin" color="#fff" />
              </div>
            ) : null}
            <div className={styles.uploadBlock}>
              <Form.Item>
                <Dragger
                  action={this.onCustomRequest}
                  fileList={fileList}
                  onChange={this.handleChangeUpload}
                  className={styles.dragWrapper}
                  showUploadList={true}
                  beforeUpload={this.beforeUpload}
                >
                  <div className="ant-upload-drag-icon">
                    {avatar ? (
                      <div
                        style={{ backgroundImage: `url(${avatar})` }}
                        className="profileAvatarIcon"
                      />
                    ) : (
                      <Icon
                        className="profileAvatarIcon"
                        component={
                          genderIdentity === 'Female' ? AvatarFemale : AvatarMale
                        }
                      />
                    )}
                  </div>
                  <div className={styles.labelBlock}>
                    <p className={`ant-upload-text ${styles.uploadButton}`}>
                      {fileList.length ? (
                        <FormattedMessage id="ProfileAccount.changePhoto" />
                      ) : (
                        <FormattedMessage id="ProfileAccount.uploadLabel" />
                      )}
                    </p>
                    <p className="ant-upload-hint desktopViewLabel">
                      <FormattedMessage id="ProfileAccount.changePhotoInfo" />
                    </p>
                  </div>
                </Dragger>
                {visible && (
                  <ProfileAccountImageCropper
                    avatar={this.state.preAvatar}
                    visible={visible}
                    handleCancel={this.handleCancel}
                    handleOk={this.handleOk}
                    formatMessage={formatMessage}
                  />
                )}
              </Form.Item>
            </div>
            </Col>
            <Col xs={24} md ={14} lg={16} xl={18}>
            <div className="infoAccount">
              <Form.Item
                label={<FormattedMessage id="ProfileAccount.firstNameLabel" />}
              >
                <Input
                  value={account.firstName}
                  onChange={e => this.updateValues('firstName', e.target.value)}
                />
              </Form.Item>
              <Form.Item
                label={<FormattedMessage id="ProfileAccount.lastNameLabel" />}
              >
                <Input
                  value={account.lastName}
                  onChange={e => this.updateValues('lastName', e.target.value)}
                />
              </Form.Item>
              <Form.Item
                label={<FormattedMessage id="ProfileAccount.emailLabel" />}
              >
                <Input
                  autoComplete="username"
                  value={account.email}
                  onChange={e => this.updateValues('email', e.target.value)}
                />
              </Form.Item>
              <Form.Item
                label={<FormattedMessage id="ProfileAccount.languageLabel" />}
              >
              {
              /*
              See $/Code/ClientApp/src/translation/README.md for instructions on how to add a new locale.
              */
              }
              <Select
                value={language}
                dropdownClassName={'languages-select'}
                onChange={value => this.updateValues('language', value)}
                >
                <Option value="en">
                  <Icon component={FlagEnIn}/>English (International)
                </Option>
                <Option value="bg-bg">
                  <Icon component={FlagBgBg}/>Български (bg-BG)
                </Option>
                <Option value="en-us">
                  <Icon component={FlagEnUs}/>English (en-US)
                </Option>
                {
                  userRole.toLowerCase() === 'admin'
                  && <Option value="uk-ua">
                    <Icon component={FlagUkUa}/>Українська (uk-UA)
                  </Option>
                }
              </Select>

              </Form.Item>
              {changePwdModal && (
                <ProfileAccountChangePasswordModal
                  visible={changePwdModal}
                  handleCancel={this.handleOpenModal}
                  handleOkChangeModal={this.handleOkChangeModal}
                  formatMessage={formatMessage}
                />
              )}
              <div className={styles.groupAccountButton}>
                <Button
                  onClick={this.handleOpenModal}
                  htmlType="submit"
                  className={`ant-btn ${styles.accountBtn}`}
                >
                  <span><FormattedMessage id="ProfileAccount.buttonChangePassword" /></span>
                </Button>
                <Button
                  onClick={() => this.signOut()}
                  className={`ant-btn ${styles.accountBtn}`}
                >
                  <span><FormattedMessage id="ProfileAccount.buttonSignOut" /></span>
                </Button>
              </div>
            </div>
            </Col>
            </Row>

          </CustomCard>
          {
            profileActivityVisible
            && <CustomCard className="profileActivity">
              <div className="cardHeaderProfile">
                <FormattedMessage id="ProfileAccount.activity" />
              </div>
              <div className={styles.activityDescription}>
                <FormattedMessage id="ProfileAccount.activityInfo" />
              </div>
              <div className={styles.activityWrapper}>
                {keysDate.map(key => (
                  <div key={key}>
                    <div className={styles.cardLabelProfile}>
                      {moment(+key).format(dateFormat2)}
                    </div>
                    <div className={styles.changeItems}>
                      {changes[key].sort((a, b) => b.createdAt - a.createdAt).map((change, i) => (
                        <div
                          key={`${i}_${change.oldValue}_${change.newValue}`}
                          className={styles.changeItem}
                        >
                          <div className={styles.locationOfChange}>
                            {change.location}
                          </div>
                          <div className={styles.whatHappens}>{change.action}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CustomCard>
          }
          </div>
      </Form>
    );
  }
}

const WrappedProfileAccount = Form.create({ name: 'ProfileAccount' })(
  ProfileAccount
);

const mapStateToProps = state => {
  return {
    language: state.locale.language,
    userRole: state.profile.userRole
  };
};

const mapDispatchToProps = dispatch => ({
  onUpdateLanguage (args) {
    dispatch(localeSet(args));
    return Promise.resolve();
  }
});

export default injectIntl(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(WrappedProfileAccount)
);
