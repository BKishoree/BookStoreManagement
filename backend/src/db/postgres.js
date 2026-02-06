const { Pool } = require('pg');

// const pool = new Pool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     port: process.env.DB_PORT,
// })

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

module.exports = {
    query: (text, params) => pool.query(text, params),
}