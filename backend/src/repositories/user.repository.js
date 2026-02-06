const db = require('../db/postgres');

class UserRepository {

  async findAll() {
    const result = await db.query(
      `SELECT 
         id,
         name,
         email,
         phonenumber,
         active,
         created_at,
         created_by,
         accounttype
       FROM identity.users 
       WHERE accounttype = 'INDIVIDUAL'
       ORDER BY created_at DESC`
    );
    return result.rows;
  }

  async findById(id) {
    const result = await db.query(
      `SELECT 
         id,
         name,
         email,
         phonenumber,
         active,
         created_at,
         created_by,
         accounttype
       FROM identity.users 
       WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  }

  async findByEmail(email) {
    const result = await db.query(
      `SELECT * FROM identity.users WHERE email = $1`,
      [email]
    );
    return result.rows[0];
  }

  async createUser(user) {
    const {
      name,
      email,
      password,
      phoneNumber,
      accounttype,
      created_by
    } = user;

    const result = await db.query(
      `INSERT INTO identity.users
       (name, email, password, phonenumber, accounttype, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, email, accounttype, active, created_at`,
      [name, email, password, phoneNumber, accounttype, created_by]
    );

    return result.rows[0];
  }

  async updateUser(id, userData) {
    const { name, email, phonenumber } = userData;
    
    const result = await db.query(
      `UPDATE identity.users
       SET name = $1, email = $2, phonenumber = $3 
       WHERE id = $4
       RETURNING id, name, email, phonenumber, accounttype, active, created_at`,
      [name, email, phonenumber, id]
    );
    
    return result.rows[0];
  }

  async deleteUser(id) {
    const result = await db.query(
      `DELETE FROM identity.users
       WHERE id = $1
       RETURNING id`,
      [id]
    );
    
    return result.rows[0];
  }
}

module.exports = new UserRepository();
