import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import SymptomCheckerSearch from '../../../src/components/SymptomChecker/SymptomCheckerSearch';
import { createStore, applyMiddleware } from 'redux';
import configureStore from 'redux-mock-store';

const Container = SymptomCheckerSearch;
const mockStore = configureStore([]);
beforeEach(() => {
  const consoleErrorMock = jest.fn();

  console.error = consoleErrorMock;
});

describe('SymptomCheckerSearch', () => {
  it('renders correctly', () => {
    let store = mockStore({
      symptomChecker: {
        symptoms: [],
        isLoading: false,
        userInfo: {
          gender: null,
          isFemale: true,
          isPregnant: false,
          keyYear: { value: '30_39', name: 'Adult 30-39 years', ageRange: [30, 39] }
        },
        isLoaded: false,
        symptomsList: [],
        symptomDetails: {},
        isSymptomDetailsLoaded: false
      }
    });
    store.dispatch = jest.fn();

    const wrapper = renderer
    .create(<Provider store={store}>
      <Container />
      </Provider>
      )
    .toJSON();

    expect(wrapper).toMatchSnapshot();
  });
});
