import * as R from 'ramda';
export const accountForm = 'accountForm';
export const settingsForm = 'settingsForm';
export const geneticsForm = 'geneticsForm';
export const profileBasicInformationForm = 'profileBasicInformationForm';
export const familyHistoryForm = 'familyHistoryForm';
export const conditionsForm = 'conditionsForm';
export const activityForm = 'activityForm';
export const TherapyAndVaccinesFrom = 'TherapyAndVaccinesFrom';
export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export const cropConfig = {
  unit: '%',
  width: 50,
  aspect: 1 / 1
};


export const dateFormat = 'dddd, MMMM DD'; // Tuesday, August 06
export const dateFormat1 = 'YYYY-MM-DD'; // 2019-10-20
export const dateFormat2 = 'dddd, MMMM Do'; // Tuesday, August 6th


export const doses = ['20 per day', '100 per week', '50 per day', '80 per day'];
export const dateConfig = {
  7: '1 week',
  14: '2 weeks',
  21: '3 weeks',
  28: '1 month',
  29: '1 month',
  30: '1 month',
  31: '1 month'
};
export const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line

export const profileUpdateGroupSections = {
  'account': {'update': 'updateUserInfo'},
  'avatar': {'update': 'profileUpploadAvatar'},
  'profileLifeStyle': {'update': 'profileUpdateLifeStyle'},
  'profileBasicInformation': {'update': 'profileUpdateBasicInformation'},
  'profileChronicConditions': {'update': 'profileUpdateChronicConditions', 'delete':  'profileDeleteChronicConditions'},
  'profileFamilyHistory': {'update': 'profileUpdateFamilyHistory', 'delete':  'profileDeleteFamilyHistory'},
  'profileTherapyVaccine': {'update': 'profileUpdateTherapyVaccine', 'delete':  'profileDeleteTherapyVaccine'}
};

export const profileFetchGroupSections = {
  'account': 'getUserInfo',
  'profileLifeStyle': 'profileFetchLifeStyle',
  'profileBasicInformation': 'profileFetchBasicInformation',
  'profileChronicConditions': 'profileFetchChronicConditions',
  'profileFamilyHistory': 'profileFetchFamilyHistory',
  'profileTherapyVaccine':  'profileFetchTherapyVaccine'
};

export const profileDispatchGroupSections = {
  'account': 'onUpdateProfile',
  'avatar': 'onUpdateProfileAvatar',
  'profileBasicInformation': 'onUpdateProfileBasicInformation',
  'profileLifeStyle': 'onUpdateProfileLifeStyle',
  'profileChronicConditions': 'onUpdateProfileChronicConditions',
  'profileFamilyHistory': 'onUpdateProfileFamilyHistory',
  'profileTherapyVaccine': 'onUpdateProfileTherapyVaccine'
};

export  const  profileCompareData = (newData, oldData) => {
  newData.forEach((element, index) => {
    if (Array.isArray(element.values)) {
      oldData[index].values.forEach((elm, i) => {
        newData[index].values[i].isSelected = elm.isSelected;
      });
    }
    else {
      const elmInOld = R.filter(item => item.id === element.id)(oldData)[0];

      if (!R.equals(element.isSelected, elmInOld.isSelected))
        newData[index].isSelected = elmInOld.isSelected;
    }
  });
  return newData;
};

export const   showDifference = (newData, oldData) => {
  var arrChanges = [];

  if (R.is(String, newData)) {
    if (newData !== oldData) {
      return R.insert(0, {newValue: newData, oldValue: oldData})(arrChanges);
    }
    return [];
  }

  if (!Array.isArray(newData)) {
    if (!R.equals(newData, oldData)) {
      return R.insert(0, {newValue: newData, oldValue: oldData})(arrChanges);
    }
    return [];
  }

  newData.forEach((elmInNewData, index) => {
    if (!Array.isArray(elmInNewData.values)) {
      if (elmInNewData.isSelected !== oldData[index].isSelected)
        arrChanges.push({ newValue: elmInNewData, oldValue: oldData[index] });
    } else {
      const valuesInNewData = elmInNewData.values;
      const valuesInOldData = oldData[index].values;

      valuesInNewData.forEach((value, i) => {
        if (!R.equals(value.isSelected, valuesInOldData[i].isSelected))
          arrChanges.push({ newValue: valuesInNewData, oldValue: valuesInOldData });
      });
    }
  });
  return arrChanges;
};

export const setChangeLanguages = language => {
  const arrChangeLanguage = JSON.parse(localStorage.getItem('changeLanguages'));
  const changesLanguage = arrChangeLanguage !== null ?  arrChangeLanguage : [];

  if (arrChangeLanguage === null || (arrChangeLanguage[arrChangeLanguage.length - 1] !== language && arrChangeLanguage[0] !== language)) {
    changesLanguage.push(language);
    localStorage.changeLanguages = JSON.stringify(changesLanguage);
  }
};

