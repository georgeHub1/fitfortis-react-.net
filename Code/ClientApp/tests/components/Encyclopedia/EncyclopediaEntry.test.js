import React from 'react';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import EncyclopediaTermEntry from '../../../src/components/Encyclopedia/EncyclopediaTermEntry.js';
import { createStore, applyMiddleware } from 'redux';

const Container = EncyclopediaTermEntry;
const mockStore = configureStore([]);

describe('EncyclopediaTermEntry', () => {
  it('renders correctly', () => {
  	let store = mockStore({
      encyclopedia: {
      	prevSearches: [],
        encyclopedia: {
          title: '',
          synonyms: '',
          conciseDescription: ''
        }
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
