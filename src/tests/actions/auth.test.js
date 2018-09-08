import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';

import {
  registerUser,
  setUserDetails,
  setToken,
  logIn
} from '../../actions/auth';
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
const { UNKNOWN_ERROR, INVALID_CREDENTIALS } = errorMessages;
const { DB_ERROR, AUTHENTICATION_ERROR } = errorTypes;

const createMockStore = configureMockStore([thunk]);

let store,
  user,
  token = '1234567890';

describe('auth actions', () => {
  beforeEach(() => {
    store = createMockStore();
    user = users[0];
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  describe('setUserDetails', () => {
    test('should create the action object ', () => {
      const action = setUserDetails(user);
      expect(action).toEqual({
        type: SET_USER_DETAILS,
        name: user.name,
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

  describe('async actions', () => {
    describe('registerUser', () => {
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
                name: user.name,
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
                data: [
                  {
                    msg: 'Path `name` is required'
                  },
                  {
                    msg: 'Path `password` is required'
                  },
                  {
                    msg: 'Path `handle` is required'
                  },
                  {
                    msg: 'Path `email` is required'
                  }
                ]
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

    describe('logIn', () => {
      test('should handle successful log-in request', done => {
        store.dispatch(logIn(user));

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
                actionName: 'logIn'
              });
              expect(actions[1]).toEqual({
                type: SET_ACTION_STATUS,
                actionStatus: SUCCESS_MESSAGE,
                actionName: 'logIn'
              });
              expect(actions[2]).toEqual({
                type: SET_USER_DETAILS,
                name: user.name,
                handle: user.handle
              });
              expect(actions[3]).toEqual({ type: SET_TOKEN, token });
              done();
            });
        });
      });

      test('should handle erroneous log-in requests', done => {
        user = {
          ...user,
          password: '12345678'
        };
        store.dispatch(logIn(user));

        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          request
            .respondWith({
              status: 400,
              response: {
                msg: INVALID_CREDENTIALS
              }
            })
            .then(() => {
              const actions = store.getActions();
              expect(actions[0]).toEqual({
                type: SET_ACTION_STATUS,
                actionStatus: IN_PROGRESS_MESSAGE,
                actionName: 'logIn'
              });
              expect(actions[1]).toEqual({
                type: SET_ERROR_MESSAGE,
                errorMessage: INVALID_CREDENTIALS,
                errorType: AUTHENTICATION_ERROR
              });
              expect(actions[2]).toEqual({
                type: SET_ACTION_STATUS,
                actionStatus: FAILED_MESSAGE,
                actionName: 'logIn'
              });
              done();
            });
        });
      });
    });
  });
});
