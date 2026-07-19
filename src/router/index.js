import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/health-portal',
      name: 'health-portal',
      component: () => import('../views/HealthPortalView.vue'),
      meta: { requiresAuth: true }, // 标记需要权限的页面
    },
    {
      path: '/resources',
      name: 'resources',
      component: () => import('../views/ResourcesView.vue'),
    },
    {
      path: '/community',
      name: 'community',
      component: () => import('../views/CommunityView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

// Navigation Guards
router.beforeEach((to, from, next) => {
  const isAuthenticated = false

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'home' }) // 如果页面需要权限且未登录，重定向回首页或登录页
  } else {
    next()
  }
})

export default router
