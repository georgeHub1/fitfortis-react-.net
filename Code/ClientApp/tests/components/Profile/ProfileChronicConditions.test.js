import React from 'react';
import renderer from 'react-test-renderer';

import ProfileChronicConditions from '../../../src/components/Profile/ProfileChronicConditions.js';

const Container = ProfileChronicConditions;

describe('ProfileChronicConditions', () => {
  it('renders correctly', () => {
    const wrapper = renderer
      .create(<Container/>)
      .toJSON();

    expect(wrapper).toMatchSnapshot();
  });
});
