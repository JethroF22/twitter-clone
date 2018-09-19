const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');
const Tweet = require('../../models/tweet');

const userOneID = new ObjectID().toHexString();
const userTwoID = new ObjectID().toHexString();
const userThreeID = new ObjectID().toHexString();
const tweetOneID = new ObjectID().toHexString();
const tweetTwoID = new ObjectID().toHexString();

const userProfiles = [
  {
    bio:
      'Award-winning entrepreneur. Professional analyst. Creator. Travel advocate.',
    coverPhoto:
      'https://images.pexels.com/photos/1053775/pexels-photo-1053775.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    photo:
      'https://images.pexels.com/photos/1409980/pexels-photo-1409980.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
  },
  {
    bio:
      'Award-winning entrepreneur. Professional analyst. Creator. Travel advocate.',
    coverPhoto:
      'https://images.pexels.com/photos/1036857/pexels-photo-1036857.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350',
    photo:
      'https://images.pexels.com/photos/1399282/pexels-photo-1399282.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350'
  },
  {
    bio:
      'Award-winning entrepreneur. Professional analyst. Creator. Travel advocate.',
    coverPhoto:
      'https://images.pexels.com/photos/1130287/pexels-photo-1130287.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350',
    photo:
      'https://images.pexels.com/photos/1416822/pexels-photo-1416822.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    likedTweets: [
      {
        _id: tweetTwoID
      }
    ],
    following: [],
    followers: []
  }
];

const users = [
  {
    _id: userOneID,
    name: 'Jethro',
    email: 'jethro@gmail.com',
    handle: 'iamjethro',
    password: 'password1',
    token: jwt.sign({ id: userOneID }, process.env.SECRET_KEY),
    following: {
      _id: userTwoID,
      user: {
        name: 'NariRoh',
        handle: 'iamnari'
      },
      photo: userProfiles[1].photo
    },
    ...userProfiles[0]
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
    ],
    followers: {
      _id: userOneID,
      user: {
        name: 'Jethro',
        handle: 'iamjethro'
      },
      photo: userProfiles[0].photo
    },
    ...userProfiles[1]
  },
  {
    _id: userThreeID,
    name: 'Alexandra',
    email: 'alexandra@gmail.com',
    handle: 'QueenAlexa',
    password: 'password3',
    token: jwt.sign({ id: userThreeID }, process.env.SECRET_KEY),
    ...userProfiles[2]
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

module.exports = { populateUsers, users, tweets, populateTweets, userProfiles };
