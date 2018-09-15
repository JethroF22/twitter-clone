import { actionTypes } from '../config/const.json';
const { UPDATE_USER_TWEETS } = actionTypes.tweet;

export default (state = { tweets: [] }, action) => {
  switch (action.type) {
    case UPDATE_USER_TWEETS:
      return {
        ...state,
        tweets: [action.tweet, ...state.tweets]
      };
    default:
      return state;
  }
};
