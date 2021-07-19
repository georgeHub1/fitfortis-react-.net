import React from 'react';
import renderer from 'react-test-renderer';

import ProfileTherapyAndVaccines from '../../../src/components/Profile/ProfileTherapyAndVaccines.js';

const Container = ProfileTherapyAndVaccines;

describe('ProfileTherapyAndVaccines', () => {
  it('renders correctly', () => {
    const wrapper = renderer
      .create(<Container/>)
      .toJSON();

    expect(wrapper).toMatchSnapshot();
  });
});
