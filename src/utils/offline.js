// 离线功能工具：检测网络状态 + 维护"待同步操作"队列
// 配合 OfflineBanner 使用：离线时表单仍可提交（数据存本地），
// 操作加入队列，恢复在线后给出"已同步"提示

// 本地存储里保存操作队列的键名
const QUEUE_KEY = 'offline_action_queue'

// 当前是否在线（浏览器网络状态）
export function isOnline() {
  return navigator.onLine === true
}

// 把一次操作加入待处理队列（用于离线期间仍能提交的表单）
export function enqueueAction(type, payload) {
  const actions = getPendingActions()
  actions.push({
    id: Date.now(),
    type: type, // 例如 'save_health_record'
    payload: payload, // 操作的具体内容
    createdAt: new Date().toISOString(),
  })
  localStorage.setItem(QUEUE_KEY, JSON.stringify(actions))
}

// 读取目前积压的操作队列
export function getPendingActions() {
  const saved = localStorage.getItem(QUEUE_KEY)
  if (saved === null) {
    return []
  }
  return JSON.parse(saved)
}

// 清空操作队列（恢复在线且完成同步后调用）
export function clearQueue() {
  localStorage.removeItem(QUEUE_KEY)
}