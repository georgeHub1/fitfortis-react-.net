import profile from '../../src/redux/profile.reducer.js';
import { UPDATE_PROFILE } from '../../src/redux/profile.action';
import { createReducer } from '../../src/utils/common';

const defaultState = {
  account: {
    avatar: '',
    firstName: 'John',
    lastName: 'Doe',
    email: 'demo@fitfortis.com'
  }
};

describe('profile account reducer', () => {
  it('should UPDATE_PROFILE ', () => {
    const action = {
      type: UPDATE_PROFILE,
      data: {
        account: {
          avatar: '',
          firstName: 'Roman',
          lastName: 'Shutsman',
          email: 'demo@fitfortis.com'
        },
        changes: {}
      }
    };
    const initialState = {
      ...defaultState,
      account: {
        avatar: '',
        firstName: 'Roman',
        lastName: 'Shutsman',
        email: 'demo@fitfortis.com'
      },
      changes: {}
    };

    expect(createReducer(profile)(defaultState, action)).toEqual(initialState);
  });
});
