import errorReducer from '../../reducers/error';

import { actionTypes } from '../../../config/const.json';
const { SET_ERROR_MESSAGE } = actionTypes.error;

test('should set the error type and message', () => {
  const error = {
    errorType: 'Testing error',
    errorMessage: 'This is a test error'
  };
  const state = errorReducer({}, { type: SET_ERROR_MESSAGE, ...error });
  expect(state).toEqual(error);
});
