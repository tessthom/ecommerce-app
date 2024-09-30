// external
import express from 'express';

// local
import middlewares from './middlewares.js';
import usersRepo from '../../repos/users.js';
import signupTemplate from '../../views/admin/auth/signup.js';
import signinTemplate from '../../views/admin/auth/signin.js';
import validators from './validators.js';
import signup from '../../views/admin/auth/signup.js';

const { handleErrors } = middlewares;
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
  handleErrors(signupTemplate),
  async (req, res) => {
    const { email, password } = req.body;
    // create user in users repo to represent this person
    const user = await usersRepo.create({ email, password }); // returns user `attrs` object

    // store the id of that user inside the user's cookie
    req.session.userId = user.id; // cookieSession will see this new prop on the `req.session` object whenever res.send() is called and append it as a string to the cookie sent to the browser for storage on client.

    res.redirect('/admin/products');  // send get req to products index page
  }
);

// signout handler
router.get('/signout', (req, res) => {
  req.session = null; // clear user data from session
  res.send('You are signed out.');
});

// signin route handler
router.get('/signin', (req, res) => {
  res.send(signinTemplate({})); // signinTemplate() returns string with html for signin form. passing in empty object so that when destructuring off of the argument in signin.js, wont be undefined.
});

// signin post request handler
router.post(
  '/signin', 
  [requireExistingEmail, requireMatchingPassword],
  handleErrors(signinTemplate),
  async (req, res) => {
    const { email } = req.body;
    
    const user = await usersRepo.getOneBy({ email });

    req.session.userId = user.id; // executes only if matching email + password found, set session property to stored user ID value to indicate that user is signed in

    res.redirect('/admin/products');
  }
);


export default router;