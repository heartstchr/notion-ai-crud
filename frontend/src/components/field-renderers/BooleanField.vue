<template>
  <div class="flex items-center gap-2">
    <div v-if="value" class="flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-full text-sm">
      <i class="pi pi-check-circle"></i>
      <span class="font-medium">{{ formatLabel(fieldName) }}</span>
    </div>
    <div v-else class="flex items-center gap-1 bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-sm">
      <i class="pi pi-times-circle"></i>
      <span class="font-medium">{{ formatLabel(fieldName) }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  value: {
    type: Boolean,
    required: true
  },
  fieldName: {
    type: String,
    required: true
  },
  formatLabel: {
    type: Function,
    required: true
  }
})
</script>
