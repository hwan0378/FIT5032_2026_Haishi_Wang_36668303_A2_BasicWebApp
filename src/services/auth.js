// 认证服务：封装 Firebase 的注册 / 登录 / 登出，并把用户资料缓存到本地
import { auth, db } from '../firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'

// 本地缓存当前登录用户的键名（供全站读取，含角色）
const USER_STORAGE_KEY = 'current_user'

// 读取本地缓存的用户资料（未登录则返回 null）
export function getCurrentUser() {
  const saved = localStorage.getItem(USER_STORAGE_KEY)
  if (saved === null) {
    return null
  }
  return JSON.parse(saved)
}

// 保存 / 更新本地缓存的用户资料
export function saveLocalUser(profile) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile))
}

// 从 Firestore 读取某个用户的资料（含角色），找不到则返回 null
export async function fetchUserProfile(uid) {
  const snapshot = await getDoc(doc(db, 'users', uid))
  if (snapshot.exists() === false) {
    return null
  }
  const data = snapshot.data()
  return {
    uid: uid,
    username: data.username,
    email: data.email,
    role: data.role,
  }
}

// 等待 Firebase 恢复本地会话（刷新页面后确认是否已登录）
export function waitForAuthState() {
  return new Promise((resolve) => {
    // onAuthStateChanged 的第一次回调就表示当前会话已确定，随后立即解绑
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user)
    })
  })
}

// 注册新用户：创建账户后把用户名 / 邮箱 / 角色写入 Firestore，并自动登录
export async function registerUser(email, username, password, role) {
  const credential = await createUserWithEmailAndPassword(auth, email, password)

  // 把用户资料写入 Firestore 的 users/{uid} 文档
  const profile = { username: username, email: email, role: role }
  await setDoc(doc(db, 'users', credential.user.uid), profile)

  const currentProfile = { uid: credential.user.uid, ...profile }
  saveLocalUser(currentProfile)
  return currentProfile
}

// 登录：校验邮箱密码后，从 Firestore 拉取该用户的资料
export async function loginUser(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  const uid = credential.user.uid

  // 优先读取 Firestore 里的资料
  let profile = await fetchUserProfile(uid)

  // 兜底：万一 Firestore 里没有该用户的文档，就用邮箱前缀作为用户名
  if (profile === null) {
    const fallback = {
      uid: uid,
      username: email.split('@')[0],
      email: email,
      role: 'Senior',
    }
    // 同时补写一份文档，方便后续读取
    await setDoc(doc(db, 'users', uid), {
      username: fallback.username,
      email: fallback.email,
      role: fallback.role,
    })
    profile = fallback
  }

  saveLocalUser(profile)
  return profile
}

// 登出：退出 Firebase 并清除本地缓存
export async function logoutUser() {
  await signOut(auth)
  localStorage.removeItem(USER_STORAGE_KEY)
}

// 恢复会话：刷新页面时调用，返回当前登录用户的资料（未登录返回 null）
export async function restoreSession() {
  const firebaseUser = await waitForAuthState()
  if (firebaseUser === null) {
    return null
  }

  // 本地已有同账号缓存直接复用，避免每次刷新都请求 Firestore
  const cached = getCurrentUser()
  if (cached !== null && cached.uid === firebaseUser.uid) {
    return cached
  }

  // 否则从 Firestore 拉取最新资料（邮箱前缀兜底）
  const safeEmail = firebaseUser.email !== null ? firebaseUser.email : ''
  const fallback = {
    uid: firebaseUser.uid,
    username: safeEmail.split('@')[0],
    email: safeEmail,
    role: 'Senior',
  }

  const profile = await fetchUserProfile(firebaseUser.uid)
  const finalProfile = profile !== null ? profile : fallback
  saveLocalUser(finalProfile)
  return finalProfile
}

// 把 Firebase 的错误代码翻译成用户能看懂的提示文字
export function getFirebaseErrorMessage(error) {
  const code = error.code

  if (code === 'auth/email-already-in-use') {
    return 'This email is already registered. Please login instead.'
  }
  if (code === 'auth/invalid-email') {
    return 'Please enter a valid email address.'
  }
  if (code === 'auth/user-not-found') {
    return 'No account found with this email.'
  }
  if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
    return 'Invalid email or password.'
  }
  if (code === 'auth/weak-password') {
    return 'Password is too weak. Please choose a stronger one.'
  }
  if (code === 'auth/too-many-requests') {
    return 'Too many attempts. Please wait a moment and try again.'
  }
  return error.message
}
