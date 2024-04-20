const { body, validationResult } = require('express-validator');

const validateRegistration = () => {
  return [
    body('email')
      .isEmail()
      .withMessage('Email is not valid')
      .normalizeEmail(),
    body('username')
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters long')
      .isAlphanumeric()
      .withMessage('Username must contain characters or numbers'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords does\'t match');
        }
        return true;
      }),
  ];
};

module.exports = validateRegistration;