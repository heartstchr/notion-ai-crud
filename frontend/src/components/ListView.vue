<template>
  <div class="space-y-6">
    <!-- Initial Loading State (when no items exist yet) -->
    <LoadingSkeleton v-if="loading && !items.length" :count="6"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" />

    <!-- Main Content -->
    <div v-else class="space-y-6">
      <!-- Empty State -->
      <EmptyState v-if="items.length === 0 && !loading" @add-item="goToAdd" />

      <!-- Item Grid -->
      <div v-if="schema && items.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Data Cards -->
        <CardView v-for="item in items" :key="item.id" :item="item" :schema="schema" @delete-item="deleteItem" />

        <!-- Loading More Skeletons -->
        <LoadingSkeleton v-if="loadingMore" :count="3" class="contents" />
      </div>
    </div>

    <!-- Load More -->
    <LoadMoreButton v-if="hasMore" :loading="loadingMore" @load-more="loadMore" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import LoadingSkeleton from './LoadingSkeleton.vue'
import EmptyState from './EmptyState.vue'
import LoadMoreButton from './LoadMoreButton.vue'

const router = useRouter()

defineProps({
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

defineEmits(['deleteItem', 'loadMore'])

const goToAdd = () => {
  router.push('/add')
}
</script>
