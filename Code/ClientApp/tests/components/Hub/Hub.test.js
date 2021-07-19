import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Hub from '../../../src/components/Hub/Hub.js';
import createAppStore from '../../../src/redux/';

const Container = Hub;

beforeEach(() => {
  const consoleErrorMock = jest.fn();

  console.error = consoleErrorMock;
});
describe('Hub', () => {
  it('renders correctly', () => {
    const wrapper = renderer
      .create(
        <MemoryRouter>
          <Provider store={createAppStore}>
            <Container />
          </Provider>
        </MemoryRouter>
      )
      .toJSON();

    expect(wrapper).toMatchSnapshot();
  });
});
