const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
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

const User = mongoose.model('User', UserSchema);

module.exports = User;
