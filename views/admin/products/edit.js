import layout from '../layout.js';
import helpers from '../../helpers.js';

const { getError } = helpers;

export default ({ product, errors }) => {
  return layout({
    title: 'Edit Product',
    content: `
      <div class="columns is-centered">
        <div class="column is-half">
          <h1 class="subtitle">Edit Product</h1>

          <form method="POST" enctype="multiplart/form-data">
            <div class="field">
              <label class="label" id="title" for="title" class="label">Title</label>
              <input class="input" name="title" value="${product.title}">
              <p class="help is-danger">${getError(errors, 'title')}</p>
            </div>

            <div class="field">
              <label class="label" id="price" for="price" class="label">Price</label>
              <input class="input" name="price" value="${product.price}">
              <p class="help is-danger">${getError(errors, 'price')}</p>
            </div>

            <div class="field">
              <label class="label" id="image" for="image" class="label">Replace Image</label>
              <input name="image" type="file">
            </div>

            <button class="button is-primary">Submit</button>
          </form>
        </div>
      </div>
    `
  });
};