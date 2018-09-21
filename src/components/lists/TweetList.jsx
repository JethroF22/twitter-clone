import React, { Component } from 'react';

import Tweet from './list-items/Tweet';

export class TweetList extends Component {
  render() {
    return (
      <div>
        {this.props.tweets.length > 0 ? (
          this.props.tweets.map(tweet => (
            <Tweet tweet={tweet} key={Math.random() * 99999} />
          ))
        ) : (
          <p>No tweets to display</p>
        )}
      </div>
    );
  }
}

export default TweetList;
