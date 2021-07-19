import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import * as chartActions from '../../../src/redux/metricsChart.action';
import { HomeCharts } from '../../../src/components/Home/HomeCharts';
import { Provider } from 'react-redux';
import { initialState } from '../../../src/redux/index';

const mockStore = configureStore([]);

const Container = HomeCharts;

function createNodeMock() {
  const doc = document.implementation.createHTMLDocument();
  return { parentElement: doc.body };
}

describe('HomeCharts', () => {
  it('renders correctly', () => {
    let store = mockStore(initialState);
    store.dispatch(chartActions.loadChartsBulkSuccess({ charts: [], chartMetrics: [], metricData: [], metrics: [] }));

    const wrapper = renderer
      .create(
        <MemoryRouter>
            <Container
              selectedCharts={[]}
              loadMetrics={() => { return Promise.resolve(); }}
              loadChartBulk={() => { return Promise.resolve(); }}
              loadTimeLineData={() => { return Promise.resolve(); }}
              loadMetricDataAsync={() => { return Promise.resolve(); }}
              intl={{ formatMessage: jest.fn() }}
            />
        </MemoryRouter>,
        { createNodeMock }
      )
      .toJSON();

    expect(wrapper).toMatchSnapshot();
  });
});
