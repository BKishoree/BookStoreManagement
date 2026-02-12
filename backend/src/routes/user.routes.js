const userRouter = require('express').Router();
const userController = require('../controllers/user.controller');
const { validateRequest, validateParams } = require('../middlewares/validation');
const {
  createUserValidation,
  updateUserValidation,
  idParamValidation
} = require('../middlewares/validation/schemas.middleware');

userRouter.get('/', userController.getAll);
userRouter.get('/:id', validateParams(idParamValidation), userController.getById);
userRouter.post('/individual', validateRequest(createUserValidation), userController.createIndividual);
userRouter.put('/:id', validateParams(idParamValidation), validateRequest(updateUserValidation), userController.update);
userRouter.delete('/:id', validateParams(idParamValidation), userController.delete);

module.exports = userRouter;
