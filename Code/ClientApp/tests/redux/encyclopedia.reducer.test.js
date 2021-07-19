import encyclopedia from '../../src/redux/encyclopedia.reducer.js';
import {
  UPDATE_PREV_SEARCH,
  DELETE_PREV_SEARCH
} from '../../src/redux/encyclopedia.action';
import { createReducer } from '../../src/utils/common';

const defaultState = {
  prevSearches: [{ name: 'pneumonia' }]
};

describe('encyclopedia', () => {
  it('should UPDATE_PREV_SEARCH ', () => {
    const action = {
      type: UPDATE_PREV_SEARCH,
      search: [{ name: 'walking' }]
    };
    const initialState = {
      prevSearches: [{ name: 'walking' }, { name: 'pneumonia' }]
    };

    expect(createReducer(encyclopedia)(defaultState, action)).toEqual(
      initialState
    );
  });
  it('should DELETE_PREV_SEARCH ', () => {
    const action = {
      type: DELETE_PREV_SEARCH,
      search: []
    };
    const initialState = {
      prevSearches: []
    };

    expect(createReducer(encyclopedia)(defaultState, action)).toEqual(
      initialState
    );
  });
});
