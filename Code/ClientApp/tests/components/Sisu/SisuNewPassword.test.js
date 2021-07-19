import React from 'react';
import { shallow } from 'enzyme';
import SisuNewPassword from '../../../src/components/Sisu/SisuNewPassword.js';

const Container = SisuNewPassword;

describe('SisuNewPassword', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Container/>);
    expect(wrapper).toMatchSnapshot();
  });
});
