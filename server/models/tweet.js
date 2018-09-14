const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');

const TweetSchema = new mongoose.Schema({
  body: {
    type: String,
    maxlength: 140,
    required: true
  },
  user: {
    name: {
      type: String,
      required: true
    },
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  },
  timestamp: {
    type: Number,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  retweets: {
    type: Number,
    default: 0
  },
  imgUrl: {
    type: String,
    validate: {
      validator: validator.isURL,
      message: '"{VALUE}" is not a valid URL'
    }
  }
});

TweetSchema.methods.toJSON = function() {
  const tweet = this;
  const tweetObj = tweet.toObject();

  return _.pick(tweetObj, [
    'body',
    'timestamp',
    'likes',
    'retweets',
    'imgUrl',
    'user',
    '_id'
  ]);
};

const Tweet = mongoose.model('Tweet', TweetSchema);

module.exports = Tweet;
