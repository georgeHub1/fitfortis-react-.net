import React from 'react';
import { shallow } from 'enzyme';

import NewsAndAlerts from '../../../src/components/News/NewsAndAlerts.js';

const Container = NewsAndAlerts;

describe('NewsAndAlerts', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Container/>);

    expect(wrapper).toMatchSnapshot();
  });
});
