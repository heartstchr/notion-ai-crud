<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <LoadingSkeleton v-if="loading && !talents.length" :count="6"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" />

    <!-- Talent List -->
    <div v-if="!loading || talents.length" class="space-y-6">
      <!-- Empty State -->
      <EmptyState v-if="talents.length === 0 && !loading" @add-item="goToAdd" />

      <!-- Talent Grid -->
      <div v-if="schema" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Data Cards -->
        <CardView v-for="talent in talents" :key="talent.id" :item="talent" :schema="schema"
          @delete-item="deleteTalent" />

        <!-- Loading More Skeletons -->
        <LoadingSkeleton v-if="loadingMore" :count="3" class="contents" />
      </div>

      <!-- Initial Loading Skeleton -->
      <LoadingSkeleton v-else-if="loading" :count="6" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" />
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
  talents: {
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

defineEmits(['deleteTalent', 'loadMore'])

const goToAdd = () => {
  router.push('/add')
}
</script>
