import React, { Component } from 'react';

import { actionStatusMessages } from '../../../config/const.json';

class UserDetails extends Component {
  render() {
    const profile = this.props.profile;
    return (
      <div>
        <img src={profile.coverPhoto} />
        <img src={profile.photo} />
        <h4>{profile.name}</h4>
        <p>{profile.handle}</p>
        <p>{this.props.tweets.length}</p>
        <p>{profile.followers.length}</p>
        <p>{profile.following.length}</p>
      </div>
    );
  }
}

export default UserDetails;
