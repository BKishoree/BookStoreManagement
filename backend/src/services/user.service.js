const userRepository = require('../repositories/user.repository');

class UserService {

  async getAllUsers(loggedInUser) {
    // if (loggedInUser.accounttype !== 'ADMIN') {
    //   throw new Error('Only ADMIN can view users');
    // }

    return userRepository.findAll();
  }

  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async createIndividual(createdBy, accounttype, userData) {
    if (accounttype !== 'ADMIN') {
      throw new Error('Only ADMIN can create users');
    }

    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }
    console.log("userdata ", userData);

    return userRepository.createUser({
      ...userData,
      accounttype: 'INDIVIDUAL',
      created_by: createdBy
    });
  }

  async updateUser(id, userData) {
    const existingUser = await userRepository.findById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    // Check if email is being changed and if it already exists
    if (userData.email && userData.email !== existingUser.email) {
      const userWithEmail = await userRepository.findByEmail(userData.email);
      if (userWithEmail && userWithEmail.id !== id) {
        throw new Error('Email already exists');
      }
    }

    return userRepository.updateUser(id, userData);
  }

  async deleteUser(id) {
    const existingUser = await userRepository.findById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    return userRepository.deleteUser(id);
  }
}

module.exports = new UserService();
