<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="text-center space-y-4">
      <!-- Database Title with Skeleton -->
      <div v-if="loading && !databaseTitle" class="space-y-2">
        <div class="h-12 bg-gray-200 rounded-lg animate-pulse mx-auto" style="width: 300px;"></div>
      </div>
      <h1 v-else class="text-4xl font-bold text-gray-900">{{ databaseTitle }}</h1>

      <!-- Database Description with Skeleton -->
      <div v-if="loading && !databaseDescription" class="space-y-2">
        <div class="h-6 bg-gray-200 rounded-lg animate-pulse mx-auto" style="width: 500px;"></div>
        <div class="h-6 bg-gray-200 rounded-lg animate-pulse mx-auto" style="width: 400px;"></div>
      </div>
      <p v-else-if="databaseDescription" class="text-lg text-gray-600 max-w-2xl mx-auto">
        {{ databaseDescription }}
      </p>

      <div class="flex justify-center gap-4 flex-wrap">
        <Button @click="refreshSchema" :disabled="loading" severity="secondary" icon="pi pi-refresh"
          label="Refresh" />
        <Button @click="openAddForm" icon="pi pi-plus" label="Add" />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !talents.length" class="space-y-6">
      <!-- Skeleton Loading for Talent Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="p-4 border-2 border-amber-100 space-y-3">
          <!-- Card Header Skeleton -->
          <div class="flex justify-end">
            <div class="flex gap-2">
              <div class="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div class="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          <!-- Title Skeleton -->
          <div class="h-6 bg-gray-200 rounded animate-pulse"></div>

          <!-- Field Skeletons -->
          <div v-for="j in 3" :key="j" class="space-y-1">
            <div class="h-4 bg-gray-200 rounded animate-pulse" style="width: 60%;"></div>
            <div class="h-4 bg-gray-200 rounded animate-pulse" style="width: 80%;"></div>
          </div>

          <!-- Date Skeleton -->
          <div class="h-3 bg-gray-200 rounded animate-pulse" style="width: 40%;"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
      <i class="pi pi-exclamation-triangle text-red-500 text-xl"></i>
      <div class="flex-1">
        <strong class="text-red-800">Error:</strong>
        <span class="text-red-700">{{ error }}</span>
        <Button @click="retryLoad" text label="Try Again" class="ml-2 p-0 h-auto text-red-600 hover:text-red-800" />
      </div>
    </div>

    <!-- Add/Edit Form Dialog -->
    <Dialog v-model:visible="isDialogVisible" :header="editingTalent ? 'Edit Talent Profile' : 'Add New Talent'"
      :style="{ width: '600px' }" :modal="true" :closable="true" @hide="closeForm">
      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- Loading State for Schema -->
        <div v-if="!schema && !loading" class="text-center py-8 text-gray-500">
          <div class="spinner w-8 h-8 mx-auto mb-4"></div>
          <p>Loading database schema...</p>
        </div>

        <!-- No Schema Available -->
        <div v-else-if="formFields.length === 0" class="text-center py-8 text-gray-500">
          <p>No database schema available. Please check your Notion database configuration.</p>
        </div>

        <div v-for="field in formFields" :key="field.name" class="space-y-2">
          <label :for="field.name" class="form-label">
            {{ field.label }}
            <span v-if="field.required" class="text-red-500 ml-1">*</span>
          </label>

          <!-- Text Input -->
          <InputText
            v-if="field.type === 'text' || field.type === 'email' || field.type === 'url' || field.type === 'tel'"
            :id="field.name" :type="field.type" :placeholder="field.placeholder" :required="field.required"
            :model-value="formData[field.name]" @update:model-value="(value) => formData[field.name] = value"
            :class="{ 'p-invalid': formErrors[field.name] }" class="w-full" />

          <!-- Number Input -->
          <InputNumber v-else-if="field.type === 'number'" :id="field.name" :placeholder="field.placeholder"
            :required="field.required" :min="field.min" :step="field.step" :model-value="formData[field.name]"
            @update:model-value="(value) => formData[field.name] = value"
            :class="{ 'p-invalid': formErrors[field.name] }" class="w-full" />

          <!-- Date Input -->
          <Calendar v-else-if="field.type === 'date'" :id="field.name" :placeholder="field.placeholder"
            :required="field.required" :model-value="formData[field.name]"
            @update:model-value="(value) => formData[field.name] = value"
            :class="{ 'p-invalid': formErrors[field.name] }" class="w-full" dateFormat="yy-mm-dd" />

          <!-- Textarea -->
          <Textarea v-else-if="field.type === 'textarea'" :id="field.name" :placeholder="field.placeholder"
            :required="field.required" :model-value="formData[field.name]"
            @update:model-value="(value) => formData[field.name] = value"
            :class="{ 'p-invalid': formErrors[field.name] }" class="w-full" rows="3" />

          <!-- Select -->
          <Dropdown v-else-if="field.type === 'select'" :id="field.name" :required="field.required"
            :model-value="formData[field.name]" @update:model-value="(value) => formData[field.name] = value"
            :options="field.options" optionLabel="label" optionValue="value" :placeholder="`Select ${field.label}`"
            :class="{ 'p-invalid': formErrors[field.name] }" class="w-full" />

          <!-- Multi-select -->
          <MultiSelect v-else-if="field.type === 'multiselect'" :id="field.name" :model-value="formData[field.name]"
            @update:model-value="(value) => formData[field.name] = value" :options="field.options" optionLabel="label"
            optionValue="value" :placeholder="`Select ${field.label}`" :class="{ 'p-invalid': formErrors[field.name] }"
            class="w-full" :filter="true" :allowEmpty="true" />

          <!-- Checkbox -->
          <div v-else-if="field.type === 'checkbox'" class="flex items-center gap-3">
            <Checkbox :id="field.name" :model-value="formData[field.name]"
              @update:model-value="(value) => formData[field.name] = value" :binary="true" />
            <label :for="field.name" class="text-sm text-gray-700 cursor-pointer">
              {{ field.label }}
            </label>
          </div>

          <!-- Error Message -->
          <small v-if="formErrors[field.name]" class="text-red-600 block">
            {{ formErrors[field.name] }}
          </small>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button type="button" @click="closeForm" severity="secondary" label="Cancel" />
          <Button type="submit" :disabled="submitting" :loading="submitting"
            :label="submitting ? 'Saving...' : (editingTalent ? 'Update' : 'Add') + ' Talent'" />
        </div>
      </form>
    </Dialog>

    <!-- Talent List -->
    <div v-if="!loading || talents.length" class="space-y-6">
      <div v-if="talents.length === 0 && !loading" class="text-center py-16">
        <div class="text-6xl mb-4">👥</div>
        <h3 class="text-2xl font-semibold text-gray-900 mb-2">No talent profiles yet</h3>
        <p class="text-gray-600 mb-6">Start building your talent pool by adding your first profile.</p>
        <Button @click="openAddForm" icon="pi pi-plus" label="Add First Talent" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Talent Cards -->
        <div v-for="talent in talents" :key="talent.id"
          class="hover:shadow-lg text-gray-900 transition-shadow p-4 border-2 border-amber-100">
          <div class="flex justify-end items-start mb-3">
            <div class="flex gap-2">
              <Button @click="editTalent(talent)" icon="pi pi-pencil" text severity="secondary" class="p-2"
                title="Edit" />
              <Button @click="deleteTalent(talent.id)" icon="pi pi-trash" text severity="danger" class="p-2"
                title="Delete" />
            </div>
          </div>

          <div class="space-y-3">
            <!-- Dynamic fields -->
            <div v-for="[key, value] in getDynamicFields(talent)" :key="key" class="space-y-1">
              <div class="text-sm font-medium text-gray-900">{{ formatLabel(key) }}:</div>
              <div v-if="Array.isArray(value)" class="flex flex-wrap gap-2">
                <span v-for="item in value" :key="item"
                  class="px-2 py-1 bg-gray-100 text-gray-900 text-xs rounded-full">
                  {{ item }}
                </span>
              </div>
              <div v-else-if="typeof value === 'boolean'" class="text-gray-800">
                {{ value ? 'Yes' : 'No' }}
              </div>
              <div v-else class="text-gray-800">{{ value }}</div>
            </div>
          </div>

          <div class="text-xs text-gray-500">
            Added: {{ formatDate(talent.created_time) }}
            <span v-if="talent.last_edited_time !== talent.created_time">
              • Updated: {{ formatDate(talent.last_edited_time) }}
            </span>
          </div>
        </div>

        <!-- Skeleton Loading for Additional Cards while Loading More -->
        <template v-if="loadingMore">
          <div v-for="i in 3" :key="`skeleton-${i}`" class="p-4 border-2 border-amber-100 space-y-3">
            <!-- Card Header Skeleton -->
            <div class="flex justify-end">
              <div class="flex gap-2">
                <div class="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                <div class="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            <!-- Title Skeleton -->
            <div class="h-6 bg-gray-200 rounded animate-pulse mb-4"></div>

            <!-- Field Skeletons -->
            <div v-for="j in 2" :key="j" class="space-y-1">
              <div class="h-4 bg-gray-200 rounded animate-pulse" style="width: 60%;"></div>
              <div class="h-4 bg-gray-200 rounded animate-pulse" style="width: 80%;"></div>
            </div>

            <!-- Date Skeleton -->
            <div class="h-3 bg-gray-200 rounded animate-pulse" style="width: 40%;"></div>
          </div>
        </template>
      </div>
    </div>

    <!-- Load More -->
    <div v-if="hasMore" class="text-center">
      <Button @click="loadMore" :disabled="loadingMore" :loading="loadingMore" severity="secondary" label="Load More" />
    </div>

    <!-- Load More Skeleton -->
    <div v-if="loadingMore" class="text-center">
      <div class="h-10 w-32 bg-gray-200 rounded-lg animate-pulse mx-auto"></div>
    </div>

    <!-- Toast for notifications -->
    <Toast />

    <!-- Confirmation Dialog for delete -->
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import talentService from '../services/talentService.js'
import NotionMiddleware from '../services/notionMiddleware.js'

// Composables
const confirm = useConfirm()
const toast = useToast()

// Reactive state
const loading = ref(true)
const loadingMore = ref(false)
const submitting = ref(false)
const error = ref(null)
const talents = ref([])
const schema = ref(null)
const databaseTitle = ref('')
const databaseDescription = ref('')
const hasMore = ref(false)
const nextCursor = ref(null)
const showAddForm = ref(false)
const editingTalent = ref(null)
const formData = ref({})
const formErrors = ref({})

// Computed
const formFields = computed(() => {
  if (!schema.value) return []
  return talentService.generateFormFields(schema.value)
})

const isDialogVisible = computed(() => showAddForm.value || editingTalent.value)

// Methods
const initialize = async () => {
  try {
    loading.value = true
    error.value = null

    // First try to get talents (this will also infer the schema)
    try {
      const talentsResult = await talentService.getAllTalents({ pageSize: 20 })

      talents.value = talentsResult.results || []
      hasMore.value = talentsResult.has_more || false
      nextCursor.value = talentsResult.next_cursor
    } catch {
      talents.value = []
    }

    // Get database info (includes schema, title, and description)
    try {
      const dbInfo = await talentService.getDatabaseInfo()

      if (dbInfo.title) {
        databaseTitle.value = dbInfo.title
      }
      if (dbInfo.description) {
        databaseDescription.value = dbInfo.description
      }
      if (dbInfo.schema) {
        schema.value = dbInfo.schema
      }
    } catch {
      schema.value = null
    }

  } catch (error) {
    error.value = error.message
  } finally {
    loading.value = false
  }
}

const refreshSchema = async () => {
  try {
    loading.value = true
    const dbInfo = await talentService.getDatabaseInfo()
    if (dbInfo.title) {
      databaseTitle.value = dbInfo.title
    }
    if (dbInfo.description) {
      databaseDescription.value = dbInfo.description
    }
    if (dbInfo.schema) {
      schema.value = dbInfo.schema
    }
    toast.add({ severity: 'success', summary: 'Success', detail: 'Database info refreshed successfully', life: 3000 })
  } catch (error) {
    error.value = error.message
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to refresh database info', life: 3000 })
  } finally {
    loading.value = false
  }
}

const loadMore = async () => {
  if (!hasMore.value || loadingMore.value) return

  try {
    loadingMore.value = true
    const result = await talentService.getAllTalents({
      pageSize: 20,
      startCursor: nextCursor.value
    })

    talents.value.push(...(result.results || []))
    hasMore.value = result.has_more || false
    nextCursor.value = result.next_cursor

  } catch (error) {
    error.value = error.message
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load more talents', life: 3000 })
  } finally {
    loadingMore.value = false
  }
}

const retryLoad = async () => {
  await initialize()
}

const openAddForm = async () => {
  try {
    // Ensure schema is loaded before adding
    if (!schema.value) {
      const dbInfo = await talentService.getDatabaseInfo()
      if (dbInfo.schema) {
        schema.value = dbInfo.schema
      }
    }

    showAddForm.value = true
    formData.value = {}
    formErrors.value = {}
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load database schema', life: 3000 })
  }
}

const editTalent = async (talent) => {
  try {
    // Ensure schema is loaded before editing
    if (!schema.value) {
      const dbInfo = await talentService.getDatabaseInfo()
      if (dbInfo.schema) {
        schema.value = dbInfo.schema
      }
    }

    editingTalent.value = talent
    formData.value = { ...talent }
    formErrors.value = {}
  } catch (error) {
    console.error('Failed to load schema for editing:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load database schema', life: 3000 })
  }
}

const closeForm = () => {
  showAddForm.value = false
  editingTalent.value = null
  formData.value = {}
  formErrors.value = {}
}

const submitForm = async () => {
  try {
    submitting.value = true
    formErrors.value = {}

    // Validate form data
    const validation = talentService.validateFormData(formData.value, schema.value)
    if (!validation.isValid) {
      formErrors.value = validation.errors
      return
    }

    let result
    if (editingTalent.value) {
      // Update existing talent
      result = await talentService.updateTalent(editingTalent.value.id, formData.value)

      // Update talent in list
      const index = talents.value.findIndex(t => t.id === editingTalent.value.id)
      if (index !== -1) {
        talents.value[index] = result.result
      }

      toast.add({ severity: 'success', summary: 'Success', detail: 'Talent updated successfully', life: 3000 })
    } else {
      // Create new talent
      result = await talentService.createTalent(formData.value)

      // Add to beginning of list
      talents.value.unshift(result.result)

      toast.add({ severity: 'success', summary: 'Success', detail: 'Talent added successfully', life: 3000 })
    }

    closeForm()

  } catch (error) {
    error.value = error.message
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save talent', life: 3000 })
  } finally {
    submitting.value = false
  }
}

const deleteTalent = (id) => {
  confirm.require({
    message: 'Are you sure you want to delete this talent profile?',
    header: 'Delete Confirmation',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await talentService.deleteTalent(id)
        talents.value = talents.value.filter(t => t.id !== id)
        toast.add({ severity: 'success', summary: 'Success', detail: 'Talent deleted successfully', life: 3000 })
      } catch (error) {
        error.value = error.message
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete talent', life: 3000 })
      }
    }
  })
}





const getDynamicFields = (talent) => {
  // Only exclude metadata fields, not specific field names
  const metadataFields = ['id', 'created_time', 'last_edited_time']

  // Get all fields from talent object (excluding metadata)
  const allFields = Object.keys(talent).filter(key => !metadataFields.includes(key) && key !== '')

  // Use schema order if available to sort the fields
  let orderedFields
  if (schema.value && schema.value.properties) {
    // Get the exact schema order from Notion
    const schemaOrder = Object.keys(schema.value.properties)

    // Find the name field (first field in schema)
    const nameField = schemaOrder[0]

    // Get all fields EXCEPT the name field
    const fieldsToDisplay = allFields.filter(key => {
      // Check if this field is the name field (exact match)
      return key !== nameField
    })

    // Strictly follow the Notion schema order for the remaining fields
    orderedFields = []

    // Add fields in the exact order they appear in the schema (excluding the name field)
    for (let i = 1; i < schemaOrder.length; i++) {
      const fieldName = schemaOrder[i]
      if (fieldsToDisplay.includes(fieldName)) {
        orderedFields.push(fieldName)
      }
    }

    // Add any remaining fields that aren't in the schema
    const remainingFields = fieldsToDisplay.filter(key => !schemaOrder.includes(key))
    orderedFields.push(...remainingFields)
  } else {
    // Use talent object order
    orderedFields = allFields
  }

  const fields = orderedFields.map(key => [key, talent[key]])
  return fields
}

const formatLabel = (text) => {
  return NotionMiddleware.formatLabel(text)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}

// Lifecycle
onMounted(() => {
  initialize()
})
</script>
