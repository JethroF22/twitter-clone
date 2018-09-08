import authReducer from '../../reducers/auth';

import { actionTypes } from '../../config/const.json';
const { SET_USER_DETAILS, SET_TOKEN } = actionTypes.auth;

test('should set the user details', () => {
  const userDetails = {
    name: 'Jethro',
    handle: 'IamKing'
  };
  const state = authReducer({}, { type: SET_USER_DETAILS, ...userDetails });
  expect(state).toEqual(userDetails);
});

test('should set the user token', () => {
  const token = '1234567890';
  const state = authReducer({}, { type: SET_TOKEN, token });
  expect(state).toEqual({ token });
});
