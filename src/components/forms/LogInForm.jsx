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

  onChange = e => {
    const { value, name } = e.target;
    this.setState(() => ({
      [name]: value
    }));
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
            onChange={this.onChange}
          />
          <br />
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.onChange}
          />
          <br />
          <button type="submit">Log In</button>
        </form>
      </div>
    );
  }
}

export default LogInForm;
