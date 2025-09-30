<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDatabaseMenuStore } from '../stores/databaseMenuStore.js'

const router = useRouter()
const route = useRoute()
const databaseMenuStore = useDatabaseMenuStore()

async function fetchDatabases() {
  databaseMenuStore.setLoading(true)
  databaseMenuStore.clearError()
  databaseMenuStore.openDropdown()

  try {
    const res = await fetch('/.netlify/functions/list-databases')
    if (!res.ok) {
      let details = 'Failed to load databases'
      try {
        const errJson = await res.json()
        if (errJson && (errJson.error || errJson.message)) {
          details = `${errJson.error || 'Error'}${errJson.message ? ': ' + errJson.message : ''}`
        }
      } catch { }
      throw new Error(details)
    }
    const data = await res.json()
    if (data && data.success) {
      const results = data.results || []
      databaseMenuStore.setDatabases(results)
      if (!results.length) {
        databaseMenuStore.setError('No databases found under NOTION_PARENT_PAGE_ID')
      }
    } else {
      throw new Error('Unexpected response')
    }
  } catch (e) {
    databaseMenuStore.setError(e.message || 'Failed to load databases')
  } finally {
    databaseMenuStore.setLoading(false)
  }
}

function go(dbId) {
  router.push({ name: 'db-list', params: { databaseId: dbId } })
  databaseMenuStore.closeDropdown()
}

function toggleDropdown() {
  if (!databaseMenuStore.isOpen) {
    // Only fetch if not already loaded and not loading
    if (!databaseMenuStore.hasDatabases && !databaseMenuStore.isLoading) {
      fetchDatabases()
    } else {
      databaseMenuStore.toggleDropdown()
    }
  } else {
    databaseMenuStore.toggleDropdown()
  }
}

onMounted(() => {
  // Don't auto-fetch on mount, only when user clicks
})
</script>

<template>
  <div class="relative">
    <button class="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
      @click="toggleDropdown" title="Toggle databases menu">
      <i class="pi pi-database"></i>
      <span>Databases</span>
      <i class="pi text-xs transition-transform duration-200"
        :class="databaseMenuStore.isOpen ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
    </button>

    <div v-if="databaseMenuStore.isOpen"
      class="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      <div class="max-h-80 overflow-auto divide-y divide-gray-100">
        <div v-if="databaseMenuStore.isLoading" class="px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
          <i class="pi pi-spin pi-spinner"></i>
          Loading...
        </div>
        <div v-else-if="databaseMenuStore.hasError" class="px-4 py-3 text-sm text-red-600">
          {{ databaseMenuStore.error }}
        </div>
        <div v-else-if="databaseMenuStore.isEmpty" class="px-4 py-3 text-sm text-gray-500">
          No databases found under NOTION_PARENT_PAGE_ID
        </div>
        <template v-else>
          <button v-for="db in databaseMenuStore.databases" :key="db.id"
            class="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between" @click="go(db.id)">
            <div>
              <div class="font-medium text-gray-900">{{ db.title }}</div>
              <div class="text-xs text-gray-500 truncate">{{ db.id }}</div>
            </div>
            <i class="pi pi-angle-right text-gray-400"></i>
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
