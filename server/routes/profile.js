const express = require('express');
const _ = require('lodash');

const authenticate = require('../middleware/authenticate');
const errorParser = require('../utils/errorParser');
const User = require('../models/user');
const { errorMessages } = require('../../config/const.json');

const {
  CANT_BE_FOLLOWED,
  HAS_BEEN_FOLLOWED,
  HAS_NOT_BEEN_FOLLOWED,
  USER_NOT_FOUND
} = errorMessages;
const router = express.Router();

// GET routes
router.get('/view/:id', (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .then(user => {
      if (!user) {
        return res.status(404).send(USER_NOT_FOUND);
      }

      const userProfile = user.getProfileDetails();

      res.send(userProfile);
    })
    .catch(err => {
      const errors = errorParser(err);
      res.status(400).send(errors);
    });
});

// PATCH routes
router.patch('/edit', authenticate, (req, res) => {
  const user = req.user;
  const profileDetails = _.pick(req.body, ['bio', 'photo', 'coverPhoto']);

  User.findByIdAndUpdate(
    user._id,
    { $set: profileDetails },
    { new: true, runValidators: true }
  )
    .then(user => {
      const userProfile = user.getProfileDetails();
      res.send(userProfile);
    })
    .catch(err => {
      const errors = errorParser(err);
      res.status(400).send(errors);
    });
});

router.patch('/follow/:id', authenticate, (req, res) => {
  const id = req.params.id;
  const user = req.user;

  if (id === user._id.toHexString()) {
    return res.status(400).send(CANT_BE_FOLLOWED);
  }

  const follower = {
    _id: user._id,
    user: {
      name: user.name,
      handle: user.handle
    },
    photo: user.photo
  };

  const hasBeenFollowed = user.following.find(
    following => following._id.toHexString() === id
  );
  if (hasBeenFollowed) {
    return res.status(400).send(HAS_BEEN_FOLLOWED);
  }

  User.findByIdAndUpdate(
    id,
    {
      $push: {
        followers: follower
      }
    },
    { new: true, runValidators: true }
  )
    .then(followedUser => {
      if (!followedUser) {
        return res.status(404).send(USER_NOT_FOUND);
      }

      const following = _.pick(followedUser, ['_id', 'photo']);
      following.user = {
        name: followedUser.name,
        handle: followedUser.handle
      };

      user.following.push(following);
      user.save().then(user => {
        res.send({
          followedUser: followedUser.getProfileDetails(),
          user: user.getProfileDetails()
        });
      });
    })
    .catch(err => {
      const errors = errorParser(err);
      res.status(400).send(errors);
    });
});

router.patch('/unfollow/:id', authenticate, (req, res) => {
  const id = req.params.id;
  const user = req.user;
  const follower = {
    _id: user._id,
    user: {
      name: user.name,
      handle: user.handle
    },
    photo: user.photo
  };

  const hasBeenFollowed = user.following.find(
    following => following._id.toHexString() === id
  );
  if (!hasBeenFollowed) {
    return res.status(400).send(HAS_NOT_BEEN_FOLLOWED);
  }

  User.findByIdAndUpdate(
    id,
    {
      $pull: {
        followers: follower
      }
    },
    { new: true, runValidators: true }
  )
    .then(followedUser => {
      user.following = user.following.filter(
        currentlyFollowing => currentlyFollowing.user.name !== followedUser.name
      );
      user.save().then(user => {
        res.send({
          followedUser: followedUser.getProfileDetails(),
          user: user.getProfileDetails()
        });
      });
    })
    .catch(err => {
      const errors = errorParser(err);
      res.status(400).send(errors);
    });
});

module.exports = router;
