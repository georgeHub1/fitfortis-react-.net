import configureStore from 'redux-mock-store';
import * as actions from '../../src/redux/symptomChecker.action';

const middlewares = [];
const mockStore = configureStore(middlewares);

const store = mockStore();

describe('should dispatch action', () => {
  beforeEach(() => {
    store.clearActions();
  });

  it('action ADD_NEW_SYMPTOM', () => {
    const action = { type: actions.ADD_NEW_SYMPTOM };
    const expectedAction = [action];

    store.dispatch(actions.addNewSymptom());
    expect(store.getActions()).toEqual(expectedAction);
  });
  it('action DELETE_SYMPTOM', () => {
    const action = { type: actions.DELETE_SYMPTOM };
    const expectedAction = [action];

    store.dispatch(actions.deleteSymptom());
    expect(store.getActions()).toEqual(expectedAction);
  });
  it('action SET_USER_INFO', () => {
    const action = { type: actions.SET_USER_INFO };
    const expectedAction = [action];

    store.dispatch(actions.setUserInfo());
    expect(store.getActions()).toEqual(expectedAction);
  });
});
