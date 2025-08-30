// Notion Middleware
// Handles transformation of raw Notion API responses to frontend-friendly format

class NotionMiddleware {
  // Transform raw Notion properties to simple key-value pairs
  static flattenProperties(properties) {
    const result = {}

    Object.entries(properties || {}).forEach(([key, property]) => {
      switch (property.type) {
        case 'title':
          result[key] = property.title?.map((t) => t.plain_text).join('') || ''
          break
        case 'rich_text':
          result[key] = property.rich_text?.map((t) => t.plain_text).join('') || ''
          break
        case 'email':
          result[key] = property.email || ''
          break
        case 'phone_number':
          result[key] = property.phone_number || ''
          break
        case 'url':
          result[key] = property.url || ''
          break
        case 'select':
          result[key] = property.select?.name || ''
          break
        case 'multi_select':
          result[key] = property.multi_select?.map((s) => s.name) || []
          break
        case 'checkbox':
          result[key] = property.checkbox || false
          break
        case 'number':
          result[key] = property.number || 0
          break
        case 'date':
          result[key] = property.date?.start || ''
          break
        case 'status':
          result[key] = property.status?.name || ''
          break
        default:
          result[key] = ''
      }
    })

    return result
  }

  // Convert form data to Notion properties
  static convertToNotionProperties(data) {
    const properties = {}

    Object.entries(data).forEach(([key, value]) => {
      if (!value || value === '') return // Skip empty values

      // Handle different property types based on common field names and value patterns
      if (key.toLowerCase().includes('email')) {
        properties[key] = { email: value }
      } else if (key.toLowerCase().includes('phone')) {
        properties[key] = { phone_number: value }
      } else if (
        key.toLowerCase().includes('url') ||
        key.toLowerCase().includes('link') ||
        (typeof value === 'string' && (value.startsWith('http') || value.startsWith('www')))
      ) {
        properties[key] = { url: value }
      } else if (key.toLowerCase() === 'name' || key.toLowerCase().includes('title')) {
        properties[key] = { title: [{ text: { content: value } }] }
      } else if (typeof value === 'boolean') {
        properties[key] = { checkbox: value }
      } else if (typeof value === 'number') {
        properties[key] = { number: value }
      } else if (Array.isArray(value)) {
        properties[key] = { multi_select: value.map((item) => ({ name: item })) }
      } else if (value && typeof value === 'string' && value.includes(',')) {
        const items = value
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item)
        properties[key] = { multi_select: items.map((item) => ({ name: item })) }
      } else {
        properties[key] = { rich_text: [{ text: { content: String(value) } }] }
      }
    })

    return properties
  }

  // Extract database metadata from raw Notion response
  static extractDatabaseInfo(database) {
    // Reverse the order of properties as they come from Notion
    const sortedProperties = {}
    if (database.properties) {
      Object.entries(database.properties)
        .reverse()
        .forEach(([key, value]) => {
          sortedProperties[key] = value
        })
    }
    console.log('Database info:', sortedProperties)
    return {
      id: database.id,
      title: database.title?.[0]?.plain_text || 'Untitled Database',
      description: database.description?.[0]?.plain_text || '',
      properties: sortedProperties,
      created_time: database.created_time,
      last_edited_time: database.last_edited_time,
    }
  }

  // Transform raw Notion page to flattened format
  static transformPage(page) {
    return {
      id: page.id,
      created_time: page.created_time,
      last_edited_time: page.last_edited_time,
      ...this.flattenProperties(page.properties),
    }
  }

  // Transform raw Notion response with results
  static transformResultsResponse(response) {
    if (!response.success || !response.results) {
      return response
    }

    return {
      ...response,
      results: response.results.map((page) => this.transformPage(page)),
    }
  }

  // Transform raw Notion response with single result
  static transformResultResponse(response) {
    if (!response.success || !response.result) {
      return response
    }

    return {
      ...response,
      result: this.transformPage(response.result),
    }
  }

  // Generate schema from raw Notion properties
  static generateSchema(properties, title = 'Database') {
    const schemaProperties = {}

    Object.entries(properties || {}).forEach(([key, property]) => {
      if (key !== 'id' && key !== 'created_time' && key !== 'last_edited_time') {
        schemaProperties[key] = {
          type: property.type || 'rich_text',
          required: false,
        }
      }
    })

    return {
      id: 'inferred',
      title,
      properties: schemaProperties,
    }
  }

  // Validate form data based on schema
  static validateFormData(data, schema) {
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
          case 'email': {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(value)) {
              errors[key] = 'Please enter a valid email address'
            }
            break
          }
          case 'url': {
            try {
              new URL(value)
            } catch {
              if (!value.startsWith('http://') && !value.startsWith('https://')) {
                errors[key] = 'Please enter a valid URL (include http:// or https://)'
              }
            }
            break
          }
          case 'phone_number': {
            const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
            if (!phoneRegex.test(value.replace(/[\s\-()]/g, ''))) {
              errors[key] = 'Please enter a valid phone number'
            }
            break
          }
        }
      }
    })

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  }

  // Format field name to readable label
  static formatLabel(fieldName) {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim()
  }

  // Map Notion property types to HTML form input types
  static mapNotionTypeToFormType(notionType) {
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

  // Generate form fields from schema
  static generateFormFields(schema) {
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
        field.pattern = '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$'
      }

      if (property.type === 'url') {
        field.pattern = 'https?://.+'
      }

      fields.push(field)
    })

    return fields
  }

  // Generate placeholder text
  static generatePlaceholder(fieldName, type) {
    const typePlaceholders = {
      email: 'Enter email address',
      phone_number: 'Enter phone number',
      url: 'Enter URL',
      number: 'Enter number',
      date: 'Select date',
    }

    if (typePlaceholders[type]) {
      return typePlaceholders[type]
    }

    return `Enter ${this.formatLabel(fieldName).toLowerCase()}`
  }
}

export default NotionMiddleware
