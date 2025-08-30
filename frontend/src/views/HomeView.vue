<template>
  <div class="home-view">
    <TalentPool />
  </div>
</template>

<script>
import TalentPool from '../components/TalentPool.vue'

export default {
  name: 'HomeView',
  components: {
    TalentPool
  }
}
</script>

<style scoped>
.home-view {
  min-height: calc(100vh - 80px);
  background: #f8f9fa;
}
</style>
