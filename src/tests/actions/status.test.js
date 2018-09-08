import { setActionStatus } from '../../actions/status';
import { actionTypes, actionStatusMessages } from '../../config/const.json';

const { SET_ACTION_STATUS } = actionTypes.status;
const { SUCCESS_MESSAGE } = actionStatusMessages;

let actionObject = {
  actionName: 'action',
  actionStatus: SUCCESS_MESSAGE
};

test('should create the action object', () => {
  const action = setActionStatus(actionObject);
  expect(action).toEqual({
    type: SET_ACTION_STATUS,
    ...actionObject
  });
});
