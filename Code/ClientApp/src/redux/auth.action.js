import auth from '../backendServices/auth';
import profile from '../backendServices/profile';
import {
  setAccountData,
  setProfileBasicInformation,
  setProfileLifeStyle,
  setProfileChronicConditions,
  setProfileFamilyHistory,
  setProfileTherapyVaccine,
  setProfileAvatar,
  setUserRole
} from './profile.action.js';
import { localeSet } from './locale.action';
import { getAgeRange } from '../constants/symptomChecker';
import {
  setUserInfo
} from './symptomChecker.action';
import analyticId from '../utils/AnalyticsAndAbTests.tsx';

export const LOGIN_USER_REQUEST = 'LOGIN_USER_REQUEST';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_FAILURE = 'LOGIN_USER_FAILURE';

export const loginUserRequest = () => ({
  type: LOGIN_USER_REQUEST
});

export const loginUserSuccess = () => ({
  type: LOGIN_USER_SUCCESS
});

export const loginUserFailure = error => ({
  type: LOGIN_USER_FAILURE,
  error
});

export const fetchAccountMe = (token, push = () => true, lang) => (dispatch, getState) => {
  dispatch(loginUserRequest());

  return auth
    .accountMe(token, push)
    .then(({ item }) => {
      let language = item.hasOwnProperty('languageCode') ? item.languageCode : localStorage.getItem('language') || 'en';

      analyticId.firebaseAnalyticUserId(item.userId);
      if (lang) {
        language = lang;
      }
      if (window.location.search.includes('?lang=')) {
        language = window.location.search.includes('?lang=') ? window.location.search.substring(6, 11) : (localStorage.getItem('language') || 'en');
      }
      localStorage.setItem('language', language);
      dispatch(localeSet(language));
      dispatch(setUserRole(item.role.toLowerCase() || 'user'));
      dispatch(loginUserSuccess());
      dispatch(setAccountData(item));
      const fetchBasicInformation =  profile.profileFetchBasicInformation(item.userId, language);
      const fetchChronicConditions =  profile.profileFetchChronicConditions(item.userId, language);
      const fetchFamilyHistory =  profile.profileFetchFamilyHistory(item.userId, language);
      const fetchTherapyVaccine =  profile.profileFetchTherapyVaccine(item.userId, language);
      const fetchLifeStyle =  profile.profileFetchLifeStyle(item.userId, language);
      const fetchAvatar = profile.profileFetchAvatar(item.userId, token);

      Promise.all([fetchBasicInformation, fetchChronicConditions, fetchFamilyHistory, fetchTherapyVaccine, fetchLifeStyle, fetchAvatar])
      .then(([basicInformation = [], chronicConditions = [], familyHistory = [], therapyVaccine = [], lifestyle = [], avatar = undefined]) => {
        dispatch(setProfileBasicInformation(basicInformation));
        dispatch(setProfileChronicConditions(chronicConditions));
        dispatch(setProfileFamilyHistory(familyHistory));
        dispatch(setProfileTherapyVaccine(therapyVaccine));
        dispatch(setProfileLifeStyle(lifestyle));
        dispatch(setProfileAvatar(avatar));

        const userInfo = {
          isFemale: (item.genderIdentity === 'Female'),
          isPregnant: false,
          keyYear: item.dateOfBirth ? getAgeRange(item.dateOfBirth) : {},
          gender: item.sexAtBirth ? item.sexAtBirth.toLowerCase() : item.sexAtBirth
        };

        dispatch(setUserInfo(userInfo));
      }).catch(err => {
        throw err;
      });
    }, test => {
      dispatch(loginUserFailure());
    });
};

export const loginUser = (username, password, push, lang) => dispatch => {
  dispatch(loginUserRequest());

  return auth
    .authenticate(username, password)
    .then(token => {
      dispatch(fetchAccountMe(token, push, lang));
    }, errors => {
      dispatch(loginUserFailure(errors));
    });
};

export const confirmAccount = (token, userId, history) => dispatch => {
  dispatch(loginUserRequest());

  return auth
    .confirmation(token, userId)
    .then(({ item }) => {
      dispatch(fetchAccountMe(item.token, history.push));
    }, ({ errors }) => {
      history.push('/');
      dispatch(loginUserFailure(errors));
    });
};

