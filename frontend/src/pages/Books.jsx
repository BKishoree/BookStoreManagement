import { useEffect, useState } from 'react';
import api from '../api/api';
import AddBookForm from '../components/AddBookForm';
import PopupModal from '../components/PopupModal';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  
  // Popup states
  const [popup, setPopup] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: null,
    confirmText: 'OK',
    showCancel: false
  });

  // View/Edit/Delete modal states
  const [viewBook, setViewBook] = useState(null);
  const [editBook, setEditBook] = useState(null);
  
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.id : null;

  useEffect(() => {
    fetchBooks();
  }, [userId]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const endpoint = `/books?createdBy=${userId}`;
      const res = await api.get(endpoint);
      setBooks(res.data);
    } catch (error) {
      console.error('Failed to fetch books:', error);
      showError('Failed to load books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (message) => {
    setPopup({
      isOpen: true,
      type: 'success',
      title: 'Success',
      message,
      confirmText: 'OK',
      showCancel: false,
      onConfirm: () => setPopup(prev => ({ ...prev, isOpen: false }))
    });
  };

  const showError = (message) => {
    setPopup({
      isOpen: true,
      type: 'error',
      title: 'Error',
      message,
      confirmText: 'OK',
      showCancel: false,
      onConfirm: () => setPopup(prev => ({ ...prev, isOpen: false }))
    });
  };

  const showDeleteConfirm = (book) => {
    setPopup({
      isOpen: true,
      type: 'delete',
      title: 'Delete Book',
      message: `Are you sure you want to delete "${book.title}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      showCancel: true,
      onConfirm: () => handleDeleteConfirmed(book)
    });
  };

  const handleAddBook = async (newBookData) => {
    try {
      await api.post('/books', newBookData);
      setShowAddForm(false);
      fetchBooks();
      showSuccess('Book added successfully.');
    } catch (error) {
      console.error('Failed to add book:', error);
      showError('Failed to add book. Please try again.');
    }
  };

  const handleDeleteConfirmed = async (bookToDelete) => {
    try {
      await api.delete(`/books/${bookToDelete.id}`);
      setBooks(books.filter(b => b.id !== bookToDelete.id));
      setPopup(prev => ({ ...prev, isOpen: false }));
      showSuccess(`"${bookToDelete.title}" has been deleted successfully.`);
    } catch (error) {
      console.error('Failed to delete book:', error);
      showError(error.response?.data?.message || 'Failed to delete book. Please try again.');
    }
  };

  const handleEditBook = (book) => {
    setEditBook({ ...book });
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      const response = await api.put(`/books/${editBook.id}`, updatedData);
      setBooks(books.map(b => b.id === editBook.id ? { ...b, ...response.data } : b));
      setEditBook(null);
      showSuccess(`"${updatedData.title || editBook.title}" has been updated successfully.`);
    } catch (error) {
      console.error('Failed to update book:', error);
      showError(error.response?.data?.message || 'Failed to update book. Please try again.');
    }
  };

  const handleViewBook = (book) => {
    setViewBook(book);
  };

  const filteredBooks = books;

  return (
    <div className="page-container">
      {/* Control Bar */}
      <div className="control-bar" style={{width: '100% !important', justifyContent: 'flex-end'}}>
        {/* <div className="control-filters">
          <div className="search-box large">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Books</option>
            <option value="inStock">In Stock</option>
            <option value="outOfStock">Out of Stock</option>
          </select>
        </div> */}

        <div className="control-actions">
          {/* <div className="view-toggle">
            <button 
              className={viewMode === 'grid' ? 'active' : ''}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              ⊞
            </button>
            <button 
              className={viewMode === 'list' ? 'active' : ''}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              ☰
            </button>
          </div> */}

          <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
            <span>➕</span>
            <span>Add Book</span>
          </button>
        </div>
      </div>

      {/* Add Book Modal */}
      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Book</h3>
              <button className="btn-close" onClick={() => setShowAddForm(false)}>✕</button>
            </div>
            <div className="modal-body">
              <AddBookForm
                onSave={handleAddBook}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* View Book Modal */}
      {viewBook && (
        <div className="modal-overlay" onClick={() => setViewBook(null)}>
          <div className="modal-content view-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Book Details</h3>
              <button className="btn-close" onClick={() => setViewBook(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="view-details book-view">
                <div className="view-book-cover">
                  <span>📖</span>
                </div>
                <div className="view-info">
                  <div className="view-row">
                    <span className="view-label">Title:</span>
                    <span className="view-value highlight">{viewBook.title}</span>
                  </div>
                  <div className="view-row">
                    <span className="view-label">Author:</span>
                    <span className="view-value">{viewBook.author}</span>
                  </div>
                  <div className="view-row">
                    <span className="view-label">Price:</span>
                    <span className="view-value price">${viewBook.price || '0.00'}</span>
                  </div>
                  <div className="view-row">
                    <span className="view-label">Stock:</span>
                    <span className="view-value">
                      <span className={`stock-badge ${viewBook.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                        {viewBook.stock > 0 ? `${viewBook.stock} available` : 'Out of stock'}
                      </span>
                    </span>
                  </div>
                  <div className="view-row">
                    <span className="view-label">Created By:</span>
                    <span className="view-value">
                      {viewBook.createdBy === 'MySelf' ? (
                        <span className="creator-chip myself">👤 MySelf</span>
                      ) : (
                        <span className="creator-chip other">👤 {viewBook.createdBy}</span>
                      )}
                    </span>
                  </div>
                  <div className="view-row">
                    <span className="view-label">ID:</span>
                    <span className="view-value">#{viewBook.id}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setViewBook(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Book Modal */}
      {editBook && (
        <div className="modal-overlay" onClick={() => setEditBook(null)}>
          <div className="modal-content edit-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Book</h3>
              <button className="btn-close" onClick={() => setEditBook(null)}>✕</button>
            </div>
            <div className="modal-body">
              <form className="edit-form">
                <div className="form-field">
                  <label>Title</label>
                  <input
                    type="text"
                    defaultValue={editBook.title}
                    onChange={(e) => editBook.title = e.target.value}
                  />
                </div>
                <div className="form-field">
                  <label>Author</label>
                  <input
                    type="text"
                    defaultValue={editBook.author}
                    onChange={(e) => editBook.author = e.target.value}
                  />
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label>Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      defaultValue={editBook.price}
                      onChange={(e) => editBook.price = e.target.value}
                    />
                  </div>
                  <div className="form-field">
                    <label>Stock</label>
                    <input
                      type="number"
                      defaultValue={editBook.stock}
                      onChange={(e) => editBook.stock = e.target.value}
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setEditBook(null)}>
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => handleSaveEdit({
                  title: editBook.title,
                  author: editBook.author,
                  price: editBook.price,
                  stock: editBook.stock
                })}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Area */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner-large"></div>
          <p>Loading books...</p>
        </div>
      ) : filteredBooks.length === 0 && !showAddForm ? (
        <div className="empty-state-large">
          <div className="empty-illustration">📚</div>
          <h3>No books found</h3>
          <p>Try adjusting your search or filters, or add a new book to get started.</p>
          <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
            Add Your First Book
          </button>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="books-masonry">
              {filteredBooks.map((book, index) => (
                <div 
                  key={book.id} 
                  className="book-card-v2"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="book-card-header">
                    <div className={`stock-indicator ${book.stock > 0 ? 'available' : 'unavailable'}`}>
                      {book.stock > 0 ? '● Available' : '● Out of Stock'}
                    </div>
                    <div className="book-actions-dropdown">
                      <button className="btn-icon-sm">⋮</button>
                    </div>
                  </div>
                  
                  <div className="book-card-body">
                    <div className="book-visual">
                      <span className="book-emoji">📖</span>
                    </div>
                    <h4 className="book-title-v2" title={book.title}>
                      {book.title}
                    </h4>
                    <p className="book-author-v2">by {book.author}</p>
                    <div className="book-meta-row">
                      <span className="book-price-v2">${book.price || '0.00'}</span>
                      <span className="book-stock">{book.stock || 0} in stock</span>
                    </div>
                    <div className="book-creator">
                      {book.createdBy === 'MySelf' ? (
                        <span className="creator-chip myself">👤 MySelf</span>
                      ) : (
                        <span className="creator-chip other">👤 {book.createdBy}</span>
                      )}
                    </div>
                  </div>

                  <div className="book-card-footer">
                    <button className="btn btn-sm btn-outline" onClick={() => handleViewBook(book)}>
                      Details
                    </button>
                    <div className="admin-actions">
                      <button className="btn-icon" onClick={() => handleEditBook(book)}>
                        ✏️
                      </button>
                      <button className="btn-icon danger" onClick={() => showDeleteConfirm(book)}>
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="books-list-view">
              {filteredBooks.map((book) => (
                <div key={book.id} className="book-list-item">
                  <div className="book-list-visual">
                    <span>📖</span>
                  </div>
                  <div className="book-list-info">
                    <h4>{book.title}</h4>
                    <p>{book.author}</p>
                  </div>
                  <div className="book-list-meta">
                    <span className="price">${book.price || '0.00'}</span>
                    <span className={`stock ${book.stock > 0 ? 'in' : 'out'}`}>
                      {book.stock > 0 ? `${book.stock} available` : 'Out of stock'}
                    </span>
                    {book.createdBy === 'MySelf' ? (
                      <span className="creator-badge myself">👤 MySelf</span>
                    ) : (
                      <span className="creator-badge other">👤 {book.createdBy}</span>
                    )}
                  </div>
                  <div className="book-list-actions">
                    <button className="btn btn-sm btn-outline" onClick={() => handleViewBook(book)}>
                      View
                    </button>
                    <button className="btn btn-sm btn-warning" onClick={() => handleEditBook(book)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => showDeleteConfirm(book)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="results-footer">
            <span>Showing {filteredBooks.length} books</span>
          </div>
        </>
      )}

      {/* Popup Modal */}
      <PopupModal
        isOpen={popup.isOpen}
        onClose={() => setPopup(prev => ({ ...prev, isOpen: false }))}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        onConfirm={popup.onConfirm}
        confirmText={popup.confirmText}
        cancelText={popup.cancelText}
        showCancel={popup.showCancel}
      />
    </div>
  );
}
