import React from 'react';
import { shallow } from 'enzyme';

import ProfileAccount from '../../../src/components/Profile/ProfileAccount.js';


const Container = ProfileAccount;

describe('ProfileAccount', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Container/>);

    expect(wrapper).toMatchSnapshot();
  });
});