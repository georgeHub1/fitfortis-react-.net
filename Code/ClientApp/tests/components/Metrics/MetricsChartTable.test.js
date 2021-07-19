import React from 'react';

import renderer from 'react-test-renderer';
import MetricsChartTable from '../../../src/components/Metrics/MetricsChartTable.js';

const Container = MetricsChartTable;

describe('MetricsChartTable', () => {
  it('renders correctly', () => {
    const wrapper = renderer.create(<Container
      chartDATA={[]}
      columnsName={{}}
      createNewEntry={jest.fn()}
      deleteMetricDataBulk={jest.fn()}
      upsertEntity={jest.fn()}
    />);

    expect(wrapper).toMatchSnapshot();
  });
});
