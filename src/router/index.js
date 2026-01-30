import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/explore',
            name: 'explore',
            component: () => import('../views/ExploreView.vue')
        },
        {
            path: '/add',
            name: 'add',
            component: () => import('../views/AddPropertyView.vue')
        },
        {
      path: '/property/:id',
      name: 'property-details',
      component: () => import('../views/PropertyDetailsView.vue')
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('../views/FavoritesView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue')
    }
  ]
})

export default router
