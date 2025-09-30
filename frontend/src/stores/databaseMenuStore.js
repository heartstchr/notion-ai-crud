import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDatabaseMenuStore = defineStore('databaseMenu', () => {
  // State
  const isOpen = ref(false)
  const loading = ref(false)
  const error = ref('')
  const databases = ref([])

  // Getters
  const hasDatabases = computed(() => databases.value.length > 0)
  const isEmpty = computed(() => !loading.value && !error.value && databases.value.length === 0)
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => !!error.value)

  // Actions
  const toggleDropdown = () => {
    isOpen.value = !isOpen.value
  }

  const openDropdown = () => {
    isOpen.value = true
  }

  const closeDropdown = () => {
    isOpen.value = false
  }

  const setLoading = (value) => {
    loading.value = value
  }

  const setError = (message) => {
    error.value = message
  }

  const setDatabases = (data) => {
    databases.value = data || []
  }

  const clearError = () => {
    error.value = ''
  }

  const reset = () => {
    isOpen.value = false
    loading.value = false
    error.value = ''
    databases.value = []
  }

  return {
    // State
    isOpen,
    loading,
    error,
    databases,

    // Getters
    hasDatabases,
    isEmpty,
    isLoading,
    hasError,

    // Actions
    toggleDropdown,
    openDropdown,
    closeDropdown,
    setLoading,
    setError,
    setDatabases,
    clearError,
    reset,
  }
})
