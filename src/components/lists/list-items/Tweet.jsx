import React from 'react';

const Tweet = props => (
  <div>
    <img src={props.tweet.user.photo} />
    <h4>
      {props.tweet.user.name} | {props.tweet.user.handle} |{' '}
      {props.tweet.timestamp}
    </h4>
    <p>{props.tweet.body}</p>
    {props.tweet.imgUrl && <img src={props.tweet.imgUrl} />}
    <h4>
      {props.tweet.retweets} retweet
      {props.tweet.retweets === 1 ? '' : 's'} | {props.tweet.likes} like
      {props.tweet.likes === 1 ? '' : 's'}
    </h4>
  </div>
);

export default Tweet;
