const express = require('express');
const _ = require('lodash');

const User = require('../models/user');
const errorParser = require('../utils/errorParser');

const router = express.Router();

router.post('/register', (req, res) => {
  const credentials = _.pick(req.body, ['name', 'password', 'email', 'handle']);

  const user = new User(credentials);
  user.generateAuthToken();
  user
    .save()
    .then(user => {
      res.set('x-auth', user.token).send(user);
    })
    .catch(err => res.status(400).send(errorParser(err)));
});

router.post('/login', (req, res) => {
  const credentials = _.pick(req.body, ['password', 'email']);

  User.findByCredentials(credentials)
    .then(user => {
      res.set('x-auth', user.token).send(user);
    })
    .catch(err => {
      res.status(400).send({ msg: err });
    });
});

module.exports = router;
