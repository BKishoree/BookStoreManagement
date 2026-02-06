const bookService = require('../services/book.service');

class BookController {
  async getAll(req, res, next) {
    try {
      const books = await bookService.getAllBooks(req.query.createdBy);
      res.status(200).json(books);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const book = await bookService.getBookById(req.params.id);
      res.status(200).json(book);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const book = await bookService.createBook(req.body);
      res.status(201).json(book);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const book = await bookService.updateBook(req.params.id, req.body);
      res.status(200).json(book);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await bookService.deleteBook(req.params.id);
      res.status(200).json({ message: 'Book deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new BookController();
