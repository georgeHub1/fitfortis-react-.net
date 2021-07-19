import React, { Component } from 'react';
import { Form, Select, Row, Col } from 'antd';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import CustomCard from '../Common/CustomCard.js';
import CustomHeaderTooltip from '../Common/CustomHeaderTooltip';
import styles from './styles.module.less';
import * as R from 'ramda';
import moment from 'moment';
import { monthNames } from '../../constants/profile';
import analyticId from '../../utils/AnalyticsAndAbTests.tsx';

const { Option } = Select;

class ProfileBasicInformation extends Component {
  displayName = ProfileBasicInformation.name;
  static propTypes = {
    basicInformation: PropTypes.array,
    setTabValue: PropTypes.func
  };
  static defaultProps = {
    basicInformation: [],
    setTabValue: () => true
  };

  constructor (...args) {
    super(...args);

    this.state = {
      countDaysInMonth: this.daysInMonth(
        new Date().getMonth(),
        new Date().getFullYear()
      ),
      age: '',
      year: undefined,
      month: undefined,
      day: undefined,
      account: this.props.account,
      profileLifeStyle: this.props.profileLifeStyle,
      profileBasicInformation: this.props.profileBasicInformation,
      profileLifeStyleSelected: {},
      profileBasicInformationSelected: {}
    };
  }

  componentDidUpdate  ({profileBasicInformation, profileLifeStyle, account}) {
    const { profileBasicInformation: profileBasicInformationProps, profileLifeStyle: profileLifeStyleProps, account: accountProps } = this.props;

    if (!R.equals(account, accountProps)) {
      this.setState({
        account: {...accountProps}
      });
      this.calculateAge();
    }

    if (!R.equals(profileBasicInformation, profileBasicInformationProps)) {
      this.setState({
        profileBasicInformation: [...profileBasicInformationProps]
      }, () => {
        this.updateData();
      });
    }
    if (!R.equals(profileLifeStyle, profileLifeStyleProps)) {
      this.setState({
        profileLifeStyle: [...profileLifeStyleProps]
      }, () => {
        this.updateData();
      });
    }
  }

  componentDidMount () {
    this.updateData();
    analyticId.firebaseAnalyticsLog('Profile_BasicInformation');
  }

  updateData () {
    const { account } = this.props;
    const dateOfBirth = account !== undefined ? account.dateOfBirth : undefined;

    if (dateOfBirth !== undefined) {
      const date = new Date(dateOfBirth);

      this.setState({
        year: date.getUTCFullYear(),
        month: moment().locale('en').month(date.getUTCMonth()).format('MMMM'),
        day: date.getUTCDate()
      });
      this.getSectionSelected('prof');
    }
    this.getSectionSelected('profileBasicInformation');
    this.getSectionSelected('profileLifeStyle');
    this.calculateAge();
  }

  daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  getYears = () => {
    const year = [];
    const minYear = 1940;
    const maxYear = new Date().getFullYear();

    for (let i = 0; i <= maxYear - minYear; i++) {
      year[i] = i + minYear;
    }
    return year.reverse();
  };

  handleSelectYearMonth = (value, key) => {
    const { account, setTabValue } = this.props;
    const { dateOfBirth } = account;
    const preMonth = dateOfBirth !== undefined ? new Date(dateOfBirth).getMonth() : undefined;
    const monthValue
      = key === 'month' ? moment().locale('en').month(value).format('MM') : preMonth;

    const preYear = dateOfBirth !== undefined ? new Date(dateOfBirth).getFullYear() : undefined;
    const yearValue
      = key === 'year' ? value : preYear;

    const noValueYear = yearValue ? yearValue : new Date().getFullYear();
    const noValueMonth = monthValue
      ? monthValue
      : monthNames[new Date().getMonth()];

    const index = monthNames.findIndex(i => i === noValueMonth);
    const countDaysInMonth = this.daysInMonth(index, noValueYear);


    const days = countDaysInMonth
      ? countDaysInMonth
      : this.daysInMonth(noValueMonth, noValueYear);

  this.setState({ [key]: value, countDaysInMonth: days });

  setTimeout(() => {
    const {year, month, day} = this.state;

    if (year !== undefined && month !== undefined && day !== undefined) {
      const newDateOfBirth = `${year}-${moment().locale('en').month(month).format('MM')}-${day}`;

      setTabValue({
        account: {
          ...account,
          dateOfBirth: newDateOfBirth

        }
      });
      }
    }, 500);
  };


  getSectionSelected = section => {
    let sectionSelected = {};
    const sectionInStateSelected = `${section}Selected`;
    const pattern = elm => elm.isSelected === true;
    const sectionInState = this.state[section] || [];

    sectionInState.forEach((item, index) => {
      const defaultItem = section === 'profileLifeStyle' ? [item.values[0]] : [{name:undefined}];
      const selectedElem = R.filter(pattern)(item.values).length !== 0
        ? R.filter(pattern)(item.values)
        : defaultItem;

        sectionSelected = R.assoc(item.key, selectedElem[0].id)(sectionSelected);
    });

    this.setState({
      [sectionInStateSelected]: {...sectionSelected}
    });
  }

  handleProfileSelect = (section, key, value) => {
    const { setTabValue } = this.props;
    const sectionInState = `${section}Selected`;
    const data = R.clone(this.state[section]);
    const newStatesectionSelected = R.assoc(key, value)(this.state[sectionInState]);
    const updateElem = elem => {
      return elem.id === value
        ?  R.assoc('isSelected', true)(elem)
        : R.assoc('isSelected', false)(elem);
    };
    const sectionChanges = data.map((item, index) => {
      return item.key === key
        ? {
          ...item,
          values: R.map(updateElem)(item.values)
        }
        : item;
    });

    this.setState({
      [sectionInState]: {...newStatesectionSelected},
      [section]: [...sectionChanges]
    });

     setTabValue({
      [section]: [...sectionChanges]
    });
  };


  calculateAge = () => {
    const {
      intl: { formatMessage },
      account
    } = this.props;

    const dateOfBirth = account !== undefined ? account.dateOfBirth : undefined;

    /* TODO: needs refactoring*/
    if (dateOfBirth !== undefined) {
      const DOB = new Date(dateOfBirth);
      const today = new Date();
      const age = today.getTime() - DOB.getTime();
      const elapsed = new Date(age);
      const year = elapsed.getYear() - 70;
      const month = elapsed.getMonth();

      let ageTotal = '';

      if (today <= DOB) {
        ageTotal = formatMessage({ id: 'ProfileBasicInformation.ageDateError' });
      } else {
        if (year > 0) {
          ageTotal += `${year} ${(year > 1) ? `${formatMessage({ id: 'ProfileBasicInformation.ageYears' })} ` : `${formatMessage({ id: 'ProfileBasicInformation.ageYear' })} ` }`;
        }
        if (month > 0) {
          ageTotal += `${month} ${(month > 1) ? `${formatMessage({ id: 'ProfileBasicInformation.ageMonths' })}` : `${formatMessage({ id: 'ProfileBasicInformation.ageMonth' })}` }`;
        }

        if (year === 0 && month === 0) {
          ageTotal += `${formatMessage({ id: 'ProfileBasicInformation.ageLessThanMonth' })}`;
        }
      }
      this.setState({
        age: ageTotal
      });
    }
  }


  render () {
    const {
      intl: { formatMessage }
    } = this.props;
    const { countDaysInMonth } = this.state;
    const daysInMonth = Array.from(
      { length: countDaysInMonth },
      (e, i) => i + 1
    );
    const years = this.getYears();
    const { profileLifeStyleSelected, profileBasicInformationSelected } =  this.state;
    const profileBasicInformation = this.state.profileBasicInformation || [];
    const profileLifeStyle = this.state.profileLifeStyle || [];
    const {day, month, year} = this.state;

    return (
      <Form
        id='profileBasicInformationForm'
        hideRequiredMark={true}
        onSubmit={this.handleSave}
        className="mainProfileBasicInformation"
      >
        <CustomCard>
          <div className="cardHeaderProfile">
            {formatMessage({
              id: 'ProfileBasicInformation.basicInfoLabel'
            })}
          </div>
          <Row gutter={32}>
              <Col xs={24} lg ={12}>
              <div className={styles.BirthDateWrapper}>
                <div className={styles.cardLabelProfile}>
                <Form.Item
                     label={formatMessage({
                      id: 'ProfileBasicInformation.birthDateLabel'
                    })}
                     className={styles.customLabel}
                  >
                </Form.Item>
                </div>
                <div className={styles.BirthDateSelects}>
                  <Row gutter={16}>
                  <Col xs={{ span: 10 }} sm={{ span: 12 }} className="monthInput">
                    <Form.Item >
                    <Select
                      getPopupContainer={trigger => trigger.parentNode}
                      className={styles.profileSelect}
                      placeholder={formatMessage({
                        id: 'ProfileBasicInformation.ageMonth'
                      })}
                      value={month}
                      onChange={value => {
                        this.handleSelectYearMonth(value, 'month');
                        setTimeout(() => {
                          this.calculateAge();
                        }, 500);
                      }}
                    >
                      {monthNames.map((month, key) => (
                        <Option key={month} value={month}>
                          {formatMessage({ id: `ProfileBasicInformation.${month}` })}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  </Col>
                  <Col xs={{ span: 6 }} sm={{ span: 5 }} className="ageDayInput">
                  <Form.Item>
                    <Select
                      getPopupContainer={trigger => trigger.parentNode}
                      className={styles.profileSelect}
                      value={day}
                      placeholder={formatMessage({
                        id: 'ProfileBasicInformation.ageDay'
                      })}
                      onChange={value => {
                        this.handleSelectYearMonth(value, 'day');
                        setTimeout(() => {
                          this.calculateAge();
                        }, 500);
                      }}
                    >
                      {daysInMonth.map(day => (
                        <Option key={day} value={day < 10 ? `0${day}` : day }>
                          {day}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  </Col>
                  <Col xs={{ span: 8 }} sm={{ span: 7 }} className="YearInput">
                  <Form.Item>
                    <Select
                      value={year}
                      getPopupContainer={trigger => trigger.parentNode}
                      className={styles.profileSelect}
                      placeholder={formatMessage({
                        id: 'ProfileBasicInformation.ageYear'
                      })}
                      onChange={value => {
                        this.handleSelectYearMonth(value, 'year');
                        setTimeout(() => {
                          this.calculateAge();
                        }, 500);
                      }}
                    >
                      {years.map(year => (
                        <Option key={year} value={year}>
                          {year}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  </Col>
                  </Row>
                </div>
              </div>
            </Col>
            <Col xs={24} lg ={12} className={styles.ageLabel}>
              <div className={styles.cardLabelProfile}>
                <Form.Item
                     label= {formatMessage({
                      id: 'ProfileBasicInformation.ageLabel'
                    })}
                     className={styles.customLabel}
                  >
                </Form.Item>
              </div>
              <div className={styles.cardAge}>
                {this.state.age}
              </div>
            </Col>
          </Row>

          <Row gutter={32} className="BasicInfoSecRow">
          {
                profileBasicInformation.map((groupbasicInformation, index) => {
                  let placeholder = '';

                  switch (groupbasicInformation.name) {
                    case 'Sex at birth':
                      placeholder = formatMessage({
                        id: 'ProfileBasicInformation.sexAtBirthPlaceholder'
                      });
                    break;
                    case 'Gender identity':
                      placeholder = formatMessage({
                        id: 'ProfileBasicInformation.genderIdentityPlaceholder'
                      });
                    break;
                    case 'Ethnic origin':
                      placeholder = formatMessage({
                        id: 'ProfileBasicInformation.ethnicPlaceholder'
                      });
                    break;
                    default:
                     placeholder = '';
                    break;
                  }

                  return (
                    <Col sm = {24} md={12} key={index}>
                      <Form.Item
                        label={
                        <CustomHeaderTooltip
                          header={groupbasicInformation.name}
                          description={groupbasicInformation.description}
                          encyclopediaId={groupbasicInformation.encyclopediaId}
                        /> }
                      >
                      <Select
                        getPopupContainer={ trigger => trigger.parentNode }
                        className={ styles.profileSelect }
                        placeholder={placeholder}
                        style={{ width: '100%' }}
                        value={ profileBasicInformationSelected[groupbasicInformation.key] }
                        onChange={value => {
                          this.handleProfileSelect('profileBasicInformation', groupbasicInformation.key, value);
                        }}
                      >
                        {
                          groupbasicInformation.values.map((item, index) => {
                            return (
                              <Option value={ item.id} key={ index }>
                                { item.name }
                              </Option>
                            );
                          })
                        }
                      </Select>
                      </Form.Item>
                    </Col>
                  );
                })
              }

            </Row>
        </CustomCard>
        <CustomCard>
            <div className="cardHeaderProfile">
            {formatMessage({
                      id: 'ProfileBasicInformation.lifestyleLabel'
            })}
            </div>
            <div className={ styles.wrapLifestype}>
            <Row gutter={32}>
              {
                profileLifeStyle.map((groupLifeStyle, index) => {
                  return (
                    <Col sm = {24} md={12} key={index}>
                      <Form.Item
                        label={
                          <CustomHeaderTooltip
                            header={groupLifeStyle.name}
                            description={groupLifeStyle.description}
                            encyclopediaId={groupLifeStyle.encyclopediaId}
                          />
                        }
                      >
                      <Select
                        getPopupContainer={ trigger => trigger.parentNode }
                        className={ styles.profileSelect }
                        style={{ width: '100%' }}
                        value={ profileLifeStyleSelected[groupLifeStyle.key] }
                        onChange={value => {
                          this.handleProfileSelect('profileLifeStyle', groupLifeStyle.key, value);
                        }}
                      >
                        {
                          groupLifeStyle.values.map((item, index) => {
                            return (
                              <Option value={ item.id } key={ index }>
                                { item.name }
                              </Option>
                            );
                          })
                        }
                      </Select>
                      </Form.Item>
                    </Col>
                  );
                })
              }

            </Row>
            </div>
        </CustomCard>
      </Form>
    );
  }
}
const WrappedProfileBasicInformation = Form.create({
  name: 'profileBasicInformation'
})(ProfileBasicInformation);


export default injectIntl(WrappedProfileBasicInformation);
