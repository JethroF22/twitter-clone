import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import authReducer from '../reducers/auth';
import errorReducer from '../reducers/error';
import profileReducer from '../reducers/profile';
import statusReducer from '../reducers/status';
import tweetReducer from '../reducers/tweet';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
  const store = createStore(
    combineReducers({
      auth: authReducer,
      error: errorReducer,
      profile: profileReducer,
      status: statusReducer,
      tweet: tweetReducer
    }),
    composeEnhancers(applyMiddleware(thunk))
  );

  return store;
};
