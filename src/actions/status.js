import { actionTypes } from '../config/const.json';

const { SET_ACTION_STATUS } = actionTypes.error;

export const setActionStatus = ({ status, actionName }) => ({
  type: SET_ACTION_STATUS,
  status,
  actionName
});
