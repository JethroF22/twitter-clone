import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import validator from 'validator';

import { logIn } from '../../../actions/auth';
import {
  actionStatusMessages,
  errorMessages
} from '../../../../config/const.json';

const {
  SUCCESS_MESSAGE,
  FAILED_MESSAGE,
  IN_PROGRESS_MESSAGE
} = actionStatusMessages;
const { INVALID_CREDENTIALS } = errorMessages;

export class LogInForm extends Component {
  state = {
    email: '',
    password: '',
    errors: {}
  };

  onChange = e => {
    const { value, name } = e.target;
    this.setState(() => ({
      [name]: value,
      errors: {}
    }));
  };

  onSubmit = e => {
    e.preventDefault();

    const credentials = _.pick(this.state, ['email', 'password']);

    if (validator.isEmail(credentials.email)) {
      this.props.logIn(credentials).then(() => {
        if (this.props.actionStatus === SUCCESS_MESSAGE) {
          alert('successful');
        } else if (this.props.actionStatus === FAILED_MESSAGE) {
          this.setState(() => ({
            errors: {
              authenticationError: INVALID_CREDENTIALS
            }
          }));
        }
      });
    } else {
      this.setState(() => ({
        errors: {
          email: 'Invalid email address'
        }
      }));
    }
  };

  render() {
    return (
      <div>
        <h3>Log In</h3>
        <form onSubmit={this.onSubmit}>
          {this.state.errors.authenticationError && (
            <p>{this.state.errors.authenticationError}</p>
          )}
          {this.state.errors.email && <p>{this.state.errors.email}</p>}
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
          <button
            type="submit"
            disabled={this.props.actionStatus === IN_PROGRESS_MESSAGE}
          >
            Log In
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
  logIn: credentials => dispatch(logIn(credentials))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogInForm);
