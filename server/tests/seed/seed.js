const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');
const Tweet = require('../../models/tweet');

const userOneID = new ObjectID();
const userTwoID = new ObjectID();
const userThreeID = new ObjectID();
const tweetOneID = new ObjectID();
const tweetTwoID = new ObjectID();

const users = [
  {
    _id: userOneID,
    name: 'Jethro',
    email: 'jethro@gmail.com',
    handle: 'iamjethro',
    password: 'password1',
    token: jwt.sign({ id: userOneID }, process.env.SECRET_KEY)
  },
  {
    _id: userTwoID,
    name: 'NariRoh',
    email: 'nariroh@gmail.com',
    handle: 'iamnari',
    password: 'password2',
    token: jwt.sign({ id: userTwoID }, process.env.SECRET_KEY),
    retweets: [
      {
        _id: tweetOneID
      }
    ]
  },
  {
    _id: userThreeID,
    name: 'Alexandra',
    email: 'alexandra@gmail.com',
    handle: 'QueenAlexa',
    password: 'password3',
    token: jwt.sign({ id: userThreeID }, process.env.SECRET_KEY),
    likedTweets: [
      {
        _id: tweetTwoID
      }
    ]
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

const tweets = [
  {
    _id: tweetOneID,
    body: 'This is a test',
    user: {
      name: users[0].name,
      _id: userOneID
    },
    timestamp: new Date()
  },
  {
    _id: tweetTwoID,
    body: 'Tres tristes tigres tragaban trigo en tres tristes trastos',
    user: {
      name: users[1].name,
      _id: userTwoID
    },
    timestamp: new Date()
  }
];

const populateTweets = done => {
  Tweet.remove({})
    .then(() => {
      return Tweet.create(tweets);
    })
    .then(() => {
      done();
    })
    .catch(err => console.log(err));
};

module.exports = { populateUsers, users, tweets, populateTweets };
