<template>
  <div class="home-view">
    <div class="space-y-8">
      <!-- Header -->
      <HeaderView :loading="loading" :database-title="databaseTitle" :database-description="databaseDescription"
        @refresh-schema="refreshSchema" />
      <!-- Error State -->
      <ErrorDisplay :error="error" @retry="retryLoad" />
      <!-- Item List -->
      <ListView :loading="loading" :loading-more="loadingMore" :items="items" :schema="enrichedSchema"
        :has-more="hasMore" @delete-item="deleteItem" @load-more="loadMore" />

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useItemStore } from '../stores/itemStore.js'
import itemService from '../services/itemService.js'
import HeaderView from '../components/HeaderView.vue'
import ErrorDisplay from '../components/ErrorDisplay.vue'
import ListView from '../components/ListView.vue'

const route = useRoute()
const itemStore = useItemStore()

// Local state for database-specific data
const loading = ref(true)
const error = ref('')
const items = ref([])
const schema = ref(null)
const databaseTitle = ref('')
const databaseDescription = ref('')
const hasMore = ref(false)
const nextCursor = ref(null)
const loadingMore = ref(false)
// Create enriched schema with properties that include field metadata
const enrichedSchema = computed(() => {
  if (!schema.value?.properties) return null

  return {
    ...schema.value,
    properties: Object.fromEntries(
      Object.entries(schema.value.properties).map(([key, property]) => [
        key,
        {
          ...property,
          // Ensure the property has all the metadata CardView needs
          type: property.type,
          required: property.required || false,
          emoji: property.emoji || null,
          icon: property.icon || null,
          // Preserve nested objects for proper field detection
          number: property.number || null,
          select: property.select || null,
          multi_select: property.multi_select || null,
          // Add any additional formatting or metadata here
        }
      ])
    )
  }
})

// Methods
const loadDatabase = async (databaseId) => {
  loading.value = true
  error.value = ''

  try {
    // Load schema and items for specific database
    const [dbInfo, itemsData] = await Promise.all([
      itemService.getDatabaseInfo(databaseId),
      itemService.getAllItems({ pageSize: 50, databaseId })
    ])

    // Set database info
    schema.value = dbInfo?.schema
    databaseTitle.value = dbInfo?.title || 'Database'
    databaseDescription.value = dbInfo?.description || ''

    // Set items data
    items.value = itemsData.results || itemsData.items || itemsData || []
    hasMore.value = !!(itemsData && (itemsData.has_more || itemsData.hasMore))
    nextCursor.value = itemsData && (itemsData.next_cursor || itemsData.nextCursor) || null

  } catch (err) {
    console.error('Failed to load database:', err)
    error.value = err.message || 'Failed to load database'
  } finally {
    loading.value = false
  }
}

const initialize = async () => {
  const databaseId = route.params.databaseId

  if (databaseId) {
    // Load specific database
    await loadDatabase(databaseId)
  } else {
    // Fallback to store-based approach
    try {
      const [schemaResult, itemsResult] = await Promise.allSettled([
        itemStore.ensureSchemaLoaded(),
        itemStore.fetchAllItems()
      ])

      // Handle schema loading result
      if (schemaResult.status === 'rejected') {
        console.error('Schema loading failed:', schemaResult.reason)
      }

      // Handle items loading result
      if (itemsResult.status === 'rejected') {
        console.error('Items loading failed:', itemsResult.reason)
      }

      // Ensure both schema and items are loaded before updating UI
      if (schemaResult.status === 'fulfilled' && itemsResult.status === 'fulfilled') {
        // Update local database info from the store
        updateDatabaseInfo()
      }
    } catch (error) {
      console.error('Failed to initialize:', error)
    } finally {
      loading.value = false
    }
  }
}

const updateDatabaseInfo = () => {
  // Get database info from the store without making API calls
  const dbInfo = itemStore.getDatabaseInfo()
  if (dbInfo) {
    schema.value = dbInfo?.schema || itemStore.schema
    if (dbInfo.title) {
      databaseTitle.value = dbInfo.title
    }
    if (dbInfo.description) {
      databaseDescription.value = dbInfo.description
    }
  }
}

const refreshSchema = async () => {
  const databaseId = route.params.databaseId

  if (databaseId) {
    // Refresh specific database
    await loadDatabase(databaseId)
  } else {
    // Fallback to store-based approach
    try {
      // Refresh both schema and items to ensure consistency
      const [schemaResult, itemsResult] = await Promise.allSettled([
        itemStore.fetchSchema(true), // Force refresh
        itemStore.fetchAllItems() // Refresh items as well
      ])

      // Only update UI if both operations succeed
      if (schemaResult.status === 'fulfilled' && itemsResult.status === 'fulfilled') {
        updateDatabaseInfo()
        items.value = itemStore.items
      } else {
        console.error('Schema refresh failed:', schemaResult.status === 'rejected' ? schemaResult.reason : 'Unknown error')
        console.error('Items refresh failed:', itemsResult.status === 'rejected' ? itemsResult.reason : 'Unknown error')
      }
    } catch (error) {
      console.error('Failed to refresh schema:', error)
    }
  }
}

const loadMore = async () => {
  if (!hasMore.value || loadingMore.value) return

  loadingMore.value = true

  try {
    const databaseId = route.params.databaseId

    if (databaseId) {
      // Load more items for specific database
      const itemsData = await itemService.getAllItems({
        pageSize: 50,
        startCursor: nextCursor.value,
        databaseId,
        useCache: false
      })

      const newItems = itemsData.results || itemsData.items || []
      items.value = items.value.concat(newItems)
      hasMore.value = !!(itemsData && (itemsData.has_more || itemsData.hasMore))
      nextCursor.value = itemsData && (itemsData.next_cursor || itemsData.nextCursor) || null
    } else {
      // Fallback to store-based approach
      await itemStore.fetchAllItems()
      items.value = itemStore.items
    }
  } catch (error) {
    console.error('Failed to load more:', error)
  } finally {
    loadingMore.value = false
  }
}

const retryLoad = async () => {
  await initialize()
}

const deleteItem = async (id) => {
  try {
    const databaseId = route.params.databaseId

    if (databaseId) {
      // Delete item from specific database
      await itemService.deleteItem(id, databaseId)
      // Remove from local items array
      items.value = items.value.filter(item => item.id !== id)
    } else {
      // Fallback to store-based approach
      await itemStore.deleteItem(id)
      // Refresh the items list after successful deletion
      await itemStore.fetchAllItems()
      items.value = itemStore.items
    }
  } catch (error) {
    console.error('Failed to delete item:', error)
  }
}

// Lifecycle
onMounted(() => {
  initialize()
})

// Watch for route parameter changes
watch(() => route.params.databaseId, (newId, oldId) => {
  if (newId && newId !== oldId) {
    // Clear current data and load new database
    items.value = []
    schema.value = null
    databaseTitle.value = ''
    databaseDescription.value = ''
    hasMore.value = false
    nextCursor.value = null
    initialize()
  }
})
</script>

<style scoped>
.home-view {
  min-height: calc(100vh - 80px);
}
</style>
