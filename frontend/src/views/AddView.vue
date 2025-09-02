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
      <Button @click="retryLoad" class="mt-4 !px-4 !py-2 !bg-red-600 !text-white !rounded-md hover:!bg-red-700"
        severity="danger">
        Try Again
      </Button>
    </div>

    <!-- Form -->
    <div v-if="isFormReady" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <FormFields :editing-item="item" :submitting="submitting" :form-errors="formErrors" @submit-form="submitForm"
        @refresh-schema="retryLoad" @update:form-data="updateFormData" @cancel-form="goBack" />
    </div>

    <!-- Toast for notifications -->
    <Toast />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useItemStore } from '../stores/itemStore.js'
import LoadingSkeleton from '../components/LoadingSkeleton.vue'
import PageHeader from '../components/PageHeader.vue'

// Composables
const router = useRouter()
const toast = useToast()

// Store
const itemStore = useItemStore()

// Computed properties from store
const loading = computed(() => itemStore.loading)
const submitting = computed(() => itemStore.submitting)
const error = computed(() => itemStore.error)

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
  try {
    // Fetch schema from store
    await itemStore.fetchSchema()

    // Get database info (synchronous, no await needed)
    const dbInfo = itemStore.getDatabaseInfo()

    // Use database info if available, otherwise fall back to schema from store
    const schemaToUse = dbInfo?.schema || itemStore.schema
    const titleToUse = dbInfo?.title || itemStore.schema?.title || 'Item'

    if (!schemaToUse) {
      toast.add({
        severity: 'error',
        summary: 'Schema Error',
        detail: 'Failed to load database schema. Please try again.',
        life: 3000
      })
      return
    }

    // Set raw schema and database title
    rawSchema.value = schemaToUse
    databaseTitle.value = titleToUse

    // Create enriched properties with empty values for new item
    const enrichedProperties = schemaToUse?.properties
      ? Object.fromEntries(
        Object.entries(schemaToUse.properties).map(([fieldName, property]) => {
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
    await itemStore.createItem(formDataToSubmit)

    // Show success message
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `${databaseTitle.value} added successfully`,
      life: 3000
    })

    // Navigate back after a brief delay for better UX
    await nextTick()
    router.push('/')

  } catch (error) {
    console.error('Create failed:', error)

    const errorMessage = itemStore.error ||
      error?.message ||
      `Failed to add ${databaseTitle.value.toLowerCase()}`

    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage,
      life: 5000
    })
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
  router.push('/')
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
