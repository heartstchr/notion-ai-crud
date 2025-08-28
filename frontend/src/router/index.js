import { createRouter, createWebHistory } from 'vue-router'
import ClientForm from '../views/ClientForm.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'client-form',
      component: ClientForm,
    },
  ],
})

export default router
