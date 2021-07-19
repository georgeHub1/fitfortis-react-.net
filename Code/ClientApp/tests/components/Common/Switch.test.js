import React from 'react';
import renderer from 'react-test-renderer';

import Switch from '../../../src/components/Common/Switch.js';

const Container = Switch;

describe('Switch', () => {
  it('renders correctly', () => {
    const wrapper = renderer
      .create(<Container/>)
      .toJSON();

    expect(wrapper).toMatchSnapshot();
  });
});
