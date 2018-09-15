import tweetReducer from '../../reducers/tweet';

import { actionTypes } from '../../config/const.json';
import { tweets } from '../seed/seed';
const { UPDATE_USER_TWEETS } = actionTypes.tweet;

test("should set update the user's tweets", () => {
  const tweet = tweets[0];
  const state = tweetReducer(
    { tweets: [] },
    { type: UPDATE_USER_TWEETS, tweet }
  );
  expect(state).toEqual({
    tweets: [tweet]
  });
});
