import React, { Component } from 'react';
import { Table, Upload, Icon, Button, List, Typography, Menu, Dropdown, Input, Modal } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import moment from 'moment';
import styles from './styles.module.less';
import { getColorClass, sortingDocuments } from './util';
import { fetchAllDocuments, fetchRemovedDocuments, removeDocumentItem, deleteDocumentItem, restoreDocumentItem, saveDocumentSearchItem } from '../../redux/document.action';
import DocumentCreate from './DocumentCreate';
import ReactLoading from 'react-loading';
import { DocumentMobileView } from './DocumentViewMobile';
import { ReactComponent as DocumentIcon } from '../../img/documentIcon.svg';
import { ReactComponent as AudioIcon } from '../../img/audioIcon.svg';
import { ReactComponent as ImageIcon } from '../../img/imageIcon.svg';
import { ReactComponent as PdfIcon } from '../../img/pdfIcon.svg';
import { localeSet } from '../../redux/locale.action';
import analyticId from '../../utils/AnalyticsAndAbTests.tsx';

const { Search } = Input;
const Dragger = Upload.Dragger;


class Documents extends Component {
  displayName = Documents.name
   state = {
    loading: false,
    hasData: true,
    fileList: [],
    uploading: false,
    activeView: 'all',
    sorting:{
      date: 'desc',
      type: 'none',
      name: 'none'
    },
    newDocument:{
      name: '',
      extension: '',
      date: moment(),
      description: '',
      size: ''
    },
    modal:{
      isModalOpen: false,
      isEditable: false
    },
    searchText: '',
    confirmModal: false,
    selectedItem: null,
    isRestoreBtnClick: false,
    isMobile:  window.innerWidth < 768,
    newIsMobile:  window.innerWidth < 1087,
    indeterminate: false,
    checkAll: false,
    selectedType: 'date',
    focused: false
  };


  showModal = data => {
    const { modal } = this.state;

    this.setState({
      ...this.state,
      modal: {
        ...modal,
        isEditable: true,
        isModalOpen: true
      },
      newDocument: {
        ...data,
        name: data.fileName,
        extension: '',
        date: data.date,
        type: data.type.toLowerCase(),
        description: data.description,
        id: data.id,
        size: data.fileSize ? data.fileSize : ''
      }
    });
  };

  componentDidMount () {
    if (window.location.search.includes('?lang=')) {
      const lan = window.location.search.includes('?lang=') ? window.location.search.substring(6, 11) : (localStorage.getItem('language') || 'en');

      this.props.onUpdateLanguage(lan);
      localStorage.setItem('language', lan);
    }
    this.fetchData();
    analyticId.firebaseAnalyticsLog('Documents_AllDocuments');
  }

  componentDidUpdate (prevProps) {
    const { msg } = this.props;

    if (prevProps.msg === null && msg === 'DOCUMENT_REMOVED_SUCCESS') {
      this.setState({
        ...this.state,
        confirmModal: false,
        selectedItem: null
      });
    } else if (prevProps.msg === null && msg === 'DOCUMENT_DELETE_SUCCESS') {
      this.setState({
        ...this.state,
        confirmModal: false,
        selectedItem: null
      });
    } else if (prevProps.msg === null && msg === 'SUCCESS_IN_RESTORE_DOCUMENT') {
      this.setState({
        ...this.state,
        confirmModal: false,
        selectedItem: null,
        isRestoreBtnClick: false
      });
    }
  }

  fetchData = () => {
    const { account } = this.props;

    if (account && account.id) {
      this.props.fetchAllDocuments(account.id);
      this.props.fetchRemovedDocuments(account.id);
    }
  }


  sortData = (setFilter, unsetFilter1, unsetFilter2) => {
    const { sorting } = this.state;

    if (sorting[setFilter] === 'none' || sorting[setFilter] === 'desc') {
      const obj = {...sorting, [setFilter]: 'asc', [unsetFilter1]: 'none', [unsetFilter2]: 'none' };

      this.setState({...this.state, sorting: obj});
    } else {
      const obj = {...sorting, [setFilter]: 'desc', [unsetFilter1]: 'none', [unsetFilter2]: 'none' };

      this.setState({...this.state, sorting: obj});
    }
  }

  getIcon = type => {
    const { sorting } = this.state;

    if (sorting[type] === 'none') {
      return '';
    }
    return (sorting[type] === 'asc') ?  <Icon type="up" /> : <Icon type="down" />;
  }

  /* Handle View for documents [ All / Recycle ]*/
  setActiveView = type => {
    this.setState({
      ...this.state,
      activeView: type,
      indeterminate: false,
      checkAll: false,
      selectedType: 'date'
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
              // CUSTOMIZATION: colorization of search items in Documents
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

  closeModal = () => {
    this.setState({
      ...this.state,
      modal: {
        ...this.state.modal,
        isModalOpen: false
      },
      fileList: []
    });
  }

  deleteDocument = data => {
    this.setState({
      ...this.state,
      isRestoreBtnClick: false,
      confirmModal: true,
      selectedItem: data
    });
  }

  onBlur = () => {
    this.setState({ focused: false }, () => { this.onChange(); });
  }

  onFocus = () => {
    this.setState({ focused: true });
  }

  onChange = () => {
    const { activeView, sorting, searchText, focused } = this.state;
    const { documents, removedDocuments } = this.props;
    const filteredData = sortingDocuments(activeView === 'all' ? documents : removedDocuments, sorting, searchText);

    if (filteredData.length === 0 && searchText !== '' && focused) {
      this.addNewSearch(searchText, '', false);
    } else if (!focused && searchText !== '' && filteredData.length !== 0) {
      this.addNewSearch(searchText, filteredData[0].id, true);
    }
  }

  addNewSearch = (title, uniqueId, isSuccessful) => {
    const { id } = this.props.account;

    this.props.saveDocumentSearchItem(title, uniqueId, id, isSuccessful);
  };

  render () {
    const { isRestoreBtnClick, activeView, sorting, fileList, searchText, modal, confirmModal, selectedItem, isMobile, newIsMobile } = this.state;
    const { isLoading, isRestoring, isDeleting, documents, removedDocuments, isAllDocumentLoaded, isRemovedDocumentLoaded } = this.props;
    const {
      intl: { formatMessage }
    } = this.props;
    const filteredData = sortingDocuments(activeView === 'all' ? documents : removedDocuments, sorting, searchText);

    const MenuItems = ({text, data}) => (
      <Menu
        className="viewDeleteDropDown"
        subMenuCloseDelay={0.5}
        onClick={e => {
          setTimeout(() => {
            if (e.key === 'view') {
              this.showModal(data);
            } else {
              this.deleteDocument(data);
            }
          }, 100);
        }}
      >
        <Menu.Item key={'view'}>
          <span>
            <Icon type="eye" />
            {formatMessage({ id: 'Documents.view' })}
          </span>
        </Menu.Item>
        <Menu.Item key={'delete'}>
          <span >
            <Icon type="delete" />
            {formatMessage({ id: 'Documents.delete' })}
          </span>
        </Menu.Item>
      </Menu>
    );

    const RecyleMenuItems = ({text, data}) => (
      <Menu
        className="viewDeleteDropDown"
        subMenuCloseDelay={0.5}
        onClick={e => {
          setTimeout(() => {
            if (e.key === 'rollback') {
              this.setState({
                ...this.state,
                isRestoreBtnClick: true,
                confirmModal: true,
                selectedItem: data
              });
            } else if (e.key === 'delete') {
              this.deleteDocument(data);
            }
          }, 100);
        }}
      >
        <Menu.Item key={'rollback'}>
          <span>
            <Icon type="rollback" />
            {formatMessage({ id: 'Documents.rollback' })}
          </span>
        </Menu.Item>
        <Menu.Item key={'delete'}>
          <span >
            <Icon type="delete" />
            {formatMessage({ id: 'Documents.delete' })}
          </span>
        </Menu.Item>
      </Menu>
    );

    const columns = [
      {
        title: (filters, sortOrder) => {
          return (
            <span onClick={() => this.sortData('date', 'type', 'name') }>
              {formatMessage({
                id: 'Documents.date'
              })}
              {this.getIcon('date')}
            </span>
          );
        },
        dataIndex: 'date',
        key: 'date',
        width: 120,
        render: (text, record) => (
           <span className="date">{moment(new Date(text)).format('MM/DD/YYYY hh:mm a')}</span>
        )
      },
      {
        title: (filters, sortOrder) => {
          return (
            <span onClick={() => this.sortData('type', 'date', 'name') }>
              {formatMessage({
                id: 'Documents.type'
              })}
              {this.getIcon('type')}
            </span>
          );
        },
        dataIndex: 'type',
        key: 'address',
        width: 120,
        render: (text, record) => (
           <div className={`${styles.typeBox} ${styles[getColorClass(text)]}`}>
              { record.contentType.includes('image') && <Icon component={ImageIcon} /> }
              { record.contentType.includes('video') && <Icon component={AudioIcon} /> }
              { record.contentType.includes('application/pdf') && <Icon component={PdfIcon} /> }
              { !record.contentType.includes('image') && !record.contentType.includes('video') && !record.contentType.includes('application/pdf') && <Icon component={DocumentIcon} /> }
              <span className={styles.fileSize}>{record.fileSize !== '' && record.fileSize > '0' ? record.fileSize  : ''}</span>
           </div>
        )
      },
      {
        title: (filters, sortOrder) => {
          return (
            <span onClick={() => this.sortData('name', 'date', 'type') }>
              {formatMessage({
                id: 'Documents.name'
              })}
              {this.getIcon('name')}
            </span>
          );
        },
        dataIndex: 'fileName',
        key: 'name',
        render: (text, record) => (
          <span className="nameContent">
            <span onClick={() => {
              if (activeView === 'all') {
                this.showModal(record);
              }
            }}>
              <h4 className={activeView === 'all' ? '' : 'no-cursor'}>{this.getHighlightedText(searchText, text)}</h4>
            </span>
            <p>{this.getHighlightedText(searchText, record.description)}</p>
            <div className="view_delete_popup">
              <Dropdown trigger={['click']} overlay={activeView === 'all' ? <MenuItems text={text} data={record} /> : <RecyleMenuItems text={text} data={record} />} placement="bottomCenter">
                <Icon type="more" />
              </Dropdown>
            </div>
          </span>
        )
      }
    ];

    const props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();

          newFileList.splice(index, 1);
          return {
            fileList: newFileList
          };
        });
      },
      beforeUpload: file => {
        const fileName = file.name;
        const ext = fileName.substr(fileName.lastIndexOf('.') + 1);
        const { modal } = this.state;

        this.setState(state => ({
          fileList: [file],
          modal:{
            ...modal,
            isEditable: false,
            isModalOpen: true
          },
          newDocument:{
            name: fileName,
            date: moment(),
            extension: ext,
            type: '',
            size: (file.size / (1024 * 1024)).toFixed(2) > 1 ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : `${(file.size / (1024)).toFixed(2)} KB`
          }
        }));
        return false;
      },
      fileList,
      multiple: false
    };

    return (
      <div>
        {
          modal.isModalOpen
          ? <DocumentCreate
            closeModal={this.closeModal}
            modal={this.state.modal}
            newDocument={this.state.newDocument}
            isLoading={isLoading}
            fileList={fileList}
          />  : null
        }
        <Modal
          title={formatMessage({ id: 'Documents.confirmationCaption' })}
          centered
          className="wrapperModal"
          visible={confirmModal}
          confirmLoading={isDeleting || isRestoring}
          okText={formatMessage({ id: `${isRestoreBtnClick ? 'Documents.rollback' : 'Documents.confirmationButtonDelete'}`})}
          cancelText={formatMessage({ id: 'Documents.confirmationButtonCancel' })}
          onOk={() => {
            if (activeView === 'all' && !isRestoreBtnClick) {
              this.props.removeDocumentItem(selectedItem.id, formatMessage);
            } else if (isRestoreBtnClick && activeView === 'recycle') {
              const { selectedItem } = this.state;
              const { account } = this.props;
              const obj = {
                  'keys': [selectedItem.id]
              };

              this.props.restoreDocumentItem(account.id, obj, formatMessage);
            } else {
              this.props.deleteDocumentItem(selectedItem.id, formatMessage);
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
            ? <p>{formatMessage({ id: 'Documents.restoreDocument'})}</p>
            : <p>{formatMessage({ id: `${activeView === 'all' ? 'Documents.confirmationTextDeleteToRecycleBin' : 'Documents.confirmationTextFinalDelete'}` })}</p>
          }
        </Modal>
        <h1 className={styles.header}>
          <FormattedMessage id="Documents.header" />
        </h1>
        <div className={styles.mainDocuments}>
          <div className="mainUploadSection">
              <div className="uploadBox">
                <Dragger {...props} className="uploadSection">
                  <div className="uploadContent">
                    <Button>
                      <Icon type="plus" />
                      <span className="uploadText">
                        {formatMessage({ id: 'Documents.uploadText' })}
                      </span>
                    </Button>
                      {
                        !isMobile
                        ? (
                          <p>{formatMessage({ id: 'Documents.fileUploadText' })}</p>
                        ) : (
                          <p>{formatMessage({ id: 'Documents.fileUploadTextMobile' })}</p>
                        )
                      }
                  </div>
                </Dragger>
              </div>
          </div>
          <div className="documentDetails">
            <List className="documentTabs">
                <List.Item onClick={() => this.setActiveView('all')}>
                  <Typography.Text className={activeView === 'all' ? 'active' : ''}>
                    {formatMessage({ id: 'Documents.allDocuments' })} ({searchText && activeView === 'all' ? `${filteredData.length} of ${documents.length}` : documents.length})
                  </Typography.Text>
                </List.Item>
                 <List.Item onClick={() => this.setActiveView('recycle')}>
                  <Typography.Text className={activeView === 'recycle' ? 'active' : ''}>
                    {formatMessage({ id: 'Documents.recycleBin' })} ({searchText && activeView === 'recycle' ? `${filteredData.length} of ${removedDocuments.length}` : removedDocuments.length})
                  </Typography.Text>
                </List.Item>
            </List>
            <div className="searchBox">
              <Search
                placeholder={formatMessage({ id: 'Documents.searchPlaceholder' })}
                onChange={e => {
                  this.setState({
                    ...this.state,
                    searchText: e.target.value
                  }, () => { this.onChange(); });
                }}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
              />
            </div>
            {
              !newIsMobile
              ? (
                <div className="userDetailsTable">
                  {
                    (isAllDocumentLoaded && isRemovedDocumentLoaded)
                      ? <Table
                          rowKey={record => record.id}
                          {...this.state}
                          columns={columns}
                          dataSource={filteredData}
                          pagination={false}
                        /> : <ReactLoading className={styles.center} type="spin" color="#335889"  />
                  }
                </div>
              ) : (
                <div>
                  {
                    (isAllDocumentLoaded && isRemovedDocumentLoaded)
                    ? <div>
                      {
                        filteredData.map((data, index) => {
                          return (
                            <DocumentMobileView
                              key={index}
                              fileName={data.fileName}
                              description={data.description}
                              contentType={data.contentType}
                              date={data.date}
                              type={data.type}
                              activeView={activeView}
                              menu={activeView === 'all' ? <MenuItems data={data} /> : <RecyleMenuItems data={data} />}
                              data={data}
                              modal={this.showModal}
                              higlightedText={this.getHighlightedText}
                              searchText={searchText}
                              selected={data.selected ? data.selected : false}
                              allData={filteredData}
                            />
                          );
                        })
                      }
                    </div>
                    : <ReactLoading className={styles.center} type="spin" color="#335889"  />
                  }
                </div>
              )
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ((
  { document: { msg, isDeleting, isRestoring, removedDocuments, documents, isLoading, isAllDocumentLoaded, isRemovedDocumentLoaded }, profile : { account }  }
  ) => (
  { documents, msg, isDeleting, isRestoring, removedDocuments, isLoading, account, isAllDocumentLoaded, isRemovedDocumentLoaded }
));

const mapDispatchToProps = dispatch => ({
  fetchAllDocuments (...args) {
    return dispatch(fetchAllDocuments(...args));
  },
  fetchRemovedDocuments (...args) {
    return dispatch(fetchRemovedDocuments(...args));
  },
  removeDocumentItem (...args) {
    return dispatch(removeDocumentItem(...args));
  },
  deleteDocumentItem (...args) {
    return dispatch(deleteDocumentItem(...args));
  },
  restoreDocumentItem (...args) {
    return dispatch(restoreDocumentItem(...args));
  },
  saveDocumentSearchItem (...args) {
    return dispatch(saveDocumentSearchItem(...args));
  },
  onUpdateLanguage (args) {
    dispatch(localeSet(args));
    return Promise.resolve();
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(Documents));
