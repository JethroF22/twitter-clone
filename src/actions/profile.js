import axios from 'axios';

import { setActionStatus } from './status';
import { setError } from './error';
import {
  actionStatusMessages,
  errorTypes,
  errorMessages,
  actionTypes
} from '../config/const.json';

const { SET_USER_PROFILE, VIEW_PROFILE } = actionTypes.profile;
const {
  IN_PROGRESS_MESSAGE,
  SUCCESS_MESSAGE,
  FAILED_MESSAGE
} = actionStatusMessages;
const { UNKNOWN_ERROR, NON_EXISTENT_USER } = errorMessages;
const { DB_ERROR, INVALID_REQUEST } = errorTypes;

const apiUrl = process.env.API_URL || '';

export const setUserProfile = userProfile => ({
  type: SET_USER_PROFILE,
  userProfile
});

export const viewUserProfile = profile => ({
  type: VIEW_PROFILE,
  profile
});

export const getUserProfile = id => {
  return dispatch => {
    const url = `${apiUrl}/profile/view/${id}`;
    dispatch(
      setActionStatus({
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'getUserProfile'
      })
    );
    return axios({
      method: 'get',
      url
    })
      .then(res => {
        const userProfile = res.data;

        dispatch(
          setActionStatus({
            actionStatus: SUCCESS_MESSAGE,
            actionName: 'getUserProfile'
          })
        );

        dispatch(setUserProfile(userProfile));
      })
      .catch(err => {
        dispatch(
          setActionStatus({
            actionStatus: FAILED_MESSAGE,
            actionName: 'getUserProfile'
          })
        );
        if (err.response.data && err.response.data == NON_EXISTENT_USER) {
          dispatch(
            setError({
              errorType: INVALID_REQUEST,
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
