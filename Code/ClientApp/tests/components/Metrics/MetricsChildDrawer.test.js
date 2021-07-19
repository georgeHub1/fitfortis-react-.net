import React from 'react';
import renderer from 'react-test-renderer';
import MetricsChildDrawer  from '../../../src/components/Metrics/MetricsChildDrawer.js';

const Container = MetricsChildDrawer;

describe('MetricsChildDrawer', () => {
  it('renders correctly', () => {
    const wrapper = renderer.create(<Container
      showGoalLines={false}
      annotateLastEntry={false}
      annotateMaxEntry={false}
      annotateMinEntry={false}
      stroke={''}
      isUpdating={false}
      close={jest.fn()}
      changeProperties={jest.fn()}
      type={0}
    />).toJSON();

    expect(wrapper).toMatchSnapshot();
  });
});
