import axios from 'axios';

import { setActionStatus } from './status';
import { setError } from './error';
import {
  actionStatusMessages,
  actionTypes,
  errorMessages,
  errorTypes
} from '../../config/const.json';

const { SET_USER_PROFILE, VIEW_PROFILE } = actionTypes.profile;
const {
  FAILED_MESSAGE,
  IN_PROGRESS_MESSAGE,
  SUCCESS_MESSAGE
} = actionStatusMessages;
const {
  CANT_BE_FOLLOWED,
  HAS_BEEN_FOLLOWED,
  HAS_NOT_BEEN_FOLLOWED,
  UNKNOWN_ERROR,
  UNAUTHORISED,
  USER_NOT_FOUND
} = errorMessages;
const { AUTHORISATION_ERROR, DB_ERROR, INVALID_REQUEST } = errorTypes;

const apiUrl = process.env.API_URL || '';

export const setUserProfile = userProfile => ({
  type: SET_USER_PROFILE,
  userProfile
});

export const viewUserProfile = profile => ({
  type: VIEW_PROFILE,
  profile
});

export const getUserProfile = (id, currentUser) => {
  return dispatch => {
    const url = `${apiUrl}/profile/view/${id}`;
    dispatch(
      setActionStatus({
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'getUserProfile'
      })
    );
    return axios({ method: 'get', url })
      .then(res => {
        const userProfile = res.data;

        if (userProfile.name === currentUser) {
          dispatch(setUserProfile(userProfile));
        } else {
          dispatch(viewUserProfile(userProfile));
        }

        dispatch(
          setActionStatus({
            actionStatus: SUCCESS_MESSAGE,
            actionName: 'getUserProfile'
          })
        );
      })
      .catch(err => {
        dispatch(
          setActionStatus({
            actionStatus: FAILED_MESSAGE,
            actionName: 'getUserProfile'
          })
        );
        if (err.response.data && err.response.data == USER_NOT_FOUND) {
          dispatch(
            setError({
              errorType: INVALID_REQUEST,
              errorMessage: USER_NOT_FOUND
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

export const followUser = (id, token) => {
  return dispatch => {
    const url = `${apiUrl}/profile/follow/${id}`;
    dispatch(
      setActionStatus({
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'followUser'
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
        const userProfile = res.data.user;
        const viewedProfile = res.data.followedUser;

        dispatch(
          setActionStatus({
            actionStatus: SUCCESS_MESSAGE,
            actionName: 'followUser'
          })
        );

        dispatch(setUserProfile(userProfile));
        dispatch(viewUserProfile(viewedProfile));
      })
      .catch(err => {
        dispatch(
          setActionStatus({
            actionStatus: FAILED_MESSAGE,
            actionName: 'followUser'
          })
        );
        if (err.response) {
          if (err.response.data == USER_NOT_FOUND) {
            dispatch(
              setError({
                errorType: INVALID_REQUEST,
                errorMessage: USER_NOT_FOUND
              })
            );
          } else if (err.response.statusText == UNAUTHORISED) {
            dispatch(
              setError({
                errorType: AUTHORISATION_ERROR,
                errorMessage: UNAUTHORISED
              })
            );
          } else if (err.response.data == HAS_BEEN_FOLLOWED) {
            dispatch(
              setError({
                errorType: INVALID_REQUEST,
                errorMessage: HAS_BEEN_FOLLOWED
              })
            );
          } else if (err.response.data == CANT_BE_FOLLOWED) {
            dispatch(
              setError({
                errorType: INVALID_REQUEST,
                errorMessage: CANT_BE_FOLLOWED
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

export const unfollowUser = (id, token) => {
  return dispatch => {
    const url = `${apiUrl}/profile/follow/${id}`;
    dispatch(
      setActionStatus({
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'unfollowUser'
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
        const userProfile = res.data.user;
        const viewedProfile = res.data.followedUser;

        dispatch(
          setActionStatus({
            actionStatus: SUCCESS_MESSAGE,
            actionName: 'unfollowUser'
          })
        );

        dispatch(setUserProfile(userProfile));
        dispatch(viewUserProfile(viewedProfile));
      })
      .catch(err => {
        dispatch(
          setActionStatus({
            actionStatus: FAILED_MESSAGE,
            actionName: 'unfollowUser'
          })
        );
        if (err.response) {
          if (err.response.data == USER_NOT_FOUND) {
            dispatch(
              setError({
                errorType: INVALID_REQUEST,
                errorMessage: USER_NOT_FOUND
              })
            );
          } else if (err.response.data == HAS_NOT_BEEN_FOLLOWED) {
            dispatch(
              setError({
                errorType: INVALID_REQUEST,
                errorMessage: HAS_NOT_BEEN_FOLLOWED
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

export const editProfile = (token, updates) => {
  return dispatch => {
    const url = `${apiUrl}/profile/edit/`;
    dispatch(
      setActionStatus({
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'editProfile'
      })
    );
    return axios({
      method: 'patch',
      url,
      data: updates,
      headers: { 'x-token': token }
    })
      .then(res => {
        const userProfile = res.data;

        dispatch(
          setActionStatus({
            actionStatus: SUCCESS_MESSAGE,
            actionName: 'editProfile'
          })
        );

        dispatch(setUserProfile(userProfile));
      })
      .catch(err => {
        dispatch(
          setActionStatus({
            actionStatus: FAILED_MESSAGE,
            actionName: 'editProfile'
          })
        );
        if (err.response && err.response.statusText == UNAUTHORISED) {
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
