import React, { Component } from 'react';
import Textarea from 'react-textarea-autosize';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

import { createTweet } from '../../../actions/tweet';
import {
  actionStatusMessages,
  errorMessages
} from '../../../../config/const.json';

const { SUCCESS_MESSAGE } = actionStatusMessages;

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

  onSubmit = e => {
    const tweet = this.state.body;

    this.props.createTweet(tweet, this.props.token).then(() => {
      if (this.props.actionStatus === SUCCESS_MESSAGE) {
        this.setState(() => ({
          body: ''
        }));
        alert('Tweet created');
      }
    });
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

const mapStateToProps = state => ({
  actionStatus: state.status.actionStatus,
  token: state.auth.token,
  photo: state.profile.userProfile.photo
});

const mapDispatchToProps = dispatch => ({
  createTweet: (tweet, token) => dispatch(createTweet(tweet, token))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TweetForm);
