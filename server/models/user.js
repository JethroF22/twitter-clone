const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

const { containsSpaces } = require('../utils/regex');

const UserSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    minlength: 6
  },
  handle: {
    type: String,
    required: true,
    minlength: 6,
    unique: true,
    validate: {
      validator: containsSpaces,
      message: 'Handles cannot contain any spaces'
    }
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: validator.isEmail,
      message: '"{VALUE}" is not a valid email'
    }
  },
  password: {
    type: String,
    required: true
  },
  bio: {
    type: String
  },
  photo: {
    type: String,
    validate: {
      validator: validator.isURL,
      message: '"{VALUE}" is not a valid URL'
    }
  },
  coverPhoto: {
    type: String,
    validate: {
      validator: validator.isURL,
      message: '"{VALUE}" is not a valid URL'
    }
  },
  followers: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      user: {
        name: {
          type: String,
          required: true,
          minLength: 6
        },
        handle: {
          type: String,
          required: true,
          minLength: 6
        }
      },
      photo: {
        type: String,
        validate: {
          validator: validator.isURL,
          message: '"{VALUE}" is not a valid URL'
        }
      }
    }
  ],
  following: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      user: {
        name: {
          type: String,
          required: true,
          minLength: 6
        },
        handle: {
          type: String,
          required: true,
          minLength: 6
        }
      },
      photo: {
        type: String,
        validate: {
          validator: validator.isURL,
          message: '"{VALUE}" is not a valid URL'
        }
      }
    }
  ],
  messages: [
    {
      _id: false,
      body: {
        type: String,
        required: true
      },
      sender: {
        type: String,
        required: true
      },
      timestamp: {
        type: Number,
        required: true
      }
    }
  ],
  notifications: [
    {
      _id: false,
      message: {
        type: String,
        required: true
      },
      timestamp: {
        type: Number,
        required: true
      }
    }
  ],
  retweets: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      }
    }
  ],
  likedTweets: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      }
    }
  ]
});

UserSchema.pre('save', function(next) {
  const user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

UserSchema.methods.toJSON = function() {
  const user = this;
  const userObj = user.toObject();

  return _.pick(userObj, [
    'name',
    'handle',
    'bio',
    'photo',
    'coverPhoto',
    'followers',
    'following',
    'messages',
    'notifications',
    'likedTweets'
  ]);
};

UserSchema.methods.generateAuthToken = function() {
  const user = this;

  const token = jwt.sign(
    {
      _id: user._id.toHexString()
    },
    process.env.SECRET_KEY
  );
  user.token = token;
};

UserSchema.methods.getProfileDetails = function() {
  const user = this;
  return _.pick(user, [
    'name',
    '_id',
    'bio',
    'photo',
    'coverPhoto',
    'followers',
    'following',
    'likedTweets'
  ]);
};

UserSchema.statics.findByCredentials = function(
  { email, password } = { ...credentials }
) {
  const User = this;

  return User.findOne({ email }).then(user => {
    if (!user) return Promise.reject('Invalid email/password combination');

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          return resolve(user);
        } else {
          return reject('Invalid email/password combination');
        }
      });
    });
  });
};

UserSchema.statics.findByToken = function(token) {
  const User = this;

  return User.findOne({ token }).then(user => {
    if (!user) {
      return Promise.reject('User not found');
    } else {
      return Promise.resolve(user);
    }
  });
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
