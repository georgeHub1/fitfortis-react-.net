import React from 'react';
import renderer from 'react-test-renderer';

import AvailableMetric from '../../../src/components/Metrics/AvailableMetric';

const Container = AvailableMetric;

describe('AvailableMetric', () => {
  it('renders correctly', () => {
    const wrapper =  renderer
    .create(<Container
      metric={{
        id: "",
        name: ""
      }}
      onAdd={() => { }}
      searchValue="searchValue"
    />).toJSON();

    expect(wrapper).toMatchSnapshot();
  });
});
