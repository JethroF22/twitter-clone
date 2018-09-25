import React from 'react';
import { shallow } from 'enzyme';

import AuthenticationModal from '../../../components/modals/AuthenticationModal';
import LogInForm from '../../../components/forms/auth/LogInForm';
import RegistrationForm from '../../../components/forms/auth/RegistrationForm';

let wrapper, modalIsOpen, modalContent, triggerModal, closeModal;

describe('AuthenticationModal', () => {
  beforeEach(() => {
    triggerModal = jest.fn();
    closeModal = jest.fn();
    modalIsOpen = true;
    modalContent = 'Sign Up';
    wrapper = shallow(
      <AuthenticationModal
        triggerModal={triggerModal}
        closeModal={closeModal}
        modalIsOpen={modalIsOpen}
        modalContent={modalContent}
      />
    );
  });

  test('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('should render the correct form', () => {
    expect(wrapper.containsMatchingElement(<RegistrationForm />)).toBe(true);
    wrapper.setProps({ modalContent: 'Log In' });
    expect(wrapper.containsMatchingElement(<LogInForm />)).toBe(true);
  });

  test('should handle closeModal', () => {
    wrapper.find('button[name="closeModal"]').simulate('click');
    expect(closeModal).toHaveBeenCalled();
  });
});
