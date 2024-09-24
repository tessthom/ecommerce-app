import layout from '../layout.js';
import helpers from '../../helpers.js';

const { getError } = helpers;

export default ({ errors }) => {
  return layout({
    title: `Sign In`,
    content: `
      <div class="form-wrapper">  
        <form method="POST">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" />
          ${getError(errors, 'email')}
          <label for="password">Password:</label>
          <input type="password" id="password" name="password" />
          ${getError(errors, 'password')}
          <button>Sign In</button>
        </form>
      </div>
    `
  });
};