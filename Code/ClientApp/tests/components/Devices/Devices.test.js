import React from 'react';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import Devices from '../../../src/components/Devices/Devices.js';

const Container = Devices;
const mockStore = configureStore([]);

describe('Devices', () => {
	it('renders correctly', () => {
		let store = mockStore({
			profile: {
				userRole: 'admin'
			}
		});
		const wrapper = renderer
			.create(<Provider store={store}>
				<Container />
				</Provider>
				)
			.toJSON();


		expect(wrapper).toMatchSnapshot();
	});
});
