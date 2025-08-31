<template>
  <div class="edit-view">
    <div class="max-w-4xl mx-auto p-6">
      <!-- Header -->
      <PageHeader mode="edit" :database-title="databaseTitle" :show-back-button="true" @go-back="goBack" />

      <!-- Loading State -->
      <div v-if="loading">
        <LoadingSkeleton :count="1" container-class="bg-white rounded-lg shadow-sm border border-gray-200 p-6" />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
        <div class="flex items-start gap-3">
          <i class="pi pi-exclamation-triangle text-red-500 text-xl mt-1"></i>
          <div class="flex-1">
            <strong class="text-red-800">Error:</strong>
            <span class="text-red-700">{{ error }}</span>
            <button @click="retryLoad" class="ml-2 text-red-600 hover:text-red-800 underline">
              Try Again
            </button>
          </div>
        </div>
      </div>

      <!-- Edit Form -->
      <div v-else-if="item && schema" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <FormFields :editing-item="item" :schema="schema" :loading="loading" :submitting="submitting"
          :form-data="formData" :form-errors="formErrors" :form-fields="formFields" @submit-form="submitForm"
          @refresh-schema="retryLoad" @update:form-data="updateFormData" @cancel-form="goBack" />
      </div>

      <!-- Not Found State -->
      <div v-else-if="!item && !loading" class="text-center py-16">
        <div class="text-6xl mb-4">❌</div>
        <h3 class="text-2xl font-semibold text-gray-900 mb-2">{{ databaseTitle }} Not Found</h3>
        <p class="text-gray-600 mb-6">The {{ databaseTitle.toLowerCase() }} you're looking for doesn't exist or has been
          removed.</p>
        <button @click="goBack" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Back to Pool
        </button>
      </div>
    </div>

    <!-- Toast for notifications -->
    <Toast />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useItemStore } from '../stores/itemStore.js'
import LoadingSkeleton from '../components/LoadingSkeleton.vue'
import PageHeader from '../components/PageHeader.vue'

// Composables
const route = useRoute()
const router = useRouter()
const toast = useToast()

// Store
const itemStore = useItemStore()

// Computed properties from store
const loading = computed(() => itemStore.loading)
const error = computed(() => itemStore.error)
const schema = computed(() => itemStore.schema)
const submitting = computed(() => itemStore.submitting)

// Local state
const item = ref(null)
const formData = ref({})
const formErrors = ref({})
const databaseTitle = ref('')

// Computed
const formFields = computed(() => {
  if (!schema.value) return []
  return itemStore.formFields
})

// Methods
const loadItem = async () => {
  try {
    const itemId = route.params.id

    if (!itemId) {
      console.error('No item ID provided')
      return
    }

    // Ensure schema is loaded first
    if (!itemStore.schema) {
      await itemStore.fetchSchema()
    }

    // Load item data from store
    const itemResult = await itemStore.fetchItem(itemId)

    if (!itemResult) {
      console.error('Item not found')
      item.value = null // Ensure item is null so the "not found" UI shows
      return
    }

    item.value = itemResult

    // Initialize form data with normalized values
    formData.value = normalizeItemData(item.value, itemStore.schema)

    // Update database title from store
    const dbInfo = itemStore.getDatabaseInfo()
    if (dbInfo && dbInfo.title) {
      databaseTitle.value = dbInfo.title
    }
  } catch (err) {
    console.error('Error loading item:', err)
    // Error is already set in the store, no need to set it again
  }
}

const retryLoad = () => {
  loadItem()
}

const normalizeItemData = (item, schema) => {
  // Filter out Notion internal properties and only include schema-defined properties
  const normalizedData = {}

  // Normalizing item data

  if (schema && schema.properties) {
    Object.keys(schema.properties).forEach(propertyName => {
      const property = schema.properties[propertyName]
      const value = item[propertyName]

      if (property.type === 'multiselect') {
        // Handle multiselect fields - ensure they're arrays
        if (Array.isArray(value)) {
          normalizedData[propertyName] = value
        } else if (typeof value === 'string' && value) {
          try {
            // Try to parse JSON first
            const parsed = JSON.parse(value)
            normalizedData[propertyName] = Array.isArray(parsed) ? parsed : []
          } catch {
            // If not JSON, split by comma
            normalizedData[propertyName] = value.split(',').map(v => v.trim()).filter(v => v)
          }
        } else {
          normalizedData[propertyName] = []
        }
      } else if (property.type === 'select') {
        // Handle select fields - ensure they have a value
        normalizedData[propertyName] = value || ''
      } else if (property.type === 'checkbox') {
        // Handle checkbox fields - ensure they're boolean
        normalizedData[propertyName] = Boolean(value)
      } else if (property.type === 'title') {
        // Handle title fields - ensure they have a value
        normalizedData[propertyName] = value || ''
      } else if (property.type === 'rich_text') {
        // Handle rich text fields - ensure they have a value
        normalizedData[propertyName] = value || ''
      } else if (property.type === 'number') {
        // Handle number fields - ensure they have a value
        normalizedData[propertyName] = value || 0
      } else if (property.type === 'date') {
        // Handle date fields - ensure they have a value
        normalizedData[propertyName] = value || ''
      } else if (property.type === 'email') {
        // Handle email fields - ensure they have a value
        normalizedData[propertyName] = value || ''
      } else if (property.type === 'phone_number') {
        // Handle phone number fields - ensure they have a value
        normalizedData[propertyName] = value || ''
      } else if (property.type === 'url') {
        // Handle URL fields - ensure they have a value
        normalizedData[propertyName] = value || ''
      } else if (property.type === 'status') {
        // Handle status fields - ensure they have a value
        normalizedData[propertyName] = value || ''
      } else {
        // For any other property type, include the value as is
        normalizedData[propertyName] = value || ''
      }
    })
  }

  // Normalized data result
  return normalizedData
}

const updateFormData = (newFormData) => {
  formData.value = newFormData
  // Clear errors when form data changes
  formErrors.value = {}
}

const submitForm = async () => {
  try {
    formErrors.value = {}

    // Submitting form with data
    // Schema available

    // Validate form data
    const validation = itemStore.validateFormData(formData.value, schema.value)
    // Validation result

    if (!validation.isValid) {
      formErrors.value = validation.errors
      // Validation failed
      return
    }

    // Update item
    await itemStore.updateItem(item.value.id, formData.value)

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `${databaseTitle.value} updated successfully`,
      life: 3000
    })

    // Navigate back to pool
    router.push('/')

  } catch (error) {
    console.error('Update failed:', error)

    // Show specific error message if available
    const errorMessage = itemStore.error || error?.message || `Failed to update ${databaseTitle.value.toLowerCase()}`

    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage,
      life: 5000
    })
  }
}

const goBack = () => {
  router.push('/')
}

// Watch for route parameter changes
watch(() => route.params.id, (newId) => {
  if (newId) {
    loadItem()
  }
})

// Lifecycle
onMounted(() => {
  loadItem()
})
</script>

<style scoped>
.edit-view {
  min-height: calc(100vh - 80px);
  background-color: #f9fafb;
}
</style>
