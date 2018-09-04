const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    minLength: 6
  },
  handle: {
    type: String,
    required: true,
    minLength: 6
  },
  email: {
    type: String,
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
      username: {
        username: {
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
      username: {
        username: {
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
    'username',
    'handle',
    'bio',
    'photo',
    'coverPhoto',
    'followers',
    'following',
    'messages',
    'notifications'
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

const User = mongoose.model('User', UserSchema);

module.exports = User;
