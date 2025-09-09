<template>
  <div class="space-y-3">
    <!-- Display existing files -->
    <div v-if="fileList.length > 0" class="space-y-2">
      <div v-for="(file, index) in fileList" :key="index"
        class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div class="flex items-center space-x-3">
          <!-- Image preview for image files -->
          <div v-if="isImageFile(file)" class="flex-shrink-0">
            <img :src="getFilePreviewUrl(file)" :alt="file.name || file.filename || 'Image preview'"
              class="w-12 h-12 object-cover rounded-lg border border-gray-200" @error="handleImageError" />
          </div>
          <!-- File icon for non-image files -->
          <i v-else class="pi pi-file text-blue-500 text-lg"></i>

          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{{ file.name || file.filename || 'Unknown file' }}</p>
            <p v-if="file.size" class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
            <p v-if="file.url" class="text-xs text-blue-600 hover:text-blue-800">
              <a :href="file.url" target="_blank" rel="noopener noreferrer" class="hover:underline">
                View file
              </a>
            </p>
          </div>
        </div>
        <Button v-if="showRemoveButton" @click="removeFile(index)" icon="pi pi-times" size="small" severity="danger"
          text rounded class="ml-2" />
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-4 text-gray-500">
      <i class="pi pi-file text-4xl text-gray-300 mb-2 block"></i>
      <p class="text-sm">No files uploaded</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: [Array, Object, String],
    required: true
  },
  showRemoveButton: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['remove-file'])

const fileList = computed(() => {
  if (!props.value) return []

  // Handle different data formats
  if (Array.isArray(props.value)) {
    return props.value
  } else if (typeof props.value === 'object' && props.value.files) {
    return props.value.files
  } else if (typeof props.value === 'string') {
    try {
      const parsed = JSON.parse(props.value)
      return Array.isArray(parsed) ? parsed : [parsed]
    } catch {
      return []
    }
  }

  return []
})

const formatFileSize = (bytes) => {
  if (!bytes) return ''
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

const removeFile = (index) => {
  emit('remove-file', index)
}

// Check if file is an image
const isImageFile = (file) => {
  if (!file) return false

  // Check by MIME type
  if (file.type) {
    return file.type.startsWith('image/')
  }

  // Check by file extension as fallback
  const fileName = file.name || file.filename || ''
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg']
  return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext))
}

// Get preview URL for file
const getFilePreviewUrl = (file) => {
  // If file has a URL (already uploaded), use that
  if (file.url) {
    return file.url
  }

  // If file has a blob URL, use that
  if (file.preview) {
    return file.preview
  }

  // If file is a File object (newly selected), create object URL
  if (file.file && file.file instanceof File) {
    return URL.createObjectURL(file.file)
  }

  return ''
}

// Handle image load error
const handleImageError = (event) => {
  console.warn('Failed to load image preview:', event.target.src)
  // Optionally, you could show a fallback icon here
}
</script>
