import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import talentService from '../services/talentService.js'

export const useTalentStore = defineStore('talent', () => {
  // State
  const talents = ref([])
  const currentTalent = ref(null)
  const schema = ref(null)
  const databaseInfo = ref(null)
  const loading = ref(false)
  const submitting = ref(false)
  const error = ref(null)

  // Getters
  const getTalentById = computed(() => {
    return (id) => talents.value.find((talent) => talent.id === id)
  })

  const talentsCount = computed(() => talents.value.length)

  const hasSchema = computed(() => schema.value !== null)

  const hasDatabaseInfo = computed(() => databaseInfo.value !== null)

  const isFullyLoaded = computed(() => hasSchema.value && hasDatabaseInfo.value)

  const formFields = computed(() => {
    if (!schema.value) return []
    return talentService.generateFormFields(schema.value)
  })

  // Actions
  const fetchAllTalents = async () => {
    try {
      loading.value = true
      error.value = null

      const response = await talentService.getAllTalents()
      if (response.success && response.results) {
        talents.value = response.results
      } else {
        throw new Error(response.message || 'Failed to fetch talents')
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch talents'
      console.error('Error fetching talents:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchTalent = async (id) => {
    try {
      loading.value = true
      error.value = null

      const response = await talentService.getTalent(id)
      if (response.success && response.result) {
        currentTalent.value = response.result
        return response.result
      } else {
        throw new Error(response.message || 'Failed to fetch talent')
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch talent'
      console.error('Error fetching talent:', err)
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
      const response = await talentService.getDatabaseInfo()
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
    return talentService.validateFormData(data, schema)
  }

  const createTalent = async (talentData) => {
    try {
      submitting.value = true
      error.value = null

      const response = await talentService.createTalent(talentData, schema.value)
      if (response.success && response.result) {
        // Add the new talent to the list
        talents.value.unshift(response.result)
        return response.result
      } else {
        throw new Error(response.message || 'Failed to create talent')
      }
    } catch (err) {
      error.value = err.message || 'Failed to create talent'
      console.error('Error creating talent:', err)
      throw err
    } finally {
      submitting.value = false
    }
  }

  const updateTalent = async (id, talentData) => {
    try {
      submitting.value = true
      error.value = null

      // Updating talent

      const response = await talentService.updateTalent(id, talentData, schema.value)
      // Update response

      if (response.success && response.result) {
        // The response.result should now be the transformed talent data
        const updatedTalent = response.result

        // Update the talent in the list
        const index = talents.value.findIndex((talent) => talent.id === id)
        if (index !== -1) {
          talents.value[index] = updatedTalent
        }

        // Update current talent if it's the one being edited
        if (currentTalent.value && currentTalent.value.id === id) {
          currentTalent.value = updatedTalent
        }

        return updatedTalent
      } else {
        throw new Error(response.message || 'Failed to update talent')
      }
    } catch (err) {
      error.value = err.message || 'Failed to update talent'
      console.error('Error updating talent:', err)
      throw err
    } finally {
      submitting.value = false
    }
  }

  const deleteTalent = async (id) => {
    try {
      error.value = null

      const response = await talentService.deleteTalent(id)
      if (response.success) {
        // Remove the talent from the list
        talents.value = talents.value.filter((talent) => talent.id !== id)

        // Clear current talent if it's the one being deleted
        if (currentTalent.value && currentTalent.value.id === id) {
          currentTalent.value = null
        }

        return response
      } else {
        throw new Error(response.message || 'Failed to delete talent')
      }
    } catch (err) {
      error.value = err.message || 'Failed to delete talent'
      console.error('Error deleting talent:', err)
      throw err
    }
  }

  const clearError = () => {
    error.value = null
  }

  const clearCurrentTalent = () => {
    currentTalent.value = null
  }

  const reset = () => {
    talents.value = []
    currentTalent.value = null
    schema.value = null
    databaseInfo.value = null
    loading.value = false
    submitting.value = false
    error.value = null
  }

  return {
    // State
    talents,
    currentTalent,
    schema,
    databaseInfo,
    loading,
    submitting,
    error,

    // Getters
    getTalentById,
    talentsCount,
    hasSchema,
    hasDatabaseInfo,
    isFullyLoaded,
    formFields,

    // Actions
    fetchAllTalents,
    fetchTalent,
    fetchSchema,
    getDatabaseInfo,
    ensureSchemaLoaded,
    validateFormData,
    createTalent,
    updateTalent,
    deleteTalent,
    clearError,
    clearCurrentTalent,
    reset,
  }
})
