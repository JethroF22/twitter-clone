import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import authReducer from '../reducers/auth';
import statusReducer from '../reducers/status';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
  const store = createStore(
    combineReducers({
      auth: authReducer,
      status: statusReducer
    }),
    composeEnhancers(applyMiddleware(thunk))
  );

  return store;
};
