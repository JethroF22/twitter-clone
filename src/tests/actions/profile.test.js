import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';

import {
  followUser,
  getUserProfile,
  setUserProfile,
  unfollowUser
} from '../../actions/profile';
import {
  actionTypes,
  actionStatusMessages,
  errorMessages,
  errorTypes
} from '../../config/const.json';
import { userProfiles, users } from '../../../config/seed';

const { SET_ACTION_STATUS } = actionTypes.status;
const { SET_ERROR_MESSAGE } = actionTypes.error;
const {
  SUCCESS_MESSAGE,
  IN_PROGRESS_MESSAGE,
  FAILED_MESSAGE
} = actionStatusMessages;
const { SET_USER_PROFILE, VIEW_PROFILE } = actionTypes.profile;
const { NON_EXISTENT_USER, UNAUTHORISED } = errorMessages;
const { AUTHORISATION_ERROR, INVALID_REQUEST } = errorTypes;

const createMockStore = configureMockStore([thunk]);
let followedUser, id, store, profile, token, user, userID;

describe('profile actions', () => {
  beforeEach(() => {
    store = createMockStore(() => ({ tweet: { tweets } }));
    user = users[0];
    profile = { ...userProfiles[0], name: user.name };
    userID = user._id;
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
    test("should handle successful requests to view the authenticated user's own profile", done => {
      store.dispatch(getUserProfile(userID, profile.name));
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

    test("should handle successful requests to view a different user's profile", done => {
      const viewedProfile = {
        ...userProfiles[1],
        name: users[1].name
      };
      store.dispatch(getUserProfile(userID, profile.name));
      let actions = store.getActions();
      expect(actions[0]).toEqual({
        type: SET_ACTION_STATUS,
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'getUserProfile'
      });

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request
          .respondWith({ status: 200, response: viewedProfile })
          .then(() => {
            actions = store.getActions();
            expect(actions[1]).toEqual({
              type: SET_ACTION_STATUS,
              actionStatus: SUCCESS_MESSAGE,
              actionName: 'getUserProfile'
            });
            expect(actions[2]).toEqual({
              type: VIEW_PROFILE,
              profile: viewedProfile
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

  describe('followUser', () => {
    test('should handle successful requests', done => {
      followedUser = users[1];
      store.dispatch(followUser(followedUser._id, token));
      let actions = store.getActions();
      expect(actions[0]).toEqual({
        type: SET_ACTION_STATUS,
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'followUser'
      });

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request
          .respondWith({
            status: 200,
            response: {
              followedUser,
              user
            }
          })
          .then(() => {
            actions = store.getActions();
            expect(actions[1]).toEqual({
              type: SET_ACTION_STATUS,
              actionStatus: SUCCESS_MESSAGE,
              actionName: 'followUser'
            });
            expect(actions[2]).toEqual({
              type: SET_USER_PROFILE,
              userProfile: user
            });
            expect(actions[3]).toEqual({
              type: VIEW_PROFILE,
              profile: followedUser
            });
            done();
          });
      });
    });

    test('should handle requests with invalid ids', done => {
      id = '1234567890';
      store.dispatch(followUser(id, token));
      let actions = store.getActions();
      expect(actions[0]).toEqual({
        type: SET_ACTION_STATUS,
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'followUser'
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
              actionName: 'followUser'
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

    test('should handle unauthorised requests', done => {
      followedUser = users[1];
      store.dispatch(followUser(followedUser._id));
      let actions = store.getActions();
      expect(actions[0]).toEqual({
        type: SET_ACTION_STATUS,
        actionStatus: IN_PROGRESS_MESSAGE,
        actionName: 'followUser'
      });

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request
          .respondWith({ status: 401, statusText: UNAUTHORISED })
          .then(() => {
            actions = store.getActions();
            expect(actions[1]).toEqual({
              type: SET_ACTION_STATUS,
              actionStatus: FAILED_MESSAGE,
              actionName: 'followUser'
            });
            expect(actions[2]).toEqual({
              type: SET_ERROR_MESSAGE,
              errorMessage: UNAUTHORISED,
              errorType: AUTHORISATION_ERROR
            });
            done();
          });
      });
    });
  });
});
