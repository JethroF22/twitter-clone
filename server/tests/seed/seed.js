const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

const userOneID = new ObjectID();
const userTwoID = new ObjectID();

const users = [
  {
    _id: userOneID,
    username: 'Jethro',
    email: 'jethro@gmail.com',
    handle: 'iamjethro',
    password: 'password1',
    token: jwt.sign({ id: userOneID }, process.env.SECRET_KEY)
  },
  {
    _id: userTwoID,
    username: 'NariRoh',
    email: 'nariroh@gmail.com',
    handle: 'iamnari',
    password: 'password2',
    token: jwt.sign({ id: userTwoID }, process.env.SECRET_KEY)
  }
];

const populateUsers = done => {
  User.remove({})
    .then(() => {
      return User.create(users);
    })
    .then(() => {
      done();
    })
    .catch(err => console.log(err));
};

module.exports = { populateUsers, users };
