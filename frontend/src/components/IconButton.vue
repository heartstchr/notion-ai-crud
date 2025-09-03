<template>
  <Button :pt="buttonPT" :icon="icon" @click="handleClick" />
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

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click')
}
</script>
