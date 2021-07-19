import React from 'react';
import { shallow } from 'enzyme';

import  AdminTools  from '../../../src/components/AdminTools/AdminTools';

const Container = AdminTools;

describe('AdminTools', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Container/>);

    expect(wrapper).toMatchSnapshot();
  });
});
