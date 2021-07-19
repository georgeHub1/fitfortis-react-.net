import { getSymptoms, getSymptomDetails, saveItem } from '../backendServices/symptom';
import { message } from 'antd';

export const ADD_NEW_SYMPTOM = 'ADD_NEW_SYMPTOM';
export const DELETE_SYMPTOM = 'DELETE_SYMPTOM';
export const SET_USER_INFO = 'SET_USER_INFO';

export const FETCH_SYMPTOM_LIST = 'FETCH_SYMPTOM_LIST';
export const SET_SYMPTOM_LIST = 'SET_SYMPTOM_LIST';
export const ERROR_SYMPTOM_LIST = 'ERROR_SYMPTOM_LIST';

export const FETCH_SYMPTOM_DETAILS = 'FETCH_SYMPTOM_DETAILS';
export const SET_SYMPTOM_DETAILS = 'SET_SYMPTOM_DETAILS';
export const ERROR_SYMPTOM_DETAILS = 'ERROR_SYMPTOM_DETAILS';

export const RESET_SYMPTOM_LIST = 'RESET_SYMPTOM_LIST';

export const addNewSymptom = symptom => ({
  type: ADD_NEW_SYMPTOM,
  symptom
});
export const deleteSymptom = symptom => ({
  type: DELETE_SYMPTOM,
  symptom
});
export const setUserInfo = user => ({
  type: SET_USER_INFO,
  user
});

export const resetSymptomList = () => ({
  type: RESET_SYMPTOM_LIST
});


export const fetchSymptomList = () => ({
	type: FETCH_SYMPTOM_LIST
});
export const successSymptomList = list => ({
	type: SET_SYMPTOM_LIST,
	list
});
export const errorSymptomList = () => ({
	type: ERROR_SYMPTOM_LIST
});

export const fetchSymptomDetails = () => ({
  type: FETCH_SYMPTOM_DETAILS
});
export const successSymptomDetails = data => ({
  type: SET_SYMPTOM_DETAILS,
  data
});
export const errorSymptomDetails = () => ({
  type: ERROR_SYMPTOM_DETAILS
});

export const saveSymptomCheckerSearchItem = (title, itemId, userId, isSuccessful) => dispatch => {
    saveItem(title, itemId, userId, isSuccessful);
};

export const fetchSymptoms = language => dispatch => {
    dispatch(fetchSymptomList());
    getSymptoms(language).then(data => {
      if (data.success) {
        dispatch(successSymptomList(data.items));
      } else {
        message.error('Item not found');
        dispatch(errorSymptomList());
      }
    }, test => {
      message.error(test);
      dispatch(errorSymptomList());
    });
};

export const handleFetchSymptomDetails = id => dispatch => {
  dispatch(fetchSymptomDetails());
  const language = localStorage.getItem('language') || 'en';

  getSymptomDetails(id, language.includes('uk') ? 'uk-ua' : language).then(data => {
    if (data.success) {
      dispatch(successSymptomDetails(data.item));
    } else {
      message.error('Item not found');
      dispatch(errorSymptomDetails());
    }
  }, test => {
    message.error(test);
    dispatch(errorSymptomDetails());
  });
};
