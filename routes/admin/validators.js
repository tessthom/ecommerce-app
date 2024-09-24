import { check } from 'express-validator';
import usersRepo from '../../repos/users.js';

// leverage express-validator validation/sanitation chaining.
// process: check() 1st string param is the name of the field you want to validate. other methods chained to check() are 'validators' (determine if a field input is valid), 'sanitizers' (transform the field value, like trim()) or 'modifiers' (define how validation chains behave when run, like not()). the order of chained methods matters, except for 'optional()' which can be placed at any point in chain.
// custom validators: fns that receive the field value + some data about it, must return truthy if field is valid, falsy if invalid. can be async & return a promise which is awaited on. if resolves field is processed as valid. if promise rejects field is invalid. if validator throws error, field deemed invalid and string arg passed to Error() is used as the error message. (can also spec custom error messages at validator chain-level for when a field fails a specific validator with `.withMessage('message')` which will be called if preceeding validators fail, or at field-level for a fallback message with a 2nd arg passed to `check()`).

// ^extracted all this logic from auth.js into this custom validators object
export default {
  requireEmail: check('email')
   .trim()
   .escape()
   .normalizeEmail()
   .isEmail()
   .withMessage('Must be a valid email address')
   .custom(async (email) => {
      const existingUser = await usersRepo.getOneBy({ email });
      if (existingUser) {
        throw new Error('Email already in use');
      }
    }),
  requirePassword: check('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Must be between 4 and 20 characters'),
  requirePasswordConfirmation: check('passwordConfirmation')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Must be between 4 and 20 characters')
    .custom((passwordConfirmation, { req }) => {
      // this custom validator needs to compare the passwordConfirmation input with the `password` field (which is on the request object's body). can spec a 2nd param on the custom validator fn which will receive an object containing the request object when called. easy to destructure `req` off of it, then use it to get to `body.password`.
      if (passwordConfirmation !== req.body.password) {
        throw new Error('Passwords must match');
      }
    }),
  requireExistingEmail: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must enter a valid email')
    .custom(async (email) => {
      const user = await usersRepo.getOneBy({ email });
      if (!user) {
        throw new Error('Email not found');
      }
    }),
  requireMatchingPassword: check('password')
    .trim()
    .custom(async (password, { req }) => {
      // get access to the request body properties with destructured req object
      const user = await usersRepo.getOneBy({ email: req.body.email });
      if (!user) {
        throw new Error('Invalid password'); // technically not an accurate message, but this will throw only if user in undefined, so makes the most sense to say this.
      }
      const validPassword = await usersRepo.comparePasswords(
        user.password,
        password
      );
      if (!validPassword) { // if matching email found but password doesn't match...
        throw new Error('Invalid password');
      }
    })
};