import React from 'react';
import Modal from 'react-modal';

import RegistrationForm from '../forms/auth/RegistrationForm';
import LogInForm from '../forms/auth/LogInForm';

const AuthenticationModal = props => (
  <Modal
    isOpen={props.modalIsOpen}
    contentLabel={props.modalContent}
    onRequestClose={props.closeModal}
    closeTimeoutMS={200}
  >
    <button onClick={props.closeModal} name="closeModal">
      &times;
    </button>
    {props.modalContent === 'Sign Up' ? <RegistrationForm /> : <LogInForm />}
  </Modal>
);

export default AuthenticationModal;
