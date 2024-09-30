import layout from '../layout.js';

export default ({ products }) => {  // assume will be passed in an object with `products` property that holds array of products
  const renderedProducts = products.map((product) => {
    // create snippet for every product
    return `
      <div>${product.title}</div>
    `;
  }).join('');  // remember to join each snippet back together into single string

  return layout({
    title: `Products`,
    content: `
      <h1 class="title">Products</h1>
      ${renderedProducts}
    `
  });
};