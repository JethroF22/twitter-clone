import React from 'react';
import { connect } from 'react-redux';

import TweetForm from '../forms/tweets/TweetForm';
import TweetList from '../lists/TweetList';

const UserFeed = props => (
  <div>
    <TweetForm />
    <TweetList id={props.id} />
  </div>
);

const mapStateToProps = state => ({
  id: state.auth._id
});

export default connect(mapStateToProps)(UserFeed);
