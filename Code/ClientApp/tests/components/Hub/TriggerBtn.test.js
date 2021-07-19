import React from 'react';
import renderer from 'react-test-renderer';

import TriggerBtn from '../../../src/components/Hub/TriggerBtn.js';

const Container = TriggerBtn;

describe('TriggerBtn', () => {
  it('renders correctly', () => {
    const wrapper = renderer
      .create(<Container/>)
      .toJSON();

    expect(wrapper).toMatchSnapshot();
  });
});
