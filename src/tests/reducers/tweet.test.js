import tweetReducer from '../../reducers/tweet';

import { actionTypes } from '../../../config/const.json';
import { tweets } from '../../../config/seed';
const { UPDATE_USER_TWEETS, SET_USER_TWEETS } = actionTypes.tweet;

test("should update the user's tweets", () => {
  const tweet = tweets[0];
  const state = tweetReducer(
    { tweets: [] },
    { type: UPDATE_USER_TWEETS, tweet }
  );
  expect(state).toEqual({
    tweets: [tweet]
  });
});

test("should set the user's tweets", () => {
  const state = tweetReducer({ tweets: [] }, { type: SET_USER_TWEETS, tweets });
  expect(state).toEqual({
    tweets
  });
});
