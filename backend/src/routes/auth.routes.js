const authRouter = require('express').Router();
const authController = require('../controllers/auth.controller');
const { validateRequest } = require('../middlewares/validation');
const { loginValidation } = require('../middlewares/validation/schemas.middleware');

authRouter.post('/login', validateRequest(loginValidation), authController.login);

module.exports = authRouter;
