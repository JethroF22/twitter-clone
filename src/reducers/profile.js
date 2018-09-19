import { actionTypes } from '../config/const.json';
const { SET_USER_PROFILE } = actionTypes.profile;

export default (state = {}, action) => {
  switch (action.type) {
    case SET_USER_PROFILE:
      return { ...state, userProfile: action.userProfile };
    default:
      break;
  }
};
