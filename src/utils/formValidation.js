import validator from 'validator';

export const validateRegistrationForm = formData => {
  const errors = {};
  for (const key in formData) {
    switch (key) {
      case 'password':
        if (data[key].length < 8) {
          errors[key] = 'Password must be at least 8 characters';
        }
        break;
      case 'confirmPassword':
        if (data[key].length !== data['password']) {
          errors[key] = 'Passwords must match';
        }
        break;
      case 'username':
      case 'handle':
        if (data[key].length < 6) {
          errors[key] = `${key.charAt(0).toUpperCase() +
            key.slice(1)} must be at least 6 characters`;
        }
        break;
      case 'email':
        if (!validator.isEmail(data[key])) {
          errors[key] = `"${data[key]}" is not a valid email`;
        }
        break;
      default:
        break;
    }
  }
};
