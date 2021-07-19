import './polyfill.js';

import '@babel/polyfill';
import 'core-js/stable';
import 'core-js/es/string';
import 'core-js/es/array';
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import createAppStore from './redux/';
import {Provider} from 'react-redux';
import registerServiceWorker from './registerServiceWorker';
if (window.location.pathname.includes('/newPassword') || window.location.pathname.includes('/confirm')) localStorage.clear();


const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');

ReactDOM.render(
  <BrowserRouter basename={baseUrl}>
    <Provider store={createAppStore}>
      <App />
    </Provider>
  </BrowserRouter>,
  rootElement);

registerServiceWorker();
