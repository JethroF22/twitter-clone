import { actionTypes } from '../config/const.json';

const { SET_ACTION_STATUS } = actionTypes.status;

export const setActionStatus = ({ actionStatus, actionName }) => ({
  type: SET_ACTION_STATUS,
  actionStatus,
  actionName
});
