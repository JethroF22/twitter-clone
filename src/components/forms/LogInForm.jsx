import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { logIn } from '../../actions/auth';

class LogInForm extends Component {
  state = {
    email: '',
    password: '',
    errors: {}
  };

  render() {
    return (
      <div>
        <h3>Log In</h3>
        <form>
          {this.state.errors.authenticationError && (
            <p>{this.state.errors.authenticationError}</p>
          )}
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            name="email"
            value={this.state.email}
            onChange={() => console.log('Email changed')}
          />
          <br />
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={() => console.log('Password changed')}
          />
          <br />
          <button type="submit">Log In</button>
        </form>
      </div>
    );
  }
}

export default LogInForm;
