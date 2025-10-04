<template>
  <Dialog v-model:visible="visible" modal header="Review & Edit Database Schemas"
    :style="{ width: '90vw', maxWidth: '1200px' }" :closable="false">
    <div class="database-edit-container">
      <!-- Header with description -->
      <div class="mb-4">
        <p class="text-gray-600 mb-3">
          Review the generated database schemas below. You can edit names, descriptions, and properties before creating
          the databases.
        </p>
      </div>

      <!-- Database schemas list -->
      <div class="schemas-list">
        <div v-for="(schema, index) in schemas" :key="index"
          class="schema-card mb-4 p-4 border border-gray-200 rounded-lg">
          <!-- Database header -->
          <div class="schema-header flex items-center justify-between mb-3">
            <h3 class="text-lg font-semibold text-gray-800">
              Database {{ index + 1 }}
            </h3>
            <Button icon="pi pi-trash" severity="danger" text size="small" @click="removeSchema(index)"
              v-if="schemas.length > 1" />
          </div>

          <!-- Database title -->
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Database Name
            </label>
            <InputText v-model="schema.title" class="w-full" placeholder="Enter database name" />
          </div>

          <!-- Database description -->
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <Textarea v-model="schema.description" class="w-full" rows="2" placeholder="Enter database description" />
          </div>

          <!-- Properties section -->
          <div class="properties-section">
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-medium text-gray-700">
                Properties
              </label>
              <Button icon="pi pi-plus" label="Add Property" size="small" @click="addProperty(index)" />
            </div>

            <div class="properties-list space-y-2">
              <div v-for="(property, propKey, propIndex) in schema.properties" :key="propKey"
                class="property-item flex items-center gap-2 p-2 bg-gray-50 rounded">
                <!-- Property name -->
                <div class="flex-1">
                  <InputText v-model="property.name" placeholder="Property name" class="w-full" />
                </div>

                <!-- Property type -->
                <div class="w-32">
                  <Dropdown v-model="property.type" :options="propertyTypes" option-label="label" option-value="value"
                    placeholder="Type" class="w-full" />
                </div>

                <!-- Property options (for select/multi_select) -->
                <div v-if="property.type === 'select' || property.type === 'multi_select'" class="w-24">
                  <Button icon="pi pi-cog" size="small" @click="editPropertyOptions(index, propKey)" />
                </div>

                <!-- Remove property -->
                <Button icon="pi pi-trash" severity="danger" text size="small"
                  @click="removeProperty(index, propKey)" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add new database button -->
      <div class="text-center mb-4">
        <Button icon="pi pi-plus" label="Add Another Database" outlined @click="addNewSchema" />
      </div>
    </div>

    <!-- Footer with actions -->
    <template #footer>
      <div class="flex justify-between">
        <Button label="Cancel" severity="secondary" @click="handleCancel" />
        <div class="flex gap-2">
          <Button label="Preview" icon="pi pi-eye" outlined @click="handlePreview" />
          <Button label="Create Databases" icon="pi pi-check" @click="handleCreate" :loading="creating" />
        </div>
      </div>
    </template>

    <!-- Preview Dialog -->
    <Dialog v-model:visible="previewVisible" modal header="Database Preview"
      :style="{ width: '80vw', maxWidth: '1000px' }">
      <div class="preview-content">
        <div v-for="(schema, index) in schemas" :key="index"
          class="preview-schema mb-4 p-4 border border-gray-200 rounded-lg">
          <h3 class="text-lg font-semibold mb-2">{{ schema.title }}</h3>
          <p class="text-gray-600 mb-3">{{ schema.description }}</p>

          <div class="properties-preview">
            <h4 class="font-medium mb-2">Properties:</h4>
            <div class="grid grid-cols-2 gap-2">
              <div v-for="(property, propKey) in schema.properties" :key="propKey"
                class="property-preview p-2 bg-gray-50 rounded text-sm">
                <span class="font-medium">{{ property.name }}:</span>
                <span class="text-gray-600">{{ property.type }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <Button label="Close" @click="previewVisible = false" />
      </template>
    </Dialog>
  </Dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'

const props = defineProps({
  schemas: {
    type: Array,
    required: true
  },
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'create', 'cancel'])

const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const previewVisible = ref(false)
const creating = ref(false)

// Property types available in Notion
const propertyTypes = [
  { label: 'Title', value: 'title' },
  { label: 'Rich Text', value: 'rich_text' },
  { label: 'Number', value: 'number' },
  { label: 'Select', value: 'select' },
  { label: 'Multi Select', value: 'multi_select' },
  { label: 'Date', value: 'date' },
  { label: 'People', value: 'people' },
  { label: 'Files', value: 'files' },
  { label: 'Checkbox', value: 'checkbox' },
  { label: 'URL', value: 'url' },
  { label: 'Email', value: 'email' },
  { label: 'Phone Number', value: 'phone_number' }
]

// Convert schema properties to editable format
const schemas = ref(props.schemas.map(schema => ({
  ...schema,
  properties: Object.entries(schema.properties || {}).map(([key, value]) => ({
    name: key,
    type: Object.keys(value)[0],
    options: value.select?.options || value.multi_select?.options || []
  }))
})))

const addProperty = (schemaIndex) => {
  const newProperty = {
    name: '',
    type: 'rich_text',
    options: []
  }
  schemas.value[schemaIndex].properties.push(newProperty)
}

const removeProperty = (schemaIndex, propIndex) => {
  schemas.value[schemaIndex].properties.splice(propIndex, 1)
}

const addNewSchema = () => {
  schemas.value.push({
    title: '',
    description: '',
    properties: []
  })
}

const removeSchema = (index) => {
  schemas.value.splice(index, 1)
}

const editPropertyOptions = (schemaIndex, propIndex) => {
  // TODO: Implement property options editing
  console.log('Edit property options:', schemaIndex, propIndex)
}

const handlePreview = () => {
  previewVisible.value = true
}

const handleCreate = async () => {
  creating.value = true

  try {
    // Convert back to the original schema format
    const formattedSchemas = schemas.value.map(schema => ({
      title: schema.title,
      description: schema.description,
      properties: schema.properties.reduce((acc, prop) => {
        if (prop.name && prop.type) {
          acc[prop.name] = { [prop.type]: {} }
        }
        return acc
      }, {})
    }))

    emit('create', formattedSchemas)
  } finally {
    creating.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.database-edit-container {
  max-height: 70vh;
  overflow-y: auto;
}

.schema-card {
  background: white;
  border: 1px solid #e5e7eb;
}

.property-item {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
}

.properties-preview {
  background: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
}

.preview-schema {
  background: white;
  border: 1px solid #e5e7eb;
}
</style>
