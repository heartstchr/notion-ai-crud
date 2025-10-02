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
      <div v-else-if="isFormReady" class="relative">
        <!-- Gradient Border with Drop Shadow -->
        <div
          class="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 rounded-lg p-0.5 shadow-lg"
          style="filter: drop-shadow(0 10px 25px rgba(0, 144, 247, 0.3)) drop-shadow(0 4px 6px rgba(186, 98, 252, 0.2)) drop-shadow(0 1px 3px rgba(242, 65, 107, 0.2)) drop-shadow(0 0 0 rgba(245, 86, 0, 0.1));">
          <div class="bg-white rounded-lg h-full w-full"></div>
        </div>

        <div class="relative z-10 bg-white rounded-lg p-6">
          <FormFields :editing-item="item" :submitting="submitting" :form-errors="formErrors" @submit-form="submitForm"
            @refresh-schema="retryLoad" @update:form-data="updateFormData" @cancel-form="goBack" />
        </div>
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
import itemService from '../services/itemService.js'
import ValidationService from '../services/validationService.js'
import LoadingSkeleton from '../components/LoadingSkeleton.vue'
import PageHeader from '../components/PageHeader.vue'

// Composables
const route = useRoute()
const router = useRouter()
const toast = useToast()

// Store
const itemStore = useItemStore()

// Local loading state for database-specific forms
const loading = ref(true)
const error = ref('')
const submitting = ref(false)

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
  const databaseId = route.params.databaseId

  if (!itemId) return

  loading.value = true
  error.value = ''
  formErrors.value = {}

  try {
    let itemResult, schemaToUse, titleToUse

    if (databaseId) {
      // Load item and schema for specific database
      const [itemData, dbInfo] = await Promise.all([
        itemService.getItem(itemId, databaseId),
        itemService.getDatabaseInfo(databaseId)
      ])

      itemResult = itemData.result || itemData
      schemaToUse = dbInfo?.schema
      titleToUse = dbInfo?.title || 'Item'
    } else {
      // Fallback to store-based approach
      const [itemData, schemaData] = await Promise.all([
        itemStore.fetchItem(itemId),
        itemStore.ensureSchemaLoaded().then(() => itemStore.schema)
      ])

      const dbInfo = itemStore.getDatabaseInfo()
      itemResult = itemData.result || itemData
      schemaToUse = dbInfo?.schema || schemaData
      titleToUse = dbInfo?.title || schemaData?.title || 'Item'
    }

    if (!schemaToUse) {
      error.value = 'Failed to load database schema. Please try again.'
      return
    }



    if (!itemResult) {
      error.value = 'The item you are trying to edit does not exist.'
      return
    }

    // Set raw schema and database title
    rawSchema.value = schemaToUse
    databaseTitle.value = titleToUse

    // Create enriched properties with embedded values from schema
    const enrichedProperties = schemaToUse?.properties
      ? Object.fromEntries(
        Object.entries(schemaToUse.properties).map(([fieldName, property]) => {
          // Get the value from the flattened item data
          const fieldValue = itemResult[fieldName] || ''

          const enrichedProperty = {
            ...property,
            value: fieldValue,
            name: property.name || fieldName,
            // Ensure nested objects are preserved
            number: property.number || null,
            select: property.select || null,
            multi_select: property.multi_select || null,
            // Ensure format is explicitly set for number fields
            format: property.type === 'number' ? (property.number?.format || property.format) : undefined
          }

          console.log(`EditView - Field ${fieldName}:`, {
            property,
            fieldValue,
            enrichedProperty
          })

          return [fieldName, enrichedProperty]
        })
      )
      : {}

    // Set enriched properties as item
    item.value = enrichedProperties

    console.log('EditView - Final enrichedProperties:', enrichedProperties)
    console.log('EditView - Final item.value:', item.value)

  } catch (err) {
    console.error('Error loading item:', err)
    error.value = err.message || 'Failed to load item'
  } finally {
    loading.value = false
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

    // Update item
    const itemId = route.params.id
    const databaseId = route.params.databaseId

    if (databaseId) {
      await itemService.updateItem(itemId, formDataToSubmit, rawSchema.value, databaseId)
    } else {
      await itemStore.updateItem(itemId, formDataToSubmit, rawSchema.value)
    }

    // Show success message
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `${databaseTitle.value} updated successfully`,
      life: 3000
    })

    // Navigate back after a brief delay for better UX
    await nextTick()
    const dbId = route.params.databaseId
    if (dbId) {
      router.push({ name: 'db-list', params: { databaseId: dbId } })
    } else {
      router.push('/')
    }

  } catch (error) {
    console.error('Update failed:', error)

    const errorMessage = error?.message ||
      `Failed to update ${databaseTitle.value.toLowerCase()}`

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
  const dbId = route.params.databaseId
  if (dbId) {
    router.push({ name: 'db-list', params: { databaseId: dbId } })
  } else {
    router.push('/')
  }
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
