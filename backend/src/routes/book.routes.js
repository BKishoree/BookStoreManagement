const bookRouter = require('express').Router();
const bookController = require('../controllers/book.controller');

bookRouter.get('/', bookController.getAll);
bookRouter.get('/:id', bookController.getById);
bookRouter.post('/', bookController.create);
bookRouter.put('/:id', bookController.update);
bookRouter.delete('/:id', bookController.delete);

module.exports = bookRouter;
