<template>
  <div>
    <!-- 离线横幅：离线时固定显示在最顶部 -->
    <div v-if="isOffline" class="offline-banner" role="status" aria-live="polite">
      ⚠ You are offline — your changes are saved locally and will sync when you reconnect.
    </div>

    <!-- 恢复连接横幅：短暂提示后自动消失 -->
    <div
      v-else-if="showReconnected"
      class="reconnected-banner"
      role="status"
      aria-live="polite"
    >
      ✓ {{ reconnectedMessage }}
    </div>
  </div>
</template>

<script>
import { getPendingActions, clearQueue } from '../utils/offline'

export default {
  name: 'OfflineBanner',
  data() {
    return {
      // 页面打开时若已经离线，直接显示横幅
      isOffline: navigator.onLine === false,
      showReconnected: false, // 恢复连接后短暂显示提示
      reconnectedMessage: 'You are back online.',
      hideTimer: null, // 自动隐藏提示用的定时器
    }
  },
  mounted() {
    // 监听浏览器的网络状态变化事件
    window.addEventListener('online', this.handleOnline)
    window.addEventListener('offline', this.handleOffline)
  },
  beforeUnmount() {
    // 组件销毁时移除监听并清理定时器，避免内存泄漏
    window.removeEventListener('online', this.handleOnline)
    window.removeEventListener('offline', this.handleOffline)
    clearTimeout(this.hideTimer)
  },
  methods: {
    // 进入离线状态：显示离线横幅
    handleOffline() {
      this.isOffline = true
    },

    // 恢复在线：提示并处理离线期间积压的操作队列
    handleOnline() {
      this.isOffline = false

      // 读取离线期间的积压操作，给出同步提示并清空队列
      const pending = getPendingActions()
      if (pending.length > 0) {
        this.reconnectedMessage = 'You are back online! Synced ' + pending.length + ' offline action(s).'
        clearQueue()
      } else {
        this.reconnectedMessage = 'You are back online.'
      }

      this.showReconnected = true
      clearTimeout(this.hideTimer)
      this.hideTimer = setTimeout(() => {
        this.showReconnected = false
      }, 5000)
    },
  },
}
</script>

<style scoped>
/* 离线横幅：固定在顶部，样式醒目但保持可读 */
.offline-banner {
  position: sticky;
  top: 0;
  z-index: 1050;
  background-color: #fff3cd;
  color: #664d03;
  border-bottom: 3px solid #ffc107;
  padding: 0.75rem 1.25rem;
  font-weight: bold;
  font-size: 1.1rem;
  text-align: center;
}

/* 恢复连接横幅 */
.reconnected-banner {
  position: sticky;
  top: 0;
  z-index: 1050;
  background-color: #d1e7dd;
  color: #0f5132;
  border-bottom: 3px solid #198754;
  padding: 0.75rem 1.25rem;
  font-weight: bold;
  font-size: 1.1rem;
  text-align: center;
}
</style>