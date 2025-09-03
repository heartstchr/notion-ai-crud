<template>
  <div class="grid grid-cols-2 gap-4">
    <!-- Email -->
    <div v-if="typeof value === 'string' || value?.email" class="flex items-center space-x-2">
      <i class="pi pi-envelope text-blue-500"></i>
      <span class="text-gray-800">{{ typeof value === 'string' ? value : value.email }}</span>
    </div>

    <!-- Phone Number -->
    <div v-if="typeof value === 'string' || value?.phone" class="flex items-center space-x-2">
      <i class="pi pi-phone text-green-500"></i>
      <span class="text-gray-800">{{ typeof value === 'string' ? value : value.phone }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  value: {
    type: [Object, String],
    required: true
  }
})
</script>
