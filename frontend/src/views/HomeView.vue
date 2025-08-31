<template>
  <div class="home-view">
    <div class="space-y-8">
      <!-- Header -->
      <HeaderView :loading="loading" :database-title="databaseTitle" :database-description="databaseDescription"
        @refresh-schema="refreshSchema" />
      <!-- Error State -->
      <ErrorDisplay :error="error" @retry="retryLoad" />
      <!-- Talent List -->
      <ListView :loading="loading" :loading-more="loadingMore" :talents="talents" :schema="schema" :has-more="hasMore"
        @delete-talent="deleteTalent" @load-more="loadMore" />

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useTalentStore } from '../stores/talentStore.js'
// Store
const talentStore = useTalentStore()
// Computed properties from store
const loading = computed(() => talentStore.loading)
const error = computed(() => talentStore.error)
const talents = computed(() => talentStore.talents)
const schema = computed(() => talentStore.schema)
// Local state
const loadingMore = ref(false)
const databaseTitle = ref('')
const databaseDescription = ref('')
const hasMore = ref(false)

// Methods
const initialize = async () => {
  try {
    // First, ensure schema is loaded (this should happen first)
    await talentStore.ensureSchemaLoaded()

    // Then fetch talents (schema will be available for proper field ordering)
    await talentStore.fetchAllTalents()

    // Update local database info from the store
    updateDatabaseInfo()
  } catch (error) {
    console.error('Failed to initialize:', error)
  }
}

const updateDatabaseInfo = () => {
  // Get database info from the store without making API calls
  const dbInfo = talentStore.getDatabaseInfo()
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
    await talentStore.fetchSchema(true) // Force refresh
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

const deleteTalent = async (id) => {
  if (confirm('Are you sure you want to delete this talent profile?')) {
    try {
      await talentStore.deleteTalent(id)
    } catch (error) {
      console.error('Failed to delete talent:', error)
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
