<template>
  <div
    class="bg-white hover:shadow-lg transition-shadow p-4 border-2 border-black rounded-lg shadow-lg flex flex-col h-full">
    <!-- Empty State Content -->
    <div class="text-center py-16 flex-1 flex flex-col items-center justify-center">
      <div class="text-6xl mb-4">📋</div>
      <h3 class="text-2xl font-semibold text-gray-900 mb-2">No rows found</h3>
      <p class="text-gray-600 mb-6 text-center max-w-md">This database is empty. Start building your collection by
        adding your first item
        to get started.</p>
      <Button @click="$emit('add-item')" severity="primary">
        <i class="pi pi-plus mr-2"></i>Add First Item
      </Button>
    </div>
  </div>
</template>

<script setup>
defineEmits(['add-item'])
</script>
