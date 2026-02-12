const bookRouter = require('express').Router();
const bookController = require('../controllers/book.controller');
const { validateRequest, validateParams } = require('../middlewares/validation');
const {
  createBookValidation,
  updateBookValidation,
  idParamValidation
} = require('../middlewares/validation/schemas.middleware');

bookRouter.get('/', bookController.getAll);
bookRouter.get('/:id', validateParams(idParamValidation), bookController.getById);
bookRouter.post('/', validateRequest(createBookValidation), bookController.create);
bookRouter.put('/:id', validateParams(idParamValidation), validateRequest(updateBookValidation), bookController.update);
bookRouter.delete('/:id', validateParams(idParamValidation), bookController.delete);

module.exports = bookRouter;
