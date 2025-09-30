<template>
  <div class="add-view">
    <!-- Header -->
    <PageHeader mode="add" :database-title="databaseTitle" :show-back-button="true" @go-back="goBack" />

    <!-- Loading State -->
    <LoadingSkeleton v-if="loading" :count="1" />

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
      <div class="flex items-center">
        <i class="pi pi-exclamation-triangle text-red-500 mr-3 text-xl"></i>
        <div>
          <h3 class="text-lg font-medium text-red-800">Error Loading Form</h3>
          <p class="text-red-700 mt-1">{{ error }}</p>
        </div>
      </div>
      <Button @click="retryLoad" severity="danger" class="mt-4">
        Try Again
      </Button>
    </div>

    <!-- Form -->
    <div v-if="isFormReady" class="relative">
      <!-- Gradient Border with Drop Shadow -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 rounded-lg p-0.5 shadow-lg"
        style="filter: drop-shadow(0 10px 25px rgba(0, 144, 247, 0.3)) drop-shadow(0 4px 6px rgba(186, 98, 252, 0.2)) drop-shadow(0 1px 3px rgba(242, 65, 107, 0.2)) drop-shadow(0 0 0 rgba(245, 86, 0, 0.1));">
        <div class="bg-white rounded-lg h-full w-full"></div>
      </div>
      <div class="relative z-10 rounded-lg p-6">
        <FormFields :editing-item="item" :submitting="submitting" :form-errors="formErrors" @submit-form="submitForm"
          @refresh-schema="retryLoad" @update:form-data="updateFormData" @cancel-form="goBack" />
      </div>
    </div>

    <!-- Toast for notifications -->
    <Toast />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useItemStore } from '../stores/itemStore.js'
import LoadingSkeleton from '../components/LoadingSkeleton.vue'
import PageHeader from '../components/PageHeader.vue'
import itemService from '../services/itemService.js'

// Composables
const router = useRouter()
const route = useRoute()
const toast = useToast()

// Store
const itemStore = useItemStore()

// Local loading state for database-specific forms
const loading = ref(true)
const submitting = ref(false)
const error = ref('')

// Local state
const item = ref(null)
const formErrors = ref({})
const databaseTitle = ref('')
const rawSchema = ref(null)

// Computed properties
const isFormReady = computed(() => item.value && rawSchema.value && !loading.value && !error.value)

// Validation regex patterns (memoized)
const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[+]?[1-9][\d]{0,15}$/
}

// Methods
const loadSchema = async () => {
  loading.value = true
  error.value = ''

  try {
    // Check if we're in a database context
    const databaseId = route.params.databaseId

    if (databaseId) {
      // Load schema for specific database
      const dbInfo = await itemService.getDatabaseInfo(databaseId)
      const schemaToUse = dbInfo?.schema
      const titleToUse = dbInfo?.title || 'Item'

      if (!schemaToUse) {
        error.value = 'Failed to load database schema. Please try again.'
        return
      }

      // Set raw schema and database title
      rawSchema.value = schemaToUse
      databaseTitle.value = titleToUse
    } else {
      // Fallback to store-based approach
      await itemStore.fetchSchema()
      const dbInfo = itemStore.getDatabaseInfo()
      const schemaToUse = dbInfo?.schema || itemStore.schema
      const titleToUse = dbInfo?.title || itemStore.schema?.title || 'Item'

      if (!schemaToUse) {
        error.value = 'Failed to load database schema. Please try again.'
        return
      }

      // Set raw schema and database title
      rawSchema.value = schemaToUse
      databaseTitle.value = titleToUse
    }

    // Create enriched properties with empty values for new item
    const enrichedProperties = rawSchema.value?.properties
      ? Object.fromEntries(
        Object.entries(rawSchema.value.properties).map(([fieldName, property]) => {
          const enrichedProperty = {
            ...property,
            value: '', // Empty values for new item
            name: property.name || fieldName,
            // Ensure nested objects are preserved
            number: property.number || null,
            select: property.select || null,
            multi_select: property.multi_select || null,
            // Ensure format is explicitly set for number fields
            format: property.type === 'number' ? (property.number?.format || property.format) : undefined
          }

          return [fieldName, enrichedProperty]
        })
      )
      : {}

    // Set enriched properties as item
    item.value = enrichedProperties
    formErrors.value = {}

  } catch (err) {
    console.error('Failed to load database schema:', err)
    error.value = err.message || 'Failed to load database schema'
  } finally {
    loading.value = false
  }
}

const retryLoad = async () => {
  await loadSchema()
}

const updateFormData = (newFormData) => {
  // Update the values in enriched properties
  Object.entries(newFormData).forEach(([key, value]) => {
    if (item.value[key]) {
      item.value[key].value = value
    }
  })
  // Clear errors when user starts typing
  formErrors.value = {}
}

const submitForm = async () => {
  if (submitting.value) return // Prevent double submission

  submitting.value = true

  try {
    formErrors.value = {}

    // Extract form data from enriched properties
    const formDataToSubmit = Object.fromEntries(
      Object.entries(item.value).map(([key, property]) => [key, property.value])
    )

    // Validate form data
    const validation = validateFormData(formDataToSubmit, item.value)
    if (!validation.isValid) {
      formErrors.value = validation.errors
      return
    }

    // Create new item
    const databaseId = route.params.databaseId
    if (databaseId) {
      await itemService.createItem(formDataToSubmit, rawSchema.value, databaseId)
    } else {
      await itemStore.createItem(formDataToSubmit)
    }

    // Show success message
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `${databaseTitle.value} added successfully`,
      life: 3000
    })

    // Navigate back after a brief delay for better UX
    await nextTick()
    if (databaseId) {
      router.push({ name: 'db-list', params: { databaseId } })
    } else {
      router.push('/')
    }

  } catch (error) {
    console.error('Create failed:', error)

    const errorMessage = error?.message ||
      `Failed to add ${databaseTitle.value.toLowerCase()}`

    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage,
      life: 5000
    })
  } finally {
    submitting.value = false
  }
}

const validateFormData = (data, enrichedProperties) => {
  const errors = {}

  if (!enrichedProperties) {
    return { isValid: true, errors: {} }
  }

  Object.entries(enrichedProperties).forEach(([key, property]) => {
    const value = data[key]
    const trimmedValue = value?.toString().trim()

    // Check required fields
    if (property.required && (!value || trimmedValue === '')) {
      errors[key] = `${formatLabel(key)} is required`
      return
    }

    // Type-specific validation (only if value exists)
    if (value && trimmedValue !== '') {
      switch (property.type) {
        case 'email': {
          if (!VALIDATION_PATTERNS.email.test(value)) {
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
          const cleanPhone = value.replace(/[\s\-()]/g, '')
          if (!VALIDATION_PATTERNS.phone.test(cleanPhone)) {
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

const formatLabel = (fieldName) => {
  return fieldName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

const goBack = () => {
  const dbId = route.params.databaseId
  if (dbId) {
    router.push({ name: 'db-list', params: { databaseId: dbId } })
  } else {
    router.push('/')
  }
}

// Lifecycle
onMounted(() => {
  loadSchema()
})
</script>

<style scoped>
.add-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
