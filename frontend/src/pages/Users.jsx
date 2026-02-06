import { useEffect, useState, useRef } from 'react';
import api from '../api/api';
import AddUserForm from '../components/AddUserForm';
import PopupModal from '../components/PopupModal';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
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

  // View/Edit modal states
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  
  // Ref for AddUserForm
  const addUserFormRef = useRef(null);
  
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.id : null;
  const accounttype = user ? user.accounttype : null;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      showError('Failed to load staff members. Please try again.');
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

  const showDeleteConfirm = (user) => {
    setPopup({
      isOpen: true,
      type: 'delete',
      title: 'Delete Staff Member',
      message: `Are you sure you want to delete "${user.name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      showCancel: true,
      onConfirm: () => handleDeleteConfirmed(user)
    });
  };

  const handleAddUser = async (userData) => {
    try {
      const payload = {
        ...userData,
        password: userData.email,
      };
      await api.post(`/users/individual?createdBy=${userId}&accounttype=${accounttype}`, payload);
      setShowAddForm(false);
      fetchUsers();
      showSuccess('User added successfully. You can login into the staff account with email as password.');
    } catch (error) {
      console.error('Failed to add user:', error);
      showError('Failed to add user. Please try again.');
    }
  };

  const handleDeleteConfirmed = async (userToDelete) => {
    try {
      await api.delete(`/users/${userToDelete.id}`);
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setPopup(prev => ({ ...prev, isOpen: false }));
      showSuccess(`"${userToDelete.name}" has been deleted successfully.`);
    } catch (error) {
      console.error('Failed to delete user:', error);
      showError(error.response?.data?.message || 'Failed to delete user. Please try again.');
    }
  };

  const handleEditUser = (user) => {
    setEditUser(user);
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      const response = await api.put(`/users/${editUser.id}`, updatedData);
      setUsers(users.map(u => u.id === editUser.id ? { ...u, ...response.data } : u));
      setEditUser(null);
      showSuccess(`"${updatedData.name || editUser.name}" has been updated successfully.`);
    } catch (error) {
      console.error('Failed to update user:', error);
      showError(error.response?.data?.message || 'Failed to update user. Please try again.');
    }
  };

  const handleViewUser = (user) => {
    setViewUser(user);
  };

  const filteredUsers = users;

  return (
    <div className="page-container">
      {/* Toolbar */}
      <div className="toolbar" style={{justifyContent: 'flex-end'}}>
        {/* <div className="toolbar-left">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search staff by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div> */}
        <div className="toolbar-right">
          <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
            <span>➕</span>
            <span>Add Staff Member</span>
          </button>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div className="modal-content edit-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Staff Member</h3>
              <button className="btn-close" onClick={() => setShowAddForm(false)}>✕</button>
            </div>
            <div className="modal-body">
              <AddUserForm
                ref={addUserFormRef}
                onSave={handleAddUser}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  if (addUserFormRef.current) {
                    addUserFormRef.current.submit();
                  }
                }}
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {viewUser && (
        <div className="modal-overlay" onClick={() => setViewUser(null)}>
          <div className="modal-content view-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Staff Member Details</h3>
              <button className="btn-close" onClick={() => setViewUser(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="view-details">
                <div className="view-avatar-large">
                  {viewUser.name?.charAt(0).toUpperCase()}
                </div>
                <div className="view-info">
                  <div className="view-row">
                    <span className="view-label">Name:</span>
                    <span className="view-value">{viewUser.name}</span>
                  </div>
                  <div className="view-row">
                    <span className="view-label">Email:</span>
                    <span className="view-value">{viewUser.email}</span>
                  </div>
                  <div className="view-row">
                    <span className="view-label">Phone:</span>
                    <span className="view-value">{viewUser.phonenumber || 'N/A'}</span>
                  </div>
                  {/* <div className="view-row">
                    <span className="view-label">Role:</span>
                    <span className="view-value">
                      <span className={`role-badge ${viewUser.accounttype?.toLowerCase()}`}>
                        {viewUser.accounttype}
                      </span>
                    </span>
                  </div> */}
                  <div className="view-row">
                    <span className="view-label">ID:</span>
                    <span className="view-value">#{viewUser.id}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setViewUser(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editUser && (
        <div className="modal-overlay" onClick={() => setEditUser(null)}>
          <div className="modal-content edit-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Staff Member</h3>
              <button className="btn-close" onClick={() => setEditUser(null)}>✕</button>
            </div>
            <div className="modal-body">
              <form className="edit-form">
                <div className="form-field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    defaultValue={editUser.name}
                    onChange={(e) => editUser.name = e.target.value}
                  />
                </div>
                <div className="form-field">
                  <label>Email</label>
                  <input
                    type="email"
                    defaultValue={editUser.email}
                    onChange={(e) => editUser.email = e.target.value}
                  />
                </div>
                <div className="form-field">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    defaultValue={editUser.phonenumber}
                    onChange={(e) => editUser.phonenumber = e.target.value}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setEditUser(null)}>
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => handleSaveEdit({
                  name: editUser.name,
                  email: editUser.email,
                  phonenumber: editUser.phonenumber
                })}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="data-card">
        {loading ? (
          <div className="table-loading">
            <div className="spinner-large"></div>
            <p>Loading staff members...</p>
          </div>
        ) : (
          <>
            <div className="table-header">
              <span className="table-info">
                Showing {filteredUsers.length} of {users.length} staff members
              </span>
            </div>
            
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="col-checkbox">
                      <input type="checkbox" />
                    </th>
                    <th className="col-user">Staff Member</th>
                    <th className="col-contact">Email</th>
                    <th className="col-role">Phone Number</th>
                    <th className="col-status">Status</th>
                    <th className="col-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <input type="checkbox" />
                        </td>
                        <td>
                          <div className="user-cell">
                            <div className="user-avatar-sm">
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="user-details">
                              <span className="user-name">{u.name}</span>
                              <span className="user-id">ID: #{u.id}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="contact-cell">
                            <span className="contact-item">{u.email}</span>
                          </div>
                        </td>
                        <td>
                          {u.phonenumber && (
                            <span className="contact-item">{u.phonenumber}</span>
                          )}
                        </td>
                        <td>
                          <span className="status-badge active">
                            <span className="status-dot"></span>
                            Active
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn-icon" 
                              title="View"
                              onClick={() => handleViewUser(u)}
                            >
                              👁️
                            </button>
                            <button 
                              className="btn-icon" 
                              title="Edit"
                              onClick={() => handleEditUser(u)}
                            >
                              ✏️
                            </button>
                            <button 
                              className="btn-icon danger" 
                              title="Delete"
                              onClick={() => showDeleteConfirm(u)}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="empty-cell">
                        <div className="table-empty">
                          <span className="empty-icon">👥</span>
                          <p>No staff members found</p>
                          <span>Try adjusting your search or add a new member</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="table-footer">
              <span className="pagination-info">
                Page 1 of 1
              </span>
              <div className="pagination">
                <button className="btn-page" disabled>← Previous</button>
                <button className="btn-page active">1</button>
                <button className="btn-page" disabled>Next →</button>
              </div>
            </div>
          </>
        )}
      </div>

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
