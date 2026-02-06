const userRepository = require('../repositories/user.repository');

class AuthService {
  async login(email, password) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (user.password !== password) {
      throw new Error('Invalid email or password');
    }

    if (!user.active) {
      throw new Error('User is inactive');
    }
    delete user.password;

    return user;
  }
}

module.exports = new AuthService();
