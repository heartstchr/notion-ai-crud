<template>
    <div class="text-center">
        <Button @click="$emit('load-more')" :disabled="loading" severity="secondary">
            <span v-if="loading">Loading...</span>
            <span v-else>Load More</span>
        </Button>
    </div>
</template>

<script setup>
defineProps({
    loading: {
        type: Boolean,
        default: false
    }
})

defineEmits(['load-more'])
</script>
