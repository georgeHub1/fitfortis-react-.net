import React from 'react';
import { shallow } from 'enzyme';

import SisuSignIn from '../../../src/components/Sisu/SisuSignIn.js';


const Container = SisuSignIn;

describe('SisuSignIn', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Container/>);

    expect(wrapper).toMatchSnapshot();
  });
});
