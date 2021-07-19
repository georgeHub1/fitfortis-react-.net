import React from 'react';
import { shallow } from 'enzyme';
import SisuCreateAccount from '../../../src/components/Sisu/SisuCreateAccount.js';

const Container = SisuCreateAccount;

describe('SisuCreateAccount', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Container/>);
    expect(wrapper).toMatchSnapshot();
  });
});
