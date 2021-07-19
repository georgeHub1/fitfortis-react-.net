export const UPDATE_PROFILE = 'UPDATE_PROFILE';
export const SET_ACCOUNT_DATA = 'SET_ACCOUNT_DATA';
export const SET_BASIC_INFORMATION = 'SET_BASIC_INFORMATION';
export const SET_PROFILE_LIFE_STYLE = 'SET_PROFILE_LIFE_STYLE';
export const SET_CHRONIC_CONDITIONS = 'SET_CHRONIC_CONDITIONS';
export const CHRONIC_CONDITIONS_UPDATE = 'CHRONIC_CONDITIONS_UPDATE';
export const SET_FAMILY_HISTORY = 'SET_FAMILY_HISTORY';
export const SET_THERAPY_VACCINE = 'SET_THERAPY_VACCINE';
export const SET_AVATAR = 'SET_AVATAR';
export const SET_PROFILE_STORE_STATE = 'SET_PROFILE_STORE_STATE';
export const SET_USER_ROLE = 'SET_USER_ROLE';

export const setUserRole = role => ({
  type: SET_USER_ROLE,
  role
});

export const updateProfile = data => ({
  type: UPDATE_PROFILE,
  data
});

export const setAccountData = data => ({
  type: SET_ACCOUNT_DATA,
  data
});

export const setProfileBasicInformation = data => ({
  type: SET_BASIC_INFORMATION,
  data
});

export const setProfileLifeStyle = data => ({
  type: SET_PROFILE_LIFE_STYLE,
  data
});
export const setProfileChronicConditions = data => ({
  type: SET_CHRONIC_CONDITIONS,
  data
});

export const updateProfileChronicConditions = data => ({
  type: CHRONIC_CONDITIONS_UPDATE,
  data
});

export const setProfileFamilyHistory = data => ({
  type: SET_FAMILY_HISTORY,
  data
});

export const setProfileTherapyVaccine = data => ({
  type: SET_THERAPY_VACCINE,
  data
});

export const setProfileAvatar = data => ({
  type: SET_AVATAR,
  data
});

export const setProfileStoreState = data => ({
  type: SET_PROFILE_STORE_STATE,
  data
});
