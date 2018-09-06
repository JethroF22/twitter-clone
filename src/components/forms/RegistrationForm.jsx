import React, { Component } from 'react';
import { connect } from 'react-redux';
import { registerUser } from '../../actions/auth';
import _ from 'lodash';

import { validateRegistrationForm } from '../../utils/formValidation';
import { actionStatusMessages, errorMessages } from '../../config/const.json';

const {
  SUCCESS_MESSAGE,
  FAILED_MESSAGE,
  IN_PROGRESS_MESSAGE
} = actionStatusMessages;
const { UNKNOWN_ERROR, DUPLICATE_EMAIL } = errorMessages;

class RegistrationForm extends Component {
  state = {
    username: '',
    password: '',
    confirmPassword: '',
    handle: '',
    email: '',
    errors: {}
  };

  handleChange = e => {
    const { value, name } = e.target;

    this.setState(prevState => ({
      [name]: value,
      errors: {
        ...prevState.errors,
        [name]: ''
      }
    }));
  };

  onSubmit = e => {
    e.preventDefault();

    const credentials = _.pick(this.state, [
      'username',
      'email',
      'password',
      'handle'
    ]);

    const errors = validateRegistrationForm(this.state);
    if (_.isEqual(errors, {})) {
      this.props.registerUser(credentials).then(() => {
        if (this.props.actionStatus === SUCCESS_MESSAGE) {
          alert('successful');
        } else if (this.props.actionStatus === FAILED_MESSAGE) {
          let registrationError = '';
          if (this.props.errorMessage === DUPLICATE_EMAIL) {
            registrationError =
              'This email is already in use! Please try again with a different email';
          } else if (this.props.errorMessage === UNKNOWN_ERROR) {
            registrationError =
              'An unknown database error has occurred. Please come back later to try again';
          }
          this.setState(() => ({ errors: { registrationError } }));
        }
      });
    } else {
      this.setState(() => ({
        errors
      }));
    }
  };

  render() {
    return (
      <div>
        <h3>Create an account</h3>
        <form onSubmit={this.onSubmit}>
          {this.state.errors.registrationError && (
            <p>{this.state.errors.registrationError}</p>
          )}
          {this.state.errors.username && <p>{this.state.errors.username}</p>}
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            name="username"
            value={this.state.username}
            onChange={this.handleChange}
          />
          <br />
          {this.state.errors.email && <p>{this.state.errors.email}</p>}
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            name="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
          <br />
          {this.state.errors.handle && <p>{this.state.errors.handle}</p>}
          <label htmlFor="handle">Handle: </label>
          <input
            type="text"
            name="handle"
            value={this.state.handle}
            onChange={this.handleChange}
            placeholder="Example: @i_am_jerry"
          />
          <br />
          {this.state.errors.password && <p>{this.state.errors.password}</p>}
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.handleChange}
          />
          <br />
          {this.state.errors.confirmPassword && (
            <p>{this.state.errors.confirmPassword}</p>
          )}
          <label htmlFor="confirmPassword">Confirm Password: </label>
          <input
            type="password"
            name="confirmPassword"
            value={this.state.confirmPassword}
            onChange={this.handleChange}
          />
          <br />
          <button
            type="submit"
            disabled={this.props.actionStatus === IN_PROGRESS_MESSAGE}
          >
            Create Account
          </button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  actionStatus: state.status.actionStatus,
  errorType: state.error.errorType,
  errorMessage: state.error.errorMessage
});

const mapDispatchToProps = dispatch => ({
  registerUser: credentials => dispatch(registerUser(credentials))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegistrationForm);
