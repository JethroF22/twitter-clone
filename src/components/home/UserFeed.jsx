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
  id: state.auth._id || '5b9bfefc90c2a23304450b6d'
});

export default connect(mapStateToProps)(UserFeed);
