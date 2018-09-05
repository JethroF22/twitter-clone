import React, { Component } from 'react';

class RegistrationForm extends Component {
  state = {
    username: '',
    password: '',
    confirmPassword: '',
    handle: '',
    email: ''
  };

  render() {
    return (
      <div>
        <h3>Create an account</h3>
        <form onSubmit={() => console.log('submitted')}>
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            name="username"
            value={this.state.username}
            onChange={() => console.log('Username changed')}
          />
          <br />
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            name="email"
            value={this.state.email}
            onChange={() => console.log('Email changed')}
          />
          <br />
          <label htmlFor="handle">Handle: </label>
          <input
            type="text"
            name="handle"
            value={this.state.handle}
            onChange={() => console.log('Handle changed')}
            placeholder="Example: @i_am_jerry"
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
          <label htmlFor="confirmPassword">Confirm Password: </label>
          <input
            type="password"
            name="confirmPassword"
            value={this.state.confirmPassword}
            onChange={() => console.log('Confirm Password changed')}
          />
          <br />
        </form>
      </div>
    );
  }
}

export default RegistrationForm;
