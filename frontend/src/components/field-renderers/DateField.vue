<template>
  <div class="flex items-center space-x-2">
    <i class="pi pi-calendar text-indigo-500"></i>
    <span class="text-gray-800">{{ formatDate(typeof value === 'string' ? value : value.date?.start || value.date)
    }}</span>
  </div>
</template>

<script setup>
defineProps({
  value: {
    type: [Object, String],
    required: true
  }
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}
</script>
