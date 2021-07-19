import symptomChecker from '../../src/redux/symptomChecker.reducer.js';
import {
  ADD_NEW_SYMPTOM,
  DELETE_SYMPTOM,
  SET_USER_INFO
} from '../../src/redux/symptomChecker.action';
import { createReducer } from '../../src/utils/common';

const defaultState = {
  symptoms: [{ name: 'runny nose' }],
  userInfo: {
    isFemale: true,
    isPregnant: false,
    keyYear: { value: '30_39', name: 'Adult 30-39 yrs' }
  }
};

describe('symptomChecker reducer', () => {
  it('should ADD_NEW_SYMPTOM ', () => {
    const action = {
      type: ADD_NEW_SYMPTOM,
      symptom: [{ name: 'cough' }]
    };
    const initialState = {
      ...defaultState,
      symptoms: [{ name: 'runny nose' }, { name: 'cough' }]
    };

    expect(createReducer(symptomChecker)(defaultState, action)).toEqual(
      initialState
    );
  });
  it('should DELETE_SYMPTOM ', () => {
    const action = {
      type: DELETE_SYMPTOM,
      symptom: { name: 'runny nose' }
    };
    const initialState = {
      ...defaultState,
      symptoms: []
    };

    expect(createReducer(symptomChecker)(defaultState, action)).toEqual(
      initialState
    );
  });
  it('should SET_USER_INFO ', () => {
    const action = {
      type: SET_USER_INFO,
      user: {
        isFemale: false,
        isPregnant: false,
        keyYear: { value: '1_4', name: 'Toddler 1-4 years' }
      }
    };
    const initialState = {
      ...defaultState,
      userInfo: {
        isFemale: false,
        isPregnant: false,
        keyYear: { value: '1_4', name: 'Toddler 1-4 years' }
      }
    };

    expect(createReducer(symptomChecker)(defaultState, action)).toEqual(
      initialState
    );
  });
});
