import axios from 'axios';

import { setActionStatus } from './status';
import { setError } from './error';
import {
  actionStatusMessages,
  errorTypes,
  errorMessages,
  actionTypes
} from '../../config/const.json';

const { SET_USER_DETAILS, SET_TOKEN } = actionTypes.auth;
const {
  IN_PROGRESS_MESSAGE,
  SUCCESS_MESSAGE,
  FAILED_MESSAGE
} = actionStatusMessages;
const {
  DUPLICATE_EMAIL,
  DUPLICATE_HANDLE,
  UNKNOWN_ERROR,
  INVALID_CREDENTIALS
} = errorMessages;
const { DB_ERROR, AUTHENTICATION_ERROR } = errorTypes;

const apiUrl = process.env.API_URL || '';

export const setUserDetails = ({ name, handle } = { ...userDetails }) => ({
  type: SET_USER_DETAILS,
  name,
  handle
});

export const setToken = token => ({ type: SET_TOKEN, token });

export const registerUser = credentials => {
  return dispatch => {
    const url = `${apiUrl}/auth/register`;
    dispatch(
      setActionStatus({
        actionStatus: IN_PROGRESS_MESSAGE,
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
            actionStatus: SUCCESS_MESSAGE,
            actionName: 'registerUser'
          })
        );
        dispatch(setUserDetails(user));
        dispatch(setToken(token));
      })
      .catch(err => {
        const errors = err.response.data;
        if (errors.length === 1) {
          dispatch(
            setError({
              errorType: DB_ERROR,
              errorMessage:
                errors[0] === DUPLICATE_EMAIL
                  ? DUPLICATE_EMAIL
                  : DUPLICATE_HANDLE
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
            actionStatus: FAILED_MESSAGE,
            actionName: 'registerUser'
          })
        );
      });
  };
};

export const logIn = credentials => {
  return dispatch => {
    const url = `${apiUrl}/auth/login`;
    dispatch(
      setActionStatus({
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'logIn'
      })
    );
    return axios({
      url,
      data: credentials,
      method: 'post'
    })
      .then(res => {
        const user = res.data;
        const token = res.headers['x-auth'];

        localStorage.setItem('auth-token', token);

        dispatch(
          setActionStatus({
            actionStatus: SUCCESS_MESSAGE,
            actionName: 'logIn'
          })
        );
        dispatch(setUserDetails(user));
        dispatch(setToken(token));
      })
      .catch(err => {
        dispatch(
          setError({
            errorType: AUTHENTICATION_ERROR,
            errorMessage: INVALID_CREDENTIALS
          })
        );
        dispatch(
          setActionStatus({
            actionStatus: FAILED_MESSAGE,
            actionName: 'logIn'
          })
        );
      });
  };
};
