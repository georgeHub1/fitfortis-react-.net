import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Table, Icon, Form, Button } from 'antd';
import moment from 'moment';
import { EditableCell, EditableContext } from './MetricsEditableCell';
import { TIMELINE_METRIC_ID, DEFAULT_GUID } from '../../constants/metrics';

const sortConst = {
  asc: 'asc',
  none: 'none',
  desc: 'desc'
};

class MetricsChartTimeLineTable extends PureComponent {
  displayName = MetricsChartTimeLineTable.name;
  static propTypes = {
    metricData: PropTypes.arrayOf(
      PropTypes.shape({
        dateTime: PropTypes.number.isRequired,
        id: PropTypes.string.isRequired,
        measurements: PropTypes.any,
        labResults: PropTypes.any,
        doctorVisits: PropTypes.any
      })
    ).isRequired,
    updateEntry: PropTypes.func.isRequired,
    createNewEntry: PropTypes.func.isRequired,
    columnsName: PropTypes.object.isRequired,
    updating: PropTypes.func.isRequired
  };
  constructor (props) {
    super(props);
    this.state = {
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
  sortData = column => {
    const { sorting } = this.state;

    if (sorting[column] === sortConst.desc) {
      const obj = { [column]: sortConst.asc };

      this.setState({ sorting: obj, editingKey: null });
    } else {
      const obj = { [column]: sortConst.desc };

      this.setState({ sorting: obj, editingKey: null });
    }
  }
  sortMetricData = metricData => {
    const { sorting } = this.state;

    let field = null;

    let sort = sortConst.asc;

    Object.entries(sorting).forEach(([k, v]) => {
      if (v && v !== sortConst.none) {
        field = k;
        sort = v;
      }
    });

    if (!field)
      return metricData;

    const sorted = [...metricData];

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
  columns = () => [
    {
      title: (filters, sortOrder) => {
        return (
          <span onClick={() => this.sortData('dateTime')}>
            {this.props.columnsName.date}
            {this.getIcon('dateTime')}
          </span>
        );
      },
      dataIndex: 'dateTime',
      key: 'dateTime',
      width: 180,
      render: (text, record) => (
        <span>{moment(new Date(text)).format('MM/DD/YYYY hh:mm a')}</span>
      )
    },
    {
      title: (filters, sortOrder) => {
        return (
          <span onClick={() => this.sortData('measurements')}>
            {this.props.columnsName.measurements}
            {this.getIcon('measurements')}
          </span>
        );
      },
      dataIndex: 'measurements',
      key: 'measurements',
      width: 150
    },
    {
      title: (filters, sortOrder) => {
        return (
          <span onClick={() => this.sortData('doctorVisits')}>
            {this.props.columnsName.doctorVisits}
            {this.getIcon('doctorVisits')}
          </span>
        );
      },
      dataIndex: 'doctorVisits',
      key: 'doctorVisits',
      editable: true,
      width: 140,
      render: (text, record) => {
        return (<span className="editable-cell-value-wrap">{text}</span>);
      }
    },
    {
      title: (filters, sortOrder) => {
        return (
          <span onClick={() => this.sortData('doctorVisitsComments')}>
            {this.props.columnsName.doctorVisitsComments}
            {this.getIcon('doctorVisitsComments')}
          </span>
        );
      },
      dataIndex: 'doctorVisitComments',
      key: 'doctorVisitComments',
      inputType: 'text',
      editable: true,
      width: 140,
      render: (text, record) => {
        return (<span className="editable-cell-value-wrap">{text}</span>);
      }
    },
    {
      title: (filters, sortOrder) => {
        return (
          <span onClick={() => this.sortData('labResults')}>
            {this.props.columnsName.labResults}
            {this.getIcon('labResults')}
          </span>
        );
      },
      dataIndex: 'labResults',
      key: 'labResults',
      editable: true,
      width: 140,
      render: (text, record) => {
        return (<span className="editable-cell-value-wrap">{text}</span>);
      }
    },
    {
      title: (filters, sortOrder) => {
        return (
          <span onClick={() => this.sortData('LabResultsComments')}>
            {this.props.columnsName.LabResultsComments}
            {this.getIcon('LabResultsComments')}
          </span>
        );
      },
      dataIndex: 'labResultsComments',
      key: 'labResultsComments',
      inputType: 'text',
      editable: true,
      width: 140,
      render: (text, record) => {
        return (<span className="editable-cell-value-wrap">{text}</span>);
      }
    },
    {
      title: '',
      dataIndex: 'Operations',
      key: 'Operations',
      render: (text, record) => {
        const editable = this.isEditing(record);

        return editable ? (
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
                    this.save(form, record.dateTime);
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
        ) : null;
      }
    }
  ];

  isEditing = record => record.id !== DEFAULT_GUID && record.dateTime === this.state.editingKey;

  cancel = () => {
    this.setState(item => ({ ...item, editingKey: null }));
  };
  getState = () => {
    return this.state;
  }
  save = (form, key) => {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const {
        updateEntry,
        createNewEntry,
        metricData
      } = this.props;

      this.props.updating(true);
      const existedEntryData = metricData.find(x => x.dateTime === this.getState().editingKey);

      if (!existedEntryData || !existedEntryData.id || existedEntryData.id === DEFAULT_GUID) {
        createNewEntry({
          date: `${moment(existedEntryData.dateTime).utc().format()}`,
          MetricId: TIMELINE_METRIC_ID,
          DoctorVisits: row.doctorVisits,
          DoctorVisitComments: row.doctorVisitComments ? row.doctorVisitComments : '',
          LabResultsComments: row.labResultsComments ? row.labResultsComments : '',
          LabResults: row.labResults
        }).then(() => { this.setState({ loading: false, editingKey: '' }, () => this.props.updating(false)); });
      }
      else {
        updateEntry(
          existedEntryData.id,
          {
            ...existedEntryData,
            id: existedEntryData.id,
            Date: `${moment(existedEntryData.dateTime).utc().format()}`,
            MetricId: TIMELINE_METRIC_ID,
            DoctorVisits: row.doctorVisits,
            DoctorVisitComments: row.doctorVisitComments ? row.doctorVisitComments : '',
            LabResultsComments: row.labResultsComments ? row.labResultsComments : '',
            LabResults: row.labResults
          }).then(() => { this.setState({ loading: false, editingKey: '' }, () => this.props.updating(false)); });
      }
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
    const { metricData } = this.props;
    const sortedData = this.sortMetricData(metricData);
    const components = {
      body: {
        cell: EditableCell
      }
    };
    const columns = this.columns().map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'doctorVisitComments' || col.dataIndex === 'labResultsComments' ? 'text' : 'number',
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
                  this.edit(record.dateTime);
                }
              };
            }}
            rowKey={record => record.dateTime}
            {...this.state}
            columns={columns}
            dataSource={sortedData}
            components={components}
            pagination={{
              pageSize: 5,
              onChange: this.cancel
            }}
            elip
            scroll={{ y: 180 }}
          />
        </EditableContext.Provider>
      </div>
    </div>
    );
  }
}

export default Form.create()(MetricsChartTimeLineTable);
