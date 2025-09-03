<template>
  <div class="mb-8">
    <!-- Back Button (only shown in edit mode) -->
    <div v-if="showBackButton" class="flex items-center gap-4 mb-4">
      <Button @click="$emit('goBack')" severity="secondary" text>
        <i class="pi pi-arrow-left"></i>
        Back
      </Button>
    </div>

    <!-- Title and Description -->
    <h1 class="text-3xl font-bold text-gray-900 mb-2">
      {{ mode === 'add' ? 'Add New' : 'Edit' }} {{ databaseTitle }}
    </h1>
    <p class="text-gray-600" :class="{ 'mt-2': mode === 'edit' }">
      {{ mode === 'add'
        ? `Fill out the form below to add a new ${databaseTitle.toLowerCase()}`
        : `Update the ${databaseTitle.toLowerCase()} information below`
      }}
    </p>
  </div>
</template>

<script setup>
// Props
defineProps({
  mode: {
    type: String,
    required: true,
    validator: (value) => ['add', 'edit'].includes(value)
  },
  databaseTitle: {
    type: String,
    required: true
  },
  showBackButton: {
    type: Boolean,
    default: false
  }
})

// Emits
defineEmits(['goBack'])
</script>
