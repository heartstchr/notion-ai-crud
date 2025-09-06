// Item Management Service
// Service layer for managing items with dynamic schema support

import NotionMiddleware from './notionMiddleware.js'
import ValidationService from './validationService.js'

const API_BASE = '/.netlify/functions'

class ItemService {
  constructor() {
    this.cache = new Map()
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

  // Get database info directly from Notion
  async getDatabaseInfo() {
    const response = await this.apiRequest('/notion-crud?info=true')

    if (response.success && response.database) {
      const extractedInfo = NotionMiddleware.extractDatabaseInfo(response.database)
      console.log('extractedInfo', extractedInfo)
      return extractedInfo
    }

    throw new Error('Could not get database information')
  }

  // Get all items
  async getAllItems(options = {}) {
    const { pageSize = 50, startCursor, useCache = true } = options
    const cacheKey = `all_items_${pageSize}_${startCursor || 'first'}`

    if (useCache && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      if (Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data
      }
    }

    const params = new URLSearchParams()
    if (pageSize) params.append('page_size', pageSize)
    if (startCursor) params.append('start_cursor', startCursor)

    const endpoint = `/notion-crud?${params.toString()}`
    const response = await this.apiRequest(endpoint)

    if (response.success && response.results) {
      const transformedResponse = NotionMiddleware.transformResultsResponse(response)

      if (useCache) {
        this.cache.set(cacheKey, {
          data: transformedResponse,
          timestamp: Date.now(),
        })
      }

      return transformedResponse
    }

    if (useCache) {
      this.cache.set(cacheKey, {
        data: response,
        timestamp: Date.now(),
      })
    }

    return response
  }

  // Get specific item
  async getItem(id) {
    const cacheKey = `item_${id}`

    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      if (Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data
      }
    }

    const response = await this.apiRequest(`/notion-crud?id=${id}`)

    if (response.success && response.result) {
      const transformedResponse = NotionMiddleware.transformResultResponse(response)

      this.cache.set(cacheKey, {
        data: transformedResponse,
        timestamp: Date.now(),
      })

      return transformedResponse
    }

    this.cache.set(cacheKey, {
      data: response,
      timestamp: Date.now(),
    })

    return response
  }

  // Create new item
  async createItem(data, schema = null) {
    // Convert form data to Notion properties format
    const notionProperties = NotionMiddleware.convertToNotionProperties(data, schema)

    const response = await this.apiRequest('/notion-crud', {
      method: 'POST',
      body: JSON.stringify(notionProperties),
    })

    // Transform the response to match the frontend format
    if (response.success && response.result) {
      const transformedResponse = NotionMiddleware.transformResultResponse(response)
      this.clearCacheByPattern('all_items_')
      return transformedResponse
    }

    this.clearCacheByPattern('all_items_')
    return response
  }

  // Update item
  async updateItem(id, data, schema = null) {
    // Convert form data to Notion properties format
    const notionProperties = NotionMiddleware.convertToNotionProperties(data, schema)

    const response = await this.apiRequest(`/notion-crud?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(notionProperties),
    })

    // Transform the response to match the frontend format
    if (response.success && response.result) {
      const transformedResponse = NotionMiddleware.transformResultResponse(response)
      this.clearCacheByPattern('all_items_')
      this.cache.delete(`item_${id}`)
      return transformedResponse
    }

    this.clearCacheByPattern('all_items_')
    this.cache.delete(`item_${id}`)
    return response
  }

  // Delete item
  async deleteItem(id) {
    try {
      const response = await this.apiRequest(`/notion-crud?id=${id}`, {
        method: 'DELETE',
      })

      this.clearCacheByPattern('all_items_')
      this.cache.delete(`item_${id}`)

      return response
    } catch (error) {
      console.error('Error deleting item:', error)
      throw error
    }
  }

  // Utility method to generate form fields from schema
  generateFormFields(schema) {
    return NotionMiddleware.generateFormFields(schema)
  }

  // Format field name to readable label
  formatLabel(fieldName) {
    return NotionMiddleware.formatLabel(fieldName)
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
  }

  // Validate form data based on schema
  validateFormData(data, schema) {
    return ValidationService.validateFormData(data, schema)
  }
}

// Export singleton instance
export default new ItemService()
