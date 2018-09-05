import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import configureStore from './store/configureStore';
import LandingPage from './components/LandingPage';

const appRoot = document.getElementById('app');

const store = configureStore();

const root = (
  <Provider store={store}>
    <LandingPage />
  </Provider>
);

ReactDOM.render(root, appRoot);
