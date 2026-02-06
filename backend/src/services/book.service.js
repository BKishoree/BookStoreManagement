const bookRepository = require('../repositories/book.repository');

class BookService {
  async getAllBooks(userId) {
    console.log('User ID in service:', userId);
    return await bookRepository.findAllByUserId(userId);
  }

  async getBookById(id) {
    if (!id) {
      throw new Error('Book id is required');
    }

    const book = await bookRepository.findById(id);
    if (!book) {
      throw new Error('Book not found');
    }

    return book;
  }

  async createBook(data) {
    const { title, author } = data;

    if (!title || !author) {
      throw new Error('Title and author are required');
    }

    return bookRepository.create(data);
  }

  async updateBook(id, data) {
    if (!id) {
      throw new Error('Book id is required');
    }

    const existingBook = await bookRepository.findById(id);
    if (!existingBook) {
      throw new Error('Book not found');
    }

    const { title, author } = data;
    if (!title || !author) {
      throw new Error('Title and author are required');
    }

    return bookRepository.update(id, data);
  }

  async deleteBook(id) {
    if (!id) {
      throw new Error('Book id is required');
    }

    const existingBook = await bookRepository.findById(id);
    if (!existingBook) {
      throw new Error('Book not found');
    }

    return bookRepository.delete(id);
  }
}

module.exports = new BookService();
