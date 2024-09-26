/**
 * exports object with helper methods. 
 * imported as:
 *    import helpers from '<path>helpers.js';
 *    const { methodNeeded } = helpers; 
 */  
export default {
  // getError is called from HTML template strings, passed in errors object holding any errors created from validation chains, and string of input field value.
  getError(errors, prop) {
    // using a try/catch block even tho `err` passed in is of no use to this particular set up, bc if catch block executes it's most likely bc tried to access a prop that doesn't exist. just return empty string. 
    try {
      return errors.mapped()[prop].msg;
    } catch (err) {
      return '';
    }
  }
}