import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import AuthenticationModal from './modals/AuthenticationModal';

class LandingPage extends Component {
  state = {
    modalIsOpen: false,
    modalContent: 'Sign Up'
  };

  triggerModal = e => {
    const modalContent = e.target.name;
    this.setState(() => ({
      modalIsOpen: true,
      modalContent
    }));
  };

  closeModal = e => {
    this.setState(() => ({
      modalIsOpen: false
    }));
  };

  render() {
    return (
      <div>
        <h2>Speak Your Mind</h2>
        <FontAwesomeIcon icon={faComments} size="3x" />
        <br />
        <button name="Sign Up" onClick={this.triggerModal}>
          Sign Up
        </button>
        <br />
        <button name="Log In" onClick={this.triggerModal}>
          Log In
        </button>
        <AuthenticationModal
          triggerModal={this.triggerModal}
          closeModal={this.closeModal}
          modalIsOpen={this.state.modalIsOpen}
          modalContent={this.state.modalContent}
        />
      </div>
    );
  }
}

export default LandingPage;
