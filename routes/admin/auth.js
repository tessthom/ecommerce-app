
import express from 'express';
import { check, validationResult } from 'express-validator';

import usersRepo from '../../repos/users.js';
import signupTemplate from '../../views/admin/auth/signup.js';
import signinTemplate from '../../views/admin/auth/signin.js';
import validators from './validators.js';

const { 
  requireEmail, 
  requirePassword, 
  requirePasswordConfirmation, 
  requireExistingEmail, 
  requireMatchingPassword 
} = validators;

const router = express.Router(); // object that tracks all the different routes you set up. think of it like sub-app.

// signup route handler
router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req })); // pass in object that contains the req object 
}); 

// signup post request handler
router.post(
  '/signup', 
  // extracted validation chains to `/routes/admin/validators.js`, so can now just spec them with their property names
  [requireEmail, requirePassword, requirePasswordConfirmation], 
  async (req, res) => {
    // handle request
    const errors = validationResult(req); // express-validator library attaches results of validation chain to the req object. give validationResult() access by passing in req object. when validation errors occur, data about them will be stored in an array of objects, where each object has data about a validation error (value, msg, param, location).
    
    if (!errors.isEmpty()) {  // isEmpty() is express-validator method. use to check if any errors exist
      return res.send(signupTemplate({ req, errors })); // respond with same signup form template, passing in access to errors object. 
    }

    const { email, password, passwordConfirmation } = req.body;

    // create user in users repo to represent this person
    const user = await usersRepo.create({ email, password }); // returns user `attrs` object

    // store the id of that user inside the user's cookie
    req.session.userId = user.id; // cookieSession will see this new prop on the `req.session` object whenever res.send() is called and append it as a string to the cookie sent to the browser for storage on client.

    res.send('Account created!');
  }
);

// signin route handler
router.get('/signin', (req, res) => {
  res.send(signinTemplate({})); // signinTemplate() returns string with html for signin form. passing in empty object so that when destructuring off of the argument in signin.js, wont be undefined.
});

// signin post request handler
router.post(
  '/signin', 
  [requireExistingEmail, requireMatchingPassword],
  async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {  // if errors exist, respond with signin template and pass in object with errors to access from template file
      return res.send(signinTemplate({ errors }));
    }

    const { email } = req.body;

    const user = await usersRepo.getOneBy({ email });

    req.session.userId = user.id; // executes only if matching email + password found, set session property to stored user ID value to indicate that user is signed in

    res.send(`You're signed in!`);
  }
);

// signout handler
router.get('/signout', (req, res) => {
  req.session = null;
  res.send('You are signed out.');
});

export default router;