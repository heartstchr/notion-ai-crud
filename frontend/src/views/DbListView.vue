<template>
  <ListView :loading="loading" :loadingMore="loadingMore" :items="items" :schema="schema" :hasMore="hasMore"
    @loadMore="loadMore" @deleteItem="onDelete" />
  <ErrorDisplay v-if="error" :error="error" class="mt-4" />
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ListView from '../components/ListView.vue'
import ErrorDisplay from '../components/ErrorDisplay.vue'
import itemService from '../services/itemService.js'

const route = useRoute()

const loading = ref(true)
const loadingMore = ref(false)
const items = ref([])
const schema = ref(null)
const hasMore = ref(false)
const nextCursor = ref(null)
const error = ref('')

async function load(databaseId) {
  loading.value = true
  error.value = ''
  try {
    // Load schema/info for database
    const info = await itemService.getDatabaseInfo(databaseId)
    schema.value = info?.schema || null

    // Load items for database
    const resp = await itemService.getAllItems({ pageSize: 50, databaseId })
    // itemService returns transformed data already
    items.value = resp.results || resp.items || resp || []
    hasMore.value = !!(resp && (resp.has_more || resp.hasMore))
    nextCursor.value = resp && (resp.next_cursor || resp.nextCursor) || null
  } catch (e) {
    error.value = e.message || 'Failed to load database '
  } finally {
    loading.value = false
  }
}

async function loadMore() {
  if (!hasMore.value || loadingMore.value) return
  loadingMore.value = true
  try {
    const databaseId = route.params.databaseId
    const resp = await itemService.getAllItems({ pageSize: 50, startCursor: nextCursor.value, databaseId, useCache: false })
    const newItems = resp.results || resp.items || []
    items.value = items.value.concat(newItems)
    hasMore.value = !!(resp && (resp.has_more || resp.hasMore))
    nextCursor.value = resp && (resp.next_cursor || resp.nextCursor) || null
  } catch (e) {
    error.value = e.message || 'Failed to load more'
  } finally {
    loadingMore.value = false
  }
}

async function onDelete(id) {
  try {
    const databaseId = route.params.databaseId
    await itemService.deleteItem(id, databaseId)
    items.value = items.value.filter(i => i.id !== id)
  } catch (e) {
    error.value = e.message || 'Failed to delete item'
  }
}

onMounted(() => {
  const databaseId = route.params.databaseId
  load(databaseId)
})

watch(() => route.params.databaseId, (newId, oldId) => {
  if (newId && newId !== oldId) {
    items.value = []
    schema.value = null
    hasMore.value = false
    nextCursor.value = null
    load(newId)
  }
})
</script>

<style scoped></style>
