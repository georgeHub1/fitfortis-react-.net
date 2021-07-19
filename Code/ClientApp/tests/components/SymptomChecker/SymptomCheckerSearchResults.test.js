import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

import  SymptomCheckerSearchResults  from '../../../src/components/SymptomChecker/SymptomCheckerSearchResults.js';

const Container = SymptomCheckerSearchResults;

describe('SymptomCheckerSearchResults', () => {
  it('renders correctly', () => {
    const wrapper = renderer
      .create(
        <MemoryRouter>
          <Container />
        </MemoryRouter>
      )
      .toJSON();

    expect(wrapper).toMatchSnapshot();
  });
});
