import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AutoComplete, Input, Icon, Tag, Select, Drawer, Row, Col } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import CustomCard from '../Common/CustomCard.js';
import styles from './styles.module.less';
import SymptomCheckerSearchResults from './SymptomCheckerSearchResults';
import SymptomCheckerSideBar from './SymptomCheckerSideBar';
import * as R from 'ramda';
import  moment from 'moment';
import _ from 'lodash';
import { ReactComponent as AvatarMale } from '../../img/avatar_Male.svg';
import { ReactComponent as MaleChild } from '../../img/avatar_MaleChild.svg';
import { ReactComponent as MaleToddler } from '../../img/avatar_MaleToddler.svg';
import { ReactComponent as MaleBaby } from '../../img/avatar_MaleBaby.svg';

import { ReactComponent as AvatarFemale } from '../../img/avatar_Female.svg';
import { ReactComponent as FemaleChild } from '../../img/avatar_FemaleChild.svg';
import { ReactComponent as FemaleToddler } from '../../img/avatar_FemaleToddler.svg';
import { ReactComponent as FemaleBaby } from '../../img/avatar_FemaleBaby.svg';

import { ReactComponent as AvatarIntersex } from '../../img/avatar_Intersex.svg';
import { ReactComponent as IntersexChild } from '../../img/avatar_IntersexChild.svg';
import { ReactComponent as IntersexToddler } from '../../img/avatar_IntersexToddler.svg';
import { ReactComponent as IntersexBaby } from '../../img/avatar_IntersexBaby.svg';

import { removeSelectedItem } from './utils';
import { twoMonths } from '../../constants/symptomChecker';
import { monthNames } from '../../constants/profile';

import { handleFetchSymptomDetails, setUserInfo } from '../../redux/symptomChecker.action';
const Option = AutoComplete.Option;

class SymptomCheckerSearch extends Component {
  displayName = SymptomCheckerSearch.name;
  isSelected = false;
  static propTypes = {
    symptomsStore: PropTypes.array,
    userInfoStore: PropTypes.object,
    diagnoses: PropTypes.object,
    causesAndDiagnosis: PropTypes.array,
    searchList: PropTypes.array,
    genderIdentity: PropTypes.string,
    year: PropTypes.number,
    month: PropTypes.string,
    day: PropTypes.number
  };
  static defaultProps = {
    symptomsStore: [],
    userInfoStore: {
      isFemale: true,
      isPregnant: false,
      gender: '',
      keyYear: {
        value: '',
        name: '',
        ageRange: []
      }
    },
    causesAndDiagnosis: [],
    searchList: [],
    diagnoses: {},
    genderIdentity: '',
    year: 0,
    month: '',
    day: 0
  };

  constructor (props, context) {
    super(props, context);
    const { formatMessage } = props.intl;

    this.state = {
      showResults: false,
      valueAutoCmplt: '',
      tags: this.props.symptomsStore,
      searchList: [],
      userInfoStore: this.props.userInfoStore,
      isFemale: this.props.userInfoStore.isFemale,
      gender: this.props.userInfoStore.gender || '',
      isPregnant: this.props.userInfoStore.isPregnant,
      keyYear: this.props.userInfoStore.keyYear,
      causesAndDiagnosis: this.props.causesAndDiagnosis,
      open: false,
      selectedCause: {},
      uniqSymptoms: this.props.searchList,
      allDiagnoses: this.props.causesAndDiagnosis,
      avatar: this.props.avatar,
      years: [
        { value: '0_2m', name: formatMessage({ id: 'SymptomCheckerSearch.newborn' }), ageRange: [0, twoMonths] },
        { value: '2m_1', name: formatMessage({ id: 'SymptomCheckerSearch.infant' }), ageRange: [twoMonths, 1] },
        { value: '1_4', name: formatMessage({ id: 'SymptomCheckerSearch.toddler' }), ageRange: [1, 4] },
        { value: '5_11', name: formatMessage({ id: 'SymptomCheckerSearch.child' }), ageRange: [5, 11] },
        { value: '12_19', name: formatMessage({ id: 'SymptomCheckerSearch.teen' }), ageRange: [12, 19] },
        { value: '20_29', name: formatMessage({ id: 'SymptomCheckerSearch.adult20' }), ageRange: [20, 29] },
        { value: '30_39', name: formatMessage({ id: 'SymptomCheckerSearch.adult30' }), ageRange: [30, 39] },
        { value: '40_49', name: formatMessage({ id: 'SymptomCheckerSearch.adult40' }), ageRange: [40, 49] },
        { value: '50_59', name: formatMessage({ id: 'SymptomCheckerSearch.adult50' }), ageRange: [50, 59] },
        { value: '60_plus', name: formatMessage({ id: 'SymptomCheckerSearch.adult60' }), ageRange: [60, 150] }
      ]
    };
  }
  static getDerivedStateFromProps (nextProps, prevState) {
    if (prevState.allDiagnoses !== nextProps.causesAndDiagnosis) {
      return {
        ...prevState,
        allDiagnoses: nextProps.causesAndDiagnosis
      };
    }
    if (prevState.keyYear !== nextProps.userInfoStore.keyYear) {
      return {
        ...prevState,
        keyYear: nextProps.userInfoStore.keyYear
      };
    }
    return null;
  }

  getKeyYearOfUser = () => {
    const { year, month, day } = this.props;
    const monthIndex = monthNames.findIndex(name => name === month);
    const { years } = this.state;

    const now = moment([new Date().getFullYear(), new Date().getMonth(), new Date().getUTCDate()]);
    const dateOfBirth = moment([year, monthIndex, day]);

    const diffMonths = now.diff(dateOfBirth, 'month');

    const monthInYear = +(diffMonths / 12).toFixed(2);

    return years.find(year => year.ageRange[0] <= monthInYear && monthInYear <= year.ageRange[1]);
  }
  componentDidMount () {
    setTimeout(() => {
      this.setState({
        causesAndDiagnosis: this.calculateDiagnoseBE(this.state.tags),
        keyYear: this.getKeyYearOfUser() || {}
      });
    }, 500);
  }
  handleChange = (e, action) => {
    const value = e.includes('/-/') ? e.split('/-/')[0] : e;

    const list = value !== '' ? this.props.searchList : [];

    const result = this.props.searchList.filter(item => {
      return item.name.toLowerCase().includes(value !== undefined ? value.toLowerCase() : '');
    });

    if (result.length === 0 && this.props.searchList.length !== 0 && value !== undefined && !action) {
      this.props.addNewSearch(value, '', false);
    }

    if (action) {
      this.props.addNewSearch(value, result[0].id, true);
      return this.handleSelect(value);
    }
    if (!this.isSelected)
      return this.setState({ valueAutoCmplt: value, searchList: list });
  };
  handleSelect = e => {
    const { updateListOnSelect, onAddNewSymptom } = this.props;

    this.isSelected = true;

    const oldTag = [...this.state.tags];
    const newTag = [...this.state.searchList].filter(i => i.name === e);

    // eslint-disable-next-line no-nested-ternary
    const index = oldTag.findIndex(x => x.id === newTag.length ? newTag[0].id :  '' && x.name === newTag.length ? newTag[0].name : '');

    let tags = [...oldTag, ...newTag];

    if (index > -1) {
      tags = [...oldTag];
    } else {
      tags = [...oldTag, ...newTag];
    }
    onAddNewSymptom(newTag);
    const causesAndDiagnosis = this.calculateDiagnoseBE(tags);

    updateListOnSelect(e);
    this.setState(
      {
        valueAutoCmplt: '',
        tags,
        searchList: [],
        causesAndDiagnosis
      },
      () => (this.isSelected = false)
    );
  };

  handleClose = removedTag => {
    const { updateListOnRemove, onDeleteSymptom } = this.props;

    onDeleteSymptom(removedTag);
    const tags = this.state.tags.filter(tag => tag.name !== removedTag.name);
    const causesAndDiagnosis = this.calculateDiagnoseBE(tags);

    updateListOnRemove(removedTag);
    this.setState({ tags, causesAndDiagnosis });
  };

  checkGenderFilter = (gender, possbile) => {
    if (gender === 'intersex') {
      if (possbile.applicableToMale || possbile.applicableToFemale) {
        return true;
      }
      return false;
    } else if (gender === 'female') {
      if (possbile.applicableToFemale) {
        return true;
      }
      return false;
    } else if (gender === 'male') {
      if (possbile.applicableToMale) {
        return true;
      }
      return false;
    }
    return true;
  }

  checkAgeRange = (value, possbile) => {
    return (value[0] >= possbile.minAgeOfApplicability && value[1] <= possbile.maxAgeOfApplicability);
  }

  checkIsPregnant = (gender, value, possbile) => {
    if (value) {
      if ((gender === 'intersex' || gender === 'female') && possbile.applicableToFemalePregnant) {
        return true;
      }
      return false;
    }
    return false;
  }

  isFilterApply = (filter, item) => {
    if (
      this.checkGenderFilter(filter.gender, item) && this.checkAgeRange(filter.keyYear.ageRange || [item.minAgeOfApplicability, item.maxAgeOfApplicability], item)
    ) {
      if (this.checkAgeRange(filter.keyYear.ageRange || [item.minAgeOfApplicability, item.maxAgeOfApplicability], item)) {
        if ((filter.gender === 'female' || filter.gender === 'intersex') && filter.isPregnant) {
          if (this.checkIsPregnant(filter.gender, filter.isPregnant, item)) {
            return item;
          }
          return null;
        }
        return item;
      }
      return null;
    }
    return null;
  }

  applyFilter = (filter, data) => {
    return data.filter(item => {
      if (
        this.checkGenderFilter(filter.gender, item) && this.checkAgeRange(filter.keyYear.ageRange, item)
      ) {
        if ((filter.gender === 'female' || filter.gender === 'intersex') && filter.isPregnant) {
          if (this.checkIsPregnant(filter.gender, filter.isPregnant, item)) {
            return item;
          }
          return null;
        }
        return item;
      }
      return null;
    });
  }

  uniqSymptoms = symptoms => {
    const unExpsymptoms = [...symptoms];
    const sortByName = (a, b) => {
      return a.name === b.name;
    };

    return R.uniqWith(sortByName, unExpsymptoms);
  };

  calculateDiagnoseBE = tags => {
    const { allDiagnoses } = this.state;
    const { diagnoses, allSymptoms } = this.props;
    const { isFemale, isPregnant, keyYear, gender } = this.props.userInfo;

    let calculatedSymptoms = [];

    // OLD
    Object.keys(diagnoses).map(key => {
      const find = allDiagnoses.find(x => x.title === key);

      if (this.isFilterApply({isFemale, isPregnant, keyYear, gender}, find)) {
        calculatedSymptoms = [
          ...calculatedSymptoms,
          {
            category: key
          }
        ];
      }
      return key;
    });

    return calculatedSymptoms.map(symptom => {
      [...allDiagnoses].forEach(diagnose => {
        if (symptom.category === diagnose.title) {
          symptom.shortDescription = diagnose.shortDescription;
          symptom.name = diagnose.title;
          symptom.id = diagnose.id;
        }
      });

      const matchedSymptoms = [...allSymptoms]
        .filter(item => symptom.category === item.category)
        .filter(el => [...tags].find(tag => el.name === tag.name));

      const temp = [...tags].filter(
        el => ![...matchedSymptoms].find(item => el.name === item.name)
      );

      const unExpected = this.uniqSymptoms(
        [...allSymptoms]
          .filter(item => symptom.category !== item.category)
          .filter(
            el => ![...matchedSymptoms].find(item => el.name === item.name)
          )
          .filter(el => [...temp].find(item => el.name === item.name))
      );

      const misMatch = [...allSymptoms]
        .filter(item => symptom.category === item.category)
        .filter(el => !tags.find(item => el.name === item.name));

      const total
        = matchedSymptoms.length + unExpected.length + misMatch.length;

      const InitialConfidence = (matchedSymptoms.length / total) * 100;
      const DiminishingMultiplier = (1 - unExpected.length / total) * 100;
      const FinalConfidence = (
        (InitialConfidence * DiminishingMultiplier) / 100
      ).toFixed(0);

      return {
        ...symptom,
        percent: FinalConfidence,
        symptoms: [
          {
            matchedSymptoms,
            unExpected,
            misMatch
          }
        ]
      };
    });
  };

  handleChangeSex = sex => {
    const { isPregnant: pregnant, keyYear } = this.props.userInfo;
    const isFemale = sex === 'female' || sex === 'intersex';
    const isPregnant = !isFemale ? false : pregnant;

    this.onSetUserInfo(isFemale, isPregnant, keyYear, sex);
  };
  handleChangeFemaleState = e => {
    const { isFemale, isPregnant: pregnant, keyYear, gender } = this.props.userInfo;
    const isPregnant = !pregnant;

    this.onSetUserInfo(isFemale, isPregnant, keyYear, gender);
  };
  handleChangeYears = e => {
    const { isFemale, isPregnant, gender } = this.props.userInfo;
    const { years } = this.state;
    const keyYear = years.find(i => e === i.value);

    this.onSetUserInfo(isFemale, isPregnant, keyYear, gender);
  };
  onSetUserInfo = (isFemale, isPregnant, keyYear, gender) => {
    this.props.setUserInfo({
      isFemale,
      isPregnant,
      keyYear,
      gender
    });

    setTimeout(() => {
      this.setState({
        causesAndDiagnosis: this.calculateDiagnoseBE(this.state.tags)
      });
    }, 300);
  };
  handleCloseModal = (e, item) => {
    const selectedCause = item ? item : {};

    if (!this.state.open) {
      this.props.onFetchSymptomDetails(item.id);
    }

    this.setState({ open: !this.state.open, selectedCause });
  };
  getBgColor = percent => {
    let shade = 17;

    for (let i = 10; i > 0; i--) {
      shade += 5;
      const num = Math.ceil(percent / 10);

      if (i === num) break;
    }

    return `hsl(205, 100%, ${shade}%)`;
  };

  getSVG = type => {
    const { gender } = this.props.userInfo;

    if (type === 'BABY') {
      if (gender === 'male') {
        return MaleBaby;
      } else if (gender === 'intersex') {
        return IntersexBaby;
      }
      return FemaleBaby;
    } else if (type === 'Toddler') {
      if (gender === 'male') {
        return MaleToddler;
      } else if (gender === 'intersex') {
        return IntersexToddler;
      }
      return FemaleToddler;
    } else if (type === 'Child') {
      if (gender === 'male') {
        return MaleChild;
      } else if (gender === 'intersex') {
        return IntersexChild;
      }
      return FemaleChild;
    }
    if (gender === 'male') {
      return AvatarMale;
    } else if (gender === 'intersex') {
      return AvatarIntersex;
    }
    return AvatarFemale;
  }

  getAvatar = isFemale => {
    const { keyYear } = this.props.userInfo;

    if (keyYear.value === '0_2m' || keyYear.value === '2m_1') {
      return this.getSVG('BABY');
    }
    if (keyYear.value === '1_4') {
      return this.getSVG('Toddler');
    }
    if (keyYear.value === '5_11' || keyYear.value === '12_19') {
      return this.getSVG('Child');
    }
    return this.getSVG('Avatar');
  };

  getHighlightedText = (higlight, text) => {
    const parts = text.split(new RegExp(`(${higlight})`, 'gi'));

    return (
      <span key={text}>
        {parts.map((part, i) => {
          if (higlight) {
            return (
              <span
                key={i}
                style={
                  part.toLowerCase().indexOf(higlight.toLowerCase()) !== -1
                    ? { fontWeight: 'bold', backgroundColor: '#FCABF9' }
                    : {}
                }
              >
                {part}
              </span>
            );
          }
          return (
            <span
              key={i}
            >
              {part}
            </span>
          );
        })}
      </span>
    );
  };

  render () {
    const {
      intl: { formatMessage },
      allSymptoms,
      uniqSymptoms,
      isSymptomDetailsLoaded,
      genderIdentity,
      avatar
    } = this.props;
    const {
      valueAutoCmplt,
      tags,
      searchList,
      causesAndDiagnosis,
      open,
      selectedCause,
      years
    } = this.state;
    const {
      isFemale,
      isPregnant,
      keyYear,
      gender
    } = this.props.userInfo;

    let sortOrder = _.orderBy(searchList, ['name'], ['asc']);

    sortOrder = removeSelectedItem(sortOrder, tags);

    const children = sortOrder.map((item, i) => (
      <Option key={`${item.name}/-/${item.category}/-/${item}`}>
        {this.getHighlightedText(valueAutoCmplt, item.name)}
      </Option>
    ));
    const TitleDrawer = () => (
      <div className={`${styles.headerDrawer}`}>
        <div
          className={`${styles.percentBlock} ${styles.percentBlockDrawer}`}
          style={{ background: this.getBgColor(selectedCause.percent) }}
        >
          {selectedCause.percent}%
        </div>
        <div className={`${styles.header} ${styles.headerCause}`}>
          {selectedCause.name}
        </div>
      </div>
    );

    return (
      <section className={styles.containerEncyclopedia}>
        <h1 className={styles.header}>
          <FormattedMessage id="SymptomCheckerSearch.header" />
        </h1>
        <div className={styles.searchInputBlock}>
          <AutoComplete
            className={styles.searchInput}
            dataSource={children}
            value={valueAutoCmplt}
            dropdownClassName="autocompleteSymptomChecker"
            onChange={e => this.handleChange(e, false)}
            onSelect={e => this.handleChange(e, true)}
            onFocus={this.props.fetchItems}
            filterOption={(inputValue, option) => {
              return (
                option.props.children.key
                  .toUpperCase()
                  .indexOf(inputValue.toUpperCase()) !== -1

              );
            }}
          >
            <Input
              className={styles.searchInput}
              placeholder={formatMessage({
                id: 'SymptomCheckerSearch.searchInputPlaceholder'
              })}
              prefix={
                <Icon type="search" className={styles.certainCategoryIcon} />
              }
            />
          </AutoComplete>
        </div>
        <div className={styles.wrapCustomCard}>
          <CustomCard>
            <div className={`${styles.symptomInfoBlock} symptomInfoBlock`}>
              <Row>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <div className={styles.tags}>
                    <div className={styles.cardHeaderBlock}>
                      <div className={styles.cardHeader}>
                        <FormattedMessage id="SymptomCheckerSearch.symptoms" />
                      </div>
                    </div>
                    {tags.length > 0 ? (
                      tags.map((tag, index) => {
                        const tagElem = (
                          <Tag
                            color="transparent"
                            className={styles.tag}
                            closable={true}
                            key={`${tag.name}-${tag.category}-${index}`}
                            onClose={() => this.handleClose(tag)}
                          >
                            {tag.name}
                          </Tag>
                        );

                        return tagElem;
                      })
                    ) : (
                      <p className={styles.paragraphInfo}>
                        <FormattedMessage id="SymptomCheckerSearch.symptomsInfo" />
                      </p>
                    )}
                  </div>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <div className={styles.infoUser}>
                    <div className={styles.symptomMobileUserIcon}>
                      <div className={`${styles.avatar}`}>
                        {(avatar && gender === genderIdentity) ? (
                          <img src={avatar} className={styles.imgAvatar} alt="avatar" />
                        ) : (
                          <Icon component={this.getAvatar(isFemale)} />
                        )}
                      </div>
                    </div>
                    <div className={styles.symptomMobileSelection}>
                      <div className={styles.selectBlock}>
                        <div className={styles.selectBlock1}>
                          <Select
                            className={styles.customSelect}
                            dropdownClassName="infoUserSelect"
                            value={keyYear.value}
                            onChange={this.handleChangeYears}
                          >
                            {years.map(item => (
                              <Option key={item.name} value={item.value}>
                                {item.name}
                              </Option>
                            ))}
                          </Select>
                        </div>
                        <div className={styles.selectBlock2}>
                          <span className={styles.selectWrap}>
                            <Select
                              className={styles.customSelect}
                              dropdownClassName="infoUserSelect"
                              defaultValue={gender}
                              value={gender}
                              onChange={this.handleChangeSex}
                            >
                              <Option value="male">
                                <FormattedMessage id="SymptomCheckerSearch.male" />
                              </Option>
                              <Option value="female">
                                <FormattedMessage id="SymptomCheckerSearch.female" />
                              </Option>
                              <Option value="intersex">
                                <FormattedMessage id="SymptomCheckerSearch.intersex" />
                              </Option>
                            </Select>
                          </span>
                          {isFemale && (
                            <Select
                              className={`${styles.customSelect} ${styles.femaleSelected}`}
                              dropdownClassName="infoUserSelect"
                              defaultValue={
                                isPregnant ? 'pregnant' : 'not-pregnant'
                              }
                              onChange={this.handleChangeFemaleState}
                            >
                              <Option value="not-pregnant">
                                <FormattedMessage id="SymptomCheckerSearch.notPregnant" />
                              </Option>
                              <Option value="pregnant">
                                <FormattedMessage id="SymptomCheckerSearch.pregnant" />
                              </Option>
                            </Select>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </CustomCard>
        </div>
        <SymptomCheckerSearchResults
          tags={tags}
          getBgColor={this.getBgColor}
          causesAndDiagnosis={causesAndDiagnosis}
          handleCloseModal={this.handleCloseModal}
        />
        <Drawer
          className="drawerComponentSymptomChecker"
          title={<TitleDrawer />}
          placement="right"
          onClose={this.handleCloseModal}
          closable={false}
          visible={open}
          width={485}
        >
          <SymptomCheckerSideBar
            allSymptoms={allSymptoms}
            uniqSymptoms={uniqSymptoms}
            tags={tags}
            isFemale={isFemale}
            selectedCause={selectedCause}
            isPregnant={isPregnant}
            keyYear={keyYear}
            handleCloseModal={this.handleCloseModal}
            loading={!isSymptomDetailsLoaded}
          />
        </Drawer>
      </section>
    );
  }
}

const mapStateToProps = ({
  symptomChecker
}) => {
  const { symptomDetails, isSymptomDetailsLoaded, userInfo } = symptomChecker;

  return { symptomDetails, isSymptomDetailsLoaded, userInfo };
};

const mapDispatchToProps = dispatch => ({
  onFetchSymptomDetails (...args) {
    return dispatch(handleFetchSymptomDetails(...args));
  },
  setUserInfo (...args) {
    return dispatch(setUserInfo(...args));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(SymptomCheckerSearch));
