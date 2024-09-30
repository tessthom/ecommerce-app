import layout from '../layout.js';

export default ({ products }) => {  // assume will be passed in an object with `products` property that holds array of products
  const renderedProducts = products.map((product) => {
    // create snippet for every product. edit btn should be wrapped in anchor tag with product's ID value spec'd in href path
    return `
      <tr>
        <td>${product.title}</td>
        <td>${product.price}</td>
        <td>
          <a href="/admin/products/${product.id}/edit">
            <button class="button is-link">
              Edit
            </button>
          </a>
        </td>
        <td>
          <!-- Using a form with post request instead of delete method as project specific workaround -->
          <form method="POST" action="/admin/products/${product.id}/delete">
            <button class="button is-danger">Delete</button>
          </form>
        </td>
      </tr>
    `;
  }).join('');  // remember to join each snippet back together into single string

  return layout({
    title: `Products`,
    content: `
      <div class="control">
        <h1 class="subtitle">Products</h1>  
        <a href="/admin/products/new" class="button is-primary">New Product</a>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          ${renderedProducts}
        </tbody>
      </table>
    `
  });
};