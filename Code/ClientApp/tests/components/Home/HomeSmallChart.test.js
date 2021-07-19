import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import { HomeSmallChart } from '../../../src/components/Home/HomeSmallChart';

const Container = HomeSmallChart;

function createNodeMock() {
  const doc = document.implementation.createHTMLDocument();
  return { parentElement: doc.body };
}

describe('HomeSmallChart', () => {
  it('renders correctly', () => {
    const wrapper = renderer
      .create(
          <div style={{ width: 200, height: 100 }}>
          </div>
        ,
        { createNodeMock }
      )
      .toJSON();

    expect(wrapper).toMatchSnapshot();
  });
});
