<template>
  <div class="add-view">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Add New Talent</h1>
      <p class="text-gray-600">Fill out the form below to add a new talent to your pool.</p>
    </div>

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
    <FormFields :editing-talent="null" :schema="schema" :loading="loading" :submitting="submitting"
      :form-data="formData" :form-errors="formErrors" :form-fields="formFields" @submit-form="submitForm"
      @refresh-schema="retryLoad" @update:form-data="updateFormData" @cancel-form="goBack" />

    <!-- Toast for notifications -->
    <Toast />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useTalentStore } from '../stores/talentStore.js'
import LoadingSkeleton from '../components/LoadingSkeleton.vue'

// Composables
const router = useRouter()
const toast = useToast()

// Store
const talentStore = useTalentStore()

// Computed properties from store
const loading = computed(() => talentStore.loading)
const submitting = computed(() => talentStore.submitting)
const error = computed(() => talentStore.error)
const schema = computed(() => talentStore.schema)

// Local state
const formData = ref({})
const formErrors = ref({})

// Computed
const formFields = computed(() => {
  if (!schema.value) return []
  return talentStore.formFields
})

// Methods
const loadSchema = async () => {
  try {
    // Fetch schema from store
    await talentStore.fetchSchema()

    // Initialize form data with proper default values for each field type
    formData.value = initializeFormData(talentStore.schema)
    formErrors.value = {}
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
    const validation = talentStore.validateFormData(formData.value, schema.value)
    if (!validation.isValid) {
      formErrors.value = validation.errors
      return
    }

    // Create new talent
    await talentStore.createTalent(formData.value)

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Talent added successfully',
      life: 3000
    })

    // Navigate back to pool
    router.push('/')
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to add talent',
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
