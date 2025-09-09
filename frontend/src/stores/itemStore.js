import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import itemService from '../services/itemService.js'
import ValidationService from '../services/validationService.js'

export const useItemStore = defineStore('item', () => {
  // State
  const items = ref([])
  const currentItem = ref(null)
  const schema = ref(null)
  const databaseInfo = ref(null)
  const loading = ref(false)
  const submitting = ref(false)
  const error = ref(null)

  // Getters
  const getItemById = computed(() => {
    return (id) => items.value.find((item) => item.id === id)
  })

  const itemsCount = computed(() => items.value.length)

  const hasSchema = computed(() => schema.value !== null)

  const hasDatabaseInfo = computed(() => databaseInfo.value !== null)

  const isFullyLoaded = computed(() => hasSchema.value && hasDatabaseInfo.value)

  const formFields = computed(() => {
    if (!schema.value) return {}
    return itemService.generateFormFields(schema.value)
  })

  // Actions
  const fetchAllItems = async () => {
    try {
      loading.value = true
      error.value = null

      const response = await itemService.getAllItems()
      if (response.success && response.results) {
        items.value = response.results
      } else {
        throw new Error(response.message || 'Failed to fetch items')
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch items'
      console.error('Error fetching items:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchItem = async (id) => {
    try {
      loading.value = true
      error.value = null

      const response = await itemService.getItem(id)
      if (response.success && response.result) {
        currentItem.value = response.result
        return response.result
      } else {
        throw new Error(response.message || 'Failed to fetch item')
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch item'
      console.error('Error fetching item:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchSchema = async (force = false) => {
    // If we already have the schema and don't need to force refresh, return it
    if (!force && isFullyLoaded.value) {
      // Schema already loaded, returning cached data
      return schema.value
    }

    try {
      loading.value = true
      error.value = null

      // Fetching schema from API
      const response = await itemService.getDatabaseInfo()
      if (response.schema) {
        schema.value = response.schema
        databaseInfo.value = response // Store the full database info
        // Schema loaded successfully
        return response.schema
      } else {
        throw new Error('No database schema available')
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch schema'
      console.error('Error fetching schema:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getDatabaseInfo = () => {
    // Return database info from the stored databaseInfo without making an API call
    // getDatabaseInfo called

    if (databaseInfo.value) {
      const result = {
        title: databaseInfo.value.title,
        description: databaseInfo.value.description,
        schema: databaseInfo.value.schema,
      }
      // Returning database info
      return result
    }

    // No database info available
    return null
  }

  const ensureSchemaLoaded = async () => {
    // Only fetch if we don't have the data
    if (!isFullyLoaded.value) {
      // Schema not fully loaded, fetching
      await fetchSchema()
    } else {
      // Schema already loaded, no fetch needed
    }
  }

  const validateFormData = (data, schema) => {
    return ValidationService.validateFormData(data, schema)
  }

  const createItem = async (itemData) => {
    try {
      submitting.value = true
      error.value = null

      const response = await itemService.createItem(itemData, schema.value)
      if (response.success && response.result) {
        // Add the new item to the list
        items.value.unshift(response.result)
        return response.result
      } else {
        throw new Error(response.message || 'Failed to create item')
      }
    } catch (err) {
      error.value = err.message || 'Failed to create item'
      console.error('Error creating item:', err)
      throw err
    } finally {
      submitting.value = false
    }
  }

  const updateItem = async (id, itemData) => {
    try {
      submitting.value = true
      error.value = null

      // Updating item

      const response = await itemService.updateItem(id, itemData, schema.value)
      // Update response

      if (response.success && response.result) {
        // The response.result should now be the transformed item data
        const updatedItem = response.result

        // Update the item in the list
        const index = items.value.findIndex((item) => item.id === id)
        if (index !== -1) {
          items.value[index] = updatedItem
        }

        // Update current item if it's the one being edited
        if (currentItem.value && currentItem.value.id === id) {
          currentItem.value = updatedItem
        }

        return updatedItem
      } else {
        throw new Error(response.message || 'Failed to update item')
      }
    } catch (err) {
      error.value = err.message || 'Failed to update item'
      console.error('Error updating item:', err)
      throw err
    } finally {
      submitting.value = false
    }
  }

  const deleteItem = async (id) => {
    try {
      error.value = null

      const response = await itemService.deleteItem(id)

      if (response.success) {
        // Remove the item from the list
        items.value = items.value.filter((item) => item.id !== id)

        // Clear current item if it's the one being deleted
        if (currentItem.value && currentItem.value.id === id) {
          currentItem.value = null
        }

        return response
      } else {
        throw new Error(response.message || 'Failed to delete item')
      }
    } catch (err) {
      error.value = err.message || 'Failed to delete item'
      console.error('Error deleting item:', err)
      throw err
    }
  }

  const clearError = () => {
    error.value = null
  }

  const clearCurrentItem = () => {
    currentItem.value = null
  }

  const reset = () => {
    items.value = []
    currentItem.value = null
    schema.value = null
    databaseInfo.value = null
    loading.value = false
    submitting.value = false
    error.value = null
  }

  return {
    // State
    items,
    currentItem,
    schema,
    databaseInfo,
    loading,
    submitting,
    error,

    // Getters
    getItemById,
    itemsCount,
    hasSchema,
    hasDatabaseInfo,
    isFullyLoaded,
    formFields,

    // Actions
    fetchAllItems,
    fetchItem,
    fetchSchema,
    getDatabaseInfo,
    ensureSchemaLoaded,
    validateFormData,
    createItem,
    updateItem,
    deleteItem,
    clearError,
    clearCurrentItem,
    reset,
  }
})
