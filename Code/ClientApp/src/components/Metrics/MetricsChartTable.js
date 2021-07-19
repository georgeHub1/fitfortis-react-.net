import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Table, Icon, Form, Button, Modal } from 'antd';
import moment from 'moment';
import { EditableCell, EditableContext } from './MetricsEditableCell';
import { MetricsChartDataProps } from '../../containers/Metrics/metrics.chart.propTypes';
import { injectIntl } from 'react-intl';

const sortConst = {
  asc: 'asc',
  none: 'none',
  desc: 'desc'
};

class MetricsChartTable extends PureComponent {
  displayName = MetricsChartTable.name;
  static propTypes = {
    chartDATA: PropTypes.arrayOf(MetricsChartDataProps).isRequired,
    columnsName: PropTypes.object.isRequired,
    deleteMetricDataBulk: PropTypes.func.isRequired,
    upsertEntity: PropTypes.func.isRequired,
    intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
  };
  constructor (props) {
    super(props);
    this.state = {
      confirmModal: false,
      editingKey: null,
      deletedKey: null,
      isDeleting: false,
      sorting: {
        dateTime: sortConst.desc
      }
    };
  }
  getIcon = type => {
    const { sorting } = this.state;

    if (sorting[type] === sortConst.none || !sorting[type]) {
      return '';
    }
    return (sorting[type] === sortConst.desc) ? <Icon type="down" /> : <Icon type="up" />;
  }
  setSorting = column => {
    const { sorting } = this.state;

    if (sorting[column] === sortConst.desc) {
      const obj = { [column]: sortConst.asc };

      this.setState({ sorting: obj, editingKey: null });
    } else {
      const obj = { [column]: sortConst.desc };

      this.setState({ sorting: obj, editingKey: null });
    }
  }

  sortMetricData = chartData => {
    const dateTimeMap = {};
    const { sorting } = this.state;
    const allMetricData = chartData.map(x => x.metricData)
      .reduce((acc, curr) => [...acc, ...curr], []);

    allMetricData.forEach(x => {
      if (dateTimeMap[x.dateTime] === null || (dateTimeMap[x.dateTime] === undefined))
        dateTimeMap[x.dateTime] = {
          key: x.dateTime,
          dateTime: x.dateTime
        };

      dateTimeMap[x.dateTime][x.metricId] = x.value;
      dateTimeMap[x.dateTime][`${x.metricId}comment`] = x.comment;
    });

    const combinedMetricData = Object.values(dateTimeMap);

    let field = null;

    let sort = sortConst.asc;

    Object.entries(sorting).forEach(([k, v]) => {
      if (v && v !== sortConst.none) {
        field = k;
        sort = v;
      }
    });

    if (!field)
      return combinedMetricData;

    const sorted = [...combinedMetricData];

    if (sort === sortConst.desc) {
      sorted.sort((a, b) => {
        if ((a[field] === null || a[field] === undefined) && (b[field] === null && b[field] === undefined))
          return 0;
        if ((a[field] === null || a[field] === undefined))
          return 1;
        if ((b[field] === null || b[field] === undefined))
          return -1;
        if (a[field] > b[field]) return -1;
        if (a[field] === b[field]) return 0;
        return 1;
      });
    }
    else {
      sorted.sort((a, b) => {
        if ((a[field] === null || a[field] === undefined) && (b[field] === null && b[field] === undefined))
          return 0;
        if ((a[field] === null || a[field] === undefined))
          return -1;
        if ((b[field] === null || b[field] === undefined))
          return 1;
        if (a[field] > b[field]) return 1;
        if (a[field] === b[field]) return 0;
        return -1;
      });
    }
    return sorted;
  }
  columns = () => {
    const { chartDATA, intl: { formatMessage } } = this.props;
    const columns = chartDATA.map(metric => {
      return {
        title: () => {
          return (
            <span onClick={() => this.setSorting(metric.metricId)}>
              {metric.name}
              {this.getIcon(metric.metricId)}
            </span>
          );
        },
        dataIndex: metric.metricId,
        key: metric.metricId,
        width: 180,
        editable: true,
        render: (text, record) => {
          return (<span className="editable-cell-value-wrap">{text}</span>);
        }
      };
    });
    const columnsComments = chartDATA.map(metric => {
      return {
        title: () => {
          return (
            <span onClick={() => this.setSorting(`${metric.metricId}comment`)}>
              {`${metric.name} ${formatMessage({ id: 'MetricsChart.Comments'})}`}
              {this.getIcon(`${metric.metricId}comment`)}
            </span>
          );
        },
        dataIndex: `${metric.metricId}comment`,
        key: `${metric.metricId}comment`,
        width: 180,
        editable: true,
        render: (text, record) => {
          return (<span className="editable-cell-value-wrap">{text}</span>);
        }
      };
    });

    return [
      {
        title: (filters, sortOrder) => {
          return (
            <span onClick={() => this.setSorting('dateTime')}>
              {this.props.columnsName.date}
              {this.getIcon('dateTime')}
            </span>
          );
        },
        dataIndex: 'dateTime',
        key: 'dateTime',
        width: 210,
        render: (text, record) => {
          return (<span className="editable-cell-value-wrap">{moment(new Date(text)).format('MM/DD/YYYY hh:mm a')}</span>);
        },
        editable: true
      },
      ...columns,
      ...columnsComments,
      {
        title: '',
        dataIndex: 'Operations',
        key: 'Operations',
        render: (text, record) => {
          const isEditing = this.isEditing(record);

          return isEditing ? (
            <div style={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <EditableContext.Consumer>
                {form => (
                  <Button
                    size="small"
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      this.save(form, record.key);
                    }}
                    shape="circle-outline"
                    type="primary"
                    className="action-btn"
                  >
                    <Icon type="check" style={{ width: 14, height: 14 }} />
                  </Button>
                )}
              </EditableContext.Consumer>
              <Button
                size="small"
                shape="circle-outline"
                className="action-btn"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  this.cancel();
                }}
                type="primary"
              >
                <Icon type="close" style={{ width: 14, height: 14 }} />
              </Button>
            </div>
          ) : (
              <div style={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'flex-end'
              }}>
                <Button
                  size="small"
                  shape="circle-outline"
                  className="action-btn"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.onDelete(record);
                  }}
                  type="primary"
                >
                  <Icon type="delete" style={{ width: 14, height: 14 }} />
                </Button>
              </div>);
        }
      }
    ];
  };

  isEditing = record => record.key === this.state.editingKey;
  onConfirmDelete = () => {
    this.setState(
      { isDeleting: true, confirmModal: true },
      () => {
        const { deletedKey } = this.state;
        const { chartDATA, deleteMetricDataBulk } = this.props;
        const result = chartDATA.map(x => x.metricData)
          .reduce((acc, curr) => [...acc, ...curr], [])
          .filter(x => x.dateTime === deletedKey)
          .map(x => x.id);

        deleteMetricDataBulk(result).then(this.cancel);
      }
    );
  }
  onDelete = record => {
    this.setState({ deletedKey: record.key, confirmModal: true });
  }
  cancel = () => {
    this.setState(item => ({ ...item, deletedKey: null, confirmModal: false, isDeleting: false, editingKey: null }));
  };
  save = (form, key) => {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const {
        upsertEntity,
        chartDATA
      } = this.props;
      const dateTime = this.state.editingKey;
      const editedMetricData = chartDATA.map(x => x.metricData)
        .reduce((acc, curr) => [...acc, ...curr], [])
        .filter(x => x.dateTime === dateTime);
      const result = [];
      const newDateTime = row.dateTime.toDate();

      newDateTime.setSeconds(0);
      newDateTime.setMilliseconds(0);
      chartDATA.forEach(x => {
        const point = editedMetricData.find(y => y.metricId === x.metricId);

        if (point) {
          result.push({
            id: point.id,
            date: moment(new Date(newDateTime)).utc().format(),
            metricId: x.metricId,
            value: row[x.metricId],
            comment: row[`${x.metricId}comment`]
          });
        }
        else if (row[x.metricId] !== null && row[x.metricId] !== undefined && row[x.metricId] !== '') {
          result.push({
            date: moment(new Date(newDateTime)).utc().format(),
            metricId: x.metricId,
            value: row[x.metricId],
            comment: row[`${x.metricId}comment`]
          });
        }
      });
      if (!result.length) {
        this.cancel();
      }
      upsertEntity(result, this.cancel);
    });
  }
  edit = key => {
    if (this.state.editingKey && this.state.editingKey !== key) {
      this.setState(item => ({ editingKey: null }), () => {
        this.setState({ editingKey: key });
      });
    }
    else {
      this.setState({ editingKey: key });
    }
  }

  render () {
    const { chartDATA, intl: { formatMessage } } = this.props;
    const { isDeleting, confirmModal } = this.state;
    const sortedData = this.sortMetricData(chartDATA);
    const components = {
      body: {
        cell: EditableCell
      }
    };
    const columns = this.columns().map(col => {
      if (!col.editable) {
        return col;
      }
      let inputTypeValue = null;

      if (col.dataIndex === 'dateTime') {
        inputTypeValue = 'date';
      } else if (col.dataIndex.includes('comment')) {
        inputTypeValue = 'text';
      } else {
        inputTypeValue = 'number';
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: inputTypeValue,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record)
        })
      };
    });

    return (<div
      className="metricsTimeLineSection"
      style={{
        borderRadius: '0px',
        padding: '0px',
        width: '97%'
      }}
    >
      <div className={`${sortedData.length === 0 ? 'no-data-table' : ''} detailViewTable`}>
        <EditableContext.Provider value={this.props.form}>
          <Table
            onRow={(record, index, event) => {
              return {
                onClick: e => {
                  this.edit(record.key);
                }
              };
            }}
            rowKey={record => record.key}
            {...this.state}
            columns={columns}
            dataSource={sortedData}
            components={components}
            pagination={{
              pageSize: 5,
              onChange: this.cancel
            }}
            elip
            scroll={{ y: 240}}
          />
          <Modal
            title={formatMessage({ id: 'MetricsChartTable.confirmationCaption' })}
            centered
            className="wrapperModal"
            visible={confirmModal}
            confirmLoading={isDeleting}
            okText={formatMessage({ id: 'MetricsChartTable.confirmationButtonDelete' })}
            cancelText={formatMessage({ id: 'MetricsChartTable.confirmationButtonCancel' })}
            onOk={this.onConfirmDelete}
            cancelButtonProps={{
              disabled: isDeleting
            }}
            onCancel={this.cancel}
          ><p>
              {formatMessage({ id: 'MetricsChartTable.confirmationTextDelete' })}
            </p>

          </Modal>

        </EditableContext.Provider>
      </div>
    </div>
    );
  }
}

export default injectIntl(Form.create()(MetricsChartTable));
