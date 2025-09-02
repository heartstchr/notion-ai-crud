// Services Index
// Central export point for all application services

export { default as ItemService } from './itemService.js'
export { default as NotionMiddleware } from './notionMiddleware.js'
export { default as ValidationService } from './validationService.js'

// Re-export commonly used validation methods for convenience
export {
  validateFormData,
  validateField,
  validateFieldWithRules,
  formatLabel,
  hasErrors,
  getFirstError,
  getAllErrors,
} from './validationService.js'
