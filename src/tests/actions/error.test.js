import { setError } from '../../actions/error';
import {
  actionTypes,
  errorTypes,
  errorMessages
} from '../../../config/const.json';

const { SET_ERROR_MESSAGE } = actionTypes.error;
const { UNKNOWN_ERROR } = errorMessages;
const { DB_ERROR } = errorTypes;

let actionObject = {
  errorMessage: UNKNOWN_ERROR,
  errorType: DB_ERROR
};

test('should create the action object', () => {
  const action = setError(actionObject);
  expect(action).toEqual({ type: SET_ERROR_MESSAGE, ...actionObject });
});
