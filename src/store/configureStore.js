import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import authReducer from '../reducers/auth';
import statusReducer from '../reducers/status';
import errorReducer from '../reducers/error';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
  const store = createStore(
    combineReducers({
      auth: authReducer,
      status: statusReducer,
      error: errorReducer
    }),
    composeEnhancers(applyMiddleware(thunk))
  );

  return store;
};