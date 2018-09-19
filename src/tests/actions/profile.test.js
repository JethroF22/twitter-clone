import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';

import { setUserProfile, getUserProfile } from '../../actions/profile';
import {
  actionTypes,
  actionStatusMessages,
  errorMessages,
  errorTypes
} from '../../config/const.json';
import { userID, userProfiles } from '../seed/seed';

const { SET_ACTION_STATUS } = actionTypes.status;
const { SET_ERROR_MESSAGE } = actionTypes.error;
const {
  SUCCESS_MESSAGE,
  IN_PROGRESS_MESSAGE,
  FAILED_MESSAGE
} = actionStatusMessages;
const { SET_USER_PROFILE } = actionTypes.profile;
const {
  UNAUTHORISED,
  TWEET_NOT_FOUND,
  NON_EXISTENT_USER,
  HAS_BEEN_LIKED,
  HAS_NOT_BEEN_LIKED
} = errorMessages;
const { AUTHORISATION_ERROR, INVALID_REQUEST } = errorTypes;

const createMockStore = configureMockStore([thunk]);
let store, profile, token, id;

describe('profile actions', () => {
  beforeEach(() => {
    store = createMockStore(() => ({ tweet: { tweets } }));
    profile = userProfiles[0];
    token = '1234567890';
    id = 'notavalidid';
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  describe('setUserProfile', () => {
    test('should create the action object ', () => {
      const action = setUserProfile(profile);
      expect(action).toEqual({ type: SET_USER_PROFILE, userProfile: profile });
    });
  });

  describe('getUserProfile', () => {
    test('should handle successful requests', done => {
      store.dispatch(getUserProfile(userID));
      let actions = store.getActions();
      expect(actions[0]).toEqual({
        type: SET_ACTION_STATUS,
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'getUserProfile'
      });

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request
          .respondWith({
            status: 200,
            response: profile
          })
          .then(() => {
            actions = store.getActions();
            expect(actions[1]).toEqual({
              type: SET_ACTION_STATUS,
              actionStatus: SUCCESS_MESSAGE,
              actionName: 'getUserProfile'
            });
            expect(actions[2]).toEqual({
              type: SET_USER_PROFILE,
              userProfile: profile
            });
            done();
          });
      });
    });

    test('should handle requests with invalid ids', done => {
      store.dispatch(getUserProfile(id));
      let actions = store.getActions();
      expect(actions[0]).toEqual({
        type: SET_ACTION_STATUS,
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'getUserProfile'
      });

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request
          .respondWith({ status: 404, response: NON_EXISTENT_USER })
          .then(() => {
            actions = store.getActions();
            expect(actions[1]).toEqual({
              type: SET_ACTION_STATUS,
              actionStatus: FAILED_MESSAGE,
              actionName: 'getUserProfile'
            });
            expect(actions[2]).toEqual({
              type: SET_ERROR_MESSAGE,
              errorMessage: NON_EXISTENT_USER,
              errorType: INVALID_REQUEST
            });
            done();
          });
      });
    });
  });
});
