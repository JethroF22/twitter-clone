const express = require('express');
const _ = require('lodash');

const authenticate = require('../middleware/authenticate');
const errorParser = require('../utils/errorParser');
const User = require('../models/user');

const router = express.Router();

router.patch('/edit', authenticate, (req, res) => {
  const user = req.user;
  const profileDetails = _.pick(req.body, ['bio', 'photo', 'coverPhoto']);

  User.findByIdAndUpdate(
    user._id,
    { $set: profileDetails },
    { new: true, runValidators: true }
  )
    .then(user => {
      res.send(user);
    })
    .catch(err => {
      const errors = errorParser(err);
      res.status(400).send(errors);
    });
});

module.exports = router;
