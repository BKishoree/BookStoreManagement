import { useEffect, useState } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    totalOrders: 0,
    revenue: 0,
    loading: true
  });
  const [recentActivity] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, booksRes] = await Promise.all([
          api.get('/users/count'),
          api.get('/books/count')
        ]);
        
        setStats({
          totalUsers: usersRes.data.count || 0,
          totalBooks: booksRes.data.count || 0,
          totalOrders: 0,
          revenue: 0,
          loading: false
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  const quickActions = [
    { 
      title: 'Add New Book', 
      desc: 'Add a book to inventory',
      icon: '➕',
      link: '/admin/books',
      color: 'blue'
    },
    { 
      title: 'Manage Staff', 
      desc: 'View and manage team',
      icon: '👥',
      link: '/admin/users',
      color: 'purple'
    },
    { 
      title: 'View Reports', 
      desc: 'Analytics and insights',
      icon: '📊',
      link: '#',
      color: 'green'
    },
    { 
      title: 'System Settings', 
      desc: 'Configure preferences',
      icon: '⚙️',
      link: '#',
      color: 'orange'
    },
  ];

  return (
    <div className="admin-dashboard">
      {/* Stats Overview */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-visual users">
              <span className="stat-emoji">👥</span>
            </div>
            <div className="stat-details">
              <span className="stat-number">
                {stats.loading ? '-' : stats.totalUsers}
              </span>
              <span className="stat-label">Total Staff</span>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-visual books">
              <span className="stat-emoji">📚</span>
            </div>
            <div className="stat-details">
              <span className="stat-number">
                {stats.loading ? '-' : stats.totalBooks}
              </span>
              <span className="stat-label">Books in Library</span>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-visual orders">
              <span className="stat-emoji">📦</span>
            </div>
            <div className="stat-details">
              <span className="stat-number">{stats.totalOrders}</span>
              <span className="stat-label">Active Orders</span>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-visual revenue">
              <span className="stat-emoji">💰</span>
            </div>
            <div className="stat-details">
              <span className="stat-number">${stats.revenue.toFixed(2)}</span>
              <span className="stat-label">Total Revenue</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="dashboard-grid-layout">
        {/* Quick Actions Column */}
        <section className="dashboard-column">
          <div className="panel">
            <div className="panel-header">
              <h3>Quick Actions</h3>
            </div>
            <div className="panel-body">
              <div className="action-list">
                {quickActions.map((action, index) => (
                  <Link 
                    key={index}
                    to={action.link}
                    className={`action-list-item ${action.color}`}
                  >
                    <div className="action-icon-box">
                      <span>{action.icon}</span>
                    </div>
                    <div className="action-info">
                      <span className="action-name">{action.title}</span>
                      <span className="action-desc">{action.desc}</span>
                    </div>
                    <span className="action-chevron">›</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Activity & Overview Column */}
        <section className="dashboard-column wide">
          <div className="panel">
            <div className="panel-header">
              <h3>Recent Activity</h3>
              <button className="btn-text">View All</button>
            </div>
            <div className="panel-body">
              {recentActivity.length === 0 ? (
                <div className="activity-empty">
                  <div className="activity-icon">📋</div>
                  <p>No recent activity</p>
                  <span>Activities will appear here when staff performs actions</span>
                </div>
              ) : (
                <div className="activity-list">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-dot"></div>
                      <div className="activity-content">
                        <p className="activity-text">{activity.description}</p>
                        <span className="activity-time">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>System Status</h3>
              <span className="status-badge online">● Online</span>
            </div>
            <div className="panel-body">
              <div className="status-grid">
                <div className="status-item">
                  <span className="status-label">Database</span>
                  <span className="status-value healthy">Connected</span>
                </div>
                <div className="status-item">
                  <span className="status-label">API Status</span>
                  <span className="status-value healthy">Operational</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Last Backup</span>
                  <span className="status-value">Today, 03:00 AM</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
