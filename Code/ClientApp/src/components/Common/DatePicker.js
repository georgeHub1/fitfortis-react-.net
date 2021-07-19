import React, { Component } from 'react';
import {
  Icon,
  DatePicker
} from 'antd';
import moment from 'moment';

import DropDown from '../Common/Dropdown';

import styles from './styles.module.less';

const SET_FORMAT = 'MM-DD-YYYY';
const DAY_FORMAT = 'dddd, MMMM DD';
const HOURS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const MINUTES = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

class CustomDatePicker extends Component {
  constructor (...args) {
    super(...args);

    this.state = {
      datePickerOpen: false,
      ...this.time
    };
  }

  get time () {
    const currentTime = this.roundedTime();
    const hours = currentTime.getHours();
    const selectedHoursLabel = currentTime.getHours() >= 12 ? 'PM' : 'AM';
    const selectedHours = (hours + 24) % 12 ? `${(hours + 24) % 12}` : 12;

    return {
      selectedHours: selectedHours.length === 1 ? `0${selectedHours}` : selectedHours,
      selectedHoursLabel,
      selectedDay: moment().format(SET_FORMAT),
      selectedMinutes: currentTime.getMinutes()
    };
  }

  selectedDateToTimeStamp = (day = this.state.selectedDay, hours = this.state.selectedHours, minutes = this.state.selectedMinutes, label = this.state.selectedHoursLabel) => {
    const updatedMin = +(minutes.toString().replace(/\D/g, ''));
    // eslint-disable-next-line
    const convertedHours = label === 'AM' ? (hours === 12 ? 0 : hours) : (hours === 12 ? 12 : +hours + 12);

    return new Date(new Date(new Date(day).getTime()).setHours(convertedHours)).setMinutes(updatedMin);
  }

  prevDay = () => {
    const selectedDay = moment(this.state.selectedDay, SET_FORMAT).subtract('days', 1);

    this.props.onDateChange(this.selectedDateToTimeStamp(selectedDay));

    this.setState({ selectedDay });
  }

  nextDay = () => {
    const selectedDay = moment(this.state.selectedDay, SET_FORMAT).add('days', 1);

    this.props.onDateChange(this.selectedDateToTimeStamp(selectedDay));

    this.setState({ selectedDay });
  }

  triggerDatePicker = () => {
    this.setState({ datePickerOpen: !this.state.datePickerOpen });
  }

  roundedTime = () => {
    const coeff = 1000 * 60 * 5;
    const date = new Date();  // or use any other date
    const roundedTime = new Date(Math.round(date.getTime() / coeff) * coeff);

    return roundedTime;
  }

  setSelectedHours = selectedHours => {
    this.props.onDateChange(this.selectedDateToTimeStamp(this.state.selectedDay, selectedHours));

    this.setState({ selectedHours });
  }

  setSelectedMinutes = selectedMinutes => {
    this.props.onDateChange(this.selectedDateToTimeStamp(this.state.selectedDay, this.state.selectedHours, selectedMinutes));

    this.setState({ selectedMinutes });
  }

  setSelectedHoursLabel = selectedHoursLabel => {
    this.props.onDateChange(this.selectedDateToTimeStamp(this.state.selectedDay, this.state.selectedHours, this.state.selectedMinutes, selectedHoursLabel));

    this.setState({ selectedHoursLabel });
  }


  render () {
    return (
      <div
        className={`MainDatePickerDateContainer ${styles.DatePickerContainer}`}
      >
        <div
          className={`InnerDatePickerDateContainer ${styles.DatePickerDateContainer}`}
        >
          <span
            onClick={this.prevDay}
            className={ styles.DatePickerChangeDaysBtn }
            style={{
              borderRadius: '14px 0 0 14px'
            }}

            >
              <Icon type="left" />
            </span>
          <div
            style={{
              display: 'flex',
              width: '206px',
              alignItems: 'center',
              justifyContent: 'space-between'
            }} >
            <Icon type="calendar"
            onClick={ this.triggerDatePicker}
              />
            <DatePicker
              style={ {
                width:0,
                visibility: 'hidden',
                display: 'inline-block'
              } }
              value={ moment(new Date(this.state.selectedDay)) }
              onOpenChange={ this.triggerDatePicker }
              onChange={ moment => {
                const selectedDay = moment.format(SET_FORMAT);

                this.props.onDateChange(this.selectedDateToTimeStamp(selectedDay));

                this.setState({ selectedDay }); } }
              open={this.state.datePickerOpen} />
            <span
              className={ styles.DatePickerValue }
              onClick={ this.triggerDatePicker} >
              {moment(this.state.selectedDay, SET_FORMAT).format(DAY_FORMAT)}
            </span>
          </div>
          <span
            onClick={ this.nextDay }
            className={ styles.DatePickerChangeDaysBtn }
            style={{
              borderRadius: '0 14px 14px 0'
            }}
          >
            <Icon type="right" />
          </span>
        </div>

            <div className={styles.timeBlock}>
              <DropDown setSelectedItem={ this.setSelectedHours } selected={ this.state.selectedHours } items={ HOURS } />
              <span className="punctuation_mark">:</span>
              <DropDown setSelectedItem={ this.setSelectedMinutes } selected={ this.state.selectedMinutes } items={ MINUTES } />
              <DropDown className="AmPm" setSelectedItem={ this.setSelectedHoursLabel } selected={ this.state.selectedHoursLabel } items={ ['PM', 'AM'] } />
            </div>
      </div>
    );
  }
}

export default CustomDatePicker;
