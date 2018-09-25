import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getUserProfile } from '../../actions/profile';
import { actionStatusMessages } from '../../../config/const.json';

const { SUCCESS_MESSAGE } = actionStatusMessages;

export class UserDetails extends Component {
  componentDidMount() {
    this.props.getUserProfile(this.props.id, this.props.name);
  }

  render() {
    const profile = this.props.profile;
    return this.props.actionStatus === SUCCESS_MESSAGE ? (
      <div>
        <img src={profile.coverPhoto} />
        <img src={profile.photo} />
        <h4>{profile.name}</h4>
        <p>{profile.handle}</p>
        <p>{this.props.tweets.length} tweets</p>
        <p>{profile.followers.length} followers</p>
        <p>{profile.following.length} following</p>
      </div>
    ) : (
      <p>Loading ...</p>
    );
  }
}

const mapStateToProps = state => ({
  profile: state.profile.userProfile,
  name: state.auth.name,
  id: state.auth._id,
  tweets: state.tweet.tweets || [],
  actionStatus: state.status.actionStatus
});

const mapDispatchToProps = dispatch => ({
  getUserProfile: (id, name) => dispatch(getUserProfile(id, name))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserDetails);
