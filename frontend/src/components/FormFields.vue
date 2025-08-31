<template>
  <form @submit.prevent="submitForm" class="space-y-6">
    <!-- Loading State for Schema -->
    <div v-if="!schema && !loading" class="text-center py-8 text-gray-500">
      <div class="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
      <p>Loading database schema...</p>
      <Button @click="refreshSchema" severity="secondary" label="Retry" class="mt-2" />
    </div>

    <!-- Schema Loading State -->
    <div v-else-if="loading" class="text-center py-8 text-gray-500">
      <div class="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
      <p>Loading database schema...</p>
    </div>

    <!-- No Schema Available -->
    <div v-else-if="formFields.length === 0" class="text-center py-8 text-gray-500">
      <p>No database schema available. Please check your Notion database configuration.</p>
    </div>

    <!-- Form Fields -->
    <div v-else>


      <div v-for="field in formFields" :key="field.name" class="space-y-2">
        <!-- Only show label for non-checkbox fields -->
        <label v-if="field.type !== 'checkbox'" :for="field.name" class="block text-sm font-medium text-gray-700 mt-4">
          <!-- Display emoji if available -->
          <span v-if="field.emoji" class="mr-2 text-lg">{{ field.emoji }}</span>
          <!-- Display icon if available -->
          <i v-else-if="field.icon" :class="field.icon" class="mr-2 text-gray-500"></i>
          {{ field.label }}
          <span v-if="field.required" class="text-red-500 ml-1">*</span>
        </label>

        <!-- Text Input -->
        <InputText
          v-if="field.type === 'text' || field.type === 'email' || field.type === 'url' || field.type === 'tel'"
          :id="field.name" :type="field.type" :placeholder="field.placeholder" :required="field.required"
          :model-value="formData[field.name]" @update:model-value="(value) => updateField(field.name, value)"
          :class="{ 'p-invalid': formErrors[field.name] }" class="w-full" />

        <!-- Number Input -->
        <InputNumber v-else-if="field.type === 'number'" :id="field.name" :placeholder="field.placeholder"
          :required="field.required" :min="field.min" :step="field.step" :model-value="formData[field.name]"
          @update:model-value="(value) => updateField(field.name, value)"
          :class="{ 'p-invalid': formErrors[field.name] }" class="w-full" />

        <!-- Date Input -->
        <Calendar v-else-if="field.type === 'date'" :id="field.name" :placeholder="field.placeholder"
          :required="field.required" :model-value="formData[field.name]"
          @update:model-value="(value) => updateField(field.name, value)"
          :class="{ 'p-invalid': formErrors[field.name] }" class="w-full" dateFormat="yy-mm-dd" />

        <!-- Textarea -->
        <Textarea v-else-if="field.type === 'textarea'" :id="field.name" :placeholder="field.placeholder"
          :required="field.required" :model-value="formData[field.name]"
          @update:model-value="(value) => updateField(field.name, value)"
          :class="{ 'p-invalid': formErrors[field.name] }" class="w-full" rows="3" />

        <!-- Select -->
        <Dropdown v-else-if="field.type === 'select'" :id="field.name" :required="field.required"
          :model-value="formData[field.name]" @update:model-value="(value) => updateField(field.name, value)"
          :options="field.options" optionLabel="label" optionValue="value" :placeholder="`Select ${field.label}`"
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
        <div v-if="field.type === 'select' && formData[field.name]" class="mt-2">
          <div class="flex items-center gap-2">
            <span :class="getSelectedOptionClasses(formData[field.name], field)"
              class="px-3 py-1.5 text-sm rounded-full border font-medium">
              {{ getSelectedOptionLabel(formData[field.name], field) }}
            </span>
          </div>


        </div>

        <!-- Multi-select -->
        <MultiSelect v-else-if="field.type === 'multiselect'" :id="field.name"
          :model-value="getMultiselectValue(field.name)"
          @update:model-value="(value) => updateMultiselectField(field.name, value)"
          :options="getMultiselectOptions(field, getMultiselectValue(field.name))" optionLabel="label"
          optionValue="value" :placeholder="`Select ${field.label}`" :class="{ 'p-invalid': formErrors[field.name] }"
          class="w-full" :filter="true" :allowEmpty="true" display="chip">
          <template #option="slotProps">
            <div class="flex items-center gap-2 px-2 py-1 rounded"
              :class="getOptionBackgroundClasses(slotProps.option)">
              <span>{{ slotProps.option.label }}</span>
            </div>
          </template>
          <template #chip="slotProps">
            <div class="flex items-center gap-2 px-3 py-1.5 text-sm rounded-full border font-medium"
              :class="getOptionClasses(slotProps.value, field, props.schema)">
              <span>{{ typeof slotProps.value === 'string' ? slotProps.value : slotProps.value?.label ||
                slotProps.value?.value || slotProps.value }}</span>
              <button type="button" @click="removeMultiselectItem(field.name, slotProps.value || slotProps)"
                class="ml-1 hover:opacity-75">
                <i class="pi pi-times text-xs"></i>
              </button>
            </div>
          </template>
        </MultiSelect>

        <!-- Checkbox -->
        <div v-else-if="field.type === 'checkbox'" class="flex items-center gap-3">
          <Checkbox :id="field.name" :model-value="formData[field.name]"
            @update:model-value="(value) => updateField(field.name, value)" :binary="true" />
          <label :for="field.name" class="text-sm text-gray-700 cursor-pointer">
            {{ field.description || field.label }}
          </label>
        </div>

        <!-- Error Message -->
        <small v-if="formErrors[field.name]" class="text-red-600 block">
          {{ formErrors[field.name] }}
        </small>
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
  getMultiselectOptions
} from '../utils/mappingUtils.js'

const props = defineProps({
  editingTalent: {
    type: Object,
    default: null
  },
  schema: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  submitting: {
    type: Boolean,
    default: false
  },
  formData: {
    type: Object,
    default: () => ({})
  },
  formErrors: {
    type: Object,
    default: () => ({})
  },
  formFields: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['submitForm', 'refreshSchema', 'update:formData', 'cancelForm'])

const submitButtonText = computed(() => {
  return props.editingTalent ? 'Update Talent' : 'Add Talent'
})

const submittingText = computed(() => {
  return props.editingTalent ? 'Updating...' : 'Adding...'
})



const updateField = (fieldName, value) => {
  emit('update:formData', { ...props.formData, [fieldName]: value })
}

const getMultiselectValue = (fieldName) => {
  const value = props.formData[fieldName]

  // Ensure we always return an array for multiselect
  if (Array.isArray(value)) {
    return value
  }
  // If it's a string, try to parse it (common when data comes from API)
  if (typeof value === 'string' && value) {
    try {
      const parsed = JSON.parse(value)
      return parsed
    } catch {
      const split = value.split(',').map(v => v.trim()).filter(v => v)
      return split
    }
  }
  // If it's null/undefined, return empty array
  return []
}

const updateMultiselectField = (fieldName, value) => {
  // Ensure we're always working with an array
  const arrayValue = Array.isArray(value) ? value : []
  emit('update:formData', { ...props.formData, [fieldName]: arrayValue })
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

const getChipClasses = (value) => {
  console.log('getChipClasses called with value:', value)

  if (!value) {
    console.log('No value provided, using default blue')
    return 'bg-blue-100 text-blue-800'
  }

  if (!value.color) {
    console.log('No color property found, using default blue')
    return 'bg-blue-100 text-blue-800'
  }

  console.log('Color found:', value.color)

  // Map Notion colors to Tailwind classes
  const colorMap = {
    'default': 'bg-gray-100 text-gray-800',
    'gray': 'bg-gray-100 text-gray-800',
    'brown': 'bg-amber-100 text-amber-800',
    'orange': 'bg-orange-100 text-orange-800',
    'yellow': 'bg-yellow-100 text-yellow-800',
    'green': 'bg-green-100 text-green-800',
    'blue': 'bg-blue-100 text-blue-800',
    'purple': 'bg-purple-100 text-purple-800',
    'pink': 'bg-pink-100 text-pink-800',
    'red': 'bg-red-100 text-red-800'
  }

  const result = colorMap[value.color] || 'bg-blue-100 text-blue-800'
  console.log('Returning classes:', result)
  return result
}

const getOptionBackgroundClasses = (option) => {
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

<style scoped>
/* Component-specific styles only - form field styling moved to theme level */
</style>
