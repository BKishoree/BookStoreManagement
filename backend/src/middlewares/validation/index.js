const { Validator, validateRequest, validateParams, validateQuery } = require('./validator.middleware');
const {
  commonValidations,
  createBookValidation,
  updateBookValidation,
  createUserValidation,
  updateUserValidation,
  loginValidation,
  idParamValidation
} = require('./schemas.middleware');

module.exports = {
  Validator,
  validateRequest,
  validateParams,
  validateQuery,
  commonValidations,
  createBookValidation,
  updateBookValidation,
  createUserValidation,
  updateUserValidation,
  loginValidation,
  idParamValidation
};
