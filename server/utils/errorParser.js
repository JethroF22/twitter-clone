const DBErrorParser = err => {
  const errors = [];
  if (err.name === 'MongoError') {
    errors.push({
      msg: `Duplicate ${err.errmsg.indexOf('email') > -1 ? 'email' : 'handle'}`
    });
  } else {
    for (const error in err.errors) {
      errors.push({ msg: err.errors[error].message });
    }
  }

  return errors;
};

module.exports = DBErrorParser;
