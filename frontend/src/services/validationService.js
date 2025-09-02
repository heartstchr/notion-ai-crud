// Validation Service
// Centralized validation logic for the entire application

class ValidationService {
  // Validation patterns (memoized for performance)
  static PATTERNS = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[+]?[1-9][\d]{0,15}$/,
    url: /^https?:\/\/.+/,
    phoneClean: /^[+]?[1-9][\d]{0,15}$/,
  }

  // Main validation method for form data
  static validateFormData(data, schema) {
    if (!schema || !schema.properties) {
      return { isValid: true, errors: {} }
    }

    const errors = {}

    Object.entries(schema.properties).forEach(([key, property]) => {
      const value = data[key]
      const validationResult = this.validateField(key, value, property)

      if (!validationResult.isValid) {
        errors[key] = validationResult.error
      }
    })

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  }

  // Validate individual field
  static validateField(fieldName, value, property) {
    // Check required fields
    if (property.required && !this.hasValue(value)) {
      return {
        isValid: false,
        error: `${this.formatLabel(fieldName)} is required`,
      }
    }

    // Skip validation for empty non-required fields
    if (!this.hasValue(value)) {
      return { isValid: true }
    }

    // Type-specific validation
    switch (property.type) {
      case 'email':
        return this.validateEmail(value, fieldName)

      case 'url':
        return this.validateUrl(value, fieldName)

      case 'phone_number':
        return this.validatePhone(value, fieldName)

      case 'number':
        return this.validateNumber(value, property, fieldName)

      case 'select':
        return this.validateSelect(value, property, fieldName)

      case 'multi_select':
        return this.validateMultiSelect(value, property, fieldName)

      case 'date':
        return this.validateDate(value, fieldName)

      case 'checkbox':
        return this.validateCheckbox(value, fieldName)

      case 'rich_text':
      case 'title':
        return this.validateText(value, property, fieldName)

      default:
        return { isValid: true }
    }
  }

  // Value existence check
  static hasValue(value) {
    if (value === null || value === undefined) return false
    if (typeof value === 'string') return value.trim().length > 0
    if (Array.isArray(value)) return value.length > 0
    return true
  }

  // Email validation
  static validateEmail(value, fieldName) {
    if (!this.PATTERNS.email.test(value)) {
      return {
        isValid: false,
        error: 'Please enter a valid email address',
      }
    }
    return { isValid: true }
  }

  // URL validation
  static validateUrl(value, fieldName) {
    try {
      new URL(value)
      return { isValid: true }
    } catch {
      if (!value.startsWith('http://') && !value.startsWith('https://')) {
        return {
          isValid: false,
          error: 'Please enter a valid URL (include http:// or https://)',
        }
      }
    }
    return { isValid: true }
  }

  // Phone validation
  static validatePhone(value, fieldName) {
    const cleanPhone = value.replace(/[\s\-()]/g, '')
    if (!this.PATTERNS.phoneClean.test(cleanPhone)) {
      return {
        isValid: false,
        error: 'Please enter a valid phone number',
      }
    }
    return { isValid: true }
  }

  // Number validation
  static validateNumber(value, property, fieldName) {
    const numValue = Number(value)

    if (isNaN(numValue)) {
      return {
        isValid: false,
        error: `${this.formatLabel(fieldName)} must be a valid number`,
      }
    }

    // Check min/max constraints if defined
    if (property.number?.minimum !== undefined && numValue < property.number.minimum) {
      return {
        isValid: false,
        error: `${this.formatLabel(fieldName)} must be at least ${property.number.minimum}`,
      }
    }

    if (property.number?.maximum !== undefined && numValue > property.number.maximum) {
      return {
        isValid: false,
        error: `${this.formatLabel(fieldName)} must be at most ${property.number.maximum}`,
      }
    }

    return { isValid: true }
  }

  // Select validation
  static validateSelect(value, property, fieldName) {
    if (!property.options || property.options.length === 0) {
      return { isValid: true }
    }

    const validOptions = property.options.map((opt) => opt.value || opt.name)
    if (!validOptions.includes(value)) {
      return {
        isValid: false,
        error: `${this.formatLabel(fieldName)} must be one of the available options`,
      }
    }

    return { isValid: true }
  }

  // Multi-select validation
  static validateMultiSelect(value, property, fieldName) {
    if (!Array.isArray(value)) {
      return {
        isValid: false,
        error: `${this.formatLabel(fieldName)} must be a list of options`,
      }
    }

    if (!property.options || property.options.length === 0) {
      return { isValid: true }
    }

    const validOptions = property.options.map((opt) => opt.value || opt.name)
    const invalidValues = value.filter((v) => !validOptions.includes(v))

    if (invalidValues.length > 0) {
      return {
        isValid: false,
        error: `${this.formatLabel(fieldName)} contains invalid options`,
      }
    }

    return { isValid: true }
  }

  // Date validation
  static validateDate(value, fieldName) {
    const date = new Date(value)
    if (isNaN(date.getTime())) {
      return {
        isValid: false,
        error: `${this.formatLabel(fieldName)} must be a valid date`,
      }
    }
    return { isValid: true }
  }

  // Checkbox validation
  static validateCheckbox(value, fieldName) {
    if (typeof value !== 'boolean') {
      return {
        isValid: false,
        error: `${this.formatLabel(fieldName)} must be true or false`,
      }
    }
    return { isValid: true }
  }

  // Text validation
  static validateText(value, property, fieldName) {
    if (typeof value !== 'string') {
      return {
        isValid: false,
        error: `${this.formatLabel(fieldName)} must be text`,
      }
    }

    // Check min/max length if defined
    if (property.minLength !== undefined && value.length < property.minLength) {
      return {
        isValid: false,
        error: `${this.formatLabel(fieldName)} must be at least ${property.minLength} characters`,
      }
    }

    if (property.maxLength !== undefined && value.length > property.maxLength) {
      return {
        isValid: false,
        error: `${this.formatLabel(fieldName)} must be at most ${property.maxLength} characters`,
      }
    }

    return { isValid: true }
  }

  // Validate specific field types with custom rules
  static validateFieldWithRules(fieldName, value, rules) {
    const errors = []

    // Required validation
    if (rules.required && !this.hasValue(value)) {
      errors.push(`${this.formatLabel(fieldName)} is required`)
    }

    // Skip other validations if field is empty and not required
    if (!this.hasValue(value) && !rules.required) {
      return { isValid: true, errors: [] }
    }

    // Custom validation rules
    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push(rules.message || `${this.formatLabel(fieldName)} format is invalid`)
    }

    if (rules.minLength && value.length < rules.minLength) {
      errors.push(`${this.formatLabel(fieldName)} must be at least ${rules.minLength} characters`)
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(`${this.formatLabel(fieldName)} must be at most ${rules.maxLength} characters`)
    }

    if (rules.min !== undefined && Number(value) < rules.min) {
      errors.push(`${this.formatLabel(fieldName)} must be at least ${rules.min}`)
    }

    if (rules.max !== undefined && Number(value) > rules.max) {
      errors.push(`${this.formatLabel(fieldName)} must be at most ${rules.max}`)
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  // Bulk validation for multiple fields
  static validateFields(fields) {
    const results = {}
    let hasErrors = false

    Object.entries(fields).forEach(([fieldName, fieldData]) => {
      const validation = this.validateField(fieldName, fieldData.value, fieldData)
      results[fieldName] = validation

      if (!validation.isValid) {
        hasErrors = true
      }
    })

    return {
      isValid: !hasErrors,
      results,
    }
  }

  // Format field name to readable label
  static formatLabel(fieldName) {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim()
  }

  // Get validation rules for a field type
  static getValidationRules(fieldType, fieldName = '') {
    const baseRules = {
      required: false,
      message: '',
    }

    switch (fieldType) {
      case 'email':
        return {
          ...baseRules,
          pattern: this.PATTERNS.email,
          message: 'Please enter a valid email address',
        }

      case 'phone_number':
        return {
          ...baseRules,
          pattern: this.PATTERNS.phoneClean,
          message: 'Please enter a valid phone number',
        }

      case 'url':
        return {
          ...baseRules,
          pattern: this.PATTERNS.url,
          message: 'Please enter a valid URL',
        }

      case 'number':
        return {
          ...baseRules,
          min: undefined,
          max: undefined,
        }

      case 'rich_text':
      case 'title':
        return {
          ...baseRules,
          minLength: undefined,
          maxLength: undefined,
        }

      default:
        return baseRules
    }
  }

  // Clear validation errors
  static clearErrors() {
    return {}
  }

  // Check if validation errors exist
  static hasErrors(errors) {
    return errors && Object.keys(errors).length > 0
  }

  // Get first error message
  static getFirstError(errors) {
    if (!this.hasErrors(errors)) return null

    const firstKey = Object.keys(errors)[0]
    return errors[firstKey]
  }

  // Get all error messages as array
  static getAllErrors(errors) {
    if (!this.hasErrors(errors)) return []

    return Object.values(errors)
  }
}

export default ValidationService
