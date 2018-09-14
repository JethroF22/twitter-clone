const express = require('express');
const _ = require('lodash');

const User = require('../models/user');
const Tweet = require('../models/tweet');
const authenticate = require('../middleware/authenticate');
const DBErrorParser = require('../utils/errorParser');

const router = express.Router();

// GET routes
router.get('/fetch_tweets/:id', (req, res) => {
  const id = req.params.id;

  User.findById(id).then(user => {
    if (!user) {
      return res.status(404).send('User does not exist');
    }

    const retweets = user.retweets;
    Tweet.find({ $or: [{ 'user._id': id }, { _id: { $in: retweets } }] })
      .then(tweets => {
        if (tweets.length == 0) {
          return res.status(404).send('User has not tweeted anything');
        }
        res.send(tweets);
      })
      .catch(err => {
        const errors = DBErrorParser(err);
        res.status(400).send(errors);
      });
  });
});

// POST routes
router.post('/create', authenticate, (req, res) => {
  const user = req.user;
  const tweet = _.pick(req.body, ['body', 'imgUrl']);
  tweet.timestamp = new Date();
  tweet.user = {
    name: user.name,
    _id: user._id
  };

  new Tweet(tweet)
    .save()
    .then(tweet => {
      res.send(tweet);
    })
    .catch(err => {
      const errors = DBErrorParser(err);
      res.status(400).send(errors);
    });
});

// PATCH routes
router.patch('/retweet/:id', authenticate, (req, res) => {
  const user = req.user;
  const _id = req.params.id;

  const hasBeenRetweeted = user.retweets.find(
    tweet => tweet._id.toHexString() === _id
  );
  if (hasBeenRetweeted) {
    return res.status(400).send('Cannot retweet the same tweet more than once');
  }

  Tweet.findOneAndUpdate(
    { _id },
    {
      $inc: {
        retweets: 1
      }
    },
    { new: true }
  )
    .then(tweet => {
      if (!tweet) {
        return res.status(404).send('Tweet not found');
      }
      user.retweets.push({ _id });
      user.save().then(user => {
        res.send(tweet);
      });
    })
    .catch(err => {
      const errors = DBErrorParser(err);
      res.status(400).send(errors);
    });
});

module.exports = router;
