import { useAuth } from '../auth/AuthContext';
import { useEffect, useState } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';

export default function UserDashboard() {
  const { user } = useAuth();
  const [recentBooks, setRecentBooks] = useState([]);
  const [stats, setStats] = useState({ total: 0, loading: true });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/books?limit=6');
        setRecentBooks(res.data.slice(0, 6));
        setStats({ total: res.data.length, loading: false });
      } catch (error) {
        console.error('Failed to fetch books:', error);
        setStats({ total: 0, loading: false });
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Welcome Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="greeting">
            <span className="greeting-icon">👋</span>
            <div>
              <h2 className="greeting-title">Good {getGreeting()}, {user?.name?.split(' ')[0]}!</h2>
              <p className="greeting-subtitle">Here's what's happening in your library today</p>
            </div>
          </div>
          <div className="hero-stats">
            <div className="mini-stat">
              <span className="mini-stat-value">{stats.loading ? '...' : stats.total}</span>
              <span className="mini-stat-label">Total Books</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="section">
        <h3 className="section-title">Quick Access</h3>
        <div className="action-grid">
          <Link to="/books" className="action-card primary">
            <div className="action-icon-wrapper">
              <span className="action-icon">📚</span>
            </div>
            <div className="action-content">
              <h4>Browse Collection</h4>
              <p>Explore all available books in the library</p>
            </div>
            <span className="action-arrow">→</span>
          </Link>
        </div>
      </section>

      {/* Recent Books Section */}
      <section className="section">
        <div className="section-header-bar">
          <h3 className="section-title">Recently Added</h3>
          <Link to="/books" className="view-all-link">
            View All <span>→</span>
          </Link>
        </div>

        {stats.loading ? (
          <div className="loading-grid">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        ) : recentBooks.length > 0 ? (
          <div className="books-carousel">
            {recentBooks.map((book, index) => (
              <Link 
                key={book.id} 
                to={`/books/${book.id}`}
                className="book-preview-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="book-cover">
                  <span className="book-cover-icon">📖</span>
                  <div className="book-cover-overlay">
                    <span>View Details</span>
                  </div>
                </div>
                <div className="book-meta">
                  <h4 className="book-title" title={book.title}>
                    {book.title}
                  </h4>
                  <p className="book-author">by {book.author}</p>
                  <div className="book-footer">
                    <span className="book-price">${book.price || '0.00'}</span>
                    <span className={`stock-badge ${book.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                      {book.stock > 0 ? 'Available' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-message">
            <span className="empty-icon">📚</span>
            <p>No books available yet</p>
          </div>
        )}
      </section>

      {/* Info Cards */}
      <section className="section">
        <div className="info-grid">
          <div className="info-card">
            <div className="info-icon">💡</div>
            <h4>Did You Know?</h4>
            <p>You can search for books by title, author, or ISBN number in the books section.</p>
          </div>
          <div className="info-card">
            <div className="info-icon">🎯</div>
            <h4>Quick Tip</h4>
            <p>Check the availability status before planning to borrow any book from the library.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
}
