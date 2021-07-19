import React from 'react';
import { shallow } from 'enzyme';

import { ChartBubbles } from '../../../src/components/Common/ChartBubbles.js';

const Container = ChartBubbles;

describe('ChartBubbles', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Container/>);

    expect(wrapper).toMatchSnapshot();
  });
});
