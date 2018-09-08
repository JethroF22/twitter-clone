import validator from 'validator';

export const validateRegistrationForm = formData => {
  const errors = {};
  for (const key in formData) {
    switch (key) {
      case 'password':
        if (formData[key].length < 8) {
          errors[key] = 'Password must be at least 8 characters';
        }
        break;
      case 'confirmPassword':
        if (formData[key] !== formData['password']) {
          errors[key] = 'Passwords must match';
        }
        break;
      case 'name':
      case 'handle':
        if (formData[key].length < 6) {
          errors[key] = `${key.charAt(0).toUpperCase() +
            key.slice(1)} must be at least 6 characters`;
        }
        break;
      case 'email':
        if (!validator.isEmail(formData[key])) {
          errors[key] = `"${formData[key]}" is not a valid email`;
        }
        break;
      default:
        break;
    }
  }

  return errors;
};
