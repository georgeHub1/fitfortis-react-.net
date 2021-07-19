import React from 'react';
import renderer from 'react-test-renderer';

import EncyclopediaTermSearchResults  from '../../../src/components/Encyclopedia/EncyclopediaTermSearchResults.js';

const Container = EncyclopediaTermSearchResults;

describe('EncyclopediaTermSearchResults', () => {
  it('renders correctly', () => {
    const wrapper = renderer
      .create(<Container/>)
      .toJSON();

    expect(wrapper).toMatchSnapshot();
  });
});
