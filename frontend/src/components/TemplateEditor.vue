<template>
    <div class="template-editor">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
            <div>
                <h2 class="text-2xl font-semibold text-gray-900">Template Editor</h2>
                <p class="text-gray-600 mt-1">Create and customize database templates</p>
            </div>
            <div class="flex gap-2">
                <Button @click="importTemplate" severity="secondary" outlined>
                    <i class="pi pi-upload mr-2"></i>
                    Import
                </Button>
                <Button @click="exportTemplates" severity="secondary" outlined>
                    <i class="pi pi-download mr-2"></i>
                    Export
                </Button>
                <Button @click="createNewTemplate" class="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    <i class="pi pi-plus mr-2"></i>
                    New Template
                </Button>
            </div>
        </div>

        <!-- Template List -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div v-for="template in templates" :key="template.id"
                class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div class="flex items-start justify-between mb-3">
                    <div class="flex-1">
                        <h3 class="font-semibold text-gray-900">{{ template.title }}</h3>
                        <p class="text-sm text-gray-600 mt-1">{{ template.description }}</p>
                        <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>{{ template.propertyCount }} properties</span>
                            <span v-if="template.custom"
                                class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Custom</span>
                            <span v-else class="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">System</span>
                        </div>
                    </div>
                    <Dropdown :options="getTemplateActions(template)" @command="handleTemplateAction">
                        <template #trigger>
                            <Button severity="secondary" text class="p-2">
                                <i class="pi pi-ellipsis-v"></i>
                            </Button>
                        </template>
                    </Dropdown>
                </div>

                <div class="flex gap-2">
                    <Button @click="editTemplate(template)" size="small" severity="secondary" outlined class="flex-1">
                        <i class="pi pi-pencil mr-1"></i>
                        Edit
                    </Button>
                    <Button @click="duplicateTemplate(template)" size="small" severity="secondary" outlined>
                        <i class="pi pi-copy"></i>
                    </Button>
                    <Button @click="deployTemplate(template)" size="small"
                        class="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        <i class="pi pi-bolt"></i>
                    </Button>
                </div>
            </div>
        </div>

        <!-- Template Editor Dialog -->
        <Dialog v-model:visible="showEditor" :header="editingTemplate?.id ? 'Edit Template' : 'New Template'" modal
            class="w-full max-w-4xl" :dismissableMask="false">
            <div class="space-y-6" v-if="editingTemplate">
                <!-- Basic Info -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Template ID</label>
                        <InputText v-model="editingTemplate.id" placeholder="e.g., my_custom_template"
                            :disabled="!!originalTemplateId" class="w-full" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <InputText v-model="editingTemplate.title" placeholder="Template Title" class="w-full" />
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <Textarea v-model="editingTemplate.description" placeholder="Describe what this template is for..."
                        rows="3" class="w-full" />
                </div>

                <!-- Properties Editor -->
                <div>
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900">Properties</h3>
                        <Button @click="addProperty" size="small">
                            <i class="pi pi-plus mr-2"></i>
                            Add Property
                        </Button>
                    </div>

                    <div class="space-y-4">
                        <div v-for="(property, propName, index) in editingTemplate.properties" :key="propName"
                            class="bg-gray-50 p-4 rounded-lg border">
                            <div class="flex items-center justify-between mb-3">
                                <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div>
                                        <label class="block text-xs font-medium text-gray-600 mb-1">Property
                                            Name</label>
                                        <InputText :modelValue="propName"
                                            @update:modelValue="updatePropertyName(propName, $event)"
                                            placeholder="Property Name" class="w-full text-sm" />
                                    </div>
                                    <div>
                                        <label class="block text-xs font-medium text-gray-600 mb-1">Type</label>
                                        <Dropdown :modelValue="property.type"
                                            @update:modelValue="updatePropertyType(propName, $event)"
                                            :options="propertyTypes" optionLabel="label" optionValue="value"
                                            placeholder="Select Type" class="w-full text-sm" />
                                    </div>
                                    <div>
                                        <label class="block text-xs font-medium text-gray-600 mb-1">Actions</label>
                                        <Button @click="removeProperty(propName)" severity="danger" text size="small"
                                            class="p-2">
                                            <i class="pi pi-trash"></i>
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <!-- Property-specific options -->
                            <div v-if="property.type === 'select' || property.type === 'multi_select'" class="mt-3">
                                <label class="block text-xs font-medium text-gray-600 mb-2">Options</label>
                                <div class="space-y-2">
                                    <div v-for="(option, optIndex) in getPropertyOptions(property)" :key="optIndex"
                                        class="flex items-center gap-2">
                                        <InputText v-model="option.name" placeholder="Option name"
                                            class="flex-1 text-sm" />
                                        <Dropdown v-model="option.color" :options="colorOptions" optionLabel="label"
                                            optionValue="value" class="w-24 text-sm" />
                                        <Button @click="removeOption(propName, optIndex)" severity="danger" text
                                            size="small" class="p-1">
                                            <i class="pi pi-times text-xs"></i>
                                        </Button>
                                    </div>
                                    <Button @click="addOption(propName)" severity="secondary" text size="small"
                                        class="text-xs">
                                        <i class="pi pi-plus mr-1"></i>
                                        Add Option
                                    </Button>
                                </div>
                            </div>

                            <!-- Number format options -->
                            <div v-if="property.type === 'number'" class="mt-3">
                                <label class="block text-xs font-medium text-gray-600 mb-1">Format</label>
                                <Dropdown :modelValue="property.number?.format || 'number'"
                                    @update:modelValue="updateNumberFormat(propName, $event)" :options="numberFormats"
                                    optionLabel="label" optionValue="value" class="w-full text-sm" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sample Data -->
                <div>
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900">Sample Data (Optional)</h3>
                        <ToggleButton v-model="includeSampleData" onLabel="Enabled" offLabel="Disabled"
                            class="text-sm" />
                    </div>

                    <div v-if="includeSampleData" class="bg-gray-50 p-4 rounded-lg">
                        <p class="text-sm text-gray-600 mb-3">Add sample data that will be created when the template is
                            deployed
                        </p>
                        <Textarea v-model="sampleDataJson"
                            placeholder='[{"Property Name": {"title": [{"text": {"content": "Sample Value"}}]}}]'
                            rows="6" class="w-full font-mono text-xs" />
                    </div>
                </div>
            </div>

            <template #footer>
                <div class="flex justify-end gap-2">
                    <Button @click="cancelEdit" severity="secondary" outlined>
                        Cancel
                    </Button>
                    <Button @click="saveTemplate" :loading="saving">
                        <i class="pi pi-save mr-2"></i>
                        Save Template
                    </Button>
                </div>
            </template>
        </Dialog>

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
    editingTemplate.value = {
        id: '',
        title: '',
        description: '',
        properties: {
            'Name': { type: 'title', title: {} }
        }
    }
    originalTemplateId.value = null
    includeSampleData.value = false
    sampleDataJson.value = ''
    showEditor.value = true
}

const editTemplate = async (template) => {
    // Load full template data
    try {
        const response = await fetch('/.netlify/functions/automation-engine', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'get_template',
                payload: { templateId: template.id }
            })
        })

        const data = await response.json()
        editingTemplate.value = { ...data.template }
        originalTemplateId.value = template.id

        // Load sample data if exists
        if (data.template.sampleData) {
            includeSampleData.value = true
            sampleDataJson.value = JSON.stringify(data.template.sampleData, null, 2)
        }

        showEditor.value = true
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

const saveTemplate = async () => {
    if (!editingTemplate.value.id || !editingTemplate.value.title) {
        toast.add({
            severity: 'warn',
            summary: 'Validation Error',
            detail: 'Template ID and title are required',
            life: 5000
        })
        return
    }

    saving.value = true

    try {
        const templateData = { ...editingTemplate.value }

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

        const action = originalTemplateId.value ? 'update_template' : 'save_template'
        const payload = originalTemplateId.value
            ? { templateId: originalTemplateId.value, updates: templateData }
            : { templateId: editingTemplate.value.id, template: templateData }

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

const addProperty = () => {
    const propertyName = `Property ${Object.keys(editingTemplate.value.properties).length + 1}`
    editingTemplate.value.properties[propertyName] = {
        type: 'rich_text',
        rich_text: {}
    }
}

const removeProperty = (propertyName) => {
    delete editingTemplate.value.properties[propertyName]
}

const updatePropertyName = (oldName, newName) => {
    if (oldName === newName) return

    const property = editingTemplate.value.properties[oldName]
    delete editingTemplate.value.properties[oldName]
    editingTemplate.value.properties[newName] = property
}

const updatePropertyType = (propertyName, newType) => {
    const baseProperty = { type: newType }

    // Add type-specific configuration
    switch (newType) {
        case 'title':
            baseProperty.title = {}
            break
        case 'rich_text':
            baseProperty.rich_text = {}
            break
        case 'number':
            baseProperty.number = { format: 'number' }
            break
        case 'select':
            baseProperty.select = { options: [] }
            break
        case 'multi_select':
            baseProperty.multi_select = { options: [] }
            break
        case 'date':
            baseProperty.date = {}
            break
        case 'people':
            baseProperty.people = {}
            break
        case 'files':
            baseProperty.files = {}
            break
        case 'checkbox':
            baseProperty.checkbox = {}
            break
        case 'url':
            baseProperty.url = {}
            break
        case 'email':
            baseProperty.email = {}
            break
        case 'phone_number':
            baseProperty.phone_number = {}
            break
        case 'created_time':
            baseProperty.created_time = {}
            break
        case 'last_edited_time':
            baseProperty.last_edited_time = {}
            break
    }

    editingTemplate.value.properties[propertyName] = baseProperty
}

const updateNumberFormat = (propertyName, format) => {
    editingTemplate.value.properties[propertyName].number.format = format
}

const getPropertyOptions = (property) => {
    if (property.type === 'select') {
        return property.select?.options || []
    } else if (property.type === 'multi_select') {
        return property.multi_select?.options || []
    }
    return []
}

const addOption = (propertyName) => {
    const property = editingTemplate.value.properties[propertyName]
    const options = getPropertyOptions(property)

    const newOption = {
        name: `Option ${options.length + 1}`,
        color: 'gray'
    }

    if (property.type === 'select') {
        if (!property.select.options) property.select.options = []
        property.select.options.push(newOption)
    } else if (property.type === 'multi_select') {
        if (!property.multi_select.options) property.multi_select.options = []
        property.multi_select.options.push(newOption)
    }
}

const removeOption = (propertyName, optionIndex) => {
    const property = editingTemplate.value.properties[propertyName]

    if (property.type === 'select') {
        property.select.options.splice(optionIndex, 1)
    } else if (property.type === 'multi_select') {
        property.multi_select.options.splice(optionIndex, 1)
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

const handleTemplateAction = (action) => {
    action.command()
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
.template-editor {
    max-height: 80vh;
    overflow-y: auto;
}

/* Custom scrollbar */
.template-editor::-webkit-scrollbar {
    width: 6px;
}

.template-editor::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
}

.template-editor::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
}

.template-editor::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}
</style>
