import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    // PWA 离线支持：构建时生成 Service Worker，预缓存全部资源
    VitePWA({
      // autoUpdate 模式：检测到新版本时自动应用更新并刷新页面，无需手动处理
      registerType: 'autoUpdate',
      workbox: {
        // 预缓存所有静态资源（含懒加载的页面模块、CSS、图片等）
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2,ttf,eot}'],
        // SPA 路由回退：断网时访问任意页面都由缓存的 index.html 兜底
        navigateFallback: 'index.html',
      },
      // 站点清单：让浏览器认识这是一款可离线安装的 PWA
      manifest: {
        name: 'ElderCare Charity',
        short_name: 'ElderCare',
        description: 'Support services for seniors and caregivers.',
        theme_color: '#0d6efd',
        background_color: '#f8f9fa',
        display: 'standalone',
        start_url: '/',
        scope: '/',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
