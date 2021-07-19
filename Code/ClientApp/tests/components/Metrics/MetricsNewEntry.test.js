import React from 'react';
import { shallow } from 'enzyme';

import renderer from 'react-test-renderer';
import MetricsNewEntry from '../../../src/components/Metrics/MetricsNewEntry.js';

const Container = MetricsNewEntry;

describe('MetricsNewEntry', () => {
  it('renders correctly', () => {
    const wrapper = renderer
      .create(<Container
        chartDATA={[{
          stroke: 'string',
          code: 'code',
          chartMetricId: 'string',
          showGoalLines: false,
          annotateLastEntry: false,
          annotateMaxEntry: false,
          annotateMinEntry: false,
          goal: 5,
          yMin: 5,
          yMax: 5,

          metricId: 'string',
          name: 'string',
          defaultStroke: 'string',
          units: 'string',
          description: 'string',
          type: 5,

          metricData: [{
            dateTime: 5,
            id: 'string',
            value: 5
          }]
        }]}
        close={jest.fn()}
        createNewEntry={jest.fn()}
        updateEntry={jest.fn()}
        open={false}
        intl={{ formatMessage: jest.fn() }}
      />)
      .toJSON();

    expect(wrapper).toMatchSnapshot();
  });
});
