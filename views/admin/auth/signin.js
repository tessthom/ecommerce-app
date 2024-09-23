import layout from '../layout.js';

export default () => {
  return layout({
    title: `Sign In`,
    content: `
      <div class="form-wrapper">  
        <form method="POST">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" />
          <label for="password">Password:</label>
          <input type="password" id="password" name="password" />
          <button>Sign In</button>
        </form>
      </div>
    `
  });
};