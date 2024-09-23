import layout from '../layout.js';

export default ({ req }) => {  // assume will be passed in object with the req property which contains the req object from the req handler
  return layout({  // call layout() and pass in object with snippet as val of content property
    title: `Sign Up`,
    content: `
      <div class="form-wrapper">  
        Your ID is: ${req.session.userId}
        <form method="POST">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" />
          <label for="password">Password:</label>
          <input type="password" id="password" name="password" />
          <label for="password-confirmation">Confirm password:</label>
          <input type="password" id="password-confirmation" name="passwordConfirmation" />
          <button>Sign Up</button>
        </form>
      </div>
    `
  });
};