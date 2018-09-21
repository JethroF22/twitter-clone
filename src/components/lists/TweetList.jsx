import React, { Component } from 'react';
import { connect } from 'react-redux';

import Tweet from './list-items/Tweet';
import { fetchTweets } from '../../actions/tweet';
import { actionStatusMessages } from '../../../config/const.json';

const { SUCCESS_MESSAGE } = actionStatusMessages;

export class TweetList extends Component {
  componentDidMount() {
    this.props.fetchTweets(this.props.id);
  }

  render() {
    return (
      <div>
        {this.props.actionStatus === SUCCESS_MESSAGE ? (
          this.props.tweets.length > 0 ? (
            this.props.tweets.map(tweet => (
              <Tweet tweet={tweet} key={Math.random() * 99999} />
            ))
          ) : (
            <p>No tweets to display</p>
          )
        ) : (
          <p>Loading ...</p>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  tweets: state.tweet.tweets,
  actionStatus: state.status.actionStatus
});

const mapDispatchToProps = dispatch => ({
  fetchTweets: id => dispatch(fetchTweets(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TweetList);
