import React from 'react';
import { shallow } from 'enzyme';
import _ from 'lodash';
import Textarea from 'react-textarea-autosize';

import { TweetForm } from '../../../components/forms/tweets/TweetForm';

import { tweets } from '../../../../config/seed';

let wrapper, body, createTweetSpy, tweet, state, token;

describe('Tweet Form', () => {
  beforeEach(() => {
    createTweetSpy = jest.fn().mockResolvedValueOnce(null);
    token = '1234567890';
    tweet = tweets[0];
    body = tweet.body;
    state = { body };
    wrapper = shallow(<TweetForm createTweet={createTweetSpy} token={token} />);
    wrapper.setState(state);
  });

  test('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('should handle onChange', () => {
    wrapper.find(Textarea).prop('onChange')({ target: { value: body } });
    expect(wrapper.state('body')).toBe(body);
  });

  test('should handle onSubmit', () => {
    wrapper.find('form').simulate('submit', { preventDefault: () => {} });
    expect(createTweetSpy).toHaveBeenLastCalledWith(
      {
        body
      },
      token
    );
  });
});
