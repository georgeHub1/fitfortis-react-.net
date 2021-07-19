import {
  UPDATE_PROFILE,
  SET_ACCOUNT_DATA,
  SET_BASIC_INFORMATION,
  SET_PROFILE_LIFE_STYLE,
  SET_CHRONIC_CONDITIONS,
  SET_FAMILY_HISTORY,
  SET_THERAPY_VACCINE,
  SET_AVATAR,
  SET_PROFILE_STORE_STATE,
  SET_USER_ROLE
} from './profile.action';
import moment from 'moment';

const getInitialState = () => ({
  account: {
    firstName: '',
    lastName: '',
    email: ''
  },
  userRole: 'USER',
  changes: {},
  basicInformation: {
    month: undefined,
    day: undefined,
    year: undefined,
    sexAtBirth: undefined,
    genderIdentity: undefined,
    origin: undefined
  }
});

export default {

  [UPDATE_PROFILE]: (state = getInitialState(), action) => {
    const { data } = action;

    return {
      ...state,
      ...data
    };
  },
  [SET_ACCOUNT_DATA]: (state = getInitialState(), action) => {
    const { data } = action;
    const accountData = {
      email: data.email,
      userId: data.userId,
      id: data.userId,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.hasOwnProperty('dateOfBirth') ? moment.utc(data.dateOfBirth).format('YYYY-MM-DD') : undefined,
      avatarId: data.avatarId,
      language: data.languageCode || undefined,
      sexAtBirth: data.sexAtBirth || undefined
    };

    const basicInformation = {
      ...state.basicInformation,
      genderIdentity: data.genderIdentity
    };

    return {
      ...state,
      account: { ...state.account, ...accountData },
      basicInformation
    };
  },
  [SET_BASIC_INFORMATION]: (state = [], action) => ({
    ...state,
    profileBasicInformation: action.data || []
  }),
  [SET_PROFILE_LIFE_STYLE]: (state = [], action) => ({
    ...state,
    profileLifeStyle: action.data || []
  }),
  [SET_CHRONIC_CONDITIONS]: (state = [], action) => ({
    ...state,
    profileChronicConditions: action.data || []
  }),
  [SET_FAMILY_HISTORY]: (state = [], action) => ({
    ...state,
    profileFamilyHistory: action.data || []
  }),
  [SET_THERAPY_VACCINE]: (state = [], action) => ({
    ...state,
    profileTherapyVaccine: action.data || []
  }),
  [SET_AVATAR]: (state = [], action) => ({
    ...state,
    avatar: action.data.avatar || null
  }),
  [SET_PROFILE_STORE_STATE]: (state = {}, action) => ({
    ...state,
    profileStoreState: action.data
  }),
  [SET_USER_ROLE]: (state = {}, action) => ({
    ...state,
    userRole: action.role
  })
};


export const defaultProfile = getInitialState();
