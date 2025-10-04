<template>
  <div class="bg-gradient-to-br from-slate-50 to-slate-100">
    <!-- Modern Header -->
    <div class="px-4 my-8">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
        <div class="flex flex-wrap gap-2 md:gap-3 items-center justify-center md:justify-end w-full">
          <Button @click="importTemplate" severity="secondary" outlined
            class="bg-gradient-to-r from-blue-500 to-blue-600 border-blue-400 text-white backdrop-blur-sm hover:from-blue-600 hover:to-blue-700 hover:-translate-y-0.5 transition-all duration-300 text-sm font-medium">
            <i class="pi pi-upload mr-2"></i>
            Import
          </Button>
          <Button @click="exportTemplates" severity="secondary" outlined
            class="bg-gradient-to-r from-purple-500 to-purple-600 border-purple-400 text-white backdrop-blur-sm hover:from-purple-600 hover:to-purple-700 hover:-translate-y-0.5 transition-all duration-300 text-sm font-medium">
            <i class="pi pi-download mr-2"></i>
            Export
          </Button>
          <Button @click="createNewTemplate"
            class="bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold px-4 md:px-6 py-2 md:py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-sm md:text-base">
            <i class="pi pi-plus mr-2"></i>
            New Template
          </Button>
        </div>
      </div>
    </div>

    <!-- Modern Empty State -->
    <div v-if="templates.length === 0" class="flex items-center justify-center min-h-96 px-8">
      <div class="text-center max-w-md">
        <div
          class="w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-500 text-3xl">
          <i class="pi pi-inbox"></i>
        </div>
        <h3 class="text-2xl font-semibold text-slate-800 mb-2">No Templates Found</h3>
        <p class="text-slate-600 mb-8 leading-relaxed">Create your first template to get started with database
          automation</p>
        <Button @click="createNewTemplate"
          class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
          <i class="pi pi-plus mr-2"></i>
          Create First Template
        </Button>
      </div>
    </div>

    <div v-else
      class="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 px-2 md:px-4 pb-4">
      <div v-for="template in templates" :key="template.id"
        class="bg-white rounded-2xl p-2 shadow-lg border border-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden group">
        <!-- Gradient top border -->
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

        <div class="flex justify-between items-start mb-3 md:mb-4">
          <div class="flex-1 min-w-0">
            <h3 class="text-lg md:text-xl font-semibold text-slate-800 mb-1 md:mb-2 truncate">{{ template.title }}</h3>
            <p class="text-xs md:text-sm text-slate-600 mb-2 md:mb-3 leading-relaxed line-clamp-2">{{
              template.description }}</p>
            <div class="flex items-center gap-2 md:gap-3 flex-wrap">
              <span class="text-xs text-slate-500 font-medium">{{ template.propertyCount }} properties</span>
              <span v-if="template.custom"
                class="px-2 md:px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold rounded-full uppercase tracking-wide">Custom</span>
              <span v-else
                class="px-2 md:px-3 py-1 bg-gradient-to-r from-slate-200 to-slate-300 text-slate-600 text-xs font-semibold rounded-full uppercase tracking-wide">System</span>
            </div>
          </div>
        </div>

        <div class="flex gap-2">
          <Button @click="editTemplate(template)" size="small" severity="secondary" outlined
            class="flex-1 text-xs md:text-sm font-medium rounded-lg transition-all duration-200 hover:bg-slate-50">
            <i class="pi pi-pencil mr-1"></i>
            Edit
          </Button>
          <Button @click="duplicateTemplate(template)" size="small" severity="secondary" outlined
            class="flex-1 text-xs md:text-sm font-medium rounded-lg transition-all duration-200 hover:bg-slate-50">
            <i class="pi pi-copy mr-1"></i>
            Copy
          </Button>
          <Button @click="deployTemplate(template)" size="small"
            class="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <i class="pi pi-bolt mr-1"></i>
            Deploy
          </Button>
        </div>
      </div>
    </div>

    <!-- Multi-Source Edit Modal for Template Editing -->
    <MultiSourceEditModal v-model:visible="showEditor" :schema="templateSchema" @create="handleTemplateCreate"
      @cancel="cancelEdit" />

    <!-- Import Dialog -->
    <Dialog v-model:visible="showImport" header="Import Templates" modal class="w-full max-w-2xl">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Select JSON File</label>
          <input type="file" accept=".json" @change="handleFileSelect"
            class="w-full p-2 border border-gray-300 rounded-lg" />
        </div>

        <div class="flex items-center gap-2">
          <Checkbox v-model="overwriteExisting" inputId="overwrite" />
          <label for="overwrite" class="text-sm text-gray-700">Overwrite existing templates</label>
        </div>

        <div v-if="importPreview" class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-medium text-gray-900 mb-2">Preview</h4>
          <div class="text-sm text-gray-600">
            <p>{{ Object.keys(importPreview.templates || {}).length }} templates found</p>
            <ul class="list-disc list-inside mt-2">
              <li v-for="templateId in Object.keys(importPreview.templates || {})" :key="templateId">
                {{ templateId }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button @click="showImport = false" severity="secondary" outlined>
            Cancel
          </Button>
          <Button @click="performImport" :disabled="!importPreview" :loading="importing">
            Import Templates
          </Button>
        </div>
      </template>
    </Dialog>

    <!-- Toast for notifications -->
    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import ToggleButton from 'primevue/togglebutton'
import Checkbox from 'primevue/checkbox'
import Toast from 'primevue/toast'
import MultiSourceEditModal from './MultiSourceEditModal.vue'

const emit = defineEmits(['template-deployed'])
const toast = useToast()

// Reactive data
const templates = ref([])
const showEditor = ref(false)
const showImport = ref(false)
const editingTemplate = ref(null)
const originalTemplateId = ref(null)
const saving = ref(false)
const importing = ref(false)
const includeSampleData = ref(false)
const sampleDataJson = ref('')
const importPreview = ref(null)
const overwriteExisting = ref(false)
const templateSchema = ref({
  title: '',
  description: '',
  dataSources: []
})

// Property type options
const propertyTypes = ref([
  { label: 'Title', value: 'title' },
  { label: 'Text', value: 'rich_text' },
  { label: 'Number', value: 'number' },
  { label: 'Select', value: 'select' },
  { label: 'Multi-select', value: 'multi_select' },
  { label: 'Date', value: 'date' },
  { label: 'People', value: 'people' },
  { label: 'Files', value: 'files' },
  { label: 'Checkbox', value: 'checkbox' },
  { label: 'URL', value: 'url' },
  { label: 'Email', value: 'email' },
  { label: 'Phone', value: 'phone_number' },
  { label: 'Created Time', value: 'created_time' },
  { label: 'Last Edited Time', value: 'last_edited_time' }
])

const colorOptions = ref([
  { label: 'Gray', value: 'gray' },
  { label: 'Blue', value: 'blue' },
  { label: 'Green', value: 'green' },
  { label: 'Yellow', value: 'yellow' },
  { label: 'Orange', value: 'orange' },
  { label: 'Red', value: 'red' },
  { label: 'Purple', value: 'purple' },
  { label: 'Pink', value: 'pink' }
])

const numberFormats = ref([
  { label: 'Number', value: 'number' },
  { label: 'Dollar', value: 'dollar' },
  { label: 'Percent', value: 'percent' }
])

// Methods
const loadTemplates = async () => {
  try {
    const response = await fetch('/.netlify/functions/automation-engine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'list_templates' })
    })

    const data = await response.json()
    templates.value = data.templates || []
  } catch (error) {
    console.error('Error loading templates:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load templates',
      life: 5000
    })
  }
}

const createNewTemplate = () => {
  templateSchema.value = {
    title: '',
    description: '',
    dataSources: [{
      name: 'Main Database',
      description: 'Primary database for this template',
      properties: [{
        name: 'Name',
        type: 'title',
        options: '',
        format: 'number'
      }]
    }]
  }
  editingTemplate.value = null
  originalTemplateId.value = null
  includeSampleData.value = false
  sampleDataJson.value = ''
  showEditor.value = true
}

const editTemplate = async (template) => {
  // Use the template data that's already available from list_templates
  try {
    // Get the full template data from DATABASE_TEMPLATES
    const response = await fetch('/.netlify/functions/automation-engine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'get_template_schema',
        payload: { templateId: template.id }
      })
    })

    if (response.ok) {
      const data = await response.json()

      // Convert template format to MultiSourceEditModal format
      templateSchema.value = {
        title: data.schema?.title || template.title,
        description: data.schema?.description || template.description,
        dataSources: [{
          name: 'Main Database',
          description: 'Primary database for this template',
          properties: Object.entries(data.schema?.properties || {}).map(([propName, propConfig]) => {
            let propType = 'rich_text'
            let options = ''
            let format = 'number'

            if (propConfig.title) {
              propType = 'title'
            } else if (propConfig.rich_text) {
              propType = 'rich_text'
            } else if (propConfig.number) {
              propType = 'number'
              format = propConfig.number.format || 'number'
            } else if (propConfig.select) {
              propType = 'select'
              options = propConfig.select.options ? propConfig.select.options.map(opt => opt.name).join('\n') : ''
            } else if (propConfig.multi_select) {
              propType = 'multi_select'
              options = propConfig.multi_select.options ? propConfig.multi_select.options.map(opt => opt.name).join('\n') : ''
            } else if (propConfig.date) {
              propType = 'date'
            } else if (propConfig.people) {
              propType = 'people'
            } else if (propConfig.files) {
              propType = 'files'
            } else if (propConfig.checkbox) {
              propType = 'checkbox'
            } else if (propConfig.url) {
              propType = 'url'
            } else if (propConfig.email) {
              propType = 'email'
            } else if (propConfig.phone_number) {
              propType = 'phone_number'
            } else if (propConfig.created_time) {
              propType = 'created_time'
            } else if (propConfig.created_by) {
              propType = 'created_by'
            } else if (propConfig.last_edited_time) {
              propType = 'last_edited_time'
            } else if (propConfig.last_edited_by) {
              propType = 'last_edited_by'
            }

            return {
              name: propName,
              type: propType,
              options: options,
              format: format
            }
          })
        }]
      }

      editingTemplate.value = { ...template }
      originalTemplateId.value = template.id

      showEditor.value = true
    } else {
      throw new Error('Failed to load template schema')
    }
  } catch (error) {
    console.error('Error loading template:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load template details',
      life: 5000
    })
  }
}

const handleTemplateCreate = async (schema) => {
  // Convert MultiSourceEditModal schema back to template format
  const templateData = {
    id: editingTemplate.value?.id || `template_${Date.now()}`,
    title: schema.title,
    description: schema.description,
    properties: {}
  }

  // Convert the first data source properties to template properties format
  if (schema.dataSources.length > 0) {
    const mainDataSource = schema.dataSources[0]
    mainDataSource.properties.forEach(prop => {
      if (prop.name && prop.type) {
        let propertyConfig = {}

        if (prop.type === 'select' || prop.type === 'multi_select') {
          const options = prop.options.split('\n').filter(opt => opt.trim()).map(opt => ({
            name: opt.trim(),
            color: 'blue'
          }))
          propertyConfig[prop.type] = { options }
        } else if (prop.type === 'number') {
          propertyConfig[prop.type] = { format: prop.format || 'number' }
        } else {
          propertyConfig[prop.type] = {}
        }

        templateData.properties[prop.name] = propertyConfig
      }
    })
  }

  // Add sample data if provided
  if (includeSampleData.value && sampleDataJson.value) {
    try {
      templateData.sampleData = JSON.parse(sampleDataJson.value)
    } catch (error) {
      toast.add({
        severity: 'warn',
        summary: 'Invalid JSON',
        detail: 'Sample data must be valid JSON',
        life: 5000
      })
      return
    }
  }

  saving.value = true

  try {
    const action = originalTemplateId.value ? 'update_template' : 'save_template'
    const payload = originalTemplateId.value
      ? { templateId: originalTemplateId.value, updates: templateData }
      : { templateId: templateData.id, template: templateData }

    const response = await fetch('/.netlify/functions/automation-engine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, payload })
    })

    const data = await response.json()

    if (data.success) {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: data.message,
        life: 5000
      })

      showEditor.value = false
      await loadTemplates()
    } else {
      throw new Error(data.error || 'Failed to save template')
    }
  } catch (error) {
    console.error('Error saving template:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message,
      life: 5000
    })
  } finally {
    saving.value = false
  }
}

const cancelEdit = () => {
  showEditor.value = false
  editingTemplate.value = null
  originalTemplateId.value = null
}

const duplicateTemplate = async (template) => {
  const newId = `${template.id}_copy_${Date.now()}`

  try {
    const response = await fetch('/.netlify/functions/automation-engine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'duplicate_template',
        payload: {
          templateId: template.id,
          newTemplateId: newId,
          customizations: {
            title: `${template.title} (Copy)`
          }
        }
      })
    })

    const data = await response.json()

    if (data.success) {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Template duplicated successfully',
        life: 5000
      })

      await loadTemplates()
    } else {
      throw new Error(data.error || 'Failed to duplicate template')
    }
  } catch (error) {
    console.error('Error duplicating template:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message,
      life: 5000
    })
  }
}

const deployTemplate = async (template) => {
  try {
    const response = await fetch('/.netlify/functions/automation-engine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'deploy_template',
        payload: {
          templateId: template.id,
          includeSampleData: true
        }
      })
    })

    const data = await response.json()

    if (data.database) {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: `Database "${data.database.title}" created successfully!`,
        life: 5000
      })

      emit('template-deployed', data.database)
    } else {
      throw new Error('Failed to create database')
    }
  } catch (error) {
    console.error('Error deploying template:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to deploy template',
      life: 5000
    })
  }
}

const getTemplateActions = (template) => {
  const actions = [
    { label: 'Edit', command: () => editTemplate(template) },
    { label: 'Duplicate', command: () => duplicateTemplate(template) },
    { label: 'Deploy', command: () => deployTemplate(template) }
  ]

  if (template.custom) {
    actions.push({ label: 'Delete', command: () => deleteTemplate(template) })
  }

  return actions
}

const handleTemplateAction = (event) => {
  const selectedAction = event.value
  if (selectedAction && selectedAction.command) {
    selectedAction.command()
  }
}

const deleteTemplate = async (template) => {
  if (!confirm(`Are you sure you want to delete "${template.title}"?`)) return

  try {
    const response = await fetch('/.netlify/functions/automation-engine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'delete_template',
        payload: { templateId: template.id }
      })
    })

    const data = await response.json()

    if (data.success) {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Template deleted successfully',
        life: 5000
      })

      await loadTemplates()
    } else {
      throw new Error(data.error || 'Failed to delete template')
    }
  } catch (error) {
    console.error('Error deleting template:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message,
      life: 5000
    })
  }
}

const exportTemplates = async () => {
  try {
    const response = await fetch('/.netlify/functions/automation-engine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'export_templates' })
    })

    const data = await response.json()

    // Create download link
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'notion-templates.json'
    a.click()
    URL.revokeObjectURL(url)

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Templates exported successfully',
      life: 5000
    })
  } catch (error) {
    console.error('Error exporting templates:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to export templates',
      life: 5000
    })
  }
}

const importTemplate = () => {
  showImport.value = true
  importPreview.value = null
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      importPreview.value = JSON.parse(e.target.result)
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Invalid File',
        detail: 'Selected file is not valid JSON',
        life: 5000
      })
    }
  }
  reader.readAsText(file)
}

const performImport = async () => {
  if (!importPreview.value) return

  importing.value = true

  try {
    const response = await fetch('/.netlify/functions/automation-engine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'import_templates',
        payload: {
          templates: importPreview.value.templates,
          overwrite: overwriteExisting.value
        }
      })
    })

    const data = await response.json()

    if (data.success) {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: data.message,
        life: 5000
      })

      showImport.value = false
      await loadTemplates()
    } else {
      throw new Error(data.error || 'Failed to import templates')
    }
  } catch (error) {
    console.error('Error importing templates:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message,
      life: 5000
    })
  } finally {
    importing.value = false
  }
}

onMounted(() => {
  loadTemplates()
})
</script>

<style scoped>
/* Line clamp utility for text truncation */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
