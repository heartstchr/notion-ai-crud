<template>
  <form @submit.prevent="submitForm" class="space-y-6">
    <!-- No Schema Available -->
    <div v-if="!getFormFieldsArray.length" class="text-center py-8 text-gray-500">
      <p>No form fields available.</p>
      <Button @click="refreshSchema" severity="secondary" label="Retry" class="mt-2" />
    </div>

    <!-- Form Fields -->
    <div v-else class="space-y-6">
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
      <!-- Boolean Fields Section -->
      <div v-if="booleanFields.length > 0" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="field in booleanFields" :key="field.name"
            class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Checkbox :id="field.name" :model-value="getFieldValue(field.name)"
              @update:model-value="(value) => updateField(field.name, value)" :binary="true" />
            <label :for="field.name" class="text-sm text-gray-700 cursor-pointer flex-1">
              {{ field.description || field.label }}
            </label>
            <small v-if="formErrors[field.name]" class="text-red-600 block w-full">
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
              <span class="text-green-600 ml-1">({{ getCurrencyCode(field.format) }})</span>
              <span v-if="field.required" class="text-red-500 ml-1">*</span>
            </label>
            <div class="relative">
              <InputNumber :id="field.name" :placeholder="field.placeholder" :required="field.required"
                :min="field.min || 0" :max="field.max || 99" :step="field.step" :model-value="getFieldValue(field.name)"
                @update:model-value="(value) => updateField(field.name, value)"
                :class="{ 'p-invalid': formErrors[field.name] }" class="w-full" showButtons buttonLayout="horizontal"
                mode="currency" :currency="getCurrencyCode(field.format)">
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="field in regularNumberFields" :key="field.name" class="space-y-2">
            <label :for="field.name" class="block text-sm font-medium text-gray-700">
              <span v-if="field.emoji" class="mr-2 text-lg">{{ field.emoji }}</span>
              <i v-else-if="field.icon" :class="field.icon" class="mr-2 text-gray-500"></i>
              {{ field.label }}
              <span v-if="field.required" class="text-red-500 ml-1">*</span>
            </label>
            <div class="relative">
              <InputNumber :id="field.name" :placeholder="field.placeholder" :required="field.required"
                :min="field.min || 0" :max="field.max || 99" :step="field.step" :model-value="getFieldValue(field.name)"
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
            <template v-else-if="field.type === 'multiselect'">
              <MultiSelect :id="field.name" :model-value="getMultiselectValue(field.name)"
                @update:model-value="(value) => updateMultiselectField(field.name, value)"
                :options="getMultiselectOptions(field, getMultiselectValue(field.name))" optionLabel="label"
                optionValue="value" :placeholder="`Select ${field.label}`"
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
                    <button type="button" @click="removeMultiselectItem(field.name, slotProps.value || slotProps)"
                      class="ml-1 hover:opacity-75">
                      <i class="pi pi-times text-xs"></i>
                    </button>
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

            <!-- Textarea -->
            <Textarea v-else-if="field.type === 'textarea'" :id="field.name" :placeholder="field.placeholder"
              :required="field.required" :model-value="getFieldValue(field.name)"
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
      <Button type="button" @click="cancelForm" severity="secondary" label="Cancel" />
      <Button type="submit" :disabled="submitting" :loading="submitting"
        :label="submitting ? submittingText : submitButtonText" />
    </div>
  </form>
</template>

<script setup>
import { computed } from 'vue'
import {
  getColorIndicator,
  getOptionClasses,
  getSelectedOptionClasses,
  getSelectedOptionLabel,
  getMultiselectOptions,
  getDefaultIcon,
  formatLabel,
  generatePlaceholder,
  extractOptionsFromRawProperty
} from '../utils/mappingUtils.js'

// Get field value directly from editingItem
const getFieldValue = (fieldName) => {
  return props.editingItem?.[fieldName]?.value || ''
}

// Get currency code for PrimeVue InputNumber
const getCurrencyCode = (format) => {
  const currencyCodeMap = {
    'dollar': 'USD',
    'euro': 'EUR',
    'pound': 'GBP',
    'yen': 'JPY',
    'rupee': 'INR',
    'yuan': 'CNY',
    'franc': 'CHF',
    'mark': 'DEM'
  }
  return currencyCodeMap[format] || 'USD'
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

  return Object.entries(props.editingItem).map(([key, property]) => ({
    name: key,
    type: property.type,
    required: property.required || false,
    value: property.value || '',
    options: property.type === 'select' || property.type === 'multi_select'
      ? extractOptionsFromRawProperty(property)
      : [],
    icon: getDefaultIcon(key, property.type, property.number?.format),
    emoji: property.emoji || null,
    label: formatLabel(key),
    placeholder: generatePlaceholder(key, property.type, property.number?.format),
    format: property.number?.format,
    min: property.type === 'number' ? (property.number?.format === 'dollar' ? 0 : undefined) : undefined,
    step: property.type === 'number' ? (property.number?.format === 'dollar' ? 0.01 : 1) : undefined,
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
  }))
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
    field.type === 'select' || field.type === 'multiselect'
  )
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
      field.type !== 'multiselect' &&
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
  // If it's a string, try to parse it
  if (typeof value === 'string' && value) {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      const split = value.split(',').map(v => v.trim()).filter(v => v)
      return split
    }
  }
  return []
}

const updateMultiselectField = (fieldName, value) => {
  // Convert to raw Notion format
  const updatedValue = {
    type: 'multi_select',
    multi_select: Array.isArray(value) ? value.map(v => ({ name: v })) : []
  }
  emit('update:formData', { [fieldName]: updatedValue })
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

const getOptionBackgroundClasses = () => {
  // Always use white background for dropdown options
  return 'bg-white text-gray-800 hover:bg-gray-50'
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
