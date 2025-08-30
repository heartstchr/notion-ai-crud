// Talent Pool Service
// Service layer for managing talent profiles with dynamic schema support

const API_BASE = '/.netlify/functions'

class TalentService {
  constructor() {
    this.cache = new Map()
    this.schemaCache = null
    this.schemaCacheTime = null
    this.CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
  }

  // Helper method for API requests
  async apiRequest(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`

    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Get database schema (cached for performance)
  async getDatabaseSchema(forceRefresh = false) {
    const now = Date.now()

    if (
      !forceRefresh &&
      this.schemaCache &&
      this.schemaCacheTime &&
      now - this.schemaCacheTime < this.CACHE_DURATION
    ) {
      return this.schemaCache
    }

    try {
      const response = await this.apiRequest('/get-database-schema')
      this.schemaCache = response.database
      this.schemaCacheTime = now
      return this.schemaCache
    } catch (error) {
      console.error('Failed to fetch database schema:', error)
      throw error
    }
  }

  // Get all talent profiles
  async getAllTalents(options = {}) {
    const { pageSize = 50, startCursor, useCache = true } = options

    const cacheKey = `all_talents_${pageSize}_${startCursor || 'first'}`

    if (useCache && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      if (Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data
      }
    }

    try {
      const params = new URLSearchParams()
      if (pageSize) params.append('page_size', pageSize)
      if (startCursor) params.append('start_cursor', startCursor)

      const response = await this.apiRequest(`/talent-crud?${params.toString()}`)

      if (useCache) {
        this.cache.set(cacheKey, {
          data: response,
          timestamp: Date.now(),
        })
      }

      return response
    } catch (error) {
      console.error('Failed to fetch talent profiles:', error)
      throw error
    }
  }

  // Get specific talent profile
  async getTalent(id) {
    const cacheKey = `talent_${id}`

    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      if (Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data
      }
    }

    try {
      const response = await this.apiRequest(`/talent-crud?id=${id}`)

      this.cache.set(cacheKey, {
        data: response,
        timestamp: Date.now(),
      })

      return response
    } catch (error) {
      console.error(`Failed to fetch talent profile ${id}:`, error)
      throw error
    }
  }

  // Create new talent profile
  async createTalent(data) {
    try {
      const response = await this.apiRequest('/talent-crud', {
        method: 'POST',
        body: JSON.stringify(data),
      })

      // Clear relevant caches
      this.clearCacheByPattern('all_talents_')

      return response
    } catch (error) {
      console.error('Failed to create talent profile:', error)
      throw error
    }
  }

  // Update talent profile
  async updateTalent(id, data) {
    try {
      const response = await this.apiRequest(`/talent-crud?id=${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })

      // Clear relevant caches
      this.clearCacheByPattern('all_talents_')
      this.cache.delete(`talent_${id}`)

      return response
    } catch (error) {
      console.error(`Failed to update talent profile ${id}:`, error)
      throw error
    }
  }

  // Delete talent profile
  async deleteTalent(id) {
    try {
      const response = await this.apiRequest(`/talent-crud?id=${id}`, {
        method: 'DELETE',
      })

      // Clear relevant caches
      this.clearCacheByPattern('all_talents_')
      this.cache.delete(`talent_${id}`)

      return response
    } catch (error) {
      console.error(`Failed to delete talent profile ${id}:`, error)
      throw error
    }
  }

  // Utility method to generate form fields from schema
  generateFormFields(schema) {
    if (!schema || !schema.properties) {
      return []
    }

    const fields = []

    Object.entries(schema.properties).forEach(([key, property]) => {
      const field = {
        name: key,
        label: this.formatLabel(key),
        type: this.mapNotionTypeToFormType(property.type),
        required: property.required || false,
        placeholder: this.generatePlaceholder(key, property.type),
      }

      // Add options for select fields
      if (property.options && property.options.length > 0) {
        field.options = property.options.map((option) => ({
          value: option.name,
          label: option.name,
          color: option.color,
        }))
      }

      // Add specific configurations
      if (property.type === 'number') {
        field.min = 0
        field.step = property.format === 'dollar' ? 0.01 : 1
      }

      if (property.type === 'email') {
        field.pattern = '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'
      }

      if (property.type === 'url') {
        field.pattern = 'https?://.+'
      }

      fields.push(field)
    })

    // Sort fields with common fields first
    const fieldOrder = ['Name', 'Email', 'Phone', 'Skills', 'Portfolio Link']

    return fields.sort((a, b) => {
      const aIndex = fieldOrder.indexOf(a.name)
      const bIndex = fieldOrder.indexOf(b.name)

      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
      if (aIndex !== -1) return -1
      if (bIndex !== -1) return 1
      return a.name.localeCompare(b.name)
    })
  }

  // Map Notion property types to HTML form input types
  mapNotionTypeToFormType(notionType) {
    const typeMap = {
      title: 'text',
      rich_text: 'textarea',
      email: 'email',
      phone_number: 'tel',
      url: 'url',
      number: 'number',
      select: 'select',
      multi_select: 'multiselect',
      checkbox: 'checkbox',
      date: 'date',
      status: 'select',
    }

    return typeMap[notionType] || 'text'
  }

  // Format field name to readable label
  formatLabel(fieldName) {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim()
  }

  // Generate placeholder text
  generatePlaceholder(fieldName, type) {
    const placeholders = {
      Name: 'Enter full name',
      Email: 'Enter email address',
      Phone: 'Enter phone number',
      Skills: 'Enter skills separated by commas',
      'Portfolio Link': 'Enter portfolio URL',
    }

    if (placeholders[fieldName]) {
      return placeholders[fieldName]
    }

    switch (type) {
      case 'email':
        return 'Enter email address'
      case 'phone_number':
        return 'Enter phone number'
      case 'url':
        return 'Enter URL'
      case 'number':
        return 'Enter number'
      case 'date':
        return 'Select date'
      default:
        return `Enter ${this.formatLabel(fieldName).toLowerCase()}`
    }
  }

  // Clear cache entries matching pattern
  clearCacheByPattern(pattern) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    }
  }

  // Clear all cache
  clearCache() {
    this.cache.clear()
    this.schemaCache = null
    this.schemaCacheTime = null
  }

  // Validate form data based on schema
  validateFormData(data, schema) {
    const errors = {}

    if (!schema || !schema.properties) {
      return { isValid: true, errors: {} }
    }

    Object.entries(schema.properties).forEach(([key, property]) => {
      const value = data[key]

      // Check required fields
      if (property.required && (!value || value.toString().trim() === '')) {
        errors[key] = `${this.formatLabel(key)} is required`
        return
      }

      // Type-specific validation
      if (value && value.toString().trim() !== '') {
        switch (property.type) {
          case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(value)) {
              errors[key] = 'Please enter a valid email address'
            }
            break

          case 'url':
            try {
              new URL(value)
            } catch {
              if (!value.startsWith('http://') && !value.startsWith('https://')) {
                errors[key] = 'Please enter a valid URL (include http:// or https://)'
              }
            }
            break

          case 'phone_number':
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
              errors[key] = 'Please enter a valid phone number'
            }
            break
        }
      }
    })

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  }
}

// Export singleton instance
export default new TalentService()
