import React from 'react';
import { shallow } from 'enzyme';
import _ from 'lodash';

import { UserDetails } from '../../../components/home/UserDetails';
import { users } from '../../../../config/seed';
import { actionStatusMessages } from '../../../../config/const.json';
const { SUCCESS_MESSAGE, IN_PROGRESS_MESSAGE } = actionStatusMessages;

let getUserProfileSpy, id, name, user, wrapper;

describe('UserDetails', () => {
  beforeEach(() => {
    getUserProfileSpy = jest.fn().mockResolvedValueOnce(null);
    user = users[2];
    id = user._id;
    name = user.name;
    wrapper = shallow(
      <UserDetails
        id={id}
        name={name}
        tweets={[]}
        getUserProfile={getUserProfileSpy}
        actionStatus={SUCCESS_MESSAGE}
        profile={user}
      />
    );
  });

  test('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('should dispatch `getUserProfile` on mount', () => {
    expect(getUserProfileSpy).toHaveBeenLastCalledWith(id, name);
  });

  test('should display message while `getUserProfile` in progress', () => {
    wrapper = shallow(
      <UserDetails
        id={id}
        name={name}
        tweets={[]}
        getUserProfile={getUserProfileSpy}
        actionStatus={IN_PROGRESS_MESSAGE}
      />
    );
    expect(wrapper.contains(<p>Loading ...</p>)).toBeTruthy();
  });
});
