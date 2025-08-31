// Notion Middleware
// Handles transformation of raw Notion API responses to frontend-friendly format

import {
  mapNotionTypeToFormType as mapTypeFromUtils,
  generatePlaceholder as generatePlaceholderFromUtils,
  getFieldIcon as getDefaultIconFromUtils,
} from '../utils/mappingUtils.js'

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
  static convertToNotionProperties(data, schema = null) {
    const properties = {}

    Object.entries(data).forEach(([key, value]) => {
      if (!value || value === '') return // Skip empty values

      // If we have a schema, use it to determine the exact property type
      if (schema && schema.properties && schema.properties[key]) {
        const property = schema.properties[key]

        switch (property.type) {
          case 'title':
            properties[key] = { title: [{ text: { content: value } }] }
            break
          case 'rich_text':
            properties[key] = { rich_text: [{ text: { content: String(value) } }] }
            break
          case 'email':
            properties[key] = { email: value }
            break
          case 'phone_number':
            properties[key] = { phone_number: value }
            break
          case 'url':
            properties[key] = { url: value }
            break
          case 'select':
            properties[key] = { select: { name: value } }
            break
          case 'multi_select':
            if (Array.isArray(value)) {
              properties[key] = { multi_select: value.map((item) => ({ name: item })) }
            } else {
              properties[key] = { multi_select: [] }
            }
            break
          case 'checkbox':
            properties[key] = { checkbox: Boolean(value) }
            break
          case 'number':
            properties[key] = { number: Number(value) || 0 }
            break
          case 'date':
            properties[key] = { date: { start: value } }
            break
          case 'status':
            properties[key] = { status: { name: value } }
            break
          default:
            // Fallback to rich_text for unknown types
            properties[key] = { rich_text: [{ text: { content: String(value) } }] }
        }
      } else {
        // Fallback to the old logic when no schema is available
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
      }
    })

    return properties
  }

  // Extract database metadata from raw Notion response
  static extractDatabaseInfo(database) {
    // extractDatabaseInfo called

    // Use properties as they come from Notion (no artificial reordering)
    const properties = database.properties || {}
    // Database properties

    // Generate schema from properties
    const schema = this.generateSchema(properties, database.title?.[0]?.plain_text || 'Database')
    // Generated schema

    const result = {
      id: database.id,
      title: database.title?.[0]?.plain_text || 'Untitled Database',
      description: database.description?.[0]?.plain_text || '',
      properties: properties,
      schema: schema,
      created_time: database.created_time,
      last_edited_time: database.last_edited_time,
    }

    // Final result
    return result
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
    // generateSchema called

    const schemaProperties = {}

    Object.entries(properties || {}).forEach(([key, property]) => {
      if (key !== 'id' && key !== 'created_time' && key !== 'last_edited_time') {
        // Processing property
        // Property icon extraction
        // Property emoji extraction

        const extractedIcon = this.extractPropertyIcon(property)
        const extractedEmoji = this.extractPropertyEmoji(property)
        const defaultIcon = this.getDefaultIcon(key, property.type)

        // Property final icons
        // Property complete structure

        schemaProperties[key] = {
          type: property.type || 'rich_text',
          required: false,
          // Extract icon information if available, with fallback to default icons
          icon: extractedIcon || defaultIcon,
          // Extract emoji if available
          emoji: extractedEmoji,
        }

        // Add options for select and multiselect fields
        if (property.type === 'select' || property.type === 'multi_select') {
          if (property.select?.options || property.multi_select?.options) {
            const options = property.select?.options || property.multi_select?.options

            // Try different property names for the option value
            const firstOption = options[0]

            // Check all available properties on the first option
            const availableKeys = Object.keys(firstOption || {})

            let valueKey = null
            let labelKey = null

            // Look for common property names that might contain the option text
            if (firstOption) {
              if (firstOption.name) {
                valueKey = 'name'
                labelKey = 'name'
              } else if (firstOption.value) {
                valueKey = 'value'
                labelKey = 'value'
              } else if (firstOption.id) {
                valueKey = 'id'
                labelKey = 'id'
              } else if (firstOption.text) {
                valueKey = 'text'
                labelKey = 'text'
              } else if (firstOption.content) {
                valueKey = 'content'
                labelKey = 'content'
              } else if (firstOption.title) {
                valueKey = 'title'
                labelKey = 'title'
              } else if (firstOption.label) {
                valueKey = 'label'
                labelKey = 'label'
              }
            }

            // If we still don't have keys, try to find any property that contains text
            if (!valueKey) {
              for (const key of availableKeys) {
                const value = firstOption[key]
                if (typeof value === 'string' && value.trim() && key !== 'color') {
                  valueKey = key
                  labelKey = key
                  break
                }
              }
            }

            schemaProperties[key].options = options.map((option, index) => {
              const optionValue = valueKey ? option[valueKey] : null
              const optionLabel = labelKey ? option[labelKey] : null

              return {
                value:
                  optionValue ||
                  option.name ||
                  option.value ||
                  option.id ||
                  option.text ||
                  option.content ||
                  option.title ||
                  option.label ||
                  `Option ${index + 1}`,
                label:
                  optionLabel ||
                  option.name ||
                  option.value ||
                  option.id ||
                  option.text ||
                  option.content ||
                  option.title ||
                  option.label ||
                  `Option ${index + 1}`,
                color: option.color,
              }
            })
          }
        }
      }
    })

    const result = {
      id: 'inferred',
      title,
      properties: schemaProperties,
    }

    // generateSchema result
    return result
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
    return mapTypeFromUtils(notionType)
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
        // Include icon information with fallback to default icons
        icon: this.extractPropertyIcon(property) || this.getDefaultIcon(key, property.type),
        emoji: this.extractPropertyEmoji(property) || null,
      }

      // Add options for select fields
      if (property.options && property.options.length > 0) {
        // Adding options for field
        field.options = property.options.map((option) => ({
          value: option.name,
          label: option.name,
          color: option.color,
        }))
      } else {
        // No options for field
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
    return generatePlaceholderFromUtils(fieldName, type)
  }

  // Extract property icon from Notion API response
  static extractPropertyIcon(property) {
    // Notion property icons can be stored in different ways
    // Check for direct icon property
    if (property.icon) {
      return property.icon
    }

    // Check for icon in property metadata
    if (property.metadata && property.metadata.icon) {
      return property.metadata.icon
    }

    // Check for icon in property configuration
    if (property.config && property.config.icon) {
      return property.config.icon
    }

    // Check for icon in property format
    if (property.format && property.format.icon) {
      return property.format.icon
    }

    // Check for icon in property options (for select/multi_select)
    if (property.select && property.select.icon) {
      return property.select.icon
    }

    if (property.multi_select && property.multi_select.icon) {
      return property.multi_select.icon
    }

    // Check for icon in property's parent or related fields
    if (property.parent && property.parent.icon) {
      return property.parent.icon
    }

    // Check for icon in property's base configuration
    if (property.base && property.base.icon) {
      return property.base.icon
    }

    return null
  }

  // Extract property emoji from Notion API response
  static extractPropertyEmoji(property) {
    // Notion property emojis can be stored in different ways
    // Check for direct emoji property
    if (property.emoji) {
      return property.emoji
    }

    // Check for emoji in property metadata
    if (property.metadata && property.metadata.emoji) {
      return property.metadata.emoji
    }

    // Check for emoji in property configuration
    if (property.config && property.config.emoji) {
      return property.config.emoji
    }

    // Check for emoji in property format
    if (property.format && property.format.emoji) {
      return property.format.emoji
    }

    // Check for emoji in property options (for select/multi_select)
    if (property.select && property.select.emoji) {
      return property.select.emoji
    }

    if (property.multi_select && property.multi_select.emoji) {
      return property.multi_select.emoji
    }

    // Check for emoji in property's parent or related fields
    if (property.parent && property.parent.emoji) {
      return property.parent.emoji
    }

    // Check for emoji in property's base configuration
    if (property.base && property.base.emoji) {
      return property.base.emoji
    }

    return null
  }

  // Get default icon for field based on name or type
  static getDefaultIcon(fieldName, type) {
    return getDefaultIconFromUtils(fieldName, type)
  }
}

export default NotionMiddleware
