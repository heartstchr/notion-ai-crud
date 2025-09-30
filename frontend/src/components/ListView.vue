<template>
  <div class="space-y-6">
    <!-- Loading State - show only when actually loading -->
    <div v-if="loading">
      <!-- Search and Filter Skeleton -->
      <SearchFilterSkeleton />

      <!-- Content Skeleton -->
      <LoadingSkeleton :count="6" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" />
    </div>

    <!-- Content (show when we have schema and items, or when we have schema but no items) -->
    <div v-else-if="schema" class="space-y-6">
      <!-- Search and View Toggle -->
      <!-- Mobile Layout (stacked) -->
      <div class="flex flex-col gap-4 lg:hidden">
        <!-- Search Input -->
        <div class="relative w-full">
          <!-- Gradient Border with Drop Shadow -->
          <div
            class="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 rounded-lg p-0.5 shadow-lg"
            style="filter: drop-shadow(0 10px 25px rgba(0, 144, 247, 0.3)) drop-shadow(0 4px 6px rgba(186, 98, 252, 0.2)) drop-shadow(0 1px 3px rgba(242, 65, 107, 0.2)) drop-shadow(0 0 0 rgba(245, 86, 0, 0.1));">
            <div class="bg-white rounded-lg h-full w-full"></div>
          </div>

          <div class="relative z-10">
            <div class="relative">
              <input v-model="searchQuery" type="text" placeholder="Search items..."
                class="w-full pl-10 pr-4 py-2.5 bg-white border-0 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0" />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="pi pi-search text-gray-400"></i>
              </div>
              <button v-if="searchQuery" @click="clearSearch"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                <i class="pi pi-times"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Filters and View Toggle Row -->
        <div class="flex gap-2 items-center">
          <!-- Filters -->
          <div class="flex gap-2 flex-1">
            <!-- Verified Filter -->
            <div class="relative flex-1">
              <!-- Gradient Border with Drop Shadow -->
              <div
                class="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 rounded-lg p-0.5 shadow-lg"
                style="filter: drop-shadow(0 10px 25px rgba(0, 144, 247, 0.3)) drop-shadow(0 4px 6px rgba(186, 98, 252, 0.2)) drop-shadow(0 1px 3px rgba(242, 65, 107, 0.2)) drop-shadow(0 0 0 rgba(245, 86, 0, 0.1));">
                <div class="bg-white rounded-lg h-full w-full"></div>
              </div>

              <button @click="toggleVerifiedFilter" :class="[
                'relative z-10 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2',
                verifiedFilter
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : 'bg-white text-gray-600 hover:text-gray-800'
              ]">
                <i class="pi pi-check-circle"></i>
                <span class="hidden sm:inline">{{ detectedFieldNames.verified }}</span>
                <span class="sm:hidden">✓</span>
              </button>
            </div>

            <!-- Available for Hire Filter -->
            <div class="relative flex-1">
              <!-- Gradient Border with Drop Shadow -->
              <div
                class="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 rounded-lg p-0.5 shadow-lg"
                style="filter: drop-shadow(0 10px 25px rgba(0, 144, 247, 0.3)) drop-shadow(0 4px 6px rgba(186, 98, 252, 0.2)) drop-shadow(0 1px 3px rgba(242, 65, 107, 0.2)) drop-shadow(0 0 0 rgba(245, 86, 0, 0.1));">
                <div class="bg-white rounded-lg h-full w-full"></div>
              </div>

              <button @click="toggleAvailableFilter" :class="[
                'relative z-10 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2',
                availableFilter
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-white text-gray-600 hover:text-gray-800'
              ]">
                <i class="pi pi-user-check"></i>
                <span class="hidden sm:inline">{{ detectedFieldNames.available }}</span>
                <span class="sm:hidden">👤</span>
              </button>
            </div>
          </div>

          <!-- View Toggle Button -->
          <div class="flex-shrink-0">
            <div class="relative">
              <!-- Gradient Border with Drop Shadow -->
              <div
                class="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 rounded-lg p-0.5 shadow-lg"
                style="filter: drop-shadow(0 10px 25px rgba(0, 144, 247, 0.3)) drop-shadow(0 4px 6px rgba(186, 98, 252, 0.2)) drop-shadow(0 1px 3px rgba(242, 65, 107, 0.2)) drop-shadow(0 0 0 rgba(245, 86, 0, 0.1));">
                <div class="bg-white rounded-lg h-full w-full"></div>
              </div>

              <div class="relative z-10 flex bg-white rounded-lg p-1">
                <button @click="viewMode = 'card'" :class="[
                  'px-2 sm:px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
                  viewMode === 'card'
                    ? 'bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                ]">
                  <i class="pi pi-th-large sm:mr-2"></i>
                  <span class="hidden sm:inline">Card</span>
                </button>
                <button @click="viewMode = 'table'" :class="[
                  'px-2 sm:px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
                  viewMode === 'table'
                    ? 'bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                ]">
                  <i class="pi pi-table sm:mr-2"></i>
                  <span class="hidden sm:inline">Table</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop Layout (horizontal) -->
      <div class="hidden lg:flex gap-4 items-center">
        <!-- Search Input -->
        <div class="relative flex-1">
          <!-- Gradient Border with Drop Shadow -->
          <div
            class="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 rounded-lg p-0.5 shadow-lg"
            style="filter: drop-shadow(0 10px 25px rgba(0, 144, 247, 0.3)) drop-shadow(0 4px 6px rgba(186, 98, 252, 0.2)) drop-shadow(0 1px 3px rgba(242, 65, 107, 0.2)) drop-shadow(0 0 0 rgba(245, 86, 0, 0.1));">
            <div class="bg-white rounded-lg h-full w-full"></div>
          </div>

          <div class="relative z-10">
            <div class="relative">
              <input v-model="searchQuery" type="text" placeholder="Search items..."
                class="w-full pl-10 pr-4 py-2.5 bg-white border-0 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0" />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="pi pi-search text-gray-400"></i>
              </div>
              <button v-if="searchQuery" @click="clearSearch"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                <i class="pi pi-times"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="flex-shrink-0 flex gap-2">
          <!-- Verified Filter -->
          <div class="relative">
            <!-- Gradient Border with Drop Shadow -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 rounded-lg p-0.5 shadow-lg"
              style="filter: drop-shadow(0 10px 25px rgba(0, 144, 247, 0.3)) drop-shadow(0 4px 6px rgba(186, 98, 252, 0.2)) drop-shadow(0 1px 3px rgba(242, 65, 107, 0.2)) drop-shadow(0 0 0 rgba(245, 86, 0, 0.1));">
              <div class="bg-white rounded-lg h-full w-full"></div>
            </div>

            <button @click="toggleVerifiedFilter" :class="[
              'relative z-10 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2',
              verifiedFilter
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-white text-gray-600 hover:text-gray-800'
            ]">
              <i class="pi pi-check-circle"></i>
              <span>{{ detectedFieldNames.verified }}</span>
            </button>
          </div>

          <!-- Available for Hire Filter -->
          <div class="relative">
            <!-- Gradient Border with Drop Shadow -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 rounded-lg p-0.5 shadow-lg"
              style="filter: drop-shadow(0 10px 25px rgba(0, 144, 247, 0.3)) drop-shadow(0 4px 6px rgba(186, 98, 252, 0.2)) drop-shadow(0 1px 3px rgba(242, 65, 107, 0.2)) drop-shadow(0 0 0 rgba(245, 86, 0, 0.1));">
              <div class="bg-white rounded-lg h-full w-full"></div>
            </div>

            <button @click="toggleAvailableFilter" :class="[
              'relative z-10 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2',
              availableFilter
                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                : 'bg-white text-gray-600 hover:text-gray-800'
            ]">
              <i class="pi pi-user-check"></i>
              <span>{{ detectedFieldNames.available }}</span>
            </button>
          </div>
        </div>

        <!-- View Toggle Button -->
        <div class="flex-shrink-0">
          <div class="relative">
            <!-- Gradient Border with Drop Shadow -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 rounded-lg p-0.5 shadow-lg"
              style="filter: drop-shadow(0 10px 25px rgba(0, 144, 247, 0.3)) drop-shadow(0 4px 6px rgba(186, 98, 252, 0.2)) drop-shadow(0 1px 3px rgba(242, 65, 107, 0.2)) drop-shadow(0 0 0 rgba(245, 86, 0, 0.1));">
              <div class="bg-white rounded-lg h-full w-full"></div>
            </div>

            <div class="relative z-10 flex bg-white rounded-lg p-1">
              <button @click="viewMode = 'card'" :class="[
                'px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
                viewMode === 'card'
                  ? 'bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              ]">
                <i class="pi pi-th-large mr-2"></i>
                Card View
              </button>
              <button @click="viewMode = 'table'" :class="[
                'px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
                viewMode === 'table'
                  ? 'bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              ]">
                <i class="pi pi-table mr-2"></i>
                Table View
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Card View -->
      <div v-if="viewMode === 'card'">
        <div v-if="filteredItems.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Data Cards -->
          <CardView v-for="item in filteredItems" :key="item.id" :item="item" :schema="schema"
            :editRoute="route.params.databaseId ? `/db/${route.params.databaseId}/edit` : '/edit'"
            @deleteItem="handleDeleteItem" />

          <!-- Loading More Skeletons -->
          <LoadingSkeleton v-if="loadingMore" :count="3" class="contents" />
        </div>
        <!-- Empty state for card view -->
        <EmptyState v-else @add-item="goToAdd" />
      </div>

      <!-- Table View -->
      <div v-else-if="viewMode === 'table'">
        <TableView v-if="filteredItems.length > 0" :items="filteredItems" :schema="schema"
          :editRoute="route.params.databaseId ? `/db/${route.params.databaseId}/edit` : '/edit'"
          @deleteItem="handleDeleteItem" />
        <!-- Empty state for table view -->
        <EmptyState v-else @add-item="goToAdd" />
      </div>

    </div>

    <!-- Empty State (shown when no schema and not loading) -->
    <EmptyState v-else-if="!schema && !loading" @add-item="goToAdd" />

    <!-- Load More -->
    <LoadMoreButton v-if="hasMore && !loading" :loading="loadingMore" @load-more="loadMore" />
  </div>
</template>

<script setup>
import LoadingSkeleton from './LoadingSkeleton.vue'
import LoadMoreButton from './LoadMoreButton.vue'
import CardView from './CardView.vue'
import TableView from './TableView.vue'
import EmptyState from './EmptyState.vue'
import SearchFilterSkeleton from './SearchFilterSkeleton.vue'
import { useRouter, useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import NotionMiddleware from '../services/notionMiddleware.js'

const router = useRouter()
const route = useRoute()

// View mode state
const viewMode = ref('card') // 'card' or 'table'

// Search state
const searchQuery = ref('')

// Filter states
const verifiedFilter = ref(false)
const availableFilter = ref(false)

// Dynamic filter labels based on actual field names
// These are computed dynamically in detectedFieldNames computed property

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  loadingMore: {
    type: Boolean,
    default: false
  },
  items: {
    type: Array,
    default: () => []
  },
  schema: {
    type: Object,
    default: null
  },
  hasMore: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['deleteItem', 'loadMore'])

// Combined condition for empty state - show when no items OR no schema, and not loading
const showEmptyState = computed(() => (props.items.length === 0 || !props.schema) && !props.loading)

// Detect actual field names for dynamic labels
const detectedFieldNames = computed(() => {
  if (props.items.length === 0) return { verified: 'Verified', available: 'Available' }

  const booleanFields = Object.entries(props.items[0]).filter(([, value]) => typeof value === 'boolean')

  let verifiedField = 'Verified'
  let availableField = 'Available'

  // Find verified field
  const verifiedFieldEntry = booleanFields.find(([key]) => {
    const keyLower = key.toLowerCase()
    return keyLower.includes('verified') || keyLower.includes('verify')
  })
  if (verifiedFieldEntry) {
    verifiedField = NotionMiddleware.formatLabel(verifiedFieldEntry[0])
  }

  // Find available field
  const availableFieldEntry = booleanFields.find(([key]) => {
    const keyLower = key.toLowerCase()
    return keyLower.includes('available') || keyLower.includes('hire') || keyLower.includes('hiring')
  })
  if (availableFieldEntry) {
    availableField = NotionMiddleware.formatLabel(availableFieldEntry[0])
  }

  return { verified: verifiedField, available: availableField }
})

// Filtered items based on search query and boolean filters
const filteredItems = computed(() => {
  let filtered = props.items

  // Debug: Log field names for first item to help identify boolean fields
  if (props.items.length > 0 && (verifiedFilter.value || availableFilter.value)) {
    // Available fields and boolean fields identified for filtering
  }

  // Apply boolean filters first
  if (verifiedFilter.value || availableFilter.value) {
    filtered = filtered.filter(item => {
      // If both filters are active, item must match both
      if (verifiedFilter.value && availableFilter.value) {
        const matchesVerified = Object.entries(item).some(([key, value]) => {
          if (typeof value !== 'boolean') return false
          const keyLower = key.toLowerCase()
          return (keyLower.includes('verified') || keyLower.includes('verify')) && value === true
        })

        const matchesAvailable = Object.entries(item).some(([key, value]) => {
          if (typeof value !== 'boolean') return false
          const keyLower = key.toLowerCase()
          return (keyLower.includes('available') ||
            keyLower.includes('hire') ||
            keyLower.includes('hiring')) && value === true
        })

        return matchesVerified && matchesAvailable
      }

      // If only verified filter is active
      if (verifiedFilter.value) {
        return Object.entries(item).some(([key, value]) => {
          if (typeof value !== 'boolean') return false
          const keyLower = key.toLowerCase()
          return (keyLower.includes('verified') || keyLower.includes('verify')) && value === true
        })
      }

      // If only available filter is active
      if (availableFilter.value) {
        return Object.entries(item).some(([key, value]) => {
          if (typeof value !== 'boolean') return false
          const keyLower = key.toLowerCase()
          return (keyLower.includes('available') ||
            keyLower.includes('hire') ||
            keyLower.includes('hiring')) && value === true
        })
      }

      return true
    })
  }

  // Apply search filter
  if (!searchQuery.value.trim()) {
    return filtered
  }

  const query = searchQuery.value.toLowerCase().trim()

  return filtered.filter(item => {
    // Search in all string fields
    return Object.entries(item).some(([, value]) => {
      if (value === null || value === undefined) return false

      // Handle different value types
      if (typeof value === 'string') {
        return value.toLowerCase().includes(query)
      }

      // Handle arrays (like multi-select fields)
      if (Array.isArray(value)) {
        return value.some(item =>
          typeof item === 'string'
            ? item.toLowerCase().includes(query)
            : item.name && item.name.toLowerCase().includes(query)
        )
      }

      // Handle objects (like select fields)
      if (typeof value === 'object' && value.name) {
        return value.name.toLowerCase().includes(query)
      }

      // Handle numbers
      if (typeof value === 'number') {
        return value.toString().includes(query)
      }

      return false
    })
  })
})

// Clear search function
const clearSearch = () => {
  searchQuery.value = ''
}

// Toggle filter functions
const toggleVerifiedFilter = () => {
  verifiedFilter.value = !verifiedFilter.value
}

const toggleAvailableFilter = () => {
  availableFilter.value = !availableFilter.value
}

const goToAdd = () => {
  // Check if we're in a database context (from route params)
  if (route.params.databaseId) {
    router.push({ name: 'db-add', params: { databaseId: route.params.databaseId } })
  } else {
    router.push('/add')
  }
}

const handleDeleteItem = (id) => {
  emit('deleteItem', id)
}

</script>
