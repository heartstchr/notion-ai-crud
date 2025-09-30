import { createRouter, createWebHistory } from 'vue-router'

// Lazy load views for better initial load performance
const HomeView = () => import('../views/HomeView.vue')
const EditView = () => import('../views/EditView.vue')
const AddView = () => import('../views/AddView.vue')
const ChatView = () => import('../views/ChatView.vue')
const ListView = () => import('../components/ListView.vue')
const DbListView = () => import('../views/DbListView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/talent',
    //   name: 'home',
    //   component: HomeView,
    // },
    // {
    //   path: '/edit/:id',
    //   name: 'edit',
    //   component: EditView,
    //   props: true,
    // },
    // {
    //   path: '/add',
    //   name: 'add',
    //   component: AddView,
    // },
    {
      path: '/',
      name: 'ai',
      component: ChatView,
    },
    // Dynamic CRUD routes per Notion database under parent page
    {
      path: '/db/:databaseId',
      name: 'db-list',
      component: DbListView,
      props: true,
    },
    {
      path: '/db/:databaseId/add',
      name: 'db-add',
      component: AddView,
      props: true,
    },
    {
      path: '/db/:databaseId/edit/:id',
      name: 'db-edit',
      component: EditView,
      props: true,
    },
  ],
})

export default router
