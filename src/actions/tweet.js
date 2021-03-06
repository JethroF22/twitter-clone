import axios from 'axios';

import { setActionStatus } from './status';
import { setError } from './error';
import {
  actionStatusMessages,
  errorTypes,
  errorMessages,
  actionTypes
} from '../../config/const.json';

const { UPDATE_USER_TWEETS, SET_USER_TWEETS } = actionTypes.tweet;
const {
  IN_PROGRESS_MESSAGE,
  SUCCESS_MESSAGE,
  FAILED_MESSAGE
} = actionStatusMessages;
const {
  HAS_BEEN_LIKED,
  HAS_NOT_BEEN_LIKED,
  TWEET_NOT_FOUND,
  TWEETS_NOT_FOUND,
  UNKNOWN_ERROR,
  UNAUTHORISED,
  USER_NOT_FOUND
} = errorMessages;
const { DB_ERROR, AUTHORISATION_ERROR, INVALID_REQUEST } = errorTypes;

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
        if (err.response.statusText == UNAUTHORISED) {
          dispatch(
            setError({
              errorType: AUTHORISATION_ERROR,
              errorMessage: UNAUTHORISED
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
        if (err.response) {
          if (err.response.data == TWEET_NOT_FOUND) {
            dispatch(
              setError({
                errorType: INVALID_REQUEST,
                errorMessage: TWEET_NOT_FOUND
              })
            );
          } else if (err.response.statusText == UNAUTHORISED) {
            dispatch(
              setError({
                errorType: AUTHORISATION_ERROR,
                errorMessage: UNAUTHORISED
              })
            );
          }
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
        if (err.response.data) {
          if (err.response.data == USER_NOT_FOUND) {
            dispatch(
              setError({
                errorType: INVALID_REQUEST,
                errorMessage: USER_NOT_FOUND
              })
            );
          } else if (err.response.data == TWEETS_NOT_FOUND) {
            dispatch(
              setError({
                errorType: INVALID_REQUEST,
                errorMessage: TWEETS_NOT_FOUND
              })
            );
          }
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

export const deleteTweet = (id, token) => {
  return (dispatch, getState) => {
    const url = `${apiUrl}/tweet/delete/${id}`;
    dispatch(
      setActionStatus({
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'deleteTweet'
      })
    );
    return axios({
      method: 'delete',
      url,
      headers: {
        'x-token': token
      }
    })
      .then(res => {
        const deletedTweet = res.data;
        let tweets = getState().tweet.tweets;

        tweets = tweets.filter(tweet => tweet._id !== deletedTweet._id);

        dispatch(
          setActionStatus({
            actionStatus: SUCCESS_MESSAGE,
            actionName: 'deleteTweet'
          })
        );

        dispatch(setUserTweets(tweets));
      })
      .catch(err => {
        dispatch(
          setActionStatus({
            actionStatus: FAILED_MESSAGE,
            actionName: 'deleteTweet'
          })
        );
        if (err.response) {
          if (err.response.statusText == UNAUTHORISED) {
            dispatch(
              setError({
                errorType: AUTHORISATION_ERROR,
                errorMessage: UNAUTHORISED
              })
            );
          } else if (err.response.data == TWEET_NOT_FOUND) {
            dispatch(
              setError({
                errorType: INVALID_REQUEST,
                errorMessage: TWEET_NOT_FOUND
              })
            );
          }
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

export const likeTweet = (id, token) => {
  return dispatch => {
    const url = `${apiUrl}/tweet/like/${id}`;
    dispatch(
      setActionStatus({
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'likeTweet'
      })
    );
    return axios({
      method: 'patch',
      url,
      headers: {
        'x-token': token
      }
    })
      .then(res => {
        dispatch(
          setActionStatus({
            actionStatus: SUCCESS_MESSAGE,
            actionName: 'likeTweet'
          })
        );
      })
      .catch(err => {
        dispatch(
          setActionStatus({
            actionStatus: FAILED_MESSAGE,
            actionName: 'likeTweet'
          })
        );
        if (err.response) {
          if (err.response.statusText == UNAUTHORISED) {
            dispatch(
              setError({
                errorType: AUTHORISATION_ERROR,
                errorMessage: UNAUTHORISED
              })
            );
          } else if (err.response.data == TWEET_NOT_FOUND) {
            dispatch(
              setError({
                errorType: INVALID_REQUEST,
                errorMessage: TWEET_NOT_FOUND
              })
            );
          } else if (err.response.data == HAS_BEEN_LIKED) {
            dispatch(
              setError({
                errorType: INVALID_REQUEST,
                errorMessage: HAS_BEEN_LIKED
              })
            );
          }
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

export const unlikeTweet = (id, token) => {
  return dispatch => {
    const url = `${apiUrl}/tweet/unlike/${id}`;
    dispatch(
      setActionStatus({
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'unlikeTweet'
      })
    );
    return axios({
      method: 'patch',
      url,
      headers: {
        'x-token': token
      }
    })
      .then(res => {
        dispatch(
          setActionStatus({
            actionStatus: SUCCESS_MESSAGE,
            actionName: 'unlikeTweet'
          })
        );
      })
      .catch(err => {
        dispatch(
          setActionStatus({
            actionStatus: FAILED_MESSAGE,
            actionName: 'unlikeTweet'
          })
        );
        if (err.response) {
          if (err.response.statusText == UNAUTHORISED) {
            dispatch(
              setError({
                errorType: AUTHORISATION_ERROR,
                errorMessage: UNAUTHORISED
              })
            );
          } else if (err.response.data == TWEET_NOT_FOUND) {
            dispatch(
              setError({
                errorType: INVALID_REQUEST,
                errorMessage: TWEET_NOT_FOUND
              })
            );
          } else if (err.response.data == HAS_NOT_BEEN_LIKED) {
            dispatch(
              setError({
                errorType: INVALID_REQUEST,
                errorMessage: HAS_NOT_BEEN_LIKED
              })
            );
          }
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
