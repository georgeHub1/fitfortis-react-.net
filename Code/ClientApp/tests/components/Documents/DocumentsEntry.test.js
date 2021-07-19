import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter  } from 'react-router-dom';
import { DocumentsEntry } from '../../../src/components/Documents/DocumentsEntry.js';

const Container = DocumentsEntry;

describe('DocumentsEntry', () => {
  it('renders correctly', () => {
    const wrapper = renderer
      .create(<Container/>)
      .toJSON();

    expect(wrapper).toMatchSnapshot();
  });
});
