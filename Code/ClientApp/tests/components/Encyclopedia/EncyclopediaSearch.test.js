import React from 'react';
import renderer from 'react-test-renderer';
import EncyclopediaTermSearch from '../../../src/components/Encyclopedia/EncyclopediaTermSearch.js';

const Container = EncyclopediaTermSearch;

describe('EncyclopediaTermSearch', () => {
  it('renders correctly', () => {
    const wrapper = renderer
      .create(<Container/>)
      .toJSON();


    expect(wrapper).toMatchSnapshot();
  });
});
