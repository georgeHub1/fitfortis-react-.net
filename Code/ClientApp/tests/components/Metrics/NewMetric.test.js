import React from 'react';
import renderer from 'react-test-renderer';
import NewMetric from '../../../src/components/Metrics/NewMetric.js';

const Container = NewMetric;

describe('NewMetric', () => {
  it('renders correctly', () => {
    const wrapper = renderer
      .create(<Container
        isOpen={false}
        onClose={jest.fn()}
        intl={{ formatMessage: jest.fn() }}
        selectedMetrics={[]}
        availableMetrics={[]}
        handleSearch={jest.fn()}
        countAvailable={0}
        chartId={""}
        value={""}
        addMetricToChart={jest.fn()}
      />).toJSON();

    expect(wrapper).toMatchSnapshot();
  });
});
