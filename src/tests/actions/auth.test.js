import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';

import { registerUser, setUserDetails, setToken } from '../../actions/auth';
import users from '../seed/seed';
import {
  actionTypes,
  actionStatusMessages,
  errorMessages,
  errorTypes
} from '../../config/const.json';

const { SET_USER_DETAILS, SET_TOKEN } = actionTypes.auth;
const { SET_ACTION_STATUS } = actionTypes.status;
const { SET_ERROR_MESSAGE } = actionTypes.error;
const {
  SUCCESS_MESSAGE,
  IN_PROGRESS_MESSAGE,
  FAILED_MESSAGE
} = actionStatusMessages;
const { UNKNOWN_ERROR } = errorMessages;
const { DB_ERROR } = errorTypes;

const createMockStore = configureMockStore([thunk]);

let store,
  user,
  token = '1234567890';

describe('auth actions', () => {
  describe('registerUser', () => {
    beforeEach(() => {
      store = createMockStore();
      user = users[0];
      moxios.install();
    });

    afterEach(() => {
      moxios.uninstall();
    });

    test('should handle successful registration requests', done => {
      store.dispatch(registerUser(user));

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request
          .respondWith({
            status: 200,
            response: user,
            headers: {
              'x-auth': token
            }
          })
          .then(() => {
            const actions = store.getActions();
            expect(actions[0]).toEqual({
              type: SET_ACTION_STATUS,
              actionStatus: IN_PROGRESS_MESSAGE,
              actionName: 'registerUser'
            });
            expect(actions[1]).toEqual({
              type: SET_ACTION_STATUS,
              actionStatus: SUCCESS_MESSAGE,
              actionName: 'registerUser'
            });
            expect(actions[2]).toEqual({
              type: SET_USER_DETAILS,
              username: user.username,
              handle: user.handle
            });
            expect(actions[3]).toEqual({ type: SET_TOKEN, token });
            done();
          });
      });
    });

    test('should handle erroneous registration requests', done => {
      store.dispatch(registerUser());

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request
          .respondWith({
            status: 400,
            response: {
              data: ['This email is already in use']
            }
          })
          .then(() => {
            const actions = store.getActions();
            expect(actions[0]).toEqual({
              type: SET_ACTION_STATUS,
              actionStatus: IN_PROGRESS_MESSAGE,
              actionName: 'registerUser'
            });
            expect(actions[1]).toEqual({
              type: SET_ERROR_MESSAGE,
              errorMessage: UNKNOWN_ERROR,
              errorType: DB_ERROR
            });
            expect(actions[2]).toEqual({
              type: SET_ACTION_STATUS,
              actionStatus: FAILED_MESSAGE,
              actionName: 'registerUser'
            });
            done();
          });
      });
    });
  });

  describe('setUserDetails', () => {
    test('should create the action object ', () => {
      const action = setUserDetails(user);
      expect(action).toEqual({
        type: SET_USER_DETAILS,
        username: user.username,
        handle: user.handle
      });
    });
  });

  describe('setToken', () => {
    test('should create the action object ', () => {
      const action = setToken(token);
      expect(action).toEqual({
        type: SET_TOKEN,
        token
      });
    });
  });
});
