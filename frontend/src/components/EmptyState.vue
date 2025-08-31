<template>
    <div class="text-center py-16">
        <div class="text-6xl mb-4">📋</div>
        <h3 class="text-2xl font-semibold text-gray-900 mb-2">No items yet</h3>
        <p class="text-gray-600 mb-6">Start building your collection by adding your first item.</p>
        <button @click="$emit('add-item')"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <i class="pi pi-plus mr-2"></i>Add First Item
        </button>
    </div>
</template>

<script setup>
defineEmits(['add-item'])
</script>
