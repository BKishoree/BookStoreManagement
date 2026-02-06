const authService = require('../services/auth.service');

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await authService.login(email, password);

      res.status(200).json(user); 
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
