<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <LoadingSkeleton v-if="loading" :count="6" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" />

    <!-- Content (only show when not loading) -->
    <div v-else class="space-y-6">
      <!-- Item Grid or Empty State -->
      <div v-if="schema" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Data Cards -->
        <CardView v-for="item in items" :key="item.id" :item="item" :schema="schema" @delete-item="deleteItem" />

        <!-- Empty State (shown when no items and not loading) -->
        <EmptyState v-if="!loading && items.length === 0" @add-item="goToAdd" />

        <!-- Loading More Skeletons -->
        <LoadingSkeleton v-if="loadingMore" :count="3" class="contents" />
      </div>

    </div>

    <!-- Load More -->
    <LoadMoreButton v-if="hasMore && !loading" :loading="loadingMore" @load-more="loadMore" />
  </div>
</template>

<script setup>
import LoadingSkeleton from './LoadingSkeleton.vue'
import LoadMoreButton from './LoadMoreButton.vue'
import CardView from './CardView.vue'
import EmptyState from './EmptyState.vue'
import { useRouter } from 'vue-router'

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
