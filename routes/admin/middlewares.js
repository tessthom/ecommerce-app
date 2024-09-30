import { check } from 'express-validator';

// consolidate middleware in helper object
export default {
  handleErrors(templateFn) {  // takes a fn as arg that 
    // return middleware function
    return (req, res, next) => {  // this returned fn will get called automatically by express. recall `next` is cb that indicates all processing inside is done and next is a ref to the next operation. it's a workaround from needing async functionality before async/await or promises were an option
      const errors = validationResult(req); // init errors array with any validation errors from validation chain in ./routes/admin/products.js. express-validator library attaches results of validation chain to the req object. give validationResult() access by passing in req object. when validation errors occur, data about them will be stored in an array of objects, where each object has data about a validation error (value, msg, param, location).

      if(!errors.isEmpty()) { // if any errors, call template fn with access to errors in an object
        return res.send(templateFn({ errors }));
      }

      next(); // if no errors, call next middleware or invoke actual route handler
    };
  }
}