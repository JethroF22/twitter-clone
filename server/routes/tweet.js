const express = require('express');
const _ = require('lodash');

const Tweet = require('../models/tweet');
const authenticate = require('../middleware/authenticate');
const DBErrorParser = require('../utils/errorParser');

const router = express.Router();

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

module.exports = router;
