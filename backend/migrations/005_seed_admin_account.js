exports.up = async (pgm) => {
  const result = await pgm.db.query(
    `SELECT id FROM identity.users WHERE accounttype = 'ADMIN' LIMIT 1`
  );
  
  if (result.rows.length === 0) {
    await pgm.db.query(
      `INSERT INTO identity.users 
       (name, email, password, phonenumber, accounttype, active, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        'Admin User',
        'admin@gmail.com',
        'Admin@123',
        '9876543210',
        'ADMIN',
        true,
        null
      ]
    );
  }
};
exports.down = async (pgm) => {
  await pgm.db.query(
    `DELETE FROM identity.users WHERE email = 'admin@gmail.com' AND accounttype = 'ADMIN'`
  );
};