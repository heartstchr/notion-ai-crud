<template>
  <div class="mb-8">
    <!-- Back Button (only shown in edit mode) -->
    <div v-if="showBackButton" class="flex items-center gap-4 mb-4">
      <Button @click="$emit('goBack')" severity="secondary" text class="p-0">
        <div
          class="bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 rounded-lg p-0.5 shadow-lg">
          <div class="bg-white rounded-md px-3 py-2 flex items-center gap-2">
            <i
              class="pi pi-arrow-left bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent"></i>
            <span
              class="bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent font-medium">Back</span>
          </div>
        </div>
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
