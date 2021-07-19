import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import HomeNews from '../../../src/components/Home/HomeNews.js';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

const mockStore = configureStore([]);
const Container = HomeNews;

describe('Home', () => {
  it('renders correctly', () => {

  let store = mockStore({
      adminTool: {
        newsFeeds: [],
        isLoading: false,
        isUploading: false,
        newsFeedMsg: null,
        isFetching: false,
        isNewsFeedLoaded: false,
        newsFeed: null
      },
      profile: {
        account: {
          
        }
      }
    });
    store.dispatch = jest.fn();
    const wrapper = renderer
      .create(
        <Provider store={store}>
          <MemoryRouter>
             <Container />
          </MemoryRouter>
        </Provider>
        )
          .toJSON();
    
        expect(wrapper).toMatchSnapshot();
      });
    });
