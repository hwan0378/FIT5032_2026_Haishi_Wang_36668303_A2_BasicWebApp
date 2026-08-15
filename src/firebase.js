// 引入 Firebase 各模块（v12 模块化写法）
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// 在 Firebase 控制台 → 项目设置 → 你的应用 中复制得到的 Web 配置
const firebaseConfig = {
  apiKey: 'AIzaSyB2CjonuhIsJ55Iy84eUyQdUAfK1Bay7Sk',
  authDomain: 'fit5032-haishi-wang-a3.firebaseapp.com',
  projectId: 'fit5032-haishi-wang-a3',
  storageBucket: 'fit5032-haishi-wang-a3.firebasestorage.app',
  messagingSenderId: '74783161070',
  appId: '1:74783161070:web:7a063bde2d78bd8acd91ff',
}

// 初始化 Firebase 应用（全项目只初始化一次）
const app = initializeApp(firebaseConfig)

// 导出认证与 Firestore 对象，供其他文件调用
export const auth = getAuth(app)
export const db = getFirestore(app)

export default app
