<template>
  <form @submit.prevent="submitForm" class="space-y-6 relative">
    <!-- No Schema Available -->
    <div v-if="!getFormFieldsArray.length" class="text-center py-8 text-gray-500">
      <p>No form fields available.</p>
      <Button @click="refreshSchema" severity="secondary" label="Retry" class="mt-2" />
    </div>

    <!-- Form Fields -->
    <div v-else class="space-y-6">
      <!-- Boolean Fields Section -->
      <div v-if="booleanFields.length > 0" class="absolute top-4 right-4">
        <div class="space-y-2">
          <div v-for="field in booleanFields" :key="field.name"
            class="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
            <Checkbox :id="field.name" :model-value="getFieldValue(field.name)"
              @update:model-value="(value) => updateField(field.name, value)" :binary="true" />
            <label :for="field.name" class="text-sm text-gray-700 cursor-pointer">
              {{ field.description || field.label }}
            </label>
            <small v-if="formErrors[field.name]" class="text-red-600 text-xs">
              {{ formErrors[field.name] }}
            </small>
          </div>
        </div>
      </div>
      <!-- Title Fields Section -->
      <div v-if="titleFields.length > 0" class="space-y-4">
        <div class="grid grid-cols-1 gap-4">
          <div v-for="field in titleFields" :key="field.name" class="space-y-2">
            <label :for="field.name" class="block text-sm font-medium text-gray-700">
              <span v-if="field.emoji" class="mr-2 text-lg">{{ field.emoji }}</span>
              <i v-else-if="field.icon" :class="field.icon" class="mr-2 text-gray-500"></i>
              {{ field.label }}
              <span v-if="field.required" class="text-red-500 ml-1">*</span>
            </label>
            <InputText :id="field.name" :type="field.type" :placeholder="field.placeholder" :required="field.required"
              :model-value="getFieldValue(field.name)" @update:model-value="(value) => updateField(field.name, value)"
              :class="{ 'p-invalid': formErrors[field.name] }" class="w-full" />
            <small v-if="formErrors[field.name]" class="text-red-600 block">
              {{ formErrors[field.name] }}
            </small>
          </div>
        </div>
      </div>


      <!-- Contact Fields Section -->
      <div v-if="contactFields.length > 0" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="field in contactFields" :key="field.name" class="space-y-2">
            <label :for="field.name" class="block text-sm font-medium text-gray-700">
              <span v-if="field.emoji" class="mr-2 text-lg">{{ field.emoji }}</span>
              <i v-else-if="field.icon" :class="field.icon" class="mr-2 text-gray-500"></i>
              {{ field.label }}
              <span v-if="field.required" class="text-red-500 ml-1">*</span>
            </label>
            <InputText :id="field.name" :type="field.type" :placeholder="field.placeholder" :required="field.required"
              :model-value="getFieldValue(field.name)" @update:model-value="(value) => updateField(field.name, value)"
              :class="{ 'p-invalid': formErrors[field.name] }" class="w-full" />
            <small v-if="formErrors[field.name]" class="text-red-600 block">
              {{ formErrors[field.name] }}
            </small>
          </div>
        </div>
      </div>

      <!-- Currency Number Fields Section -->
      <div v-if="currencyNumberFields.length > 0" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="field in currencyNumberFields" :key="field.name" class="space-y-2">
            <label :for="field.name" class="block text-sm font-medium text-gray-700">
              <span v-if="field.emoji" class="mr-2 text-lg">{{ field.emoji }}</span>
              <i v-else-if="field.icon" :class="field.icon" class="mr-2 text-gray-500"></i>
              {{ field.label }}
              <span class="text-green-600 ml-1">({{ currencyFormats[field.format]?.currency || 'USD' }})</span>
              <span v-if="field.required" class="text-red-500 ml-1">*</span>
            </label>
            <div class="relative">
              <InputNumber :id="field.name" :placeholder="field.placeholder" :required="field.required"
                :min="field.min || 0" :max="field.max" :step="field.step" :model-value="getFieldValue(field.name)"
                @update:model-value="(value) => updateField(field.name, value)"
                :class="{ 'p-invalid': formErrors[field.name] }" class="w-full" showButtons buttonLayout="horizontal"
                mode="currency" :currency="currencyFormats[field.format]?.currency || 'USD'">
                <template #incrementbuttonicon>
                  <span class="pi pi-plus" />
                </template>
                <template #decrementbuttonicon>
                  <span class="pi pi-minus" />
                </template>
              </InputNumber>
            </div>
            <small v-if="formErrors[field.name]" class="text-red-600 block">
              {{ formErrors[field.name] }}
            </small>
          </div>
        </div>
      </div>

      <!-- Regular Number Fields Section -->
      <div v-if="regularNumberFields.length > 0" class="space-y-4">
        <div class="space-y-4">
          <div v-for="field in regularNumberFields" :key="field.name" class="space-y-2">
            <label :for="field.name" class="block text-sm font-medium text-gray-700">
              <span v-if="field.emoji" class="mr-2 text-lg">{{ field.emoji }}</span>
              <i v-else-if="field.icon" :class="field.icon" class="mr-2 text-gray-500"></i>
              {{ field.label }}
              <span v-if="field.required" class="text-red-500 ml-1">*</span>
            </label>
            <div class="relative">
              <InputNumber :id="field.name" :placeholder="field.placeholder" :required="field.required"
                :min="field.min || 0" :max="field.max" :step="field.step" :model-value="getFieldValue(field.name)"
                @update:model-value="(value) => updateField(field.name, value)"
                :class="{ 'p-invalid': formErrors[field.name] }" class="w-full" showButtons buttonLayout="horizontal">
                <template #incrementbuttonicon>
                  <i class="pi pi-plus" />
                </template>
                <template #decrementbuttonicon>
                  <i class="pi pi-minus" />
                </template>
              </InputNumber>
            </div>
            <small v-if="formErrors[field.name]" class="text-red-600 block">
              {{ formErrors[field.name] }}
            </small>
          </div>
        </div>
      </div>



      <!-- Selection Fields Section -->
      <div v-if="selectionFields.length > 0" class="space-y-4">
        <div class="grid grid-cols-1 gap-4">
          <div v-for="field in selectionFields" :key="field.name" class="space-y-2">
            <label :for="field.name" class="block text-sm font-medium text-gray-700">
              <span v-if="field.emoji" class="mr-2 text-lg">{{ field.emoji }}</span>
              <i v-else-if="field.icon" :class="field.icon" class="mr-2 text-gray-500"></i>
              {{ field.label }}
              <span v-if="field.required" class="text-red-500 ml-1">*</span>
            </label>

            <!-- Single Select -->
            <template v-if="field.type === 'select'">
              <Dropdown :id="field.name" :required="field.required" :model-value="getFieldValue(field.name)"
                @update:model-value="(value) => updateField(field.name, value)" :options="field.options"
                optionLabel="label" optionValue="value" :placeholder="`Select ${field.label}`"
                :class="{ 'p-invalid': formErrors[field.name] }" class="w-full">
                <template #option="slotProps">
                  <div class="flex items-center gap-2">
                    <span v-if="slotProps.option.color" :class="getColorIndicator(slotProps.option.color)"
                      class="w-3 h-3 rounded-full"></span>
                    <span>{{ slotProps.option.label }}</span>
                  </div>
                </template>
              </Dropdown>
              <!-- Display selected select option with color -->
              <div v-if="getFieldValue(field.name)" class="mt-2">
                <div class="flex items-center gap-2">
                  <span :class="getSelectedOptionClasses(getFieldValue(field.name), field)"
                    class="px-3 py-1.5 text-sm rounded-full border font-medium">
                    {{ getSelectedOptionLabel(getFieldValue(field.name), field) }}
                  </span>
                </div>
              </div>
            </template>

            <!-- Multi Select -->
            <template v-else-if="field.type === 'multi_select'">
              <MultiSelect :id="field.name" :model-value="getMultiselectValue(field.name)"
                @update:model-value="(value) => updateMultiselectField(field.name, value)" :options="field.options"
                optionLabel="label" optionValue="value" :placeholder="`Select ${field.label}`"
                :class="{ 'p-invalid': formErrors[field.name] }" class="w-full" :filter="true" :allowEmpty="true"
                display="chip">
                <template #option="slotProps">
                  <div class="flex items-center gap-2 px-2 py-1 rounded"
                    :class="getOptionBackgroundClasses(slotProps.option)">
                    <span>{{ slotProps.option.label }}</span>
                  </div>
                </template>
                <template #chip="slotProps">
                  <div class="flex items-center gap-2 px-3 py-1.5 text-sm rounded-full border font-medium"
                    :class="getOptionClasses(slotProps.value, field)">
                    <span>{{ typeof slotProps.value === 'string' ? slotProps.value : slotProps.value?.label ||
                      slotProps.value?.value || slotProps.value }}</span>
                    <Button type="button" @click="removeMultiselectItem(field.name, slotProps.value || slotProps)"
                      class="ml-1 hover:opacity-75 p-0 w-6 h-6 text-gray-700 hover:text-gray-900" :icon="'pi pi-times'"
                      size="small" link rounded />
                  </div>
                </template>
              </MultiSelect>
            </template>

            <small v-if="formErrors[field.name]" class="text-red-600 block">
              {{ formErrors[field.name] }}
            </small>
          </div>
        </div>
      </div>

      <!-- File Fields Section -->
      <div v-if="fileFields.length > 0" class="space-y-4">
        <div class="grid grid-cols-1 gap-4">
          <div v-for="field in fileFields" :key="field.name" class="space-y-2">
            <label :for="field.name" class="block text-sm font-medium text-gray-700">
              <span v-if="field.emoji" class="mr-2 text-lg">{{ field.emoji }}</span>
              <i v-else-if="field.icon" :class="field.icon" class="mr-2 text-gray-500"></i>
              {{ field.label }}
              <span v-if="field.required" class="text-red-500 ml-1">*</span>
            </label>

            <!-- File Upload -->
            <FileUpload :id="field.name" :model-value="getFileFieldValue(field.name)"
              @update:model-value="(value) => updateFileField(field.name, value)"
              @upload="onAdvancedUpload($event, field.name)" @select="onFileSelect($event, field.name)"
              @progress="onUploadProgress($event, field.name)" :class="{ 'p-invalid': formErrors[field.name] }"
              class="w-full" mode="advanced" :multiple="true" :auto="true" :maxFileSize="10000000" accept="image/*"
              url="/.netlify/functions/upload-file" :choose-label="`Choose Files`" :show-upload-button="false"
              :show-cancel-button="false">
              <template #empty>
                <div class="flex flex-col items-center justify-center py-8 text-gray-500">
                  <i class="pi pi-cloud-upload text-4xl mb-4"></i>
                  <span class="text-lg font-medium">Drag and drop files to here to upload</span>
                  <span class="text-sm mt-2">or click to browse</span>
                </div>
              </template>
            </FileUpload>


            <small v-if="formErrors[field.name]" class="text-red-600 block">
              {{ formErrors[field.name] }}
            </small>
          </div>
        </div>
      </div>

      <!-- Other Fields Section -->
      <div v-if="otherFields.length > 0" class="space-y-4">
        <div class="grid grid-cols-1 gap-4">
          <div v-for="field in otherFields" :key="field.name" class="space-y-2">
            <label :for="field.name" class="block text-sm font-medium text-gray-700">
              <span v-if="field.emoji" class="mr-2 text-lg">{{ field.emoji }}</span>
              <i v-else-if="field.icon" :class="field.icon" class="mr-2 text-gray-500"></i>
              {{ field.label }}
              <span v-if="field.required" class="text-red-500 ml-1">*</span>
            </label>

            <!-- Date Input -->
            <Calendar v-if="field.type === 'date'" :id="field.name" :placeholder="field.placeholder"
              :required="field.required" :model-value="getFieldValue(field.name)"
              @update:model-value="(value) => updateField(field.name, value)"
              :class="{ 'p-invalid': formErrors[field.name] }" class="w-full" dateFormat="yy-mm-dd" />

            <!-- Rich Text / Textarea -->
            <Textarea v-else-if="field.type === 'rich_text' || field.type === 'textarea'" :id="field.name"
              :placeholder="field.placeholder" :required="field.required" :model-value="getFieldValue(field.name)"
              @update:model-value="(value) => updateField(field.name, value)"
              :class="{ 'p-invalid': formErrors[field.name] }" class="w-full" rows="3" />

            <!-- Text Input -->
            <InputText v-else :id="field.name" :type="field.type" :placeholder="field.placeholder"
              :required="field.required" :model-value="getFieldValue(field.name)"
              @update:model-value="(value) => updateField(field.name, value)"
              :class="{ 'p-invalid': formErrors[field.name] }" class="w-full" />

            <small v-if="formErrors[field.name]" class="text-red-600 block">
              {{ formErrors[field.name] }}
            </small>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="flex justify-end gap-3 pt-6 border-t border-gray-200">
      <Button type="button" @click="cancelForm" label="Cancel" severity="secondary" />
      <Button type="submit" :disabled="submitting" :loading="submitting"
        :label="submitting ? submittingText : submitButtonText" severity="primary" />
    </div>
  </form>
</template>

<script setup>
import { computed } from 'vue'
import {
  getColorIndicator,
  getOptionClasses,
  getOptionBackgroundClasses,
  getSelectedOptionClasses,
  getSelectedOptionLabel,
  getDefaultIcon,
  formatLabel,
  generatePlaceholder,
  extractOptionsFromRawProperty,
  currencyFormats
} from '../utils/mappingUtils.js'
import FileField from './field-renderers/FileField.vue'

// Get field value directly from editingItem
const getFieldValue = (fieldName) => {
  return props.editingItem?.[fieldName]?.value || ''
}



const props = defineProps({
  editingItem: {
    type: Object,
    default: null
  },
  submitting: {
    type: Boolean,
    default: false
  },
  formErrors: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['submitForm', 'refreshSchema', 'update:formData', 'cancelForm'])

// Schema is no longer needed as a separate property

const submitButtonText = computed(() => {
  return props.editingItem ? 'Update Item' : 'Add Item'
})

const submittingText = computed(() => {
  return props.editingItem ? 'Updating...' : 'Adding...'
})

// Convert editingItem to form fields array
const getFormFieldsArray = computed(() => {
  if (!props.editingItem) {
    return []
  }

  return Object.entries(props.editingItem).map(([key, property]) => {
    // Determine the actual field type from the property structure
    let fieldType = property.type

    // If it's a multi_select field, ensure the type is correctly set
    if (property.multi_select && Array.isArray(property.multi_select)) {
      fieldType = 'multi_select'
    }

    // If it's a files field, ensure the type is correctly set
    if (property.files && Array.isArray(property.files)) {
      fieldType = 'files'
    }

    return {
      name: key,
      type: fieldType,
      required: property.required || false,
      value: property.value || '',
      options: fieldType === 'select' || fieldType === 'multi_select'
        ? extractOptionsFromRawProperty(property)
        : [],
      icon: getDefaultIcon(key, fieldType, property.number?.format),
      emoji: property.emoji || null,
      label: formatLabel(key),
      placeholder: generatePlaceholder(key, fieldType, property.number?.format),
      format: property.number?.format,
      min: fieldType === 'number' ? 0 : undefined,
      step: fieldType === 'number' ? (property.number?.format && property.number?.format !== 'number' ? 500 : 1) : undefined,
      id: property.id,
      // Preserve nested objects without overriding format
      number: property.number,
      select: property.select,
      multi_select: property.multi_select,
      // Spread other properties but exclude nested ones to avoid conflicts
      ...Object.fromEntries(
        Object.entries(property).filter(([k]) =>
          !['number', 'select', 'multi_select'].includes(k)
        )
      )
    }
  })
})

const titleFields = computed(() => {
  return getFormFieldsArray.value.filter(field => {
    return field.type === 'title'
  })
})

const contactFields = computed(() => {
  return getFormFieldsArray.value.filter(field => {
    const fieldName = field.name.toLowerCase()
    return fieldName.includes('email') ||
      fieldName.includes('phone') ||
      fieldName.includes('contact') ||
      field.type === 'email' ||
      field.type === 'phone'
  })
})

const currencyNumberFields = computed(() => {
  return getFormFieldsArray.value.filter(field =>
    field.type === 'number' && field.format && field.format !== 'number'
  )
})

const regularNumberFields = computed(() => {
  return getFormFieldsArray.value.filter(field =>
    field.type === 'number' && (!field.format || field.format === 'number')
  )
})

const booleanFields = computed(() => {
  return getFormFieldsArray.value.filter(field => field.type === 'checkbox')
})

const selectionFields = computed(() => {
  return getFormFieldsArray.value.filter(field =>
    field.type === 'select' || field.type === 'multi_select'
  )
})

const fileFields = computed(() => {
  return getFormFieldsArray.value.filter(field => field.type === 'files')
})

const otherFields = computed(() => {
  return getFormFieldsArray.value.filter(field => {
    const fieldName = field.name.toLowerCase()
    const isContactField = fieldName.includes('email') ||
      fieldName.includes('phone') ||
      fieldName.includes('contact') ||
      field.type === 'email' ||
      field.type === 'phone'

    return field.type !== 'title' &&
      field.type !== 'number' &&
      field.type !== 'checkbox' &&
      field.type !== 'select' &&
      field.type !== 'multi_select' &&
      field.type !== 'files' &&
      !isContactField
  })
})

const updateField = (fieldName, value) => {
  emit('update:formData', { [fieldName]: value })
}

const getMultiselectValue = (fieldName) => {
  const value = getFieldValue(fieldName)

  // Ensure we always return an array for multiselect
  if (Array.isArray(value)) {
    return value
  }

  // If it's a string, try to parse it (fallback for legacy data)
  if (typeof value === 'string' && value) {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      const split = value.split(',').map(v => v.trim()).filter(v => v)
      return split
    }
  }

  // If no value, return empty array
  return []
}

const updateMultiselectField = (fieldName, value) => {
  // For multi-select, we want to store the actual selected values
  // The Notion format conversion will happen when submitting the form
  emit('update:formData', { [fieldName]: value })
}

const removeMultiselectItem = (fieldName, itemToRemove) => {
  const currentValue = getMultiselectValue(fieldName)
  const updatedValue = currentValue.filter(item => {
    // Handle both string and object comparisons
    if (typeof item === 'string' && typeof itemToRemove === 'string') {
      return item !== itemToRemove
    } else if (typeof item === 'object' && typeof itemToRemove === 'object') {
      return item.value !== itemToRemove.value
    }
    return item !== itemToRemove
  })
  updateMultiselectField(fieldName, updatedValue)
}

// File field handling methods
const getFileFieldValue = (fieldName) => {
  const value = props.editingItem?.[fieldName]?.value || []
  return Array.isArray(value) ? value : []
}

const updateFileField = (fieldName, files) => {
  // Convert FileList to array and create file objects
  const fileArray = Array.from(files || []).map(file => ({
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
    file: file, // Keep the actual File object for upload
    preview: URL.createObjectURL(file) // Create preview URL for immediate display
  }))

  emit('update:formData', { [fieldName]: fileArray })
}

const removeFileFromField = (fieldName, index) => {
  const currentFiles = getFileFieldValue(fieldName)
  const fileToRemove = currentFiles[index]

  // Clean up object URL to prevent memory leaks
  if (fileToRemove && fileToRemove.preview) {
    URL.revokeObjectURL(fileToRemove.preview)
  }

  const updatedFiles = currentFiles.filter((_, i) => i !== index)
  emit('update:formData', { [fieldName]: updatedFiles })
}

// Handle file selection (when files are chosen but not yet uploaded)
const onFileSelect = (event, fieldName) => {
  console.log('File select event:', event)

  // Get the files from the select event
  const files = event.files || []

  // Convert to our file format
  const fileArray = files.map(file => ({
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
    file: file, // Keep the actual File object for upload
    preview: URL.createObjectURL(file) // Create preview URL for immediate display
  }))

  // Update the field with the new files
  emit('update:formData', { [fieldName]: fileArray })
}

// Handle upload progress
const onUploadProgress = (event, fieldName) => {
  console.log('Upload progress:', event)
  // The progress is handled internally by PrimeVue FileUpload component
  // This event is just for logging or additional progress handling if needed
}

// Handle advanced upload
const onAdvancedUpload = async (event, fieldName) => {
  console.log('Advanced upload event:', event)

  try {
    // When using :auto="true", PrimeVue handles the upload automatically
    // The event contains the response from the server
    const response = event.xhr?.response

    if (response) {
      const result = JSON.parse(response)

      if (result.success && result.files) {
        console.log('Files uploaded successfully:', result.files)

        // Update the field with uploaded file URLs
        emit('update:formData', {
          [fieldName]: result.files.map(uploadedFile => ({
            name: uploadedFile.name,
            url: uploadedFile.url,
            type: uploadedFile.type,
            size: uploadedFile.size,
            blobKey: uploadedFile.blobKey
          }))
        })
      } else {
        console.error('Upload failed:', result.error)
      }
    } else {
      console.log('No response from upload')
    }
  } catch (error) {
    console.error('Upload processing failed:', error)
    // You might want to show an error message to the user here
  }
}



const submitForm = () => {
  emit('submitForm')
}

const cancelForm = () => {
  emit('cancelForm')
}

const refreshSchema = () => {
  emit('refreshSchema')
}
</script>
