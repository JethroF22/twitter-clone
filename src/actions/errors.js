import { actionTypes } from '../config/const.json';

const { SET_ERROR_MESSAGE } = actionTypes.error;

export const setError = ({ errorType, errorMessage }) => ({
  type: SET_ERROR_MESSAGE,
  errorType,
  errorMessage
});
