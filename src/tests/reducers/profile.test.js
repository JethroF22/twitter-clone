import profileReducer from '../../reducers/profile';

import { actionTypes } from '../../config/const.json';
const { SET_USER_PROFILE } = actionTypes.profile;

test('should set the user profile', () => {
  const userProfile = {
    bio: 'I am a professional QA tester'
  };
  const state = profileReducer({}, { type: SET_USER_PROFILE, userProfile });
  expect(state).toEqual({
    userProfile
  });
});
