import { createRouter, createWebHistory } from 'vue-router'

// Lazy load views for better initial load performance
const HomeView = () => import('../views/HomeView.vue')
const EditView = () => import('../views/EditView.vue')
const AddView = () => import('../views/AddView.vue')
const ChatView = () => import('../views/ChatView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/talent',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/edit/:id',
      name: 'edit',
      component: EditView,
      props: true,
    },
    {
      path: '/add',
      name: 'add',
      component: AddView,
    },
    {
      path: '/',
      name: 'ai',
      component: ChatView,
    },
  ],
})

export default router
