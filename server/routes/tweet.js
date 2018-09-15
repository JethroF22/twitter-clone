const express = require('express');
const _ = require('lodash');
const { ObjectID } = require('mongodb');

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

router.patch('/like/:id', authenticate, (req, res) => {
  const id = req.params.id;
  const user = req.user;

  const hasBeenLiked = user.likedTweets.find(
    tweet => tweet._id.toHexString() === id
  );
  if (hasBeenLiked) {
    return res.status(400).send('User has already liked this tweet');
  }

  Tweet.findOneAndUpdate(
    { _id: id, 'user._id': { $ne: user._id } },
    { $inc: { likes: 1 } },
    { new: true }
  ).then(tweet => {
    if (!tweet) {
      return res.status(404).send('Tweet does not exist');
    }

    user.likedTweets.push({ _id: id });
    user
      .save()
      .then(user => {
        res.send({
          user,
          tweet
        });
      })
      .catch(err => {
        const errors = DBErrorParser(err);
        res.status(400).send(errors);
      });
  });
});

// DELETE routes
router.delete('/delete/:id', authenticate, (req, res) => {
  const id = req.params.id;

  Tweet.findOneAndRemove({ _id: id, 'user._id': req.user._id })
    .then(tweet => {
      if (!tweet) {
        return res.status(404).send('This tweet does not exist');
      }

      User.updateMany(
        {
          retweets: {
            _id: id
          }
        },
        {
          $pull: {
            retweets: {
              _id: id
            }
          }
        }
      ).then(users => {
        res.send(tweet);
      });
    })
    .catch(err => {
      const errors = DBErrorParser(err);
      res.status(400).send(errors);
    });
});

module.exports = router;
