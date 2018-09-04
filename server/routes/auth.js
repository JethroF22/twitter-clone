const express = require('express');
const _ = require('lodash');

const User = require('../models/user');

const router = express.Router();

router.post('/register', (req, res) => {
  const credentials = _.pick(req.body, [
    'username',
    'password',
    'email',
    'handle'
  ]);

  const user = new User(credentials);
  user.generateAuthToken();
  user
    .save()
    .then(user => {
      res.send(user);
    })
    .catch(err => console.log(err));
});

module.exports = router;
