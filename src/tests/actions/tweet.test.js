import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';

import {
  updateUserTweets,
  createTweet,
  retweet,
  setUserTweets,
  fetchTweets
} from '../../actions/tweet';
import {
  actionTypes,
  actionStatusMessages,
  errorMessages,
  errorTypes
} from '../../config/const.json';
import { tweets, userID } from '../seed/seed';

const { SET_ACTION_STATUS } = actionTypes.status;
const { SET_ERROR_MESSAGE } = actionTypes.error;
const {
  SUCCESS_MESSAGE,
  IN_PROGRESS_MESSAGE,
  FAILED_MESSAGE
} = actionStatusMessages;
const { UPDATE_USER_TWEETS, SET_USER_TWEETS } = actionTypes.tweet;
const { INVALID_TOKEN, TWEET_NOT_FOUND, NON_EXISTENT_USER } = errorMessages;
const { AUTHORISATION_ERROR, INVALID_ID } = errorTypes;

const createMockStore = configureMockStore([thunk]);
let store, tweet;

describe('tweet actions', () => {
  beforeEach(() => {
    store = createMockStore();
    tweet = tweets[0];
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
      store.dispatch(createTweet(tweet));
      const actions = store.getActions();
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
            const actions = store.getActions();
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
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: SET_ACTION_STATUS,
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'createTweet'
      });

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request
          .respondWith({ status: 401, statusText: 'Unauthorised' })
          .then(() => {
            const actions = store.getActions();
            expect(actions[1]).toEqual({
              type: SET_ACTION_STATUS,
              actionStatus: FAILED_MESSAGE,
              actionName: 'createTweet'
            });
            expect(actions[2]).toEqual({
              type: SET_ERROR_MESSAGE,
              errorMessage: INVALID_TOKEN,
              errorType: AUTHORISATION_ERROR
            });
            done();
          });
      });
    });
  });

  describe('retweet', () => {
    test('should handle successful requests', done => {
      store.dispatch(retweet(tweet));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: SET_ACTION_STATUS,
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'retweet'
      });

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({ status: 200, response: tweet }).then(() => {
          const actions = store.getActions();
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
      store.dispatch(retweet(tweet));
      const actions = store.getActions();
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
            const actions = store.getActions();
            expect(actions[1]).toEqual({
              type: SET_ACTION_STATUS,
              actionStatus: FAILED_MESSAGE,
              actionName: 'retweet'
            });
            expect(actions[2]).toEqual({
              type: SET_ERROR_MESSAGE,
              errorMessage: TWEET_NOT_FOUND,
              errorType: INVALID_ID
            });
            done();
          });
      });
    });
  });

  describe('fetchTweets', () => {
    test('should handle successful requests', done => {
      store.dispatch(fetchTweets(userID));
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: SET_ACTION_STATUS,
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'fetchTweets'
      });

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({ status: 200, response: tweets }).then(() => {
          const actions = store.getActions();
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
      const actions = store.getActions();
      expect(actions[0]).toEqual({
        type: SET_ACTION_STATUS,
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'fetchTweets'
      });

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request
          .respondWith({ status: 404, response: NON_EXISTENT_USER })
          .then(() => {
            const actions = store.getActions();
            expect(actions[1]).toEqual({
              type: SET_ACTION_STATUS,
              actionStatus: FAILED_MESSAGE,
              actionName: 'fetchTweets'
            });
            expect(actions[2]).toEqual({
              type: SET_ERROR_MESSAGE,
              errorMessage: NON_EXISTENT_USER,
              errorType: INVALID_ID
            });
            done();
          });
      });
    });
  });
});
