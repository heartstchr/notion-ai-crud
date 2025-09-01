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
      <button @click="retryLoad" class="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
        Try Again
      </button>
    </div>

    <!-- Form -->
    <FormFields :editing-item="null" :schema="schema" :loading="loading" :submitting="submitting" :form-data="formData"
      :form-errors="formErrors" :form-fields="schema?.properties || {}" @submit-form="submitForm"
      @refresh-schema="retryLoad" @update:form-data="updateFormData" @cancel-form="goBack" />

    <!-- Toast for notifications -->
    <Toast />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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
const schema = computed(() => itemStore.schema)

// Local state
const formData = ref({})
const formErrors = ref({})
const databaseTitle = ref('')

// Methods
const loadSchema = async () => {
  try {
    // Fetch schema from store
    await itemStore.fetchSchema()

    // Initialize form data with proper default values for each field type
    formData.value = initializeFormData(itemStore.schema)
    formErrors.value = {}

    // Update database title from store
    const dbInfo = itemStore.getDatabaseInfo()
    if (dbInfo && dbInfo.title) {
      databaseTitle.value = dbInfo.title
    }
  } catch (err) {
    console.error('Failed to load database schema:', err)
  }
}

const retryLoad = async () => {
  await loadSchema()
}

const initializeFormData = (schema) => {
  const initialData = {}
  if (schema && schema.properties) {
    Object.keys(schema.properties).forEach(propertyName => {
      const property = schema.properties[propertyName]
      if (property.type === 'multiselect' || property.type === 'select') {
        initialData[propertyName] = []
      } else if (property.type === 'checkbox') {
        initialData[propertyName] = false
      } else {
        initialData[propertyName] = ''
      }
    })
  }
  return initialData
}

const updateFormData = (newFormData) => {
  formData.value = newFormData
  // Clear errors when form data changes
  formErrors.value = {}
}

const submitForm = async () => {
  try {
    formErrors.value = {}

    // Validate form data
    const validation = itemStore.validateFormData(formData.value, schema.value)
    if (!validation.isValid) {
      formErrors.value = validation.errors
      return
    }

    // Create new item
    await itemStore.createItem(formData.value)

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `${databaseTitle.value} added successfully`,
      life: 3000
    })

    router.push('/')
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: `Failed to add ${databaseTitle.value.toLowerCase()}`,
      life: 3000
    })
  }
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
