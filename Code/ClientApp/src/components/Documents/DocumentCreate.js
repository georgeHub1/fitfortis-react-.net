import React from 'react';
import { ReactComponent as print } from '../../img/print.svg';
import { ReactComponent as download } from '../../img/download.svg';
import { getColorClass } from './util';
import { injectIntl } from 'react-intl';
import moment from 'moment';
import { connect } from 'react-redux';
import { Icon, Button, Input, Select, Form, DatePicker, Row, Col, Modal, Progress, message } from 'antd';
import { createDocument, updatingDocument, dowloadDocument, printDocument } from '../../redux/document.action';

import styles from './styles.module.less';

const { Option } = Select;
const { TextArea } = Input;


class DocumentCreate extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      name: props.newDocument.name,
      extension: props.newDocument.extension,
      date: moment(props.newDocument.date),
      description: props.newDocument.description || '',
      type: props.newDocument.type,
      fileList: props.fileList || [],
      size: props.newDocument.size
    };
  }

  componentDidUpdate (prevProps) {
    const { msg } = this.props;

    if (prevProps.msg === null && msg === 'DOCUMENT_CREATE_SUCCESS') {
      this.props.closeModal();
      this.setState({...this.state, fileList: []});
    }
    if (prevProps.msg === null && msg === 'SUCCESS_IN_UPDATE_DOCUMENT') {
      this.props.closeModal();
      this.setState({...this.state, fileList: []});
    }
  }

  handleChange = (event, field) => {
    this.setState({
      ...this.state,
      [field]: event.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { modal, intl: { formatMessage } } = this.props;

        if (modal.isEditable) {
          const { updatingDocument, newDocument } = this.props;

          const { name, description, date, type } = this.state;

          updatingDocument(newDocument.id, {
            FileName: name,
            Description: description,
            Date: moment(date).utc().format(),
            Type: type
          }, formatMessage);
        } else {
          const fileList = this.state.fileList[0];

          if (fileList) {
            const newFile = new Blob([fileList], {type: fileList.type, lastModified: fileList.lastModified, uid: fileList.uid});

            newFile.name = `${this.state.name}`;

            // Construct a file
            const file = new File([newFile], newFile.name, {
                lastModified: fileList.lastModified || '', // optional - default = now
                type: newFile.type || '', // optional - default = ''
                uid: fileList.uid || '',
                webkitRelativePath: fileList.webkitRelativePath || '',
                size: fileList.size || '',
                lastModifiedDate: fileList.lastModifiedDate || ''
            });

            file.uid = fileList.uid;

            const { account, createDocument } = this.props;
            const { name, description, date, type, size } = this.state;

            createDocument(account.id, {name, description, type, file, date: moment(date).utc().format(), size}, formatMessage);
          }
        }
      }
    });
  };

  download = () => {
    const { intl: { formatMessage } } = this.props;
    const { id, fileName, contentType } = this.props.newDocument;

    this.props.dowloadDocument(id, fileName, contentType, formatMessage);
  }

  render () {
    const {
      intl: { formatMessage },
      isLoading,
      modal,
      form: { getFieldDecorator },
      downloadDocument
    } = this.props;

    const { size } = this.state;

    return (
      <Modal
          title={modal.isEditable ? formatMessage({ id: 'Documents.viewDocument' }) : formatMessage({ id: 'Documents.uploadDocument' })}
          visible={modal.isModalOpen}
          centered
          className="wrapperModal"
          onCancel={() => {
            if (downloadDocument.cancel) {
              downloadDocument.cancel('CANCEL');
            }
            this.props.closeModal();
          }}
          footer={null}
        >
        <div>
          <Form onSubmit={this.handleSubmit}  className="uploadDocumentModalForm">
            {
              (modal.isEditable) ? (
                <div className={styles.sharePrintBlock}>
                <Button type="primary" onClick={() => this.download()}>
                  <Icon component={download} />
                  {formatMessage({ id: 'Documents.download' })}
                </Button>
                <Button type="primary" onClick={() => {
                  const { intl: { formatMessage } } = this.props;
                  const { id, fileName, contentType } = this.props.newDocument;

                  if (contentType.includes('image') || contentType.includes('pdf')) {
                    this.props.printDocument(id, fileName, contentType, formatMessage);
                  } else {
                    message.error(formatMessage({ id: 'Documents.printNotAllowed' }));
                  }
                }}>
                  <Icon component={print} />
                  {formatMessage({ id: 'Documents.print' })}
                </Button>
                </div>
              ) : ('')
            }
            {downloadDocument.inProgress ? <Progress percent={downloadDocument.percentage} strokeColor={'#335889'} /> : ''}
            <Row gutter={16}>
              <Col className="gutter-row" sm={24} md={12} >
                <Form.Item
                label= {formatMessage({ id: 'Documents.date' })}
                >
                <DatePicker
                  showTime
                  size="large"
                  defaultValue={this.state.date}
                  format="MM/DD/YYYY hh:mm a"
                  onChange={e => {
                    this.setState({
                      ...this.state,
                      date: e
                    });
                  }}
                />
                </Form.Item>
              </Col>
              <Col className="gutter-row" sm={24} md={12} >
                <Form.Item
                label= {formatMessage({ id: 'Documents.type' })}
                >
                 {getFieldDecorator('type', {
                    rules: [{ required: true, message: formatMessage({ id: 'Documents.selectDocumentError' }) }],
                    initialValue: this.state.type
                  })(
                  <Select
                    size="large"
                    optionFilterProp="children"
                    className={styles[getColorClass(this.state.type)]}
                    onChange={e => {
                      this.setState({
                        ...this.state,
                        type: e
                      });
                    }}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="consentandassentform" className={`${styles[getColorClass('consentandassentform')]} selectItem`}>{formatMessage({ id: 'Documents.consentAndAssentForm' })}</Option>
                    <Option value="healthreport" className={`${styles[getColorClass('healthreport')]} selectItem`}>{formatMessage({ id: 'Documents.healthReport' })}</Option>
                    <Option value="insurancereport" className={`${styles[getColorClass('insurancereport')]} selectItem`}>{formatMessage({ id: 'Documents.insuranceReport' })}</Option>
                    <Option value="medicaldiagnosis" className={`${styles[getColorClass('medicaldiagnosis')]} selectItem`}>{formatMessage({ id: 'Documents.medicalDiagnosis' })}</Option>
                    <Option value="medicalimage" className={`${styles[getColorClass('medicalimage')]} selectItem`}>{formatMessage({ id: 'Documents.medicalImage' })}</Option>
                    <Option value="medicaltest" className={`${styles[getColorClass('medicaltest')]} selectItem`}>{formatMessage({ id: 'Documents.medicalTest' })}</Option>
                    <Option value="prescription" className={`${styles[getColorClass('prescription')]} selectItem`}>{formatMessage({ id: 'Documents.prescription' })}</Option>
                    <Option value="other" className={`${styles[getColorClass('other')]} selectItem`}>{formatMessage({ id: 'Documents.other' })}</Option>
                  </Select>
                )}
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              label= {formatMessage({ id: 'Documents.name' })}
              className="name_feild"
            >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: formatMessage({ id: 'Documents.nameError' }) }],
                initialValue: this.state.name
              })(
                <Input
                  size="large"
                  onChange = { e => this.handleChange(e, 'name')}
                />
              )}
            </Form.Item>
            {
              size !== '' && size !== '0'
              && <p className="fileSize-text">
                { size }
              </p>
            }
            <Form.Item
              label= {formatMessage({ id: 'Documents.description' })}
            >
              {getFieldDecorator('description', {
                rules: [{ required: true, message: formatMessage({ id: 'Documents.descriptionError' }) }],
                initialValue: this.state.description
              })(
                <TextArea
                  size="large"
                  rows={4}
                  onChange = { e => this.handleChange(e, 'description')}
                />
              )}
            </Form.Item>
            <div className={styles.modalFooter}>
              <Button
                disabled={isLoading}
                onClick={() => {
                  if (downloadDocument.cancel) {
                    downloadDocument.cancel('CANCEL');
                  }
                  this.props.closeModal();
                }}
                htmlType="button"
                className="login-form-button"
              >
                {formatMessage({ id: 'Documents.cancel' })}
              </Button>
              <Button loading={isLoading} type="primary" htmlType="submit" className="login-form-button">
                {modal.isEditable ? formatMessage({ id: 'Documents.save' }) : formatMessage({ id: 'Documents.ok' })}
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = ((
  {
    document: { items, isLoading, msg, downloadDocument, printDocumentWindow }, profile : { account }
  }) => ({ items, isLoading, account, msg, downloadDocument, printDocumentWindow }));

const mapDispatchToProps = dispatch => ({
  createDocument (...args) {
    return dispatch(createDocument(...args));
  },
  updatingDocument (...args) {
    return dispatch(updatingDocument(...args));
  },
  dowloadDocument (...args) {
    return dispatch(dowloadDocument(...args));
  },
  printDocument (...args) {
    return dispatch(printDocument(...args));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(Form.create({ name: 'document_create_form' })(DocumentCreate)));
