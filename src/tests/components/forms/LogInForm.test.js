import React from 'react';
import { shallow } from 'enzyme';
import _ from 'lodash';

import { LogInForm } from '../../../components/forms/LogInForm';
import { users } from '../../seed/seed';

let wrapper, state, logInSpy, user;

describe('LogInForm', () => {
  beforeEach(() => {
    logInSpy = jest.fn().mockResolvedValueOnce(null);
    wrapper = shallow(<LogInForm logIn={logInSpy} />);
    user = users[1];
    state = {
      ...user,
      errors: {}
    };
    wrapper.setState(state);
  });

  test('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('should handle onChange', () => {
    wrapper.find('input[name="email"]').prop('onChange')({
      target: {
        value: user.email,
        name: 'email'
      }
    });
    expect(wrapper.state('email')).toBe(user.email);
  });

  test('should handle onSubmit', () => {
    wrapper.find('form').simulate('submit', { preventDefault: () => {} });
    expect(wrapper.state('errors')).toEqual({});
    expect(logInSpy).toHaveBeenLastCalledWith({
      email: user.email,
      password: user.password
    });
  });

  test('should display authentication error', () => {
    state = {
      ...user,
      email: 'notavalidemail',
      errors: {}
    };
    wrapper.setState(state);
    wrapper.find('form').simulate('submit', { preventDefault: () => {} });
    expect(wrapper.state('errors')).toEqual({
      email: 'Invalid email address'
    });
  });
});
