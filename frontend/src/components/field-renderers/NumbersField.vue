<template>
  <div class="space-y-3">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <!-- Display all number fields in a grid -->
      <div v-for="(fieldValue, fieldName) in value" :key="fieldName"
        class="flex items-center justify-start bg-gray-50 rounded-lg gap-2 p-2">
        <i :class="getNumberFieldIcon(fieldName, getSchemaProperty(fieldName))" class="text-blue-500"></i>
        <span class="text-sm font-medium text-gray-700">{{ formatLabel(fieldName) }}</span>
        <div class="flex items-center space-x-2">
          <span class="text-gray-800 font-mono font-medium">
            {{ formatNumber(fieldValue || 0, fieldName) }}
          </span>
          <!-- Show currency symbol if available -->
          <span v-if="getFieldCurrencySymbol(fieldName)" class="text-lg text-gray-600 font-medium">
            {{ getFieldCurrencySymbol(fieldName) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getNumberFieldIcon } from '../../utils/mappingUtils.js'

defineProps({
  value: {
    type: Object,
    required: true
  },
  schema: {
    type: Object,
    default: null
  },
  formatLabel: {
    type: Function,
    required: true
  },
  formatNumber: {
    type: Function,
    required: true
  },
  getSchemaProperty: {
    type: Function,
    required: true
  },
  getFieldCurrencySymbol: {
    type: Function,
    required: true
  }
})
</script>
