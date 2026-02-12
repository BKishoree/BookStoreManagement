const { Validator } = require('./validator.middleware');

const commonValidations = {
  id: (v) => v.required().string(),
  
  email: (v) => v.required().email(),
  
  password: (v) => v.required().string().minLength(6).maxLength(100),
  
  name: (v) => v.required().string().minLength(2).maxLength(100),
  
  title: (v) => v.required().string().minLength(1).maxLength(200),
  
  description: (v) => v.string().maxLength(2000),
  
  price: (v) => v.required().number().min(0),
  
  quantity: (v) => v.required().number().min(0).max(999999),
  
  isbn: (v) => v.string().pattern(/^[-\d]{10,17}$/, 'Invalid ISBN format'),
  
  author: (v) => v.required().string().minLength(1).maxLength(200),
  
  publishedYear: (v) => v.number().min(1000).max(new Date().getFullYear()),
  
  pageCount: (v) => v.number().min(1),
  
  phone: (v) => v.string().pattern(/^\+?[\d\s-()]{10,20}$/, 'Invalid phone number format'),
  
  role: (v) => v.string().enum(['ADMIN', 'INDIVIDUAL', 'USER']),
  
  status: (v) => v.string().enum(['ACTIVE', 'INACTIVE', 'PENDING', 'DELETED']),
  
  uuid: (v) => v.string().pattern(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, 'Invalid UUID format'),
  
  url: (v) => v.url(),
  
  boolean: (v) => v.boolean(),
  
  date: (v) => v.date()
};

const createBookValidation = {
  title: commonValidations.title,
  author: commonValidations.author,
  isbn: commonValidations.isbn,
  description: commonValidations.description,
  price: commonValidations.price,
  publishedYear: commonValidations.publishedYear,
  pageCount: commonValidations.pageCount
};

const updateBookValidation = {
  title: (v) => v.string().minLength(1).maxLength(200),
  author: (v) => v.string().minLength(1).maxLength(200),
  isbn: commonValidations.isbn,
  description: commonValidations.description,
  price: (v) => v.number().min(0),
  publishedYear: commonValidations.publishedYear,
  pageCount: commonValidations.pageCount
};

const createUserValidation = {
  name: commonValidations.name,
  email: commonValidations.email,
  password: commonValidations.password,
  phone: commonValidations.phone,
  role: commonValidations.role
};

const updateUserValidation = {
  name: (v) => v.string().minLength(2).maxLength(100),
  email: (v) => v.email(),
  phone: commonValidations.phone,
  role: commonValidations.role,
  status: commonValidations.status
};

const loginValidation = {
  email: commonValidations.email,
  password: commonValidations.password
};

const idParamValidation = {
  id: commonValidations.id
};

module.exports = {
  commonValidations,
  createBookValidation,
  updateBookValidation,
  createUserValidation,
  updateUserValidation,
  loginValidation,
  idParamValidation
};
