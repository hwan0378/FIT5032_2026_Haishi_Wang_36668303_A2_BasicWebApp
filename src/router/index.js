import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import {
  waitForAuthState,
  fetchUserProfile,
  getCurrentUser,
  saveLocalUser,
} from '../services/auth'

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
      meta: { requiresAuth: true }, // 标记需要登录才能访问的页面
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
      path: '/directory',
      name: 'directory',
      component: () => import('../views/DirectoryView.vue'),
    },
    {
      path: '/map',
      name: 'map',
      component: () => import('../views/MapView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true, requiresRole: 'Coordinator' }, // 还需要协调员角色
    },
  ],
})

// Navigation Guards：每次跳转前检查登录状态与角色
router.beforeEach(async (to) => {
  // 等待 Firebase 确定当前会话（刷新页面后自动恢复登录状态）
  const firebaseUser = await waitForAuthState()

  // 需要登录的页面：未登录一律回到首页登录框
  if (to.meta.requiresAuth && firebaseUser === null) {
    return { name: 'home' }
  }

  // 需要特定角色的页面：先拿到角色再判断
  if (to.meta.requiresRole) {
    let currentUser = getCurrentUser()

    // 本地缓存缺失时，尝试从 Firestore 拉取并缓存
    if (currentUser === null && firebaseUser !== null) {
      try {
        const profile = await fetchUserProfile(firebaseUser.uid)
        if (profile !== null) {
          saveLocalUser(profile)
          currentUser = profile
        }
      } catch {
        // 网络异常时按无资料处理，避免跳转被卡住
      }
    }

    // 没有该角色则不允许进入
    if (currentUser === null || currentUser.role !== to.meta.requiresRole) {
      return { name: 'home' }
    }
  }

  return true
})

export default router
