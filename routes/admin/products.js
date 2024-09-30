// external
import express from 'express';
import multer from 'multer';

// local
import middlewares from './middlewares.js';
import productsRepo from '../../repos/products.js';
import addProductTemplate from '../../views/admin/products/new.js';
import indexProductsTemplate from '../../views/admin/products/index.js';
import editProductTemplate from '../../views/admin/products/edit.js';
import validators from './validators.js';

const router = express.Router();  // init a router
const upload = multer({ storage: multer.memoryStorage() });  // init upload middleware fn for file storage
const { 
  handleErrors,
  requireAuth 
} = middlewares;
const {
  requireTitle,
  requirePrice
} = validators;

/**
 * Routes:
 * - list all different products
 * - show form that allows users to cerate new product
 * - form submission
 * - individual product editing
 * - submitting editing form
 * - deleting products
 */

// product list route handler
router.get('/admin/products', requireAuth, async (req, res) => { // requireAuth is middleware that checks if user is signed in
  const products = await productsRepo.getAll();
  console.log(products);
  res.send(indexProductsTemplate({ products }));  // pass object with products array into list view template
});

// add product form route handler
router.get('/admin/products/new', requireAuth, (req, res) => {
  res.send(addProductTemplate({}));
});

// submit new product
router.post(
  '/admin/products/new', 
  requireAuth,  // check that user is signed in before further processing
  upload.single('image'), // multer method with name value of file - important to spec before validators bc opposite order would obstruct access to title + price 
  [requireTitle, requirePrice], // arr of custom validation props
  handleErrors(addProductTemplate), // pass ref to template fn so it can be called from within handleErrors. returns fn that gets called as middleware

  async (req, res) => {
    let image = '';
    if (req.file) {
      image = req.file.buffer.toString('base64'); // get str ref to image file (base64 can safely rep an image in string format)
    }
    const { title, price } = req.body; // get refs to text fields
    await productsRepo.create({ title, price, image });

    res.redirect('/admin/products');
});

// edit product form
router.get('/admin/products/:id/edit', requireAuth, async (req, res) => {
  // `:id` wildcard will capture the string passed into the URL path by the product's edit button's href value and add it to the `params` property on the request object
  const product = await productsRepo.getOne(req.params.id);
  console.log(product);
  if (!product) {
    return res.send('Product not found :(');
  }

  res.send(editProductTemplate({ product }));
});

// submit edit product
router.post('/admin/products/:id/edit', 
  requireAuth, 
  upload.single('image'), // watch for file uploaded with <input name="image"...>
  [requireTitle, requirePrice], // validators
  handleErrors(editProductTemplate, async (req) => {  // handle any errors by passing template to errors middleware, pass optional second arg that's a fn to run only if something goes wrong with validation. needed bc `editProductTemplate` expects an argument object with data about the product, except it must be passed by reference to `handleErrors()`. the async fn is a workaround for gaining access to product info without being able to call `editProductTemplate({ product })`.
    const product = await productsRepo.getOne(req.params.id);
    return { product };
  }),
  async (req, res) => {
    const edits = req.body;

    if (req.file) { // if a file was uploaded in form, get data for image encoded as base64 string
      edits.image = req.file.buffer.toString('base64');
    }

    try {
      await productsRepo.update(req.params.id, edits);  // the update() fn may throw an error, hence the try-catch wrapper
    } catch (err) {
      return res.send('Could not find product');
    }

    res.redirect('/admin/products'); // if all goes well with update, redirect back to products index page
  }
);

// delete product
router.post('/admin/products/:id/delete', 
  requireAuth, 
  async (req, res) => {
    await productsRepo.delete(req.params.id);

    res.redirect('/admin/products');
  }
);

export default router;