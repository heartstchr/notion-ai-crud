<template>
  <div class="edit-view">
    <div class="max-w-4xl mx-auto p-6">
      <PageHeader mode="edit" :database-title="databaseTitle" :show-back-button="true" @go-back="goBack" />
      <div v-if="loading || (!item && !error)">
        <LoadingSkeleton :count="1" container-class="bg-white rounded-lg shadow-sm border border-gray-200 p-6" />
      </div>
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
        <div class="flex items-start gap-3">
          <i class="pi pi-exclamation-triangle text-red-500 text-xl mt-1"></i>
          <div class="flex-1">
            <strong class="text-red-800">Error:</strong>
            <span class="text-red-700">{{ error }}</span>
            <Button @click="retryLoad" severity="danger" text>
              Try Again
            </Button>
          </div>
        </div>
      </div>
      <div v-else-if="isFormReady" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <FormFields :editing-item="item" :submitting="submitting" :form-errors="formErrors" @submit-form="submitForm"
          @refresh-schema="retryLoad" @update:form-data="updateFormData" @cancel-form="goBack" />
      </div>
    </div>
    <Toast />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useItemStore } from '../stores/itemStore.js'
import ValidationService from '../services/validationService.js'
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
const submitting = computed(() => itemStore.submitting)

// Local state
const item = ref(null)
const formErrors = ref({})
const databaseTitle = ref('')
const rawSchema = ref(null)
const isLoadingItem = ref(false)

// Computed properties
const isFormReady = computed(() => item.value && rawSchema.value && !loading.value && !error.value)

// Validation service is now imported and used

// Methods
const loadItem = async () => {
  const itemId = route.params.id
  if (!itemId) return

  try {
    isLoadingItem.value = true
    formErrors.value = {}

    // Load item data and ensure schema is loaded
    const [itemResult, schemaResult] = await Promise.all([
      itemStore.fetchItem(itemId),
      itemStore.ensureSchemaLoaded().then(() => itemStore.schema)
    ])

    // Get database info (synchronous, no await needed)
    const dbInfo = itemStore.getDatabaseInfo()

    // Use database info if available, otherwise fall back to schema from store
    const schemaToUse = dbInfo?.schema || schemaResult
    const titleToUse = dbInfo?.title || schemaResult?.title || 'Item'

    if (!schemaToUse) {
      toast.add({
        severity: 'error',
        summary: 'Schema Error',
        detail: 'Failed to load database schema. Please try again.',
        life: 3000
      })
      return
    }



    if (!itemResult) {
      toast.add({
        severity: 'error',
        summary: 'Item Not Found',
        detail: 'The item you are trying to edit does not exist.',
        life: 3000
      })
      router.push('/')
      return
    }

    // Set raw schema and database title
    rawSchema.value = schemaToUse
    databaseTitle.value = titleToUse

    // Create enriched properties with embedded values from schema
    const enrichedProperties = schemaToUse?.properties
      ? Object.fromEntries(
        Object.entries(schemaToUse.properties).map(([fieldName, property]) => {
          const enrichedProperty = {
            ...property,
            value: itemResult[fieldName] || '',
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

  } catch (err) {
    console.error('Error loading item:', err)
  } finally {
    isLoadingItem.value = false
  }
}

const retryLoad = () => {
  loadItem()
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

    // Update item
    const itemId = route.params.id
    await itemStore.updateItem(itemId, formDataToSubmit, rawSchema.value)

    // Show success message
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `${databaseTitle.value} updated successfully`,
      life: 3000
    })

    // Navigate back after a brief delay for better UX
    await nextTick()
    router.push('/')

  } catch (error) {
    console.error('Update failed:', error)

    const errorMessage = itemStore.error ||
      error?.message ||
      `Failed to update ${databaseTitle.value.toLowerCase()}`

    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage,
      life: 5000
    })
  }
}

const validateFormData = (data, enrichedProperties) => {
  // Convert enriched properties to schema format for validation service
  const schema = {
    properties: Object.fromEntries(
      Object.entries(enrichedProperties).map(([key, property]) => [
        key,
        {
          type: property.type,
          required: property.required || false,
          number: property.number,
          options: property.options,
          minLength: property.minLength,
          maxLength: property.maxLength
        }
      ])
    )
  }

  return ValidationService.validateFormData(data, schema)
}

const formatLabel = (fieldName) => {
  return ValidationService.formatLabel(fieldName)
}

const goBack = () => {
  router.push('/')
}

// Watch for route parameter changes
watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    loadItem()
  }
}, { immediate: false })

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
