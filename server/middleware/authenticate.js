const User = require('../models/user');

const authenticate = (req, res, next) => {
  const token = req.header('x-token');

  User.findByToken(token)
    .then(user => {
      if (!user) {
        return Promise.reject();
      }

      req.user = user;
      next();
    })
    .catch(err => {
      res.status(401).send();
    });
};

module.exports = authenticate;
