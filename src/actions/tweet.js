import axios from 'axios';

import { setActionStatus } from './status';
import { setError } from './error';
import {
  actionStatusMessages,
  errorTypes,
  errorMessages,
  actionTypes
} from '../config/const.json';

const { UPDATE_USER_TWEETS } = actionTypes.tweet;
const {
  IN_PROGRESS_MESSAGE,
  SUCCESS_MESSAGE,
  FAILED_MESSAGE
} = actionStatusMessages;
const { UNKNOWN_ERROR, INVALID_TOKEN } = errorMessages;
const { DB_ERROR, AUTHORISATION_ERROR } = errorTypes;

const apiUrl = process.env.API_URL || '';

export const updateUserTweets = tweet => ({ type: UPDATE_USER_TWEETS, tweet });

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
