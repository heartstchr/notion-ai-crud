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
import { ref, onMounted, computed } from 'vue'
import { useItemStore } from '../stores/itemStore.js'
// Store
const itemStore = useItemStore()
// Computed properties from store
const loading = computed(() => itemStore.loading)
const error = computed(() => itemStore.error)
const items = computed(() => itemStore.items)
// Create enriched schema with properties that include field metadata
const enrichedSchema = computed(() => {
  if (!itemStore.schema?.properties) return null

  // Get database info for additional formatting data
  const dbInfo = itemStore.getDatabaseInfo()
  const dbSchema = dbInfo?.schema?.properties || {}

  return {
    ...itemStore.schema,
    properties: Object.fromEntries(
      Object.entries(itemStore.schema.properties).map(([key, property]) => [
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
          // Merge with database info format data if available
          ...(dbSchema[key] && {
            number: {
              ...property.number,
              format: dbSchema[key].number?.format || property.number?.format
            }
          }),
          // Add any additional formatting or metadata here
        }
      ])
    )
  }
})
// Local state
const loadingMore = ref(false)
const databaseTitle = ref('')
const databaseDescription = ref('')
const hasMore = ref(false)

// Methods
const initialize = async () => {
  try {
    // First, ensure schema is loaded (this should happen first)
    await itemStore.ensureSchemaLoaded()

    // Then fetch items (schema will be available for proper field ordering)
    await itemStore.fetchAllItems()

    // Update local database info from the store
    updateDatabaseInfo()
  } catch (error) {
    console.error('Failed to initialize:', error)
  }
}

const updateDatabaseInfo = () => {
  // Get database info from the store without making API calls
  const dbInfo = itemStore.getDatabaseInfo()
  if (dbInfo) {
    if (dbInfo.title) {
      databaseTitle.value = dbInfo.title
    }
    if (dbInfo.description) {
      databaseDescription.value = dbInfo.description
    }
  }
}

const refreshSchema = async () => {
  try {
    await itemStore.fetchSchema(true) // Force refresh
    // Update local database info from the refreshed store data
    updateDatabaseInfo()
  } catch (error) {
    console.error('Failed to refresh schema:', error)
  }
}

const loadMore = async () => {
  if (!hasMore.value || loadingMore.value) return

  try {
    loadingMore.value = true
    // For now, we'll implement pagination later in the store
    // This is a placeholder for future pagination support
    // Load more functionality to be implemented
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
  if (confirm('Are you sure you want to delete this item?')) {
    try {
      await itemStore.deleteItem(id)
    } catch (error) {
      console.error('Failed to delete item:', error)
    }
  }
}

// Lifecycle
onMounted(() => {
  initialize()
})
</script>

<style scoped>
.home-view {
  min-height: calc(100vh - 80px);
}
</style>
