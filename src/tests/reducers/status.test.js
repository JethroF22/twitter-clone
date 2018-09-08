import statusReducer from '../../reducers/status';

import { actionTypes } from '../../config/const.json';
const { SET_ACTION_STATUS } = actionTypes.status;

test('should set the action name and status', () => {
  const actionStatus = {
    actionStatus: 'Testing',
    actionName: 'Action Status Test'
  };
  const state = statusReducer({}, { type: SET_ACTION_STATUS, ...actionStatus });
  expect(state).toEqual(actionStatus);
});
