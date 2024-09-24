import layout from '../layout.js';
import helpers from '../../helpers.js';

const { getError } = helpers;

export default ({ req, errors }) => {  // assume will be passed in object with the req property which contains the req object from the req handler, and an errors object that holds any errors from validation chains. errors will be undefined if none thrown.
  return layout({  // call layout() and pass in object with snippet as val of content property
    title: `Sign Up`,
    content: `
      <div class="form-wrapper">  
        Your ID is: ${req.session.userId}
        <form method="POST">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" />
          ${getError(errors, 'email')}
          <label for="password">Password:</label>
          <input type="password" id="password" name="password" />
          ${getError(errors, 'password')}
          <label for="password-confirmation">Confirm password:</label>
          <input type="password" id="password-confirmation" name="passwordConfirmation" />
          ${getError(errors, 'passwordConfirmation')}
          <button>Sign Up</button>
        </form>
      </div>
    `
  });
};