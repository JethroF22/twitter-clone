import React from 'react';
import { shallow } from 'enzyme';

import RegistrationForm from '../../components/forms/RegistrationForm';

let wrapper, username;

describe('Registration Form', () => {
  beforeEach(() => {
    wrapper = shallow(<RegistrationForm />);
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
});
