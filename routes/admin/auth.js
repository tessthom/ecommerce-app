
import express from 'express';
import usersRepo from '../../repos/users.js';
import signupTemplate from '../../views/admin/auth/signup.js';
import signinTemplate from '../../views/admin/auth/signin.js';

const router = express.Router(); // object that tracks all the different routes you set up. think of it like sub-app

// signup route handler
router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req })); // pass in object that contains the req object 
}); 

router.post('/signup', async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;
  
  const existingUser = await usersRepo.getOneBy({ email });
  if (existingUser) {
    return res.send(`Email ${email} already in use.`);
  }

  if (password !== passwordConfirmation) {
    return res.send(`Passwords must match.`);
  }

  // create user in users repo to represent this person
  const user = await usersRepo.create({ email, password }); // returns user `attrs` object

  // store the id of that user inside the user's cookie
  req.session.userId = user.id; // cookieSession will see this new prop on the `req.session` object whenever res.send() is called and append it as a string to the cookie sent to the browser for storage on client.

  res.send('Account created!');
});

// signin route handler
router.get('/signin', (req, res) => {
  res.send(signinTemplate()); // signinTemplate() returns string with html for signin form
});

// signin POST request handler
router.post('/signin', async (req, res) => {
  // check if user has previously signed up with this email
  const { email, password } = req.body;
  const user = await usersRepo.getOneBy({ email });

  if (!user) { // if no matching email found in DB...
    return res.send(`Email not found`);
  }

  const validPassword = await usersRepo.comparePasswords(
    user.password,
    password
  );

  if (!validPassword) { // if matching email found but password doesn't match...
    return res.send(`Password incorrect`);
  }

  req.session.userId = user.id; // executes only if matching email + password found, set session property to stored user ID value to indicate that user is signed in

  res.send(`You're signed in!`);
});

// signout handler
router.get('/signout', (req, res) => {
  req.session = null;
  res.send('You are signed out.');
});

export default router;