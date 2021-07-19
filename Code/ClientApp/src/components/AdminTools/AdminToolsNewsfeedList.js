import React, { Component } from 'react';
import { Form, Icon, Input, Row, Col, Upload, message, Button, Menu, Dropdown, Modal, DatePicker, List, Typography } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import moment from 'moment';
import ReactLoading from 'react-loading';
import styles from './styles.module.less';
import CustomCard from '../Common/CustomCard.js';
import AdminToolsNewsfeedImageCropper from './AdminToolsNewsfeedImageCropper';
import AdminToolsNewsfeedLanguageSelector from './AdminToolsNewsfeedLanguageSelector';
import AdminToolsList from './AdminToolsList';
import { getCountryIcon, getValidFormat } from './utils';
import { data, filter } from './const';
import { updateNewsItem, uploadImage, clearMessageValue, fetchAdminToolNewsFeedListing, fetchAdminToolsRemovedNewsFeedListing, removeNewsFeedItem, deleteRecyclebinNewsFeedItem, restoreRecyclebinNewsFeedItem } from '../../redux/adminTool.action';
import { connect } from 'react-redux';

const { Search } = Input;
const Dragger = Upload.Dragger;
const { TextArea } = Input;

let resizeEvent;

class AdminToolsNewsfeedList extends Component {
  displayName = AdminToolsNewsfeedList.name;

  constructor (props) {
    super(props);
    this.formSectionRef = React.createRef();
    this.state = {
      userId: props.account ? props.account.id : null,
      visible: false,
      language: localStorage.getItem('language') || 'en',
      title: '',
      description: '',
      avtar: '',
      fileList: null,
      fileName: null,
      list: data,
      searchText: '',
      isMobile:  window.innerWidth < 768,
      sorting:{
        date: 'desc',
        type: 'none',
        name: 'none'
      },
      confirmModal: false,
      selectedItem: null,
      preAvatar: '',
      screenWidth: window.innerWidth,
      activeDropDownId: null,
      isEditMode: false,
      selectedNewsFeed: null,
      isImageChanged: false,
      adminUserList: [],
      dateTime: moment(new Date()),
      isRestoreBtnClick: false,
      activeView: 'all'
    };
  }

  componentDidMount () {
    if (this.props.userRole !== 'user') {
      resizeEvent = window.addEventListener('resize', () => {
        const { screenWidth } = this.state;

        if (Math.abs(screenWidth - window.innerWidth) > 100) {
          this.setState({...this.state});
        }
      });
      this.fetchNewsFeed();
    }
  }

  componentWillUnmount () {
    if (resizeEvent) {
      resizeEvent.unsubscribe();
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.adminTool.newsFeedMsg === 'NEWSFEED_CREATED_SUCCESSFULLY') {
      this.props.form.resetFields();
      this.props.clearMessageValue();
      this.setState({
        ...this.state,
        avatar: null,
        fileList: null,
        fileName: null,
        dateTime: moment(new Date())
      });
    }
    if (nextProps.adminTool.newsFeedMsg === 'UPDATE_NEWS_FEED_SUCCESS') {
      this.props.form.resetFields();
      this.props.clearMessageValue();
      this.setState({
        ...this.state,
        avatar: null,
        fileList: null,
        fileName: null,
        isEditMode: false,
        selectedNewsFeed: null,
        isImageChanged: false,
        dateTime: moment(new Date())
      });
    }
    if (this.props.adminTool.newsFeedMsg === null && nextProps.adminTool.newsFeedMsg === 'SUCCESS_IN_RESTORE_NEWSFEED') {
      this.setState({
        ...this.state,
        confirmModal: false,
        selectedItem: null,
        isRestoreBtnClick: false
      });
    }
    if (this.props.adminTool.newsFeedMsg === null && nextProps.adminTool.newsFeedMsg === 'SUCCESS_IN_DELETE_NEWSFEED') {
      this.setState({
        ...this.state,
        confirmModal: false,
        selectedItem: null
      });
    }
  }

  scrollToForm = () => {
    if (this.formSectionRef) {
      this.formSectionRef.current.scrollIntoView({behavior: 'smooth'});
    }
  }

  fetchNewsFeed = () => {
    const { adminTool: { isAdminNewsFeedLoaded }} = this.props;

    if (!isAdminNewsFeedLoaded) {
      this.props.fetchAdminToolNewsFeedListing();
      this.props.fetchAdminToolRecyclebinNewsFeedListing();
    }
  }

  getTrimText = (text, flag) => {
    const COUNT_OF_ENCICLOPEDIA_DESCRIPTION = (flag) ? 300 : (window.innerWidth / 5);
    const description =   ((text || '').length > COUNT_OF_ENCICLOPEDIA_DESCRIPTION)
          ? (`${(text || '').substr(0, COUNT_OF_ENCICLOPEDIA_DESCRIPTION)}`.concat('...'))
          : text;

    return description;
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

  handleChangeUpload = async info => {
    const status = info.file.status;
    const last = info.fileList[info.fileList.length - 1];
    const { intl: { formatMessage } } = this.props;

    if (status === 'done') {
      const img = new Image();

      img.src = window.URL.createObjectURL(last.originFileObj);
      img.onload = () => {
          if (img.width >= 1440 && img.height >= 900) {
            this.handlePreview(last);
          } else {
            message.error(formatMessage({ id: 'AdminToolsNewsfeedList.imageSizeValidation' }));
          }
      };
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
    this.setState({ fileList: [last], fileName: info.file.name, isImageChanged: true });
  };

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await this.getBase64(file.originFileObj);
      this.setState({ preAvatar: file.preview });
      this.setState({ visible: true, avatar: file.preview });
    }
  };

  getBase64 = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  updateValues = (key, value) => {
    this.setState({ [key]: value });
  };

  onLanguageChange = value => {
    this.setState({
      ...this.state,
      language: value
    });
  }

  handleSavePostNewsFeedItem = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const { intl: { formatMessage, locale } } = this.props;

      if (!err) {
        const { selectedNewsFeed, language, avatar, fileName, isEditMode, isImageChanged, dateTime } = this.state;

        if (isEditMode) {
          this.props.updateNewsItem(selectedNewsFeed, language, avatar, fileName, values, formatMessage, locale, isImageChanged, moment(dateTime).toDate());
        } else {
          this.props.uploadImage(language, avatar, fileName, values, formatMessage, locale, moment(dateTime).toDate());
        }
      }
    });
  };

  getIcon = type => {
    const { sorting } = this.state;

    if (sorting[type] === 'none') {
      return '';
    }
    return (sorting[type] === 'asc') ?  <Icon type="up" /> : <Icon type="down" />;
  };

  deleteNewsFeed = data => {
    this.setState({
      ...this.state,
      isRestoreBtnClick: false,
      confirmModal: true,
      selectedItem: data
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };
  handleOk = img => {
    this.setState({ visible: false, avatar: img });
  };

  getIsDropDownActive = id => {
    const { activeDropDownId } = this.state;

    if (activeDropDownId === id) {
      return true;
    }
    return false;
  };

  editNewsItem = data => {
    const item = {...data};

    let language;

    if (data.language) {
      language = data.language;
    } else {
      language = this.state.language;
    }

    this.setState({
      isImageChanged: false,
      avatar: item.pictureUrl,
      isEditMode: true,
      language,
      dateTime: moment(new Date(item.date))
    }, () => {
      this.props.form.setFieldsValue({
        title: data.title,
        description: data.description
      });
    });
    this.scrollToForm();
  };

  /* Handle View for posted news feeds [ All / Recycle ]*/
  setActiveView = type => {
    this.setState({
      ...this.state,
      activeView: type
    });
  };

  getHighlightedText = (higlight, text) => {
    const parts = text.split(new RegExp(`(${higlight.toString()})`, 'gi'));

    return (
      <span key={text}>
        {parts.map((part, i) => (
          <span
            key={i}
            // CUSTOMIZATION
            style={
              // CUSTOMIZATION: colorization of search items in Newsfeed
              higlight !== '' && part.toLowerCase().indexOf(higlight.toLowerCase()) !== -1
                ? { fontWeight: 'bold', backgroundColor: '#FCABF9' }
                : {}
            }
          >
            {part}
          </span>
        ))}
      </span>
    );
  };

  render () {
    const { isEditMode, visible, language, fileList, avatar, searchText, isMobile, confirmModal, selectedItem, dateTime, activeView, isRestoreBtnClick } = this.state;
    const {
      form: { getFieldDecorator },
      intl: { formatMessage },
      adminTool: { isUploading, isDeleting, isRestoring, isAdminNewsListFetching, isAdminRemovedNewsfeedFetching, adminNewsFeeds, adminRemovedNewsFeeds }
    } = this.props;
    const filteredData = filter(activeView === 'all' ? adminNewsFeeds : adminRemovedNewsFeeds, searchText);
    const MenuItems = ({text, data}) => (
      <Menu
        className="viewDeleteDropDown adminToolDropDown"
        subMenuCloseDelay={0.5}
        onClick={e => {
          if (e.key === 'delete') {
            this.setState({
              ...this.state,
              activeDropDownId: null
            }, () => {
              this.deleteNewsFeed(data);
            });
          }
          if (e.key === 'edit') {
            this.setState({
              ...this.state,
              activeDropDownId: null
            }, () => {
              this.editNewsItem(data);
            });
          }
        }}
      >
        <Menu.Item key={'delete'}>
          <span >
            <Icon type="delete" />
            {formatMessage({ id: 'AdminToolsNewsfeedList.delete' })}
          </span>
        </Menu.Item>
        <Menu.Item key={'edit'}>
          <span >
            <Icon type="edit" />
            {formatMessage({ id: 'AdminToolsNewsfeedList.edit' })}
          </span>
        </Menu.Item>
      </Menu>
    );

    const RecyleMenuItems = ({text, data}) => (
      <Menu
        className="viewDeleteDropDown adminToolDropDown"
        subMenuCloseDelay={0.5}
        onClick={e => {
          setTimeout(() => {
            if (e.key === 'rollback') {
              this.setState({
                ...this.state,
                isRestoreBtnClick: true,
                confirmModal: true,
                selectedItem: data,
                activeDropDownId: null
              });
            } else if (e.key === 'delete') {
              this.setState({
                ...this.state,
                activeDropDownId: null
              }, () => {
                this.deleteNewsFeed(data);
              });
            }
          }, 100);
        }}
      >
        <Menu.Item key={'rollback'}>
          <span>
            <Icon type="rollback" />
            {formatMessage({ id: 'AdminToolsNewsfeedList.rollback' })}
          </span>
        </Menu.Item>
        <Menu.Item key={'delete'}>
          <span >
            <Icon type="delete" />
            {formatMessage({ id: 'AdminToolsNewsfeedList.delete' })}
          </span>
        </Menu.Item>
      </Menu>
    );

    const columns = [
      {
        title: (filters, sortOrder) => {
          return (
            <span>
              {formatMessage({
                  id: 'AdminToolsNewsfeedList.date'
              })}
            </span>
          );
        },
        dataIndex: 'date',
        key: 'date',
        width: 120,
        render: (text, record) => (
          <span className="date date_time">{moment(new Date(text)).format('MM/DD/YYYY hh:mm a')}</span>
        )
      },
      {
        title: (filters, sortOrder) => {
          return null;
        },
        dataIndex: 'language',
        key: 'language',
        width: 120,
        render: (text, record) => (
          <span className="date language">{getCountryIcon(text)}</span>
        )
      },
      {
        title: (filters, sortOrder) => {
          return (
            <span>
              {formatMessage({
                  id: 'AdminToolsNewsfeedList.titleDescription'
              })}
            </span>
          );
        },
        dataIndex: 'title',
        key: 'title',
        width: 120,
        className: 'head_title_description',
        render: (text, record) => {
          const data = getValidFormat(record);

          return (
            <div className="title_description">
              <span className="date title">{this.getHighlightedText(searchText, data.title)}</span>
              <span className="content_description">
                {this.getHighlightedText(searchText, this.getTrimText(data.description, false))}
              </span>
              <div className="delete_popup">
                <span>
                  <Dropdown
                    visible={this.getIsDropDownActive(record.id)}
                    onVisibleChange={e => {
                      if (e) {
                        this.setState({
                          ...this.state,
                          activeDropDownId: data.id,
                          selectedNewsFeed: data
                        });
                      } else {
                        this.setState({
                          ...this.state,
                          activeDropDownId: null
                        });
                      }
                    }}
                    trigger={['click']}
                    overlay={activeView === 'all' ? <MenuItems text={data.description} data={data} /> : <RecyleMenuItems text={data.description} data={data} />}
                    placement="bottomCenter"
                  >
                      <Icon type="more" />
                  </Dropdown>
                </span>
              </div>
            </div>
          );
        }
      }
    ];

    return (
      <div className="profilePage">
        {visible && (
          <AdminToolsNewsfeedImageCropper
            avatar={this.state.preAvatar}
            visible={visible}
            handleCancel={this.handleCancel}
            handleOk={this.handleOk}
            formatMessage={formatMessage}
          />
        )}
        <Modal
          title={formatMessage({ id: 'AdminToolsNewsfeedList.confirmationCaption' })}
          centered
          className="wrapperModal"
          visible={confirmModal}
          confirmLoading={isDeleting || isRestoring}
          okText={formatMessage({ id: `${isRestoreBtnClick ? 'AdminToolsNewsfeedList.rollback' : 'AdminToolsNewsfeedList.confirmationButtonDelete'}`})}
          cancelText={formatMessage({ id: 'AdminToolsNewsfeedList.confirmationButtonCancel' })}
          onOk={() => {
            const { intl: { formatMessage } } = this.props;

            if (activeView === 'all' && !isRestoreBtnClick) {
              this.props.removeNewsFeedItem(selectedItem.id, formatMessage);
              this.setState({ ...this.state, confirmModal: false,  selectedItem: null, isRestoring: false});
            }  else if (isRestoreBtnClick && activeView === 'recycle') {
              const data = {
                'keys':[selectedItem.id]
              };

              this.props.restoreRecyclebinNewsFeedItem(data, formatMessage);
            } else {
              this.props.deleteRecyclebinNewsFeedItem(selectedItem.id, formatMessage);
            }
          }}
          cancelButtonProps={{
            disabled: isDeleting || isRestoring
          }}
          onCancel={() => {
            this.setState({
              ...this.state,
              confirmModal: false,
              selectedItem: null
            });
          }}
        >
          {
            (isRestoreBtnClick)
            ? <p>{formatMessage({ id: 'AdminToolsNewsfeedList.restoreNewsfeed'})}</p>
            : <p>{formatMessage({ id: `${activeView === 'all' ? 'AdminToolsNewsfeedList.confirmationText' : 'AdminToolsNewsfeedList.confirmationTextFinalDelete'}` })}</p>
          }
        </Modal>
        <Form
          id={'adminToolForm'}
          className={`${styles.form} adminToolForm`}
          onSubmit={this.handleSave}
          hideRequiredMark={true}
        >
          <div className="wrappAccountActivity">
            <CustomCard>
              <div className="cardHeaderProfile" ref={this.formSectionRef}>
                <FormattedMessage id="AdminToolsNewsfeedList.postNewsFeedItem" />
              </div>

              <Row gutter={32}>
                  <Col xs={24} md ={24} xl={24}  xxl={24} className={styles.languageSelector}>
                    <AdminToolsNewsfeedLanguageSelector language={language} onLanguageChange={this.onLanguageChange}/>
                    <Form.Item>
                      <DatePicker
                        showTime
                        size="large"
                        value={this.props.dateTime || dateTime}
                        format="MM/DD/YYYY hh:mm a"
                        onChange={e => {
                          this.setState({
                            ...this.state,
                            dateTime: e
                          });
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md ={24} xl={24}  xxl={24}>
                    <div className={styles.uploadBlock}>
                      <Form.Item className="adminTooluploadBlock">
                        <Dragger
                          accept={'.png,.jpg,.jpeg'}
                          action={this.onCustomRequest}
                          fileList={fileList}
                          onChange={this.handleChangeUpload}
                          className={`${styles.dragWrapper} maindragWrapper`}
                          showUploadList={true}
                          beforeUpload={this.beforeUpload}
                        >
                            <div className="ant-upload-drag-icon mainadminToolItemImage">
                              {
                                (avatar && avatar !== '')
                                ? <div className="adminToolItemImage"><img alt={''} src={avatar} /></div>
                                : <Icon type="plus" />
                              }
                            </div>
                            <div className={styles.labelBlock}>
                                {
                                  !isMobile
                                  ? (
                                    <p className="ant-upload-hint admintooldesktopViewLabel">
                                      <FormattedMessage id="AdminToolsNewsfeedList.imageUploadText" />
                                    </p>
                                  ) : (
                                    <p className="ant-upload-hint admintooldesktopViewLabel">
                                      <FormattedMessage id="AdminToolsNewsfeedList.impageUploadTextMobile" />
                                    </p>
                                  )
                                }
                            </div>
                        </Dragger>
                      </Form.Item>
                    </div>
                  </Col>
                  <Col xs={24} md ={24} xl={24} xxl={24}>
                    <Form.Item
                      label= {formatMessage({ id: 'AdminToolsNewsfeedList.title' })}
                    >
                      {
                        getFieldDecorator('title', {
                          rules: [{ required: true, message: formatMessage({ id: 'AdminToolsNewsfeedList.titleError' }) }]
                        })(
                          <Input />
                        )
                      }
                    </Form.Item>
                  </Col>
                  <Col xs={24} md ={24} xl={24} xxl={24}>
                    <Form.Item
                      label= {formatMessage({ id: 'AdminToolsNewsfeedList.body' })}
                    >
                      {
                        getFieldDecorator('description', {
                          rules: [{ required: true, message: formatMessage({ id: 'AdminToolsNewsfeedList.descriptionError' }) }]
                        })(
                          <TextArea
                            size="large"
                            rows={4}
                          />
                        )
                      }
                    </Form.Item>
                  </Col>
                  <Col xs={24} md ={24} xl={24}  xxl={24}>
                    <Button
                      loading={isUploading}
                      onClick={this.handleSavePostNewsFeedItem}
                      htmlType="submit"
                      className={`ant-btn ${styles.accountBtn}`}
                      type="danger"
                    >
                      <span><FormattedMessage id={isEditMode ? 'AdminToolsNewsfeedList.updateNewsFeedBtn' : 'AdminToolsNewsfeedList.postToNewsfeed'} /></span>
                    </Button>
                    &nbsp;
                    {
                      isEditMode
                      ? <Button
                        onClick={() => {
                          this.props.form.resetFields();
                          this.props.clearMessageValue();
                          this.setState({
                            ...this.state,
                            isEditMode: false,
                            avatar: null,
                            selectedNewsFeed: null,
                            isImageChanged: false,
                            dateTime: moment(new Date())
                          });
                        }}
                        disabled={isUploading}
                        className={`ant-btn ${styles.accountBtn}`}
                      >
                        <span><FormattedMessage id="AdminToolsNewsfeedList.cancel" /></span>
                      </Button>
                      : ''
                    }
                  </Col>
              </Row>
            </CustomCard>
          </div>
        </Form>
        <div className="adminToolDetails">
          {
            !isMobile
            ? (
              <div className="adminToolcardHeader">
                <FormattedMessage id="AdminToolsNewsfeedList.postedNewsFeedItems" />
              </div>
            ) : (
              <div className="cardHeaderProfile">
                <FormattedMessage id="AdminToolsNewsfeedList.postedNewsFeedItems" />
            </div>
            )
          }
          <List className="documentTabs">
            <List.Item onClick={() => this.setActiveView('all')}>
              <Typography.Text className={activeView === 'all' ? 'active' : ''}>
                {formatMessage({ id: 'AdminToolsNewsfeedList.allNewsFeeds' })} ({searchText && activeView === 'all' ? `${filteredData.length} of ${adminNewsFeeds.length}` : adminNewsFeeds.length})
              </Typography.Text>
            </List.Item>
             <List.Item onClick={() => this.setActiveView('recycle')}>
              <Typography.Text className={activeView === 'recycle' ? 'active' : ''}>
                {formatMessage({ id: 'AdminToolsNewsfeedList.recycleBin' })} ({searchText && activeView === 'recycle' ? `${filteredData.length} of ${adminRemovedNewsFeeds.length}` : adminRemovedNewsFeeds.length})
              </Typography.Text>
            </List.Item>
          </List>
          <div className="searchBox">
            <Search
              placeholder={formatMessage({ id: 'AdminToolsNewsfeedList.searchPlaceholder' })}
              onChange={e => {
                this.setState({
                  ...this.state,
                  searchText: e.target.value
                });
              }}
            />
          </div>
          {
            (!isAdminNewsListFetching && !isAdminRemovedNewsfeedFetching)
            ? <AdminToolsList
                MenuItems={activeView === 'all' ? MenuItems : RecyleMenuItems}
                isMobile={isMobile}
                columns={columns}
                filteredData={filteredData}
                getTrimText={this.getTrimText}
                visible={this.getIsDropDownActive}
                onVisibleChange={(e, data) => {
                  if (e) {
                    this.setState({
                      ...this.state,
                      activeDropDownId: data.id,
                      selectedNewsFeed: data
                    });
                  } else {
                    this.setState({
                      ...this.state,
                      activeDropDownId: null
                    });
                  }
                }}
            />
            : <ReactLoading className="react-loading-center" type="spin" color="#335889"  />
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (({ adminTool, profile: { userRole } }) => ({ userRole, adminTool }));

const mapDispatchToProps = dispatch => ({
  uploadImage (...args) {
    return dispatch(uploadImage(...args));
  },
  clearMessageValue (...args) {
    return dispatch(clearMessageValue(...args));
  },
  fetchAdminToolNewsFeedListing (...args) {
    return dispatch(fetchAdminToolNewsFeedListing(...args));
  },
  fetchAdminToolRecyclebinNewsFeedListing (...args) {
    return dispatch(fetchAdminToolsRemovedNewsFeedListing(...args));
  },
  removeNewsFeedItem (...args) {
    return dispatch(removeNewsFeedItem(...args));
  },
  updateNewsItem (...args) {
    return dispatch(updateNewsItem(...args));
  },
  deleteRecyclebinNewsFeedItem (...args) {
    return dispatch(deleteRecyclebinNewsFeedItem(...args));
  },
  restoreRecyclebinNewsFeedItem (...args) {
    return dispatch(restoreRecyclebinNewsFeedItem(...args));
  }
});

const WrappedAdminTools = connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create({ name: 'adminToolForm' })(
  AdminToolsNewsfeedList
));

export default injectIntl(WrappedAdminTools);
