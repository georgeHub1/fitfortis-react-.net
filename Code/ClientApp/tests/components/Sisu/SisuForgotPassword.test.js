import React from 'react';
import { shallow } from 'enzyme';
import SisuForgotPassword from '../../../src/components/Sisu/SisuForgotPassword.js';

const Container = SisuForgotPassword;

describe('SisuForgotPassword', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Container/>);
    expect(wrapper).toMatchSnapshot();
  });
});
