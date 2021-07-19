import React, { Component } from 'react';
import { Input, DatePicker } from 'antd';
import moment from 'moment';
const pattern = new RegExp(/^(-{0,1})(\d{1,})(\.\d{0,})*$/);

export const EditableContext = React.createContext();

class NumberInput extends Component {
  handleNumberChange = e => {
    const value = e.target.value;

    if ((value === '' || value !== '-' ? pattern.test(+value) : true)) {
      this.triggerChange(value);
    }
  };

  triggerChange = changedValue => {
    const { onChange } = this.props;

    if (onChange) {
      onChange(changedValue);
    }
  };

  render () {
    const { value } = this.props;

    return (
      <Input
        type="text"
        value={value}
        onChange={this.handleNumberChange}
      />
    );
  }
}
class InputText extends Component {
  handleNumberChange = e => {
    const value = e.target.value;

      this.triggerChange(value);
  };

  triggerChange = changedValue => {
    const { onChange } = this.props;

    if (onChange) {
      onChange(changedValue);
    }
  };

  render () {
    const { value } = this.props;

    return (
      <Input
        type="text"
        value={value}
        onChange={this.handleNumberChange}
      />
    );
  }
}

export class EditableCell extends Component {
  getInput = () => {
    if (this.props.inputType === 'date') {
      return <DatePicker
        showTime={{
          minuteStep: 5,
          use12Hours: true,
          format: 'HH:mm'
        }}
        size="medium"
        format="MM/DD/YYYY hh:mm a"
      />;
    }
    if (this.props.inputType === 'text') {
      return <InputText style={{ width: 140 }} />;
    }
    return <NumberInput style={{ width: 140 }} />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;

    if (!editing) {
      return (
        <td {...restProps} >
          {children}
        </td >
      );
    }

    const initialValue = this.props.inputType === 'date' ? moment(record[dataIndex]) : record[dataIndex];

    return (
      <td {...restProps} >
        {
          getFieldDecorator(dataIndex, {
            initialValue
          })(this.getInput())}
      </td>
    );
  };

  render () {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}
