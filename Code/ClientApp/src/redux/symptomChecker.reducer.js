import {
  ADD_NEW_SYMPTOM,
  DELETE_SYMPTOM,
  SET_USER_INFO,
  FETCH_SYMPTOM_LIST,
  SET_SYMPTOM_LIST,
  ERROR_SYMPTOM_LIST,
  FETCH_SYMPTOM_DETAILS,
  SET_SYMPTOM_DETAILS,
  ERROR_SYMPTOM_DETAILS,
  RESET_SYMPTOM_LIST
} from './symptomChecker.action';

const getInitialState = () => ({
  symptoms: [],
  isLoading: false,
  userInfo: {
    gender: 'female',
    isFemale: true,
    isPregnant: false,
    keyYear: { value: '30_39', name: 'Adult 30-39 years', ageRange: [30, 39] }
  },
  isLoaded: false,
  symptomsList: [],
  symptomDetails: {},
  isSymptomDetailsLoaded: false
});

export default {
  [ADD_NEW_SYMPTOM]: (state = getInitialState(), action) => {
    return {
      ...state,
      symptoms: [...state.symptoms, ...action.symptom]
    };
  },
  [DELETE_SYMPTOM]: (state = getInitialState(), action) => {
    return {
      ...state,
      symptoms: [...state.symptoms].filter(
        el => el.name !== action.symptom.name
      )
    };
  },
  [SET_USER_INFO]: (state = getInitialState(), action) => {
    return {
      ...state,
      userInfo: {
        ...action.user,
        isFemale: action.user.gender === 'female' || action.user.gender === 'intersex'
      }
    };
  },
  [FETCH_SYMPTOM_LIST]: (state, action) => {
    return {
      ...state,
      isLoading: true,
      symptomsList: []
    };
  },
  [SET_SYMPTOM_LIST]: (state, action) => {
    return {
      ...state,
      isLoading: false,
      symptomsList: action.list,
      isLoaded: true
    };
  },
  [ERROR_SYMPTOM_LIST]: (state, action) => {
    return {
      ...state,
      isLoading: false,
      symptomsList: []
    };
  },
  [RESET_SYMPTOM_LIST]: (state, action) => {
    return {
      ...state,
      isLoaded: false,
      symptomsList: []
    };
  },
  [FETCH_SYMPTOM_DETAILS]: (state, action) => {
    return {
      ...state,
      isSymptomDetailsLoaded: false,
      symptomDetails: {}
    };
  },
  [SET_SYMPTOM_DETAILS]: (state, action) => {
    return {
      ...state,
      isSymptomDetailsLoaded: true,
      symptomDetails: action.data
    };
  },
  [ERROR_SYMPTOM_DETAILS]: (state, action) => {
    return {
      ...state,
      isSymptomDetailsLoaded: false,
      symptomDetails: null
    };
  }
};


export const defaultSymptomChecker = getInitialState();
