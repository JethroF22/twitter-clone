import React from 'react';
import { shallow } from 'enzyme';
import _ from 'lodash';

import { RegistrationForm } from '../../../components/forms/RegistrationForm';

import { users } from '../../seed/seed';

let wrapper, name, registerUserSpy, user, state;

describe('Registration Form', () => {
  beforeEach(() => {
    registerUserSpy = jest.fn().mockResolvedValueOnce(null);
    user = users[0];
    state = { ...user, confirmPassword: user.password, errors: {} };
    wrapper = shallow(<RegistrationForm registerUser={registerUserSpy} />);
    wrapper.setState(state);
    name = 'Jethro';
  });

  test('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('should handle onChange', () => {
    wrapper.find('input[name="name"]').prop('onChange')({
      target: {
        name: 'name',
        value: name
      }
    });
    expect(wrapper.state('name')).toBe(name);
  });

  test('should handle onSubmit', () => {
    wrapper.find('form').simulate('submit', { preventDefault: () => {} });
    expect(wrapper.state('errors')).toEqual({});
    expect(registerUserSpy).toHaveBeenLastCalledWith({
      name: user.name,
      handle: user.handle,
      email: user.email,
      password: user.password
    });
  });

  test('should display validation errors', () => {
    state = {
      ...state,
      name: 'Jeff'
    };
    const nameError = 'Name must be at least 6 characters';
    wrapper.setState(state);
    wrapper.find('form').simulate('submit', { preventDefault: () => {} });
    expect(wrapper.state('errors')).toEqual({
      name: nameError
    });
    expect(
      wrapper
        .find('p')
        .at(0)
        .text()
    ).toBe(nameError);
  });
});
