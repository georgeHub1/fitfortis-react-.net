import React from 'react';

import renderer from 'react-test-renderer';
import MetricsChartTimeLineTable from '../../../src/components/Metrics/MetricsChartTimeLineTable.js';

const Container = MetricsChartTimeLineTable;

describe('MetricsChartTimeLineTable', () => {
  it('renders correctly', () => {
    const wrapper = renderer
    .create(<Container
      metricData={[]}
      updateEntry={jest.fn()}
      createNewEntry={jest.fn()}
      columnsName={{}}
      updating={jest.fn()}
    />).toJSON();
    expect(wrapper).toMatchSnapshot();
  });
});
