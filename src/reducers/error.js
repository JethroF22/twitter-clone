import { actionTypes } from '../../config/const.json';

const { SET_ERROR_MESSAGE } = actionTypes.error;

export default (state = {}, action) => {
  switch (action.type) {
    case SET_ERROR_MESSAGE:
      return { errorType: action.errorType, errorMessage: action.errorMessage };
    default:
      return state;
  }
};
