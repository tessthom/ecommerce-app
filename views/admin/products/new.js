import layout from '../layout.js';
import helpers from '../../helpers.js';

const { getError } = helpers;

export default ({ errors }) => {  // errors will hold any validation errors thrown when submitting add product form
  return layout({
    title: `Add Product`,
    content: `
      <div class="columns is-centered">
        <div class="column is-half"
          <h1 class="subtitle">Add a Product</h1>

          <form method="POST" enctype="multipart/form-data">
            <div class="field">
              <label id="title" for="title" class="label">Title</label>
              <input placeholder="Title" name="title" />
              <p class="help is-danger">${getError(errors, 'title')}</p>
            </div>

            <div class="field">
              <label id="price" for="price" class="label">Price</label>
              <input placeholder="Price" name="price" />
              <p class="help is-danger">${getError(errors, 'price')}</p>
            </div>

            <div class="field">
              <label id="image" for="image" class="label">Image</label>
              <input type="file" name="image" />
              <p class="help is-danger">${getError(errors, 'image')}</p>
            </div>
            <button class="button is-primary">Submit</button>
          </form>
        </div>
      </div>
    `
  });
};