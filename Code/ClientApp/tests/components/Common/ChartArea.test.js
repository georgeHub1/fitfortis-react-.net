import React from 'react';
import { shallow } from 'enzyme';

import ChartArea from '../../../src/components/Common/ChartArea.js';

const Container = ChartArea;

describe('ChartArea', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Container/>);

    expect(wrapper).toMatchSnapshot();
  });
});
