import axios from 'axios';

import { setActionStatus } from './status';
import { setError } from './error';
import {
  actionStatusMessages,
  errorTypes,
  errorMessages
} from '../config/const.json';

const {
  IN_PROGRESS_MESSAGE,
  SUCCESS_MESSAGE,
  FAILED_MESSAGE
} = actionStatusMessages;
const { DUPLICATE_EMAIL, UNKNOWN_ERROR } = errorMessages;
const { DB_ERROR } = errorTypes;

const apiUrl = process.env.API_URL || '';

export const setUserDetails = ({ username, handle } = { ...userDetails }) => ({
  type: 'SET_USER_DETAILS',
  username,
  handle
});

export const setToken = token => ({ type: 'SET_TOKEN', token });

export const registerUser = credentials => {
  return dispatch => {
    const url = `${apiUrl}/auth/register`;
    dispatch(
      setActionStatus({
        status: IN_PROGRESS_MESSAGE,
        actionName: 'registerUser'
      })
    );
    return axios({ url, data: credentials, method: 'post' })
      .then(res => {
        const user = res.data;
        const token = res.headers['x-auth'];

        localStorage.setItem('auth-token', token);

        dispatch(
          setActionStatus({
            status: SUCCESS_MESSAGE,
            actionName: 'registerUser'
          })
        );
        dispatch(setUserDetails(user));
        dispatch(setToken(token));
      })
      .catch(err => {
        const errors = err.response.data;
        if (
          errors.length === 1 &&
          errors[0] === 'This email is already in use'
        ) {
          dispatch(
            setError({
              errorType: DB_ERROR,
              errorMessage: DUPLICATE_EMAIL
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
        dispatch(
          setActionStatus({
            status: FAILED_MESSAGE,
            actionName: 'registerUser'
          })
        );
      });
  };
};
