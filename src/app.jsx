import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import configureStore from './store/configureStore';
import AppRouter from './router/AppRouter';

const appRoot = document.getElementById('app');

const store = configureStore();

const root = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

ReactDOM.render(root, appRoot);
