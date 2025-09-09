<template>
  <!-- Item Card -->
  <div v-if="item && Object.keys(item).length > 0"
    class="bg-white hover:shadow-lg text-gray-900 transition-shadow p-4 rounded-lg shadow-lg flex flex-col h-full relative">
    <!-- Gradient Border with Drop Shadow -->
    <div
      class="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 rounded-lg p-0.5 shadow-lg"
      style="filter: drop-shadow(0 10px 25px rgba(0, 144, 247, 0.3)) drop-shadow(0 4px 6px rgba(186, 98, 252, 0.2)) drop-shadow(0 1px 3px rgba(242, 65, 107, 0.2)) drop-shadow(0 0 0 rgba(245, 86, 0, 0.1));">
      <div class="bg-white rounded-lg h-full w-full"></div>
    </div>
    <div class="relative z-10">
      <!-- Action Buttons -->
      <div class="flex justify-end items-start mb-3">
        <div class="flex gap-2">
          <IconButton icon="pi pi-pencil" severity="success" @click="editItem" />
          <IconButton icon="pi pi-trash" severity="danger" @click="deleteItem" />
        </div>
      </div>

      <!-- Title fields at the top -->
      <div v-if="titleFields.length > 0" class="mb-4 flex md:flex-row flex-col gap-2">
        <!-- Avatar Section -->
        <div class="flex justify-center mb-4">
          <!-- Custom avatar using img tag since Avatar component has issues with dynamic URLs -->
          <div v-if="avatarImageUrl" class="relative">
            <img :src="avatarImageUrl" :alt="getAvatarLabel()"
              class="w-24 h-24 rounded-full border-2 border-gray-200 shadow-md bg-gray-100 object-cover"
              @error="handleImageError" @load="handleImageLoad" />
          </div>
          <!-- Fallback to Avatar component with label if no image -->
          <Avatar v-else :label="getAvatarLabel()" size="xlarge" shape="circle"
            class="border-2 border-gray-200 shadow-md bg-gray-100 p-2" />
        </div>
        <div v-for="[key, value] in titleFields" :key="key" class="flex flex-col justify-start gap-2 mb-2 ml-4">
          <h2 class="text-2xl font-bold text-gray-900">{{ value }}</h2>
          <div v-if="booleanFields.length > 0" class="mb-2">
            <div class="flex flex-wrap gap-2">
              <BooleanField v-for="[key, value] in booleanFields" :key="key" :value="value" :field-name="key"
                :format-label="(fieldName) => memoizedFormatLabel(fieldName)" />
            </div>
          </div>
        </div>
      </div>

      <!-- Contact fields section -->
      <div v-if="contactFields.length > 0" class="mb-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-1">
          <div v-for="[key, value] in contactFields" :key="key"
            class="flex items-center justify-start bg-blue-50 rounded-lg p-1 gap-1">
            <div class="flex items-center space-x-1">
              <i :class="getContactFieldIcon(key, getSchemaProperty(key))"></i>
            </div>
            <div class="flex items-center space-x-1">
              <span class="text-gray-800 font-medium text-sm truncate max-w-32" :title="value || 'Not provided'">
                {{ value || 'Not provided' }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <!-- Currency Number Fields ({{ currencyNumberFields.length }}) -->
      <div v-if="currencyNumberFields.length > 0" class="mb-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div v-for="[key, value] in currencyNumberFields" :key="key"
            class="flex flex-col items-center justify-between bg-green-50 rounded-lg p-1 border border-green-200">
            <div class="flex items-center space-x-1">
              <span class="text-sm font-medium text-gray-700 truncate max-w-24" :title="memoizedFormatLabel(key)">{{
                memoizedFormatLabel(key) }}</span>
            </div>
            <div class="flex items-center space-x-1">
              <span class="text-gray-800 font-mono font-medium">
                {{ memoizedFormatNumber(value || 0, key) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Regular Number Fields ({{ regularNumberFields.length }}) -->
      <div v-if="regularNumberFields.length > 0" class="mb-4">
        <div class="gap-3">
          <div v-for="[key, value] in regularNumberFields" :key="key"
            class="flex-col items-center justify-between bg-gray-50 rounded-lg p-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <i :class="getNumberFieldIcon(key, getSchemaProperty(key))" class="text-blue-500"></i>
                <span class="text-sm font-medium text-gray-700" :title="memoizedFormatLabel(key)">{{
                  memoizedFormatLabel(key) }}</span>
              </div>
              <span class="text-gray-800 font-mono font-medium text-lg">
                {{ memoizedFormatNumber(value || 0, key) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- URL Fields -->
      <div v-if="urlFields.length > 0" class="mb-4">
        <div class="gap-3">
          <div v-for="[key, value] in urlFields" :key="key"
            class="flex-col items-center justify-between bg-purple-50 rounded-lg p-3 border border-purple-200">
            <div class="flex items-center space-x-2">
              <i class="pi pi-link text-purple-600"></i>
              <span class="text-sm font-medium text-gray-700" :title="memoizedFormatLabel(key)">{{
                memoizedFormatLabel(key) }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <a :href="value" target="_blank" rel="noopener noreferrer"
                class="text-purple-600 hover:text-purple-800 underline" :title="value">
                {{ value || 'No URL' }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- File Fields -->
      <div v-if="fileFields.length > 0" class="mb-4">
        <div class="space-y-3">
          <div v-for="[key, property] in fileFields" :key="key" class="space-y-1">
            <!-- Field label -->
            <div class="text-sm font-medium text-gray-700 mb-2">
              <span v-if="property?.emoji" class="mr-2 text-base">{{ property.emoji }}</span>
              <i v-else-if="property?.icon" :class="property.icon" class="mr-2 text-gray-500"></i>
              <i v-else class="pi pi-paperclip mr-2 text-gray-500"></i>
              <span class="truncate max-w-32" :title="memoizedFormatLabel(key)">{{ memoizedFormatLabel(key) }}</span>
            </div>
            <!-- Custom file display -->
            <div class="space-y-2">
              <div v-if="item[key] && Array.isArray(item[key]) && item[key].length > 0" class="space-y-2">
                <div v-for="(file, index) in item[key]" :key="index"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div class="flex items-center space-x-3">
                    <!-- Image preview for image files -->
                    <div v-if="isImageFile(file)" class="flex-shrink-0">
                      <img :src="getFilePreviewUrl(file)" :alt="file.name || 'File preview'"
                        class="w-12 h-12 object-cover rounded-lg border border-gray-200" />
                    </div>
                    <!-- File icon for non-image files -->
                    <i v-else class="pi pi-file text-blue-500 text-lg"></i>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 truncate">{{ file.name || 'Unknown file' }}</p>
                      <p v-if="file.size" class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <a v-if="file.url" :href="file.url" target="_blank" rel="noopener noreferrer"
                      class="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                      View
                    </a>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-4 text-gray-500">
                <i class="pi pi-file text-4xl text-gray-300 mb-2 block"></i>
                <p class="text-sm">No files uploaded</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Dynamic fields -->
      <div class="space-y-3 flex-1">
        <div v-for="[key, property] in processedFieldsForRender" :key="key"
          class="space-y-1 pt-2 border-b border-gray-100 last:border-b-0">
          <!-- Field label -->
          <div v-if="shouldShowLabel(key)" class="text-sm font-medium text-gray-700 mb-2">
            <span v-if="property?.emoji" class="mr-2 text-base">{{ property.emoji }}</span>
            <i v-else-if="property?.icon" :class="property.icon" class="mr-2 text-gray-500"></i>
            <span class="truncate max-w-32" :title="memoizedFormatLabel(key)">{{ memoizedFormatLabel(key) }}</span>
          </div>

          <!-- Field content -->
          <component :is="getFieldRenderer(key)" :value="item[key]" :field-name="key" :schema="schema" />
        </div>
      </div>

      <!-- Timestamps -->
      <div class="text-xs text-gray-500 mt-auto pt-2 border-t border-gray-100 flex flex-row justify-end">
        <span>Added: {{ formatDate(item.created_time) }}</span>
        <span v-if="item.last_edited_time !== item.created_time">
          • Updated: {{ formatDate(item.last_edited_time) }}
        </span>
      </div>
    </div>
  </div>

</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'

import {
  formatNumberBySchema,
  getNumberFieldIcon
} from '../utils/mappingUtils.js'
import NotionMiddleware from '../services/notionMiddleware.js'



// Direct imports for better performance - async components are unnecessary overhead
import RichTextField from './field-renderers/RichTextField.vue'
import ContactField from './field-renderers/ContactField.vue'
import NumbersField from './field-renderers/NumbersField.vue'
import UrlField from './field-renderers/UrlField.vue'
import DateField from './field-renderers/DateField.vue'
import SelectField from './field-renderers/SelectField.vue'
import BooleanField from './field-renderers/BooleanField.vue'
import TextField from './field-renderers/TextField.vue'
import FileField from './field-renderers/FileField.vue'
import Avatar from 'primevue/avatar'
import IconButton from './IconButton.vue'

// Composables
const router = useRouter()
const confirm = useConfirm()



const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  schema: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  editRoute: {
    type: String,
    default: '/edit'
  },
  itemIdField: {
    type: String,
    default: 'id'
  }
})

const emit = defineEmits(['deleteItem'])



// Memoized field processing for better performance
const processedFields = computed(() => {
  if (!props.schema?.properties || !props.item) return { titleFields: [], contactFields: [], booleanFields: [], currencyNumberFields: [], regularNumberFields: [], urlFields: [], fileFields: [], otherFields: [] }

  const schemaProps = props.schema.properties
  const itemData = props.item

  // Process all fields in one pass to avoid multiple Object.entries() calls
  const result = {
    titleFields: [],
    contactFields: [],
    booleanFields: [],
    currencyNumberFields: [],
    regularNumberFields: [],
    urlFields: [],
    fileFields: [],
    otherFields: []
  }

  Object.entries(schemaProps).forEach(([key, property]) => {
    const value = itemData[key]

    if (!value && property.type !== 'checkbox' && property.type !== 'select' && property.type !== 'multi_select' && property.type !== 'files') return // Skip empty values except checkboxes, select fields, and files

    switch (property.type) {
      case 'title':
        result.titleFields.push([key, value])
        break
      case 'checkbox':
        result.booleanFields.push([key, value || false])
        break
      case 'number':
        if (property.number?.format && property.number.format !== 'number') {
          result.currencyNumberFields.push([key, value || 0])
        } else {
          result.regularNumberFields.push([key, value || 0])
        }
        break
      case 'url':
        result.urlFields.push([key, value])
        break
      case 'files':
        result.fileFields.push([key, property])
        break
      case 'select':
      case 'multi_select':
        result.otherFields.push([key, property])
        break
      default: {
        // Check if it's a contact-related field
        const isContactField = key.toLowerCase().includes('email') ||
          key.toLowerCase().includes('phone') ||
          key.toLowerCase().includes('contact') ||
          property.type === 'email' ||
          property.type === 'phone'

        if (isContactField) {
          result.contactFields.push([key, value])
        } else if (property.type !== 'title' && property.type !== 'number' && property.type !== 'checkbox' && property.type !== 'url' && property.type !== 'files') {
          result.otherFields.push([key, property])
        }
      }
    }
  })

  return result
})

// Destructure computed results for cleaner template usage - use direct access for better performance
const titleFields = computed(() => processedFields.value.titleFields)
const contactFields = computed(() => processedFields.value.contactFields)
const booleanFields = computed(() => processedFields.value.booleanFields)
const currencyNumberFields = computed(() => processedFields.value.currencyNumberFields)
const regularNumberFields = computed(() => processedFields.value.regularNumberFields)
const urlFields = computed(() => processedFields.value.urlFields)
const fileFields = computed(() => processedFields.value.fileFields)
const processedFieldsForRender = computed(() => processedFields.value.otherFields)

// Memoized field renderer map for better performance
const fieldRendererMap = computed(() => {
  if (!props.schema?.properties) return {}

  const map = {}
  Object.entries(props.schema.properties).forEach(([key, property]) => {
    switch (property.type) {
      case 'rich_text': map[key] = RichTextField; break
      case 'url': map[key] = UrlField; break
      case 'date': map[key] = DateField; break
      case 'select':
      case 'multi_select': map[key] = SelectField; break
      case 'checkbox': map[key] = BooleanField; break
      case 'files': map[key] = FileField; break
      default: map[key] = TextField
    }
  })
  return map
})

// Simplified field renderer selection based on schema type
const getFieldRenderer = (key) => {
  if (key === 'contact') return ContactField
  if (key === 'numbers') return NumbersField
  return fieldRendererMap.value[key] || TextField
}

const shouldShowLabel = (key) => {
  return key !== 'contact' && key !== 'numbers'
}

// Memoized formatting functions for better performance
const memoizedFormatLabel = (text) => {
  return NotionMiddleware.formatLabel(text)
}

const memoizedFormatNumber = (number, fieldName = null) => {
  if (typeof number !== 'number') return number

  const property = fieldName ? getSchemaProperty(fieldName) : null
  if (property) {
    return formatNumberBySchema(number, property)
  }

  return number.toLocaleString()
}

// Methods
const editItem = () => {
  const itemId = props.item[props.itemIdField]
  router.push(`${props.editRoute}/${itemId}`)
}

const deleteItem = () => {
  const itemId = props.item[props.itemIdField]

  // Get item title for confirmation message
  const itemTitle = titleFields.value.length > 0 ? titleFields.value[0][1] : 'this item'

  confirm.require({
    message: `Are you sure you want to delete "${itemTitle}"?`,
    header: 'Confirm Deletion',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => {
      emit('deleteItem', itemId)
    },
    reject: () => {
      // User cancelled deletion
    }
  })
}


const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}

const getSchemaProperty = (fieldName) => {
  return props.schema?.properties?.[fieldName] || null
}

const getContactFieldIcon = (fieldName, property) => {
  // Check field name first
  const fieldNameLower = fieldName.toLowerCase()

  if (fieldNameLower.includes('email') || property?.type === 'email') {
    return 'pi pi-envelope text-blue-500'
  }

  if (fieldNameLower.includes('phone') || fieldNameLower.includes('mobile') || property?.type === 'phone') {
    return 'pi pi-phone text-green-500'
  }

  if (fieldNameLower.includes('linkedin') || fieldNameLower.includes('social')) {
    return 'pi pi-linkedin text-blue-600'
  }

  if (fieldNameLower.includes('website') || fieldNameLower.includes('url')) {
    return 'pi pi-globe text-purple-500'
  }

  if (fieldNameLower.includes('address') || fieldNameLower.includes('location')) {
    return 'pi pi-map-marker text-red-500'
  }

  // Default contact icon
  return 'pi pi-user text-gray-500'
}





// Avatar helper methods
// Ref for avatar image URL
const avatarImageUrl = ref('')

const getAvatarLabel = () => {
  // Try to get a name from title fields first
  if (titleFields.value.length > 0) {
    const titleValue = titleFields.value[0][1]
    if (titleValue && typeof titleValue === 'string') {
      // Extract initials from the title
      const words = titleValue.trim().split(/\s+/)
      if (words.length >= 2) {
        return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
      } else if (words.length === 1) {
        return words[0][0].toUpperCase()
      }
    }
  }

  // Fallback to first letter of the first available field
  const firstField = Object.values(props.item).find(value =>
    value && typeof value === 'string' && value.trim().length > 0
  )

  if (firstField) {
    return firstField.trim()[0].toUpperCase()
  }

  return '?'
}

const getAvatarImage = (item) => {
  // First, check for avatar field in the item data (case-insensitive)
  const avatarField = Object.entries(item).find(([key, property]) => {
    return property &&
      (key.toLowerCase().includes('avatar') ||
        key.toLowerCase().includes('profile') ||
        key.toLowerCase().includes('photo') ||
        key.toLowerCase().includes('image'))
  })

  if (avatarField) {
    const avatarValue = avatarField[1]

    // Check if it's an array of files (like the actual data structure)
    if (Array.isArray(avatarValue) && avatarValue.length > 0) {
      const firstFile = avatarValue[0]
      if (firstFile && firstFile.url) {
        return firstFile.url
      }
    }

    // Check if it's a file object with URL
    if (avatarValue && typeof avatarValue === 'object' && !Array.isArray(avatarValue)) {
      if (avatarValue.url) {
        return avatarValue.url
      }
      // Check if it's a files array with the first file
      if (avatarValue.files && Array.isArray(avatarValue.files) && avatarValue.files.length > 0) {
        const firstFile = avatarValue.files[0]
        if (firstFile && firstFile.url) {
          return firstFile.url
        }
      }
    }
    // Check if it's a direct URL string
    if (typeof avatarValue === 'string' && avatarValue.trim()) {
      return avatarValue.trim()
    }
  }

  // Fallback: check for any field with a URL
  const urlField = Object.entries(item).find(([key, property]) => {
    if (property && typeof property === 'object') {
      // Check if it has a direct URL
      if (property.url && typeof property.url === 'string') {
        return true
      }
      // Check if it's a files array with URLs
      if (property.files && Array.isArray(property.files) && property.files.length > 0) {
        return property.files.some(file => file && file.url)
      }
    }
    return false
  })

  if (urlField) {
    const urlValue = urlField[1]

    if (urlValue.url) {
      return urlValue.url
    }

    if (urlValue.files && Array.isArray(urlValue.files) && urlValue.files.length > 0) {
      const firstFile = urlValue.files[0]
      if (firstFile && firstFile.url) {
        return firstFile.url
      }
    }
  }

  // Final fallback: check for any files field in the schema
  if (props.schema?.properties) {
    const filesField = Object.entries(props.schema.properties).find(([key, property]) => {
      return property.type === 'files'
    })

    if (filesField) {
      const filesValue = item[filesField[0]]

      if (Array.isArray(filesValue) && filesValue.length > 0) {
        const firstFile = filesValue[0]
        if (firstFile && firstFile.url) {
          return firstFile.url
        }
      }
    }
  }

  return null
}

// Watch for changes in the item and update the avatar URL
watch(() => props.item, (newItem) => {
  if (newItem) {
    const imageUrl = getAvatarImage(newItem)
    avatarImageUrl.value = imageUrl
  }
}, { immediate: true, deep: true })

// Image event handlers
const handleImageError = (event) => {
  console.error('Avatar image failed to load:', event.target.src)
  // Optionally clear the URL to show fallback
  // avatarImageUrl.value = ''
}

const handleImageLoad = (event) => {
  // Image loaded successfully
}

// File handling helper functions
const isImageFile = (file) => {
  if (!file) return false

  // Check by MIME type first (for newly selected files)
  if (file.type && file.type.startsWith('image/')) {
    return true
  }

  // Check by file extension (primary method for uploaded files)
  const fileName = file.name || file.filename || ''
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.tiff', '.ico']
  return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext))
}

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

const formatFileSize = (bytes) => {
  if (!bytes) return ''
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}
</script>
