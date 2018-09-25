import React from 'react';
import { shallow } from 'enzyme';
import _ from 'lodash';

import { TweetList } from '../../../components/lists/TweetList';
import { tweets as originalTweets, users } from '../../../../config/seed';
import { actionStatusMessages } from '../../../../config/const.json';
const {
  SUCCESS_MESSAGE,
  IN_PROGRESS_MESSAGE,
  FAILED_MESSAGE
} = actionStatusMessages;

let wrapper, fetchTweetsSpy, id, tweets;

describe('TweetList', () => {
  beforeEach(() => {
    fetchTweetsSpy = jest.fn().mockResolvedValueOnce(null);
    id = users[0]._id;
    tweets = originalTweets.map(tweet => tweet.body);
    wrapper = shallow(
      <TweetList
        fetchTweets={fetchTweetsSpy}
        tweets={tweets}
        actionStatus={SUCCESS_MESSAGE}
        id={id}
      />
    );
  });

  test('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('should dispatch action on mount', () => {
    expect(fetchTweetsSpy).toHaveBeenLastCalledWith(id);
  });

  describe('renders the correct content', () => {
    test('should display a message if there are no tweets to display', () => {
      wrapper = shallow(
        <TweetList
          fetchTweets={fetchTweetsSpy}
          tweets={[]}
          actionStatus={SUCCESS_MESSAGE}
          id={id}
        />
      );
      expect(wrapper.contains(<p>No tweets to display</p>)).toBeTruthy();
    });

    test('should display a message if the action is in progress', () => {
      wrapper = shallow(
        <TweetList
          fetchTweets={fetchTweetsSpy}
          tweets={[]}
          actionStatus={IN_PROGRESS_MESSAGE}
          id={id}
        />
      );
      expect(wrapper.contains(<p>Loading ...</p>)).toBeTruthy();
    });
  });
});
