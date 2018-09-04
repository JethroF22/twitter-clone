const mongoose = require('mongoose');
const validator = require('validator');

const TweetSchema = new mongoose.Schema({
  body: {
    type: String,
    maxlength: 140,
    required: true
  },
  user: {
    username: {
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

const Tweet = mongoose.model('Tweet', TweetSchema);

module.exports = Tweet;
