import React from 'react';
import renderer from 'react-test-renderer';

import ProfileFamilyHistory from '../../../src/components/Profile/ProfileFamilyHistory.js';

const Container = ProfileFamilyHistory;

describe('ProfileFamilyHistory', () => {
  it('renders correctly', () => {
    const wrapper = renderer
      .create(<Container/>)
      .toJSON();

    expect(wrapper).toMatchSnapshot();
  });
});
