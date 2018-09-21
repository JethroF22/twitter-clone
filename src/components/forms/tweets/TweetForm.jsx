import React, { Component } from 'react';
import Textarea from 'react-textarea-autosize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

class TweetForm extends Component {
  state = {
    body: ''
  };

  onBodyChange = e => {
    const { value } = e.target;
    this.setState(() => ({
      body: value
    }));
  };

  render() {
    return (
      <div>
        {this.props.photo ? (
          <img src={this.props.photo} />
        ) : (
          <FontAwesomeIcon icon={faUserCircle} />
        )}
        <form onSubmit={this.onSubmit}>
          <Textarea
            name="body"
            onChange={this.onBodyChange}
            value={this.state.body}
            placeholder="What's happening?"
          />
          <button type="submit" disabled={this.state.body === ''}>
            Tweet
          </button>
        </form>
      </div>
    );
  }
}

export default TweetForm;
