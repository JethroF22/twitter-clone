import React from 'react';
import { shallow } from 'enzyme';
import _ from 'lodash';

import { RegistrationForm } from '../../components/forms/RegistrationForm';

import users from '../seed/seed';

let wrapper, username, registerUserSpy, user, state;

describe('Registration Form', () => {
  beforeEach(() => {
    registerUserSpy = jest.fn().mockResolvedValueOnce(null);
    user = users[0];
    state = { ...user, confirmPassword: user.password, errors: {} };
    wrapper = shallow(<RegistrationForm registerUser={registerUserSpy} />);
    wrapper.setState(state);
    username = 'Jethro';
  });

  test('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('should handle onChange', () => {
    wrapper.find('input[name="username"]').prop('onChange')({
      target: {
        name: 'username',
        value: username
      }
    });
    expect(wrapper.state('username')).toBe(username);
  });

  test('should handle onSubmit', () => {
    wrapper.find('form').simulate('submit', { preventDefault: () => {} });
    expect(wrapper.state('errors')).toEqual({});
    expect(registerUserSpy).toHaveBeenLastCalledWith({
      ...user
    });
  });

  test('should display validation errors', () => {
    state = {
      ...state,
      username: 'Jeff'
    };
    const usernameError = 'Username must be at least 6 characters';
    wrapper.setState(state);
    wrapper.find('form').simulate('submit', { preventDefault: () => {} });
    expect(wrapper.state('errors')).toEqual({
      username: usernameError
    });
    expect(
      wrapper
        .find('p')
        .at(0)
        .text()
    ).toBe(usernameError);
  });
});
