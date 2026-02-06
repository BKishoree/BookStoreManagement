const userRouter = require('express').Router();
const userController = require('../controllers/user.controller');

userRouter.get('/', userController.getAll);
userRouter.get('/:id', userController.getById);
userRouter.post('/individual', userController.createIndividual);
userRouter.put('/:id', userController.update);
userRouter.delete('/:id', userController.delete);

module.exports = userRouter;
