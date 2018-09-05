import React, { Component } from 'react';

class RegistrationForm extends Component {
  state = {
    username: '',
    password: '',
    confirmPassword: '',
    handle: '',
    email: ''
  };

  handleChange = e => {
    const { value, name } = e.target;

    this.setState(() => ({
      [name]: value
    }));
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
            onChange={this.handleChange}
          />
          <br />
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            name="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
          <br />
          <label htmlFor="handle">Handle: </label>
          <input
            type="text"
            name="handle"
            value={this.state.handle}
            onChange={this.handleChange}
            placeholder="Example: @i_am_jerry"
          />
          <br />
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.handleChange}
          />
          <br />
          <label htmlFor="confirmPassword">Confirm Password: </label>
          <input
            type="password"
            name="confirmPassword"
            value={this.state.confirmPassword}
            onChange={this.handleChange}
          />
          <br />
        </form>
      </div>
    );
  }
}

export default RegistrationForm;
