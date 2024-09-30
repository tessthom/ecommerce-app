// external
import express from 'express';
import multer from 'multer';

// local
import middlewares from './middlewares.js';
import productsRepo from '../../repos/products.js';
import addProductTemplate from '../../views/admin/products/new.js';
import indexProductsTemplate from '../../views/admin/products/index.js'
import validators from './validators.js';

const router = express.Router();  // init a router
const upload = multer({ storage: multer.memoryStorage() });  // init upload middleware fn for file storage
const { handleErrors } = middlewares;
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
router.get('/admin/products', async (req, res) => {
  const products = await productsRepo.getAll();
  console.log(products);
  res.send(indexProductsTemplate({ products }));  // pass object with products array into list view template
});

// add product form route handler
router.get('/admin/products/new', (req, res) => {
  res.send(addProductTemplate({}));
});

// submit new product
router.post(
  '/admin/products/new', 
  upload.single('image'), // multer method with name value of file - important to spec before validators bc opposite order would obstruct access to title + price 
  [requireTitle, requirePrice], // arr of custom validation props
  handleErrors(addProductTemplate), // pass ref to template fn so it can be called from within handleErrors. returns fn that gets called as middleware

  async (req, res) => {
    const image = req.file.buffer.toString('base64'); // get str ref to image file (base64 can safely rep an image in string format)
    const { title, price } = req.body; // get refs to text fields
    await productsRepo.create({ title, price, image });

    res.redirect('/admin/products');
});

// edit product form


// submit edit product


// delete product


export default router;