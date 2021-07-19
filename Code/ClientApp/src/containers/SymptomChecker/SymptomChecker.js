import React, { Component } from 'react';
import { connect } from 'react-redux';
import SymptomCheckerSearch from '../../components/SymptomChecker/SymptomCheckerSearch';
import SymptomCheckerSymptomsAndConditions from '../../constants/SymptomCheckerSymptomsAndConditions.json';
import { injectIntl } from 'react-intl';
import * as R from 'ramda';
import uuid from 'uuid';
import {
  addNewSymptom,
  deleteSymptom,
  fetchSymptoms,
  resetSymptomList,
  saveSymptomCheckerSearchItem
} from '../../redux/symptomChecker.action';
import { localeSet } from '../../redux/locale.action';
import analyticId from '../../utils/AnalyticsAndAbTests.tsx';

class SymptomChecker extends Component {
  displayName = SymptomChecker.name;
  state = {
    mockSearch: [...this.uniqSymptoms],
    allSymptoms: [], // NEW
    symptomsList: [], // NEW
    symptomsSearch: [], // NEW
    currentInstance: this, // NEW,
    diagnoses: {}
  };

  constructor (props) {
    super(props);

    if (props.userRole.toLowerCase() === 'user') {
      props.history.push('/');
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.symptomsList !== prevState.symptomsList) {
      prevState.currentInstance.handleSymptomsToList(nextProps.symptomsList);
      return {
        ...prevState,
        symptomsList: nextProps.symptomsList
      };
    }
    return null;
  }

  get uniqSymptoms () {
    const symptoms = [...this.parseJSONSymptomsToList];
    const sortByName = (a, b) => {
      return a.name === b.name;
    };

    return R.uniqWith(sortByName, symptoms);
  }

  get parseJSONSymptomsToList () {
    const keys = Object.keys(SymptomCheckerSymptomsAndConditions);
    const symptoms = [];

    let counter = 0;

    for (const key of keys) {
      const symptom = SymptomCheckerSymptomsAndConditions[key];

      symptom.forEach((name, i) => {
        counter += 1;
        const item = {
          category: key,
          name,
          i,
          counter
        };

        symptoms.push(item);
      });
    }
    return symptoms;
  }

  // NEW FUNC
  getUniqSymptoms (symptoms) {
    const sortByName = (a, b) => {
      return a.name === b.name;
    };

    return R.uniqWith(sortByName, symptoms);
  }

  // NEW FUNC
  handleSymptomsToList = list => {
    const symptoms = [];

    let counter = 0;

    const diagnoses = {};


    for (const key in list) {
      const symptom = list[key].symptoms;

      diagnoses[list[key].title] = [];
      symptom.forEach((name, i) => {
        counter += 1;
        const item = {
          category: list[key].title,
          name,
          i,
          counter,
          id: list[key].id,
          applicableToMale: list[key].applicableToMale,
          applicableToFemale: list[key].applicableToFemale,
          applicableToFemalePregnant: list[key].applicableToFemalePregnant,
          minAgeOfApplicability: list[key].minAgeOfApplicability,
          maxAgeOfApplicability: list[key].maxAgeOfApplicability,
          uuid: uuid.v4()
        };

        diagnoses[list[key].title].push(name);
        symptoms.push(item);
      });
    }
    this.setState({
      ...this.state,
      allSymptoms: symptoms,
      diagnoses,
      symptomsSearch: this.getUniqSymptoms(symptoms)
    });
  }

  updateListOnSelect = e => {
    const newSearchList = [...this.state.mockSearch].filter(i => i.name !== e);

    this.setState({ mockSearch: newSearchList });
  };
  updateListOnRemove = removedTag => {
    const newSearchList = [...this.state.mockSearch];

    newSearchList.splice(removedTag.i, 0, removedTag);
    this.setState({
      mockSearch: newSearchList
    });
  };

  fetchItems = () => {
    if (!this.props.isLoaded) {
      const { intl: { locale } } = this.props;

      this.props.fetchSymptoms(locale);
    }
  }

  componentDidMount () {
    analyticId.firebaseAnalyticsLog('SymptomChecker');
    if (window.location.search.includes('?lang=')) {
      const lan = window.location.search.includes('?lang=') ? window.location.search.substring(6, 11) : (localStorage.getItem('language') || 'en');

      this.props.onUpdateLanguage(lan);
      localStorage.setItem('language', lan);
    }
    const { symptoms } = this.props;

    // NEW
    if (symptoms.length) {
      let symptomsSearch = [];

      symptoms.forEach(el => {
        symptomsSearch = [...this.state.symptomsSearch].filter(i => i.name !== el.name);
      });

      this.setState({ symptomsSearch });
    }
  }

  componentWillUnmount () {
    // this.props.resetSymptomList();
  }

  addNewSearch = (title, uniqueId, isSuccessful) => {
    const { id } = this.props.account;

    this.props.saveSymptomCheckerSearchItem(title, uniqueId, id, isSuccessful);
  };

  render () {
    const {
      symptoms,
      onAddNewSymptom,
      onDeleteSymptom,
      onSetUserInfo,
      month,
      day,
      year,
      avatar,
      sexAtBirth,
      userRole
    } = this.props;

    const { symptomsSearch, allSymptoms, diagnoses, symptomsList } = this.state; // NEW

    return (
      <div>
        {
          userRole.toLowerCase() !== 'user'
          && <SymptomCheckerSearch
            searchList={symptomsSearch} // NEW
            allSymptoms={allSymptoms}
            diagnoses={diagnoses} // NEW
            causesAndDiagnosis={symptomsList}
            updateListOnSelect={this.updateListOnSelect}
            updateListOnRemove={this.updateListOnRemove}
            onAddNewSymptom={onAddNewSymptom}
            onDeleteSymptom={onDeleteSymptom}
            onSetUserInfo={onSetUserInfo}
            symptomsStore={symptoms}
            userInfoStore={{}}
            month={month}
            day={day}
            genderIdentity={sexAtBirth !== null ? sexAtBirth.toLowerCase() : ''}
            year={year}
            avatar={avatar}
            fetchItems={this.fetchItems}
            addNewSearch={this.addNewSearch}
          />
        }
        <br />
        <br />
      </div>
    );
  }
}
const mapStateToProps = ({
  symptomChecker,
  profile: {
    basicInformation: { year, genderIdentity, month, day },
    avatar,
    profileBasicInformation,
    userRole,
    account
  }
}) => {
  const { symptoms, symptomsList, isLoading, isLoaded } = symptomChecker;

  let sexAtBirth = null;

  if (profileBasicInformation) {
    const sexAtBirthData = profileBasicInformation.find(x => x.key === 'Sexatbirth').values ? profileBasicInformation.find(x => x.key === 'Sexatbirth').values : [];
    const findIndex = sexAtBirthData.findIndex(y => y.isSelected === true);

    if (findIndex > -1) {
      sexAtBirth = sexAtBirthData[findIndex].name;
    }
  }

  return { symptoms, symptomsList, avatar, year, genderIdentity, month, day, isLoading, isLoaded, sexAtBirth, userRole, account };
};

const mapDispatchToProps = dispatch => ({
  onAddNewSymptom (...args) {
    return dispatch(addNewSymptom(...args));
  },
  onDeleteSymptom (...args) {
    return dispatch(deleteSymptom(...args));
  },
  fetchSymptoms (...args) {
    return dispatch(fetchSymptoms(...args));
  },
  resetSymptomList (...args) {
    return dispatch(resetSymptomList(...args));
  },
  saveSymptomCheckerSearchItem (...args) {
    return dispatch(saveSymptomCheckerSearchItem(...args));
  },
  onUpdateLanguage (...args) {
    dispatch(localeSet(...args));
    return Promise.resolve();
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(SymptomChecker));
