<template>
    <Button :pt="buttonPT" :icon="icon" @click="$emit('click')" />
</template>

<script setup>
import { useButtonPT } from '../composables/useButtonPT.js'

const props = defineProps({
    icon: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        default: 'primary'
    },
    size: {
        type: String,
        default: 'small'
    }
})

const { buttonPT } = useButtonPT(props.severity, props.size, true)

defineEmits(['click'])
</script>
