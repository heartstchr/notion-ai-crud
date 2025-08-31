<template>
    <div class="text-gray-800 leading-relaxed">
        {{ value }}
    </div>
</template>

<script setup>
defineProps({
    value: {
        type: [String, Number],
        required: true
    }
})
</script>
