import axios from 'axios';

import { setActionStatus } from './status';
import { setError } from './error';
import {
  actionStatusMessages,
  errorTypes,
  errorMessages,
  actionTypes
} from '../config/const.json';

const { UPDATE_USER_TWEETS, SET_USER_TWEETS } = actionTypes.tweet;
const {
  IN_PROGRESS_MESSAGE,
  SUCCESS_MESSAGE,
  FAILED_MESSAGE
} = actionStatusMessages;
const {
  UNKNOWN_ERROR,
  INVALID_TOKEN,
  TWEET_NOT_FOUND,
  NON_EXISTENT_USER
} = errorMessages;
const { DB_ERROR, AUTHORISATION_ERROR, INVALID_ID } = errorTypes;

const apiUrl = process.env.API_URL || '';

export const updateUserTweets = tweet => ({ type: UPDATE_USER_TWEETS, tweet });

export const setUserTweets = tweets => ({ type: SET_USER_TWEETS, tweets });

export const createTweet = (tweet, token) => {
  return dispatch => {
    const url = `${apiUrl}/tweet/create`;
    dispatch(
      setActionStatus({
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'createTweet'
      })
    );
    return axios({
      method: 'post',
      url,
      data: tweet,
      headers: {
        'x-token': token
      }
    })
      .then(res => {
        const tweet = res.data;

        dispatch(
          setActionStatus({
            actionStatus: SUCCESS_MESSAGE,
            actionName: 'createTweet'
          })
        );
        dispatch(updateUserTweets(tweet));
      })
      .catch(err => {
        dispatch(
          setActionStatus({
            actionStatus: FAILED_MESSAGE,
            actionName: 'createTweet'
          })
        );
        if (err.response.statusText == 'Unauthorised') {
          dispatch(
            setError({
              errorType: AUTHORISATION_ERROR,
              errorMessage: INVALID_TOKEN
            })
          );
        } else {
          dispatch(
            setError({
              errorType: DB_ERROR,
              errorMessage: UNKNOWN_ERROR
            })
          );
        }
      });
  };
};

export const retweet = (id, token) => {
  return dispatch => {
    const url = `${apiUrl}/tweet/retweet/${id}`;
    dispatch(
      setActionStatus({
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'retweet'
      })
    );
    return axios({
      url,
      method: 'patch',
      headers: {
        'x-token': token
      }
    })
      .then(res => {
        dispatch(
          setActionStatus({
            actionStatus: SUCCESS_MESSAGE,
            actionName: 'retweet'
          })
        );

        const tweet = res.data;
        dispatch(updateUserTweets(tweet));
      })
      .catch(err => {
        dispatch(
          setActionStatus({
            actionStatus: FAILED_MESSAGE,
            actionName: 'retweet'
          })
        );
        if (err.response.data == TWEET_NOT_FOUND) {
          dispatch(
            setError({
              errorType: INVALID_ID,
              errorMessage: TWEET_NOT_FOUND
            })
          );
        } else {
          dispatch(
            setError({
              errorType: DB_ERROR,
              errorMessage: UNKNOWN_ERROR
            })
          );
        }
      });
  };
};

export const fetchTweets = id => {
  return dispatch => {
    const url = `${apiUrl}/tweet/fetch_tweets/${id}`;
    dispatch(
      setActionStatus({
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'fetchTweets'
      })
    );
    return axios({ url, method: 'get' })
      .then(res => {
        dispatch(
          setActionStatus({
            actionStatus: SUCCESS_MESSAGE,
            actionName: 'fetchTweets'
          })
        );

        const tweets = res.data;
        dispatch(setUserTweets(tweets));
      })
      .catch(err => {
        dispatch(
          setActionStatus({
            actionStatus: FAILED_MESSAGE,
            actionName: 'fetchTweets'
          })
        );
        if (err.response.data && err.response.data == NON_EXISTENT_USER) {
          dispatch(
            setError({
              errorType: INVALID_ID,
              errorMessage: NON_EXISTENT_USER
            })
          );
        } else {
          dispatch(
            setError({
              errorType: DB_ERROR,
              errorMessage: UNKNOWN_ERROR
            })
          );
        }
      });
  };
};
