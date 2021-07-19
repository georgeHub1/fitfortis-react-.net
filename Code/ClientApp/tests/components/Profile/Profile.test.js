import React from 'react';
import { shallow } from 'enzyme';

import Profile from '../../../src/components/Profile/Profile.js';

const Container = Profile;

describe('Profile', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Container/>);

    expect(wrapper).toMatchSnapshot();
  });
});
