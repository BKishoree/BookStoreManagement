import { useState } from 'react';

export default function AddBookForm({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publishedDate: '',
    price: '',
    stock: '0',
    isbn: '',
    category: ''
  });
  const [errors, setErrors] = useState({});
  const [activeSection, setActiveSection] = useState('basic');

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.id : null;

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.author.trim()) newErrors.author = 'Author is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.publishedDate) newErrors.publishedDate = 'Published date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({ ...formData, createdBy: userId });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="book-form">
      <div className="form-tabs">
        <button 
          type="button"
          className={activeSection === 'basic' ? 'active' : ''}
          onClick={() => setActiveSection('basic')}
        >
          Basic Info
        </button>
        <button 
          type="button"
          className={activeSection === 'details' ? 'active' : ''}
          onClick={() => setActiveSection('details')}
        >
          Details
        </button>
      </div>

      <div className="form-sections">
        {activeSection === 'basic' ? (
          <div className="form-section">
            <div className={`form-field ${errors.title ? 'error' : ''}`}>
              <label htmlFor="title">
                Book Title <span className="required">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter book title"
              />
              {errors.title && <span className="error-text">{errors.title}</span>}
            </div>

            <div className={`form-field ${errors.author ? 'error' : ''}`}>
              <label htmlFor="author">
                Author <span className="required">*</span>
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Enter author name"
              />
              {errors.author && <span className="error-text">{errors.author}</span>}
            </div>

            <div className="form-row">
              <div className={`form-field ${errors.publishedDate ? 'error' : ''}`}>
                <label htmlFor="publishedDate">
                  Published Date <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="publishedDate"
                  name="publishedDate"
                  value={formData.publishedDate}
                  onChange={handleChange}
                />
                {errors.publishedDate && <span className="error-text">{errors.publishedDate}</span>}
              </div>

              <div className={`form-field ${errors.price ? 'error' : ''}`}>
                <label htmlFor="price">
                  Price ($) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                />
                {errors.price && <span className="error-text">{errors.price}</span>}
              </div>
            </div>
          </div>
        ) : (
          <div className="form-section">
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="stock">Initial Stock</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>

              {/* <div className="form-field">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select category</option>
                  <option value="fiction">Fiction</option>
                  <option value="non-fiction">Non-Fiction</option>
                  <option value="science">Science</option>
                  <option value="technology">Technology</option>
                  <option value="history">History</option>
                  <option value="other">Other</option>
                </select>
              </div> */}
            </div>

            {/* <div className="form-field">
              <label htmlFor="isbn">ISBN</label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="978-3-16-148410-0"
              />
            </div> */}

            <div className="form-preview">
              <h5>Preview</h5>
              <div className="preview-card">
                <span className="preview-icon">📖</span>
                <div className="preview-info">
                  <strong>{formData.title || 'Book Title'}</strong>
                  <span>{formData.author || 'Author Name'}</span>
                </div>
                <span className="preview-price">${formData.price || '0.00'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="form-footer-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Add Book
        </button>
      </div>
    </form>
  );
}
