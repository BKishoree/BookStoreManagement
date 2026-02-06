import { useState, useImperativeHandle, forwardRef } from 'react';

const AddUserForm = forwardRef(({ onSave }, ref) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave({
        ...formData,
        accounttype: 'INDIVIDUAL'
      });
      return true;
    }
    return false;
  };

  useImperativeHandle(ref, () => ({
    submit: handleSubmit
  }));

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

  return (
    <form className="edit-form" onSubmit={(e) => e.preventDefault()}>
      <div className={`form-field ${errors.name ? 'error' : ''}`}>
        <label htmlFor="name">Full Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter full name"
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
      </div>

      <div className={`form-field ${errors.email ? 'error' : ''}`}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email address"
        />
        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>

      <div className={`form-field ${errors.phoneNumber ? 'error' : ''}`}>
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Enter phone number"
        />
        {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
      </div>

      <div className="password-notice">
        <span className="notice-icon">ℹ️</span>
        <span>Password will be set to their email address for initial login</span>
      </div>
    </form>
  );
});

AddUserForm.displayName = 'AddUserForm';

export default AddUserForm;
