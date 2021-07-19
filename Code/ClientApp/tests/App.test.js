import React from 'react';
import App from '../src/App';
import {shallow} from 'enzyme';
it('renders without crashing', () => {
  const wrapper = shallow(<App />);
  expect(wrapper.find('ContextConsumer').length).toBe(1);
  
});
