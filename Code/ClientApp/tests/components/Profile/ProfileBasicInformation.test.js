import React from 'react';
import renderer from 'react-test-renderer';

import ProfileBasicInformation from '../../../src/components/Profile/ProfileBasicInformation.js';

const Container = ProfileBasicInformation;

describe('ProfileBasicInformation', () => {
  it('renders correctly', () => {
    const wrapper = renderer
      .create(<Container/>)
      .toJSON();

    expect(wrapper).toMatchSnapshot();
  });
});
