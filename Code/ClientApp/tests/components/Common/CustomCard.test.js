import React from 'react';
import renderer from 'react-test-renderer';

import CustomCard from '../../../src/components/Common/CustomCard.js';

const Container = CustomCard;

describe('CustomCard', () => {
  it('renders correctly', () => {
    const wrapper = renderer
      .create(<Container/>)
      .toJSON();

    expect(wrapper).toMatchSnapshot();
  });
});
