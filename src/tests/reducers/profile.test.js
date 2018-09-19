import profileReducer from '../../reducers/profile';

import { userProfiles } from '../seed/seed';
import { actionTypes } from '../../config/const.json';
const { SET_USER_PROFILE, VIEW_PROFILE } = actionTypes.profile;

let profile;

test('should set the user profile', () => {
  profile = userProfiles[0];
  const state = profileReducer(
    {},
    { type: SET_USER_PROFILE, userProfile: profile }
  );
  expect(state).toEqual({ userProfile: profile });
});

test('should set the profile currently being viewed', () => {
  profile = userProfiles[1];
  const state = profileReducer({}, { type: VIEW_PROFILE, profile });
  expect(state).toEqual({ viewedProfile: profile });
});
