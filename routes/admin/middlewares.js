import { check, validationResult } from 'express-validator';

// consolidate middleware in helper object
export default {
  handleErrors(templateFn, productDataCB) {  // takes a fn as arg that will be called with errors object from inside of the middleware returned by handleErrors
    // return middleware function
    return async (req, res, next) => {  // this returned fn will get called automatically by express. recall `next` is cb that indicates all processing inside is done and next is a ref to the next operation. it's a workaround from needing async functionality before async/await or promises were an option
      const errors = validationResult(req); // init errors array with any validation errors from validation chain in ./routes/admin/products.js. express-validator library attaches results of validation chain to the req object. give validationResult() access by passing in req object. when validation errors occur, data about them will be stored in an array of objects, where each object has data about a validation error (value, msg, param, location).

      if(!errors.isEmpty()) { // if any errors, call template fn with access to errors in an object
        // check if optional callback fn arg was passed into `handleErrors()`. need to init a ref var for the data outside of the if block in order to access it elsewhere. init as empty object so that it doesn't eval as undefined when passing to templateFn() below
        let data = {};
        if (productDataCB) {
          data = await productDataCB(req);
        }

        return res.send(templateFn({ errors, ...data })); // pass in any key:val product data to template
      }

      next(); // if no errors, pass off control to the next middleware or route handler
    };
  },
  requireAuth(req, res, next) { // request, response, cb that indicates all processing is done and the next operation/middleware can be run
    if (!req.session.userId) {  // if no userId is found (recall you set it to null on signout), redirect to signin page
      return res.redirect('/signin');
    }

    next();
  }
}