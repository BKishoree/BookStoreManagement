const db = require('../db/postgres');

class BookRepository {
  async findAll() {
    const result = await db.query(
      `SELECT id, title, author, published_date, created_at, created_by
       FROM bookstore.books`
    );
    return result.rows;
  } 

  async findAllByUserId(userId) {
    const result = await db.query(
      `SELECT 
          b.id, 
          b.title, 
          b.author, 
          b.published_date as "publishedDate", 
          b.created_at as "createdAt", 
          CASE 
            WHEN u.id = $1::uuid THEN 'MySelf' 
            ELSE u.name  
          END AS "createdBy", 
          b.price, 
          b.stock 
       FROM bookstore.books b 
       LEFT JOIN identity.users u 
         ON b.created_by::uuid = u.id 
        ORDER BY b.stock DESC NULLS LAST, b.created_at DESC`,
      [userId]
    );

    return result.rows;
  }

  async findById(id) {
    const result = await db.query(
      `SELECT 
          b.id, 
          b.title, 
          b.author, 
          b.published_date as "publishedDate", 
          b.created_at as "createdAt", 
          b.created_by as "createdBy", 
          b.price, 
          b.stock 
       FROM bookstore.books b 
       WHERE b.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  async create({ title, author, publishedDate, price, createdBy, stock }) {
    const result = await db.query(
      `INSERT INTO bookstore.books (title, author, published_date, price, created_by, stock)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, author, publishedDate, price, createdBy, stock]
    );
    return result.rows[0];
  }

  async update(id, bookData) {
    const { title, author, publishedDate, price, stock } = bookData;
    
    const result = await db.query(
      `UPDATE bookstore.books
       SET title = $1, author = $2, published_date = $3, price = $4, stock = $5
       WHERE id = $6
       RETURNING id, title, author, published_date as "publishedDate", price, stock, created_by as "createdBy", created_at as "createdAt"`,
      [title, author, publishedDate, price, stock, id]
    );
    
    return result.rows[0];
  }

  async delete(id) {
    const result = await db.query(
      `DELETE FROM bookstore.books
       WHERE id = $1
       RETURNING id`,
      [id]
    );
    
    return result.rows[0];
  }
}

module.exports = new BookRepository();
