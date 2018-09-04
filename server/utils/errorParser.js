const DBErrorParser = err => {
  const errors = [];
  if (err.name === 'MongoError') {
    errors.push('This email is already in use');
  } else {
    for (const error in err.errors) {
      errors.push(err.errors[error].message);
    }
  }

  return errors;
};

module.exports = DBErrorParser;
