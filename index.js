import express from 'express';
import cookieSession from 'cookie-session';
import authRouter from './routes/admin/auth.js';
import productsRouter from './routes/admin/products.js';

const app = express();
const port = 3000;

// wire up middleware
app.use(express.static('public'));  // all requests come through this middleware 1st, express checks each req's route to see if it specs any files in the `public/` dir, serves up file in response it finds match.
app.use(express.json());  // returns middleware that only parses json
app.use(express.urlencoded({ extended: true }));  // this middleware works with default form encoding, not multipart forms
app.use(
  cookieSession({
    keys: ['we89j403jnaowehf']
  })
);
app.use(authRouter);  // bind all the routes from auth.js to the app instance
app.use(productsRouter);

app.listen(port, () => { 
  console.log(`Listening on port ${port}`);
});