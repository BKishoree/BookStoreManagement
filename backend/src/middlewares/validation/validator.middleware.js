const { ValidationError } = require('../../exceptions');

class Validator {
  constructor() {
    this.errors = [];
  }

  static create() {
    return new Validator();
  }

  validate(value, fieldName) {
    this.currentValue = value;
    this.currentField = fieldName;
    return this;
  }

  required(message) {
    if (this.currentValue === undefined || this.currentValue === null || this.currentValue === '') {
      this.errors.push({
        field: this.currentField,
        message: message || `${this.currentField} is required`
      });
    }
    return this;
  }

  string(message) {
    if (this.currentValue !== undefined && this.currentValue !== null && typeof this.currentValue !== 'string') {
      this.errors.push({
        field: this.currentField,
        message: message || `${this.currentField} must be a string`
      });
    }
    return this;
  }

  number(message) {
    if (this.currentValue !== undefined && this.currentValue !== null && (isNaN(this.currentValue) || typeof this.currentValue === 'boolean')) {
      this.errors.push({
        field: this.currentField,
        message: message || `${this.currentField} must be a number`
      });
    }
    return this;
  }

  minLength(min, message) {
    if (this.currentValue && this.currentValue.length < min) {
      this.errors.push({
        field: this.currentField,
        message: message || `${this.currentField} must be at least ${min} characters long`
      });
    }
    return this;
  }

  maxLength(max, message) {
    if (this.currentValue && this.currentValue.length > max) {
      this.errors.push({
        field: this.currentField,
        message: message || `${this.currentField} must be at most ${max} characters long`
      });
    }
    return this;
  }

  min(min, message) {
    const num = Number(this.currentValue);
    if (!isNaN(num) && num < min) {
      this.errors.push({
        field: this.currentField,
        message: message || `${this.currentField} must be at least ${min}`
      });
    }
    return this;
  }

  max(max, message) {
    const num = Number(this.currentValue);
    if (!isNaN(num) && num > max) {
      this.errors.push({
        field: this.currentField,
        message: message || `${this.currentField} must be at most ${max}`
      });
    }
    return this;
  }

  email(message) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.currentValue && !emailRegex.test(this.currentValue)) {
      this.errors.push({
        field: this.currentField,
        message: message || `${this.currentField} must be a valid email address`
      });
    }
    return this;
  }

  pattern(regex, message) {
    if (this.currentValue && !regex.test(this.currentValue)) {
      this.errors.push({
        field: this.currentField,
        message: message || `${this.currentField} format is invalid`
      });
    }
    return this;
  }

  enum(values, message) {
    if (this.currentValue && !values.includes(this.currentValue)) {
      this.errors.push({
        field: this.currentField,
        message: message || `${this.currentField} must be one of: ${values.join(', ')}`
      });
    }
    return this;
  }

  boolean(message) {
    if (this.currentValue !== undefined && this.currentValue !== null && typeof this.currentValue !== 'boolean') {
      this.errors.push({
        field: this.currentField,
        message: message || `${this.currentField} must be a boolean`
      });
    }
    return this;
  }

  array(message) {
    if (this.currentValue !== undefined && this.currentValue !== null && !Array.isArray(this.currentValue)) {
      this.errors.push({
        field: this.currentField,
        message: message || `${this.currentField} must be an array`
      });
    }
    return this;
  }

  date(message) {
    if (this.currentValue && isNaN(Date.parse(this.currentValue))) {
      this.errors.push({
        field: this.currentField,
        message: message || `${this.currentField} must be a valid date`
      });
    }
    return this;
  }

  url(message) {
    try {
      if (this.currentValue) {
        new URL(this.currentValue);
      }
    } catch {
      this.errors.push({
        field: this.currentField,
        message: message || `${this.currentField} must be a valid URL`
      });
    }
    return this;
  }

  custom(validatorFn, message) {
    if (this.currentValue !== undefined && this.currentValue !== null) {
      const isValid = validatorFn(this.currentValue);
      if (!isValid) {
        this.errors.push({
          field: this.currentField,
          message: message || `${this.currentField} is invalid`
        });
      }
    }
    return this;
  }

  throwIfInvalid() {
    if (this.errors.length > 0) {
      throw new ValidationError('Validation failed', this.errors);
    }
    return this;
  }

  isValid() {
    return this.errors.length === 0;
  }

  getErrors() {
    return this.errors;
  }
}

const validateRequest = (validationSchema) => {
  return (req, res, next) => {
    try {
      const validator = Validator.create();
      
      Object.keys(validationSchema).forEach(field => {
        const value = req.body[field];
        const rules = validationSchema[field];
        
        if (typeof rules === 'function') {
          rules(validator.validate(value, field));
        }
      });

      validator.throwIfInvalid();
      next();
    } catch (error) {
      next(error);
    }
  };
};

const validateParams = (paramSchema) => {
  return (req, res, next) => {
    try {
      const validator = Validator.create();
      
      Object.keys(paramSchema).forEach(param => {
        const value = req.params[param];
        const rules = paramSchema[param];
        
        if (typeof rules === 'function') {
          rules(validator.validate(value, param));
        }
      });

      validator.throwIfInvalid();
      next();
    } catch (error) {
      next(error);
    }
  };
};

const validateQuery = (querySchema) => {
  return (req, res, next) => {
    try {
      const validator = Validator.create();
      
      Object.keys(querySchema).forEach(key => {
        const value = req.query[key];
        const rules = querySchema[key];
        
        if (typeof rules === 'function') {
          rules(validator.validate(value, key));
        }
      });

      validator.throwIfInvalid();
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  Validator,
  validateRequest,
  validateParams,
  validateQuery
};
