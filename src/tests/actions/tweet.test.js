import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';

import {
  updateUserTweets,
  createTweet,
  retweet,
  setUserTweets,
  fetchTweets,
  deleteTweet,
  likeTweet,
  unlikeTweet
} from '../../actions/tweet';
import {
  actionTypes,
  actionStatusMessages,
  errorMessages,
  errorTypes
} from '../../../config/const.json';
import { tweets, tweetID, users } from '../../../config/seed';

const { SET_ACTION_STATUS } = actionTypes.status;
const { SET_ERROR_MESSAGE } = actionTypes.error;
const {
  SUCCESS_MESSAGE,
  IN_PROGRESS_MESSAGE,
  FAILED_MESSAGE
} = actionStatusMessages;
const { UPDATE_USER_TWEETS, SET_USER_TWEETS } = actionTypes.tweet;
const {
  UNAUTHORISED,
  TWEET_NOT_FOUND,
  USER_NOT_FOUND,
  HAS_BEEN_LIKED,
  HAS_NOT_BEEN_LIKED
} = errorMessages;
const { AUTHORISATION_ERROR, INVALID_REQUEST } = errorTypes;

const createMockStore = configureMockStore([thunk]);
let store, tweet, token, userID;

describe('tweet actions', () => {
  beforeEach(() => {
    store = createMockStore(() => ({ tweet: { tweets } }));
    tweet = tweets[0];
    token = '1234567890';
    userID = users[0]._id;
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  describe('updateUserTweets', () => {
    test('should create the action object ', () => {
      const action = updateUserTweets(tweet);
      expect(action).toEqual({
        type: UPDATE_USER_TWEETS,
        tweet
      });
    });
  });

  describe('setUserTweets', () => {
    test('should create the action object ', () => {
      const action = setUserTweets(tweets);
      expect(action).toEqual({ type: SET_USER_TWEETS, tweets });
    });
  });

  describe('createTweet', () => {
    test('should handle successful requests', done => {
      store.dispatch(createTweet(tweet, token));
      let actions = store.getActions();
      expect(actions[0]).toEqual({
        type: SET_ACTION_STATUS,
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'createTweet'
      });

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request
          .respondWith({
            status: 200,
            response: tweet
          })
          .then(() => {
            actions = store.getActions();
            expect(actions[1]).toEqual({
              type: SET_ACTION_STATUS,
              actionStatus: SUCCESS_MESSAGE,
              actionName: 'createTweet'
            });
            expect(actions[2]).toEqual({
              type: UPDATE_USER_TWEETS,
              tweet
            });
            done();
          });
      });
    });

    test('should handle unauthorised requests', done => {
      store.dispatch(createTweet(tweet));
      let actions = store.getActions();
      expect(actions[0]).toEqual({
        type: SET_ACTION_STATUS,
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'createTweet'
      });

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request
          .respondWith({ status: 401, statusText: UNAUTHORISED })
          .then(() => {
            actions = store.getActions();
            expect(actions[1]).toEqual({
              type: SET_ACTION_STATUS,
              actionStatus: FAILED_MESSAGE,
              actionName: 'createTweet'
            });
            expect(actions[2]).toEqual({
              type: SET_ERROR_MESSAGE,
              errorMessage: UNAUTHORISED,
              errorType: AUTHORISATION_ERROR
            });
            done();
          });
      });
    });
  });

  describe('retweet', () => {
    test('should handle successful requests', done => {
      store.dispatch(retweet(tweetID, token));
      let actions = store.getActions();
      expect(actions[0]).toEqual({
        type: SET_ACTION_STATUS,
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'retweet'
      });

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({ status: 200, response: tweet }).then(() => {
          actions = store.getActions();
          expect(actions[1]).toEqual({
            type: SET_ACTION_STATUS,
            actionStatus: SUCCESS_MESSAGE,
            actionName: 'retweet'
          });
          expect(actions[2]).toEqual({
            type: UPDATE_USER_TWEETS,
            tweet
          });
          done();
        });
      });
    });

    test('should handle requests with invalid ids', done => {
      store.dispatch(retweet(tweetID, token));
      let actions = store.getActions();
      expect(actions[0]).toEqual({
        type: SET_ACTION_STATUS,
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'retweet'
      });

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request
          .respondWith({ status: 404, response: TWEET_NOT_FOUND })
          .then(() => {
            actions = store.getActions();
            expect(actions[1]).toEqual({
              type: SET_ACTION_STATUS,
              actionStatus: FAILED_MESSAGE,
              actionName: 'retweet'
            });
            expect(actions[2]).toEqual({
              type: SET_ERROR_MESSAGE,
              errorMessage: TWEET_NOT_FOUND,
              errorType: INVALID_REQUEST
            });
            done();
          });
      });
    });

    test('should handle unauthorised requests', done => {
      store.dispatch(retweet(tweetID));
      let actions = store.getActions();
      expect(actions[0]).toEqual({
        type: SET_ACTION_STATUS,
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'retweet'
      });

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request
          .respondWith({ status: 401, statusText: UNAUTHORISED })
          .then(() => {
            actions = store.getActions();
            expect(actions[1]).toEqual({
              type: SET_ACTION_STATUS,
              actionStatus: FAILED_MESSAGE,
              actionName: 'retweet'
            });
            expect(actions[2]).toEqual({
              type: SET_ERROR_MESSAGE,
              errorMessage: UNAUTHORISED,
              errorType: AUTHORISATION_ERROR
            });
            done();
          });
      });
    });
  });

  describe('fetchTweets', () => {
    test('should handle successful requests', done => {
      store.dispatch(fetchTweets(userID));
      let actions = store.getActions();
      expect(actions[0]).toEqual({
        type: SET_ACTION_STATUS,
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'fetchTweets'
      });

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({ status: 200, response: tweets }).then(() => {
          actions = store.getActions();
          expect(actions[1]).toEqual({
            type: SET_ACTION_STATUS,
            actionStatus: SUCCESS_MESSAGE,
            actionName: 'fetchTweets'
          });
          expect(actions[2]).toEqual({
            type: SET_USER_TWEETS,
            tweets
          });
          done();
        });
      });
    });

    test('should handle requests with invalid ids', done => {
      store.dispatch(fetchTweets('1234567890'));
      let actions = store.getActions();
      expect(actions[0]).toEqual({
        type: SET_ACTION_STATUS,
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'fetchTweets'
      });

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request
          .respondWith({ status: 404, response: USER_NOT_FOUND })
          .then(() => {
            actions = store.getActions();
            expect(actions[1]).toEqual({
              type: SET_ACTION_STATUS,
              actionStatus: FAILED_MESSAGE,
              actionName: 'fetchTweets'
            });
            expect(actions[2]).toEqual({
              type: SET_ERROR_MESSAGE,
              errorMessage: USER_NOT_FOUND,
              errorType: INVALID_REQUEST
            });
            done();
          });
      });
    });
  });

  describe('deleteTweet', () => {
    test('should handle successful requests', done => {
      store.dispatch(deleteTweet(tweetID, token));
      const deletedTweet = tweet;
      let actions = store.getActions();
      expect(actions[0]).toEqual({
        type: SET_ACTION_STATUS,
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'deleteTweet'
      });

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request
          .respondWith({ status: 200, response: deletedTweet })
          .then(() => {
            actions = store.getActions();
            expect(actions[1]).toEqual({
              type: SET_ACTION_STATUS,
              actionStatus: SUCCESS_MESSAGE,
              actionName: 'deleteTweet'
            });
            expect(actions[2]).toEqual({
              type: SET_USER_TWEETS,
              tweets: tweets.filter(tweet => tweet._id !== deletedTweet._id)
            });
            done();
          });
      });
    });

    test('should handle requests with invalid ids', done => {
      store.dispatch(deleteTweet('1234567890', token));
      let actions = store.getActions();
      expect(actions[0]).toEqual({
        type: SET_ACTION_STATUS,
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'deleteTweet'
      });

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request
          .respondWith({ status: 404, response: TWEET_NOT_FOUND })
          .then(() => {
            actions = store.getActions();
            expect(actions[1]).toEqual({
              type: SET_ACTION_STATUS,
              actionStatus: FAILED_MESSAGE,
              actionName: 'deleteTweet'
            });
            expect(actions[2]).toEqual({
              type: SET_ERROR_MESSAGE,
              errorMessage: TWEET_NOT_FOUND,
              errorType: INVALID_REQUEST
            });
            done();
          });
      });
    });

    test('should handle unauthorised requests', done => {
      store.dispatch(deleteTweet(tweetID));
      let actions = store.getActions();
      expect(actions[0]).toEqual({
        type: SET_ACTION_STATUS,
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'deleteTweet'
      });

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request
          .respondWith({ status: 401, statusText: UNAUTHORISED })
          .then(() => {
            actions = store.getActions();
            expect(actions[1]).toEqual({
              type: SET_ACTION_STATUS,
              actionStatus: FAILED_MESSAGE,
              actionName: 'deleteTweet'
            });
            expect(actions[2]).toEqual({
              type: SET_ERROR_MESSAGE,
              errorMessage: UNAUTHORISED,
              errorType: AUTHORISATION_ERROR
            });
            done();
          });
      });
    });
  });

  describe('likeTweet', () => {
    test('should handle successful requests', done => {
      store.dispatch(likeTweet(tweetID, token));
      let actions = store.getActions();
      expect(actions[0]).toEqual({
        type: SET_ACTION_STATUS,
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'likeTweet'
      });

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({ status: 200 }).then(() => {
          actions = store.getActions();
          expect(actions[1]).toEqual({
            type: SET_ACTION_STATUS,
            actionStatus: SUCCESS_MESSAGE,
            actionName: 'likeTweet'
          });
          done();
        });
      });
    });

    test('should handle requests with invalid ids', done => {
      store.dispatch(likeTweet('1234567890', token));
      let actions = store.getActions();
      expect(actions[0]).toEqual({
        type: SET_ACTION_STATUS,
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'likeTweet'
      });

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request
          .respondWith({ status: 404, response: TWEET_NOT_FOUND })
          .then(() => {
            actions = store.getActions();
            expect(actions[1]).toEqual({
              type: SET_ACTION_STATUS,
              actionStatus: FAILED_MESSAGE,
              actionName: 'likeTweet'
            });
            expect(actions[2]).toEqual({
              type: SET_ERROR_MESSAGE,
              errorMessage: TWEET_NOT_FOUND,
              errorType: INVALID_REQUEST
            });
            done();
          });
      });
    });

    test('should handle unauthorised requests', done => {
      store.dispatch(likeTweet(tweetID));
      let actions = store.getActions();
      expect(actions[0]).toEqual({
        type: SET_ACTION_STATUS,
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'likeTweet'
      });

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request
          .respondWith({ status: 401, statusText: UNAUTHORISED })
          .then(() => {
            actions = store.getActions();
            expect(actions[1]).toEqual({
              type: SET_ACTION_STATUS,
              actionStatus: FAILED_MESSAGE,
              actionName: 'likeTweet'
            });
            expect(actions[2]).toEqual({
              type: SET_ERROR_MESSAGE,
              errorMessage: UNAUTHORISED,
              errorType: AUTHORISATION_ERROR
            });
            done();
          });
      });
    });

    test('should handle requests for already-liked tweets ', done => {
      store.dispatch(likeTweet(tweetID));
      let actions = store.getActions();
      expect(actions[0]).toEqual({
        type: SET_ACTION_STATUS,
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'likeTweet'
      });

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request
          .respondWith({
            status: 400,
            response: HAS_BEEN_LIKED
          })
          .then(() => {
            actions = store.getActions();
            expect(actions[1]).toEqual({
              type: SET_ACTION_STATUS,
              actionStatus: FAILED_MESSAGE,
              actionName: 'likeTweet'
            });
            expect(actions[2]).toEqual({
              type: SET_ERROR_MESSAGE,
              errorMessage: HAS_BEEN_LIKED,
              errorType: INVALID_REQUEST
            });
            done();
          });
      });
    });
  });

  describe('unlikeTweet', () => {
    test('should handle successful requests', done => {
      store.dispatch(unlikeTweet(tweetID, token));
      let actions = store.getActions();
      expect(actions[0]).toEqual({
        type: SET_ACTION_STATUS,
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'unlikeTweet'
      });

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({ status: 200 }).then(() => {
          actions = store.getActions();
          expect(actions[1]).toEqual({
            type: SET_ACTION_STATUS,
            actionStatus: SUCCESS_MESSAGE,
            actionName: 'unlikeTweet'
          });
          done();
        });
      });
    });

    test('should handle requests with invalid ids', done => {
      store.dispatch(unlikeTweet('1234567890', token));
      let actions = store.getActions();
      expect(actions[0]).toEqual({
        type: SET_ACTION_STATUS,
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'unlikeTweet'
      });

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request
          .respondWith({ status: 404, response: TWEET_NOT_FOUND })
          .then(() => {
            actions = store.getActions();
            expect(actions[1]).toEqual({
              type: SET_ACTION_STATUS,
              actionStatus: FAILED_MESSAGE,
              actionName: 'unlikeTweet'
            });
            expect(actions[2]).toEqual({
              type: SET_ERROR_MESSAGE,
              errorMessage: TWEET_NOT_FOUND,
              errorType: INVALID_REQUEST
            });
            done();
          });
      });
    });

    test('should handle unauthorised requests', done => {
      store.dispatch(unlikeTweet(tweetID));
      let actions = store.getActions();
      expect(actions[0]).toEqual({
        type: SET_ACTION_STATUS,
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'unlikeTweet'
      });

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request
          .respondWith({ status: 401, statusText: UNAUTHORISED })
          .then(() => {
            actions = store.getActions();
            expect(actions[1]).toEqual({
              type: SET_ACTION_STATUS,
              actionStatus: FAILED_MESSAGE,
              actionName: 'unlikeTweet'
            });
            expect(actions[2]).toEqual({
              type: SET_ERROR_MESSAGE,
              errorMessage: UNAUTHORISED,
              errorType: AUTHORISATION_ERROR
            });
            done();
          });
      });
    });

    test('should handle requests for tweets user has not yet liked ', done => {
      store.dispatch(unlikeTweet(tweetID));
      let actions = store.getActions();
      expect(actions[0]).toEqual({
        type: SET_ACTION_STATUS,
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'unlikeTweet'
      });

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request
          .respondWith({ status: 400, response: HAS_NOT_BEEN_LIKED })
          .then(() => {
            actions = store.getActions();
            expect(actions[1]).toEqual({
              type: SET_ACTION_STATUS,
              actionStatus: FAILED_MESSAGE,
              actionName: 'unlikeTweet'
            });
            expect(actions[2]).toEqual({
              type: SET_ERROR_MESSAGE,
              errorMessage: HAS_NOT_BEEN_LIKED,
              errorType: INVALID_REQUEST
            });
            done();
          });
      });
    });
  });
});
