import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';

class LandingPage extends Component {
  render() {
    return (
      <div>
        <h2>Speak Your Mind</h2>
        <FontAwesomeIcon icon={faComments} size="3x" />
        <br />
        <button>Sign Up</button>
        <br />
        <button>Log In</button>
      </div>
    );
  }
}

export default LandingPage;
